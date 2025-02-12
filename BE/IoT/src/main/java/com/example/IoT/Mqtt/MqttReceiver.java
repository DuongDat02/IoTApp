package com.example.IoT.Mqtt;

import com.example.IoT.Entity.SensorData;
import com.example.IoT.Repository.SensorDataRepository;
import com.example.IoT.Service.EmailService;
import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.time.LocalDateTime;

@Component
public class MqttReceiver implements MqttCallback {

    @Autowired
    private EmailService emailService;

    private final MqttClient mqttClient;
    private final SensorDataRepository sensorDataRepository;

    @Autowired
    public MqttReceiver(MqttClient mqttClient, SensorDataRepository sensorDataRepository) {
        this.mqttClient = mqttClient;
        this.sensorDataRepository = sensorDataRepository;
        mqttClient.setCallback(this);

        try {
            mqttClient.subscribe("esp8266/data");
        } catch (MqttException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void connectionLost(Throwable cause) {
        // Handle connection loss
    }

    @Override
    public void messageArrived(String topic, MqttMessage message) {
        String payload = new String(message.getPayload());
        System.out.println("Message arrived [" + topic + "]: " + payload);

        JsonObject jsonObject = JsonParser.parseString(payload).getAsJsonObject();
        SensorData sensorData = new SensorData();
        sensorData.setTemp(jsonObject.get("temperature").getAsFloat());
        sensorData.setHumi(jsonObject.get("humidity").getAsFloat());
        sensorData.setGas(jsonObject.get("gas").getAsFloat());
        sensorData.setCreatedAt(LocalDateTime.now());

        sensorDataRepository.save(sensorData);

        float gasThreshold = 1500;
        if(jsonObject.get("gas").getAsFloat() > gasThreshold){
            String to = "Duongdat75k@gmail.com";  // Địa chỉ email người nhận

            emailService.sendFireAlertEmail(to);
            System.out.println("Email cảnh báo đã được gửi.");
        }
    }

    @Override
    public void deliveryComplete(IMqttDeliveryToken token) {
        // Handle delivery complete
    }
}

