#include <SoftwareSerial.h>
SoftwareSerial xbee (2,3);

// LED actuator


// Buzzer actuator


// Temperature (thermistor) sensor http://www.circuitbasics.com/arduino-thermistor-temperature-sensor-tutorial/
const int thermistorPin = 0;
void temperatureSensor() {
  //the calculating formula of temperature
  float resistor = (1023.0*10000)/analogRead(thermistorPin)-10000;
  float tempC = (3435.0/(log(resistor/10000)+(3435.0/(273.15+25)))) - 273.15;

  Serial.print("Temperature: ");// Print a message of "Temp: "to the LCD.
  Serial.print(tempC);// Print a centigrade temperature to the LCD. 
  Serial.println(" C"); // Print the unit of the centigrade temperature to the LCD.
  Serial.println();
}

// Light sensor // https://learn.adafruit.com/photocells/arduino-code
//https://www.digikey.com/en/maker/projects/design-a-luxmeter-with-an-ldr-and-an-arduino/623aeee0f93e427bb57e02c4592567d1
const int photocellPin = 0;     // the cell and 10K pulldown are connected to a0
int photocellReading;     // the analog reading from the sensor divider
int LEDbrightness;        // 
void lightSensor() {
  photocellReading = analogRead(photocellPin);
  if (photocellReading < 10) {
    Serial.println(" - Dark");
  } else if (photocellReading < 200) {
    Serial.println(" - Dim");
  } else if (photocellReading < 500) {
    Serial.println(" - Light");
  } else if (photocellReading < 800) {
    Serial.println(" - Bright");
  } else {
    Serial.println(" - Very bright");
  }
  delay(1000);
}


// Distance sensor https://howtomechatronics.com/tutorials/arduino/ultrasonic-sensor-hc-sr04/
const int trigPin = 11;
const int echoPin = 10;
long duration;
int distance;

void distanceSensor() {
  // Clears the trigPin
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  // Sets the trigPin on HIGH state for 10 micro seconds
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  // Reads the echoPin, returns the sound wave travel time in microseconds
  duration = pulseIn(echoPin, HIGH);
  // Calculating the distance in cm
  distance= duration*0.034/2 + 2; //seems to give 2cm less
  // Prints the distance on the Serial Monitor
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");
  Serial.println();
}


void setup() {

  //Distance sensor
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  
  Serial.begin(9600);
  Serial.println("setup()");
  //xbee.begin(9600);
}

void loop() {
  /*if (xbee.available()) {
    int myData = xbee.read();
    Serial.write(myData);
  }*/
  distanceSensor();
  delay(1000);
  temperatureSensor();
  delay(1000);
}
