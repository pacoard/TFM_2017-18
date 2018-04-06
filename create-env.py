#!/usr/bin/python

# Use example
# python create-env.py --key-pair mykey --security-group sg-rtw54sd --subnet-id subnet-56dfd21
import os, argparse, json, time
# Measure how long the script takes
from datetime import datetime
startTime = datetime.now()


################################################
#											   #
# 	COMMAND CONFIGURATION WITH ARGUMENTPARSER  #
#											   #
################################################

parser = argparse.ArgumentParser(description="Script that automates the creation of Blockchain+IoT project.")
# python create-env.py --key-pair 1 --security-group 2 --subnet-id 3 --iam-role 4
parser.add_argument('--composer-instance-id', '-cid', required=True, help="ID of the EC2 instance that runs the blockchain. ")
parser.add_argument('--key-pair', '-key', required=True, help="Name of the key pair to access the instances.")
parser.add_argument('--security-group', '-secgroup', required=True, help="ID of the security group that the instances will be in. Needs to open port 8000.")
parser.add_argument('--subnet-id', '-subnetid', required=True, help="ID of the subnet for the autoscaling group. You need to use the one assigned to us-east-2a.")
args = parser.parse_args()

print(args)
print('\n')


################################################
#											   #
# 	GLOBAL VALUES							   #
#											   #
################################################

# Local files for internal operations
AUX_FILE = 'auxfile.sh'
JSON_OUTPUT = 'output.json'
WEBAPP_REPOSITORY = 'https://github.com/pacoard/TFM_2017-18.git'
# AWS parameters
ELB_NAME = 'diot-frontend-elb'
ELB_DNS = '' # to be set when ELB is up and running
AWS_KEY_PAIR = args.key_pair
SECURITY_GROUP = args.security_group
AVAILABILITY_ZONE = os.popen('aws configure get region').read().replace('\n', '')
AMI_ID = 'ami-aa0030cf' # image of an instance that has the node dependencies installed
SUBNET_ID = args.subnet_id

# Autoscaling parameters
AUTOSCALING_CONFIGURATION = 'diot-frontend-autoscaling-config'
AUTOSCALING_GROUP = 'diot-frontend-autoscaling-group'

# Blockchain paramenters
BLOCKCHAIN_NETWORK_NAME = 'diot-biz-network'
BLOCKCHAIN_INSTANCE_ID = args.composer_instance_id
BLOCKCHAIN_DNS = '' # to be retrieved from blockchain's EC2 instance

# GLOBAL FUNCTIONS
def execCommand(commandString):
	print('=> Running command: ' + commandString + '\n')
	os.system(commandString)

def extractJSON():
	jsondict = {}
	with open(JSON_OUTPUT) as jsonfile:
		jsondict = json.load(jsonfile)
	os.remove(JSON_OUTPUT)
	return jsondict

# Create auxiliar file for commands to run when instances are created:
def createUserData():
	fileData = (
		'#!/bin/bash\n'
		'cd /home/ubuntu\n'
		'runuser -l ubuntu -c \'git clone ' + WEBAPP_REPOSITORY + ' diot\'\n'
		'cd diot/frontend/\n'
		'cp /home/ubuntu/node_modules -r .\n'
		# PASSING DATA BY REPLACING VALUES IN THE SERVER SOURCE FILES
# ubuntu@ip-172-31-46-186:~$ sed -i "s/t_HOSTNAME/$(curl -s http://169.254.169.254/lest/meta-data/public-hostname)/g" package.json webpack.config.js
		"sed -i 's/t_/\""+ BLOCKCHAIN_DNS.replace('/', '\/') +"\"/g' server.js\n"
		'npm start\n')
	print('=============================== FRONTEND USER DATA FILE ===============================\n')
	print(fileData)
	print('=======================================================================================\n')
	with open(AUX_FILE, 'w') as f:
		f.write(fileData)
	os.system('chmod +x ' + AUX_FILE)
	return AUX_FILE

