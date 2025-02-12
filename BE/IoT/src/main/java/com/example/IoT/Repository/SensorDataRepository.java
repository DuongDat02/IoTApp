package com.example.IoT.Repository;


import com.example.IoT.Entity.SensorData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SensorDataRepository extends JpaRepository<SensorData, Long> {

    @Query(value = "SELECT * FROM sensor_data ORDER BY created_at DESC LIMIT 1", nativeQuery = true)
    SensorData findLatestData();

    List<SensorData> findTop10ByOrderByCreatedAtDesc();

}

