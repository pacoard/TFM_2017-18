#!/usr/bin/python

import os, json

# Measure how long the script takes
from datetime import datetime
startTime = datetime.now()

JSON_OUTPUT = 'output.json'
# AWS parameters
ELB_NAME = 'diot-frontend-elb'
ELB_DNS = '' # to be set when ELB is up and running

AVAILABILITY_ZONE = os.popen('aws configure get region').read().replace('\n', '')
AMI_ID = 'ami-aa0030cf' # image of an instance that has the node dependencies installed

# Autoscaling parameters
AUTOSCALING_CONFIGURATION = 'diot-frontend-autoscaling-config'
AUTOSCALING_GROUP = 'diot-frontend-autoscaling-group'

# Blockchain paramenters
BLOCKCHAIN_NETWORK_NAME = 'diot-biz-network'
BLOCKCHAIN_INSTANCE_ID = 'i-0bfba0dd9763a17c8' #args.composer_instance_id
BLOCKCHAIN_DNS = '' # to be retrieved from blockchain's EC2 instance

def execCommand(commandString):
	print('============================> Running command: ' + commandString + '\n')
	os.system(commandString)

def extractJSON():
	jsondict = {}
	with open(JSON_OUTPUT) as jsonfile:
		jsondict = json.load(jsonfile)
	os.remove(JSON_OUTPUT)
	return jsondict

# ELB
execCommand('aws elb delete-load-balancer'
			+ ' --load-balancer-name ' + ELB_NAME)

# Autoscaling group
execCommand('aws autoscaling delete-auto-scaling-group'
			+ ' --auto-scaling-group-name ' + AUTOSCALING_GROUP
			+ ' --force-delete')
execCommand('aws autoscaling delete-launch-configuration'
			+ ' --launch-configuration-name ' + AUTOSCALING_CONFIGURATION)

print('####################################################################################\n')
print('####################################################################################\n')
print('####################################################################################\n')
print('\n')

print('The scenario was succesfully destroyed.\n')
print('Execution time: ')
print(datetime.now() - startTime)