package com.example.IoT.Controller;


import com.example.IoT.Entity.SensorData;
import com.example.IoT.Repository.SensorDataRepository;
import com.example.IoT.Service.SensorDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/v1/iot")
public class SensorDataController {

    @Autowired
    private SensorDataService sensorDataService;

    @Autowired
    private SensorDataRepository sensorDataRepository;


    @GetMapping("/dataLatest")
    public SensorData getLatestSensorData() {
        return sensorDataService.getLatestData();
    }


    @GetMapping("/dataLast10")
    public List<SensorData> getLast10Data() {
        return sensorDataRepository.findTop10ByOrderByCreatedAtDesc();
    }

    @GetMapping("/allData")
    public Page<SensorData> getAllData(@RequestParam int page) {
        int size = 20;  // Fixed page size
        Pageable pageable = PageRequest.of(page, size);
        return sensorDataRepository.findAll(pageable);
    }
}

