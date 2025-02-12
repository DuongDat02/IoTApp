package com.example.IoT.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Tắt bảo vệ CSRF cho mục đích thử nghiệm, không nên làm trong môi trường sản xuất
                .authorizeRequests()
                .anyRequest().permitAll(); // Cho phép truy cập công khai đến tất cả các request

        return http.build();
    }
}

