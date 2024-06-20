package com.tableManager.tableManager.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AuthResponseDTO {

    private String accessToken;
    private String tokenType = "Bearer ";
    private String role;
    private Long id;
    private String username;
    private String email;


    public AuthResponseDTO(String accessToken, String role, Long id, String username, String email ) {
        this.accessToken = accessToken;
        this.role = role;
        this.id = id;
        this.username= username;
        this.email = email;
    }
}
