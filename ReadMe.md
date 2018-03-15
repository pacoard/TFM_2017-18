## Introduction

As IoT (Internet of Things), an emerging technology, starts to build a place for itself in the market, it is starting to face scalability and security problems that cannot be helped with our current mature technologies and protocols. 

In this project, a proof-of-concept solution that solves all those problems has been developed with Hyperledger Composer, which is a toolset that works on top of Hyperledger Fabric. It is a modular blockchain framework that uses a unique focus to implement a Decentralized Ledger Technology. 

By decentralizing the data storage and business logic, IoT's scalability problem is solved, and the security is solved by the cryptographic nature of the blockchain, aside from its consensus among nodes in order to achieve a single truth so that the data cannot be tampered with.

## dIoT: Decentralized Internet of Things

The project consists of a frontend, a smart contract (blockchain-backend) and a wireless sensor network as an IoT use case scenario.

### Sensors
![ ](/images/frontend-sensors.jpg)

### Actuators
![ ](/images/frontend-actuators.jpg)

### Assets
```
asset Sensor extends Device {
  o Reading[] data optional
  o String unit
  o Integer eventThreshold optional
}
asset Actuator extends Device {
  o String state optional
  o Boolean enabled default=false optional
}
```

### Transactions
```
transaction CreateDevice {
  o String deviceId
  o DeviceType deviceType
  o String unit optional
  o Integer eventThreshold optional
  o String state optional
  o Boolean enabled optional
  --> DeviceOwner deviceOwner
}
transaction DeleteSensor {
  --> Sensor device
  --> DeviceOwner deviceOwner
}
transaction DeleteActuator {
  --> Actuator device
  --> DeviceOwner deviceOwner
}
transaction SensorReading {
  o Reading reading
  --> Sensor sensor
  --> DeviceOwner deviceOwner
}
transaction ActuatorWrite {
  o String newState optional
  o Boolean enabled optional
  --> Actuator actuator
  --> DeviceOwner deviceOwner
}
```