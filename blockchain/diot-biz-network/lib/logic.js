'use strict';
/**
 * diot business network transactions processor and event functions
 */

/**
 * Device creation transaction
 * @param {diot.biznet.CreateDevice} tx
 * @transaction
 */
function CreateDevice(tx) {
    // Get the asset registry for Devices
    var deviceType;
    if (tx.deviceType === 'SENSOR') {
        deviceType = 'Sensor';
    } else if (tx.deviceType === 'ACTUATOR') {
        deviceType = 'Actuator';
    } else {
        throw new Error('Invalid device type. Must be SENSOR or ACTUATOR');
    }

    var factory = getFactory();

    return getAssetRegistry('diot.biznet.'+deviceType)
        .then(function(assetRegistry) {
            // Create an asset to hold the incoming values
            var Device = factory.newResource('diot.biznet', deviceType, tx.deviceId);
            // parameters of abstract definition of Device
            Device.deviceId = tx.deviceId;
            Device.deviceOwner = tx.deviceOwner;
            // parameters for a subclass of Device
            switch (deviceType) {
                case 'Sensor':
                    Device.unit = tx.unit;
                    if (tx.eventThreshold) Device.eventThreshold = tx.eventThreshold;
                    break;
                case 'Actuator':
                    if (tx.state) Device.state = tx.state;
                    if (tx.enabled) Device.enabled = tx.enabled;
                    break;
                default: break;
            }
            // Add the asset to the asset registry
            return assetRegistry.add(Device);
        })
        .then(function() {
            // Emit an event for the created asset
            var event = factory.newEvent('diot.biznet', 'LogEvent');
            event.ownerEmail = tx.deviceOwner.email;
            event.msg = tx.deviceType + ' with ID ' + tx.deviceId + ' created.';
            emit(event);
        });
}

// Deletion transaction for sensors or actuators
function deleteDevice(tx, type) {
    // Get the asset registry for Devices
    var assetRegistry;
    var id = tx.device.deviceId;

    var factory = getFactory();

    return getAssetRegistry('diot.biznet.' + type)
        // Get asset that will be updated in this transaction
        .then(function(ar) {
            assetRegistry = ar;
            return assetRegistry.get(id);
        })
        .then(function(asset) {
            // (Remove asset from the blockchain)
            return assetRegistry.remove(asset);
        })
        .then(function() {
            // Emit an event for the deleted asset
            var event = factory.newEvent('diot.biznet', 'LogEvent');
            event.ownerEmail = tx.deviceOwner.email;
            event.msg = type + ' with ID ' + id + ' deleted.';
            emit(event);
        });
}
/**
 * Sensor deletion transaction
 * @param {diot.biznet.DeleteSensor} tx
 * @transaction
 */
function DeleteSensor(tx) {
    deleteDevice(tx, 'Sensor');
}

/**
 * Actuator deletion transaction
 * @param {diot.biznet.DeleteActuator} tx
 * @transaction
 */
function DeleteActuator(tx) {
    deleteDevice(tx, 'Actuator');
}

/**
 * Sensor reading transaction
 * @param {diot.biznet.SensorReading} tx
 * @transaction
 */
function SensorReading(tx) {
    var assetRegistry;
    var id = tx.sensor.deviceId;
    var t_sensor;

    var factory = getFactory();

    return getAssetRegistry('diot.biznet.Sensor')
        // Get asset that will be updated in this transaction
        .then(function(ar) {
            assetRegistry = ar;
            return assetRegistry.get(id);
        })
        .then(function(sensor) {
            if (!sensor.data) {
                sensor.data = [factory.newConcept('diot.biznet', 'Reading')];
                sensor.data[0].value = tx.reading.value;
                sensor.data[0].timestamp = tx.reading.timestamp;
            } else {
                newData = factory.newConcept('diot.biznet', 'Reading');
                newData.value = tx.reading.value;
                newData.timestamp = tx.reading.timestamp;
                sensor.data.push(newData);
            }
            // Update the asset in the asset registry
            // (Update Device object in the blockchain)
            t_sensor = sensor;
            return assetRegistry.update(sensor);
        })
        .then(function() {
            // If the sensor's threshold is surpassed, emit an event
            if (t_sensor.eventThreshold && tx.reading.value > t_sensor.eventThreshold) {
                var eventThreshold = factory.newEvent('diot.biznet', 'SensorEvent');
                eventThreshold.sensorId = id;
                eventThreshold.ownerEmail = tx.deviceOwner.email;
                eventThreshold.msg = 'Sensor with ID ' + id 
                    + ' triggered an alarm: ' + tx.reading.value.toString() + ' ' + t_sensor.unit;
                emit(eventThreshold);
            }
        });
}

/**
 * Actuator write transaction
 * @param {diot.biznet.ActuatorWrite} tx
 * @transaction
 */
function ActuatorWrite(tx) {
    var assetRegistry;
    var id = tx.actuator.deviceId;
    var t_actuator;

    var factory = getFactory();

    return getAssetRegistry('diot.biznet.Actuator')
        // Get asset that will be updated in this transaction
        .then(function(ar) {
            assetRegistry = ar;
            return assetRegistry.get(id);
        })
        .then(function(actuator) {

            if (tx.newState) actuator.state = tx.newState;
            if (tx.enabled != null) actuator.enabled = tx.enabled;
            
            // Update the asset in the asset registry
            // (Update Device object in the blockchain)
            t_actuator = actuator;
            return assetRegistry.update(actuator);
        })
        .then(function() {
            // Actuator event
            var actuatorEvent = factory.newEvent('diot.biznet', 'ActuatorEvent');
            actuatorEvent.actuatorId = id;
            actuatorEvent.newState = t_actuator.state;
            actuatorEvent.enabled = t_actuator.enabled;
            actuatorEvent.ownerEmail = tx.deviceOwner.email;
            actuatorEvent.msg = 'Actuator with ID ' + id + ' changed its state: ' 
                + '[NewState] '+  t_actuator.state + ', [Enabled] ' + t_actuator.enabled.toString();
            emit(actuatorEvent);
        });
}