#include <ESP8266WiFi.h>
#include "DHTesp.h"
#include <ArduinoJson.h>
#include <PubSubClient.h>
#include <WiFiClientSecure.h>
#include <math.h>

#define DHTpin 14
#define GASpin A0  

#define PN 5  
#define PK 4  

DHTesp dht;

//----Thay đổi thành thông tin của bạn---------------
const char* ssid = "HV";      //Wifi connect
const char* password = "12345678";   //Password

const char* mqtt_server = "dd86dc72f53445328d345c2d91fd9470.s1.eu.hivemq.cloud";
const int mqtt_port = 8883;
const char* mqtt_username = "duongdatSmartHome"; //User
const char* mqtt_password = "Abcde12345"; //Password
//--------------------------------------------------

WiFiClientSecure espClient;
PubSubClient client(espClient);

unsigned long lastMsg = 0;
#define MSG_BUFFER_SIZE (50)
char msg[MSG_BUFFER_SIZE];

float LPGCurve[3] = {2.3, 0.21, -0.47};
float Ro = 10;  // Ro is initialized to 10 kilo ohms

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  randomSeed(micros());
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

//------------Connect to MQTT Broker-----------------------------
void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientID =  "ESPClient-";
    clientID += String(random(0xffff), HEX);
    if (client.connect(clientID.c_str(), mqtt_username, mqtt_password)) {
      Serial.println("connected");
      client.subscribe("esp8266/client");
      client.subscribe("PN");  // Subscribe to PN topic
      client.subscribe("PK");  // Subscribe to PK topic
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

//-----Call back Method for Receiving MQTT message---------
void callback(char* topic, byte* payload, unsigned int length) {
  String incomingMessage = "";
  for (int i = 0; i < length; i++) incomingMessage += (char)payload[i];
  Serial.println("Message arrived [" + String(topic) + "]: " + incomingMessage);

  if (String(topic) == "PN") {
    if (incomingMessage == "1") {
      digitalWrite(PN, HIGH);
    } else if (incomingMessage == "0") {
      digitalWrite(PN, LOW);
    }
  }

  if (String(topic) == "PK") {
    if (incomingMessage == "1") {
      digitalWrite(PK, HIGH);
    } else if (incomingMessage == "0") {
      digitalWrite(PK, LOW);
    }
  }
}

//-----Method for Publishing MQTT Messages---------
void publishMessage(const char* topic, String payload, boolean retained) {
  if (client.publish(topic, payload.c_str(), retained))
    Serial.println("Message published [" + String(topic) + "]: " + payload);
}

void setup() {
  Serial.begin(9600);
  while (!Serial) delay(1);

  dht.setup(DHTpin, DHTesp::DHT11);

  // Set LED pins as output
  pinMode(PN, OUTPUT);
  pinMode(PK, OUTPUT);

  setup_wifi();
  espClient.setInsecure();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

float calculateGasConcentration(int sensorValue) {
  float sensorResistance = ((float)(1023 - sensorValue) * 10 / sensorValue);  
  float ratio = sensorResistance / Ro;
  float gasConcentration = pow(10, ((log10(ratio) - LPGCurve[1]) / LPGCurve[2]) + LPGCurve[0]);  
  return gasConcentration;
}

unsigned long timeUpdate = millis();

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // read sensors
  if (millis() - timeUpdate > 5000) {
    delay(dht.getMinimumSamplingPeriod());
    float h = dht.getHumidity();
    float t = dht.getTemperature();
    int gasSensorValue = analogRead(GASpin);
    float gasConcentration = calculateGasConcentration(gasSensorValue);  

    DynamicJsonDocument doc(1024);
    doc["humidity"] = h;
    doc["temperature"] = t;
    doc["gas"] = gasConcentration;

    char mqtt_message[128];
    serializeJson(doc, mqtt_message);
    publishMessage("esp8266/data", mqtt_message, true);

    timeUpdate = millis();
  }
}
