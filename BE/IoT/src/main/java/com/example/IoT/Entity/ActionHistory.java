package com.example.IoT.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "ActionHistory")
public class ActionHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String action;
    private String type;
    private LocalDateTime createdAt;

    public ActionHistory() {
    }

    public ActionHistory(String action, String type, LocalDateTime createdAt) {
        this.action = action;
        this.type = type;
        this.createdAt = createdAt;
    }


}
