package com.tableManager.tableManager.service;


import com.tableManager.tableManager.model.Role;
import com.tableManager.tableManager.dto.RegisterDTO;
import com.tableManager.tableManager.model.User;

import javax.sql.RowSet;
import java.util.Set;

public interface UserService {

    User findByUsername(String username);

    Boolean userEmailExists(String email);

    User signUp(RegisterDTO registerDTO);
    Set<Role> findByName(String roleName);

    boolean usernameExists(String username);

    Long getCurrentUserId();

    String findByRoleId(Set<Role> roles);

    User findbyId(Long currentUserId);

    User findbyEmail(String email);
}