# Check that the blockchain instance is running and get its DNS address
print('Checking if blockchain is online...')
execCommand('aws ec2 wait instance-status-ok'
			' --instance-ids ' + BLOCKCHAIN_INSTANCE_ID)
print('Blockchain online.')
# Get DNS of blockchain
execCommand('aws ec2 describe-instances' 
			+ ' --filters Name=instance-id,Values=' + BLOCKCHAIN_INSTANCE_ID
			+ ' > ' + JSON_OUTPUT)
BLOCKCHAIN_DNS = extractJSON()['Reservations'][0]['Instances'][0]['PublicDnsName']

print('####################################################################################\n')
print('\n')
################################################
#											   #
# 	FRONTEND SERVERS SETUP         			   #
#											   #
################################################

# Autoscaling launch configuration
execCommand('aws autoscaling create-launch-configuration'
			+ ' --launch-configuration-name ' + AUTOSCALING_CONFIGURATION
			+ ' --key-name ' + AWS_KEY_PAIR
			+ ' --security-groups ' + SECURITY_GROUP
			#+ ' --iam-instance-profile ' + IAM_ROLE
			+ ' --image-id ' + AMI_ID
			+ ' --instance-type t2.micro'
			+ ' --user-data file://' + createUserData())

# Autoscaling group creation
execCommand('aws autoscaling create-auto-scaling-group'
			+ ' --auto-scaling-group-name ' + AUTOSCALING_GROUP
			+ ' --launch-configuration-name ' + AUTOSCALING_CONFIGURATION
			+ ' --availability-zones ' + AVAILABILITY_ZONE + 'a'
			+ ' --desired-capacity 3'
			+ ' --min-size 1'
			+ ' --max-size 3'
			+ ' --vpc-zone-identifier ' + SUBNET_ID)

print('####################################################################################\n')
print('\n')
################################################
#											   #
# 	LOAD BALANCER SETUP	   			     	   #
#											   #
################################################

# Load balancer creation, with listener for the webapp
execCommand('aws elb create-load-balancer'
			+ ' --load-balancer-name ' + ELB_NAME
			+ ' --listeners "Protocol=HTTP,LoadBalancerPort=80,InstanceProtocol=HTTP,InstancePort=3000"'
			+ ' --availability-zones ' + AVAILABILITY_ZONE + 'a'
			+ ' --security-groups ' + SECURITY_GROUP
			+ ' > ' + JSON_OUTPUT)

ELB_DNS = extractJSON()['DNSName'] # get ELB's DNS in order to access the service

# Attach load balancer to the autoscaling group
execCommand('aws autoscaling attach-load-balancers'
			+ ' --load-balancer-names ' + ELB_NAME
			+ ' --auto-scaling-group-name ' + AUTOSCALING_GROUP)

# Create load balancer stickiness policy
execCommand('aws elb create-lb-cookie-stickiness-policy'
			+ ' --load-balancer-name ' + ELB_NAME
			+ ' --policy-name my-duration-cookie-policy'
			+ ' --cookie-expiration-period 60')

# Set policy
execCommand('aws elb set-load-balancer-policies-of-listener'
			+ ' --load-balancer-name ' + ELB_NAME
			+ ' --load-balancer-port 80'
			+ ' --policy-names my-duration-cookie-policy')

print('####################################################################################\n')
print('\n')
################################################
#											   #
# 	WAIT FOR SERVICE TO BE READY        	   #
#											   #
################################################


print('####################################################################################\n')
print('####################################################################################\n')
print('####################################################################################\n')
print('\n')
################################################
#											   #
# 	END OF SCRIPT			                   #
#											   #
################################################

print('The service is ready to use. Go to the browser and use the ELB DNS address: \n')
print(ELB_DNS+'\n')
print('The blockchain\'s DNS address is: \n')
print(BLOCKCHAIN_DNS + ':3000\n')
print('\n')
print('Execution time: ')
print(datetime.now() - startTime)