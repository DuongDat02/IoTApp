package com.example.IoT.Service;


import com.example.IoT.Entity.SensorData;
import com.example.IoT.Repository.SensorDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SensorDataService {

    @Autowired
    private SensorDataRepository sensorDataRepository;

    public SensorData saveSensorData(float temperature, float humidity, float gas) {
        SensorData sensorData = new SensorData();
        sensorData.setTemp(temperature);
        sensorData.setHumi(humidity);
        sensorData.setGas(gas);
        sensorData.setCreatedAt(LocalDateTime.now());
        return sensorDataRepository.save(sensorData);
    }

    public SensorData getLatestData() {
        return sensorDataRepository.findLatestData();
    }

    public List<SensorData> getAllData(){
        return sensorDataRepository.findAll();
    }

}

