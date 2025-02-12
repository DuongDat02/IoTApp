package com.example.IoT.Controller;


import com.example.IoT.DTO.LightControlRequest;
import com.example.IoT.Entity.ActionHistory;
import com.example.IoT.Entity.SensorData;
import com.example.IoT.Mqtt.MqttSender;
import com.example.IoT.Repository.ActionHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@CrossOrigin
@RequestMapping("/api/v1/iot")
public class LightController {

    @Autowired
    private MqttSender mqttSender;

    @Autowired
    private ActionHistoryRepository actionHistoryRepository;

    @PostMapping("/control")
    public void controlLight(@RequestBody LightControlRequest request) {
        String topic = request.getLight();
        String message = request.getState();
        System.out.println(topic+" "+message);

        // Gửi message tới Arduino qua MQTT
        mqttSender.sendMessage(topic, message);

        // Lưu hành động vào database
        ActionHistory actionHistory = new ActionHistory();
        if(request.getState().equals("1")) actionHistory.setAction("ON");
        else actionHistory.setAction("OFF");
        if (request.getLight().equals("PN")) {
            actionHistory.setType("Phòng ngủ");
        }
        else actionHistory.setType("Phòng khách");
        actionHistory.setCreatedAt(LocalDateTime.now());
        actionHistoryRepository.save(actionHistory);
    }

    @GetMapping("/allAction")
    public Page<ActionHistory> getAllData(@RequestParam int page) {
        int size = 10;  // Fixed page size
        Pageable pageable = PageRequest.of(page, size);
        return actionHistoryRepository.findAll(pageable);
    }

}
