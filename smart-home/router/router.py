#!/usr/bin/python

import websocket
import json

from time import sleep
from gpiozero import Buzzer, RGBLED


################################################
#											   	#
# 	PARAMETERS									#
#											   	#
################################################


# Constants
BLOCKCHAIN_DNS = "ec2-18-188-237-183.us-east-2.compute.amazonaws.com"
SENSOR_EVENT_CODE = "diot.biznet.SensorEvent"
ACTUATOR_EVENT_CODE = "diot.biznet.ActuatorEvent"

# Actuator objects
buzzer = Buzzer(10)
rgb_led = RGBLED(red=17, green=27, blue=22)# https://gpiozero.readthedocs.io/en/stable/recipes.html#full-color-led


################################################
#											   	#
# 	ACTUATOR HANDLERS							#
#											   	#
################################################

# Filter function: delegate actuator events to actuator handlers
def actuator_handle_event(event):
	actuator = event['actuatorId']
	if actuator == 'buzzer':
		buzzer_handler(event)
	elif actuator == 'rgb-led':
		rbg_led_handler(event)
	else:
		print 'No device matches that event.'

def buzzer_handler(event):
	if not event['enabled']:
		rgb_led.color = (1, 1, 1)
		return
	buzzer.on()
	sleep(0.5)
	buzzer.off()

def rbg_led_handler(event):
	color = event['newState']

	if not event['enabled']:
		rgb_led.color = (1, 1, 1)
		return
	else:
		if color == "red":
			rgb_led.color = (0, 1, 1)
		elif color == "green":
			rgb_led.color = (1, 0, 1)
		elif color == "blue":
			rgb_led.color = (1, 1, 0)
		elif color == "white":
			rgb_led.color = (0, 0, 0)
		elif color == "none" or color == "":
			rgb_led.color = (1, 1, 1)
		else:
			print("Not a valid command")


################################################
#											   	#
# 	ROUTER LOGIC 								#
#											   	#
################################################

def on_message(ws, message):
	print "====> Received event:"

	json_event = json.loads(message)
	event_id = json_event['$class']
	if event_id == SENSOR_EVENT_CODE:
		print json_event['msg']
	elif event_id == ACTUATOR_EVENT_CODE:
		actuator_handle_event(json_event)

def on_error(ws, error):
	print error

def on_close(ws):
	print "====> Disconnected."
	# Attemp to reconnect with 5 seconds interval
	sleep(5)
	initiate()

def initiate():
	print "====> Connecting to blockchain."

	ws = websocket.WebSocketApp("ws://"+BLOCKCHAIN_DNS+":3000",
		on_message = on_message,
		on_error = on_error,
		on_close = on_close)

	print "====> Connected."

	ws.run_forever()


if __name__ == "__main__":
	initiate()