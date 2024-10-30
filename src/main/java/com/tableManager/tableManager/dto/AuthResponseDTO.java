package com.tableManager.tableManager.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class AuthResponseDTO {

    private String accessToken;
    private String tokenType = "Bearer ";
    private String role;
    private Long id;
    private String username;
    private String email;
    private boolean enabled;
    private boolean hasTrial;


    public AuthResponseDTO(String accessToken, String role, Long id, String username, String email, boolean enabled, boolean hasTrial ) {
        this.accessToken = accessToken;
        this.role = role;
        this.id = id;
        this.username= username;
        this.email = email;
        this.enabled = enabled;
        this.hasTrial = hasTrial;
    }
}
