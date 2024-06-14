package com.tableManager.tableManager.service;


import com.tableManager.tableManager.model.Role;
import com.tableManager.tableManager.dto.RegisterDTO;
import com.tableManager.tableManager.model.User;

import java.util.Set;

public interface UserService {

    User findByUsername(String username);

    Boolean userEmailExists(String email);

    User signUp(RegisterDTO registerDTO);
    Set<Role> findByName(String roleName);

    boolean usernameExists(String username);

    public Long getCurrentUserId();
}
