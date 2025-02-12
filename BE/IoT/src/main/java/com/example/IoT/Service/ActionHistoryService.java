package com.example.IoT.Service;

import com.example.IoT.Entity.ActionHistory;
import com.example.IoT.Repository.ActionHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ActionHistoryService {

    @Autowired
    private ActionHistoryRepository actionHistoryRepository;

    public void saveAction(String action, String type) {
        ActionHistory actionHistory = new ActionHistory(action, type, LocalDateTime.now());
        actionHistoryRepository.save(actionHistory);
    }
}
