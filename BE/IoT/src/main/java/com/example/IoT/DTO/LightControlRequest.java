package com.example.IoT.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LightControlRequest {
    private String light;
    private String state;

    public LightControlRequest() {}

    public LightControlRequest(String light, String state) {
        this.light = light;
        this.state = state;
    }

}
