#!/usr/bin/python

# Use example
# python create-env.py --key-pair mykey --security-group sg-rtw54sd --subnet-id subnet-56dfd21 --iam-role myRole
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
parser.add_argument('--key-pair', '-key', required=True, help="Name of the key pair to access the instances.")
parser.add_argument('--security-group', '-secgroup', required=True, help="ID of the security group that the instances will be in. Needs to open port 8000.")
parser.add_argument('--subnet-id', '-subnetid', required=False, help="ID of the subnet for the autoscaling group. You need to use the one assigned to us-east-2a.")
parser.add_argument('--iam-role', '-iamrole', required=False, help="Name of the IAM role that the EC2 instances will use. Needs to have PowerUserAccess permission.")

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
ELB_NAME = 'itmo544-elb'
ELB_DNS = '' # to be set when ELB is up and running

AWS_KEY_PAIR = args.key_pair
SECURITY_GROUP = args.security_group
AVAILABILITY_ZONE = os.popen('aws configure get region').read().replace('\n', '')
AMI_ID = 'ami-a67f48c3' # image of an instance that has hyperledger fabric+composer installed
if (args.iam_role):
	IAM_ROLE = args.iam_role
if (args.subnet_id):
	SUBNET_ID = args.subnet_id
# Autoscaling parameters
AUTOSCALING_CONFIGURATION = 'itmo544-autoscaling-config'
AUTOSCALING_GROUP = 'itmo544-autoscaling-group'

BLOCKCHAIN_NETWORK_NAME = 'iot-biz-network'

# GLOBAL FUNCTIONS
def execCommand(commandString):
	print('==========> Running command: ' + commandString + '\n')
	os.system(commandString)

def extractJSON():
	jsondict = {}
	with open(JSON_OUTPUT) as jsonfile:
		jsondict = json.load(jsonfile)
	os.remove(JSON_OUTPUT)
	return jsondict

# Create auxiliar file for commands to run when instances are created:
START_SH = (
	'#!/bin/bash\n'
	'cd /home/ubuntu/project/blockchain/' + BLOCKCHAIN_NETWORK_NAME + '\n'
	'npm config set user 0\n'
	'npm config set unsafe-perm true\n'
	'npm install -g composer-cli\n'
	'npm install -g composer-rest-server\n'
	'composer archive create -t dir -n .\n'
	'composer runtime install --card PeerAdmin@hlfv1 --businessNetworkName ' + BLOCKCHAIN_NETWORK_NAME + '\n'
	'composer network start --card PeerAdmin@hlfv1 --networkAdmin admin --networkAdminEnrollSecret adminpw --archiveFile ' + BLOCKCHAIN_NETWORK_NAME + '@0.0.1.bna --file networkadmin.card\n'
	'composer card import --file networkadmin.card\n'
	'composer-rest-server -c admin@' + BLOCKCHAIN_NETWORK_NAME + ' -n never -w true\n')
def createUserData(type):
	fileData = (
		'#!/bin/bash\n'
		'cd /root\n'
		#'echo ' + START_SH + ' > start.sh\n'
		#'chmod +x start.sh\n'
		'cd /root/fabric-tools\n'
		'./startFabric.sh\n'
		'./createPeerAdminCard.sh\n'
		'cd /home/ubuntu\n'
		'git clone ' + WEBAPP_REPOSITORY + ' project\n')
	print('=============================== ' + type + ' USER DATA FILE ===============================\n')
	print(fileData)
	print('==============================================================================\n')
	with open(AUX_FILE, 'w') as f:
		f.write(fileData)
	os.system('chmod +x ' + AUX_FILE)
	return AUX_FILE

################################################
#											   #
# 	BLOCKCHAIN 	                			   #
#											   #
################################################

#aws ec2 run-instances --image-id ami-2eb98d4b --count 1 --instance-type t2.micro --key-name firstkeypair --security-group-ids sg-ca845ba2

execCommand('aws ec2 run-instances --image-id ' + AMI_ID
			+ ' --count 1'
			+ ' --instance-type t2.micro --key-name ' + AWS_KEY_PAIR
			+ ' --security-group-ids ' + SECURITY_GROUP
			#+ ' --subnet-id ' + SUBNET_ID
			#+ ' --iam-instance-profile Name=' + IAM_ROLE
			+ ' --tag-specifications ResourceType=instance,Tags=[{Key=Name,Value=CompoREST}]'
			+ ' --user-data file://' + createUserData('BLOCKCHAIN EC2 INSTANCE')
			+ ' > ' + JSON_OUTPUT)
BLOCKCHAIN_INSTANCE_ID = extractJSON()['Instances'][0]['InstanceId']

# Wait for the blockchain instance to get up and running
print('Waiting for the service to get up and running...')
execCommand('aws ec2 wait instance-status-ok'
			' --instance-ids ' + BLOCKCHAIN_INSTANCE_ID)
time.sleep(100.0)
# Get DNS of blockchain
execCommand('aws ec2 describe-instances' 
			+ ' --filters Name=instance-id,Values=' + BLOCKCHAIN_INSTANCE_ID
			+ ' > ' + JSON_OUTPUT)
BLOCKCHAIN_DNS = extractJSON()['Reservations'][0]['Instances'][0]['PublicDnsName']

################################################
#											   #
# 	END OF SCRIPT			                   #
#											   #
################################################

print('####################################################################################\n')
print('####################################################################################\n')
print('####################################################################################\n')
print('\n')

#print('The service is ready to use. Go to the browser and use the ELB DNS address: \n')
#print(ELB_DNS+'\n')
print('The blockchain\'s DNS address is: \n')
print(BLOCKCHAIN_DNS + ':3000\n')
print('\n')
print('Execution time: ')
print(datetime.now() - startTime)