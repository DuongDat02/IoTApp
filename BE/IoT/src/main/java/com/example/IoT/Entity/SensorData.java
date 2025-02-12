package com.example.IoT.Entity;


import jakarta.persistence.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "SensorData")
public class SensorData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private float temp;
    private float humi;
    private float gas;

    private LocalDateTime createdAt;

    // Constructors
    public SensorData() {}

    public SensorData(float temp, float humi, float gas, LocalDateTime createdAt) {
        this.temp = temp;
        this.humi = humi;
        this.gas = gas;
        this.createdAt = createdAt;
    }

    // Getters and Setters

}

