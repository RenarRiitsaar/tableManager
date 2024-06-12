package com.tableManager.tableManager.service;


import com.tableManager.tableManager.model.User;

public interface UserService {

    User findByUsername(String username);
}
