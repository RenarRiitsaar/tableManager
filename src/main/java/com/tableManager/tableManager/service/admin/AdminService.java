package com.tableManager.tableManager.service.admin;

import com.tableManager.tableManager.model.User;

import java.util.List;

public interface AdminService {

    List<User> getAllUsers();

    void deleteById(Long id);

    boolean setActive(Long id);

    User findById(Long id);
}
