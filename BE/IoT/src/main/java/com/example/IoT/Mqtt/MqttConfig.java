package com.example.IoT.Mqtt;


import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.UUID;

@Configuration
public class MqttConfig {
    @Bean
    public MqttClient mqttClient() throws MqttException {
        String brokerUrl = "ssl://dd86dc72f53445328d345c2d91fd9470.s1.eu.hivemq.cloud:8883";
        String clientId = "client-" + UUID.randomUUID().toString();  // Tạo clientId ngẫu nhiên
        MqttClient client = new MqttClient(brokerUrl, clientId);
        System.out.println(clientId);

        MqttConnectOptions options = new MqttConnectOptions();
        options.setUserName("duongdatSmartHome");
        options.setPassword("Abcde12345".toCharArray());
        options.setCleanSession(true);
        options.setAutomaticReconnect(true); // Tự động reconnect khi mất kết nối

        client.connect(options);
        return client;
    }
}

