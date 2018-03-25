#include <SPI.h>
#include <Ethernet.h>

// ETHERNET
byte mac[] = {
  0x90, 0xA2, 0xDA, 0x0F, 0x46, 0x77
};
IPAddress ip(192, 168, 137, 46); //192.168.137.46
EthernetClient client;

//String server = "192.168.0.8";
//IPAddress server(192, 168, 0, 8);
char server[] = "ec2-18-221-203-33.us-east-2.compute.amazonaws.com"; 


void setup() {
  Serial.begin(9600);
  Serial.println("setup()");
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }
  // start the Ethernet connection and the client:
  if (Ethernet.begin(mac) == 0) {
    Serial.println("Failed to configure Ethernet using DHCP");
    // try to configure using IP address instead of DHCP:
    Ethernet.begin(mac, ip);
  }
  Serial.print("client is at ");
  Serial.println(Ethernet.localIP());
  delay(1000); // wait for initialization
}

void loop() {
  // Send measures every 5 seconds
   // if you get a connection, report back via serial:
  if (client.connect(server, 3000)) {
    Serial.println("connected");
    /*
    {
      "value": 80.0,
      "sensor": "mySensor",
      "deviceOwner": "pacoard@gmail.com"
    }
    */
    String json = "";
    String measure = "10";
    json += "{";
    json += "  \"value\": "+measure+",";
    json += "  \"sensor\": \"sensor_name\",";
    json += "  \"deviceOwner\": \"pacoard@gmail.com\"";
    json += "}";
    Serial.println(json);
    // Make a HTTP POST message:
    client.println("POST /api/SensorReading HTTP/1.1");
    client.println("Host: yo");
    //client.println("User-Agent: Arduino/1.0");
    client.println("Connection: close");
    client.println("Content-Type: application/json;charset=utf-8");
    client.println("Accept: application/json");
    client.print("Content-Length: ");
    client.println(json.length());
    client.println();
    client.println(json);
    
    Serial.println();
    String logMeasure = measure + " units";
    Serial.println(logMeasure);
    char logMeasureChar[logMeasure.length()];
    logMeasure.toCharArray(logMeasureChar, logMeasure.length());
    
    
    Serial.println();
    Serial.println("disconnecting.");
    client.stop();

  } else {
    // if you didn't get a connection to the server:
    Serial.println("connection failed");
  }

  //Wait some seconds for next measurement
  delay(5000);
}
