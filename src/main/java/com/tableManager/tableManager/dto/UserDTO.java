package com.tableManager.tableManager.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserDTO {

    private String password;
    private String email;
    private String firstName;
    private String lastName;

}
