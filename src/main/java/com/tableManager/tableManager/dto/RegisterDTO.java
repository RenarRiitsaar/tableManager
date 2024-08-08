package com.tableManager.tableManager.dto;

import lombok.Data;

@Data
public class RegisterDTO {

    private String email;
    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private boolean enabled = false;

}
