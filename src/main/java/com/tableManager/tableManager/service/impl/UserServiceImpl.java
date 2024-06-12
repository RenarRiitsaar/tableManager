package com.tableManager.tableManager.service.impl;

import com.tableManager.tableManager.model.User;
import com.tableManager.tableManager.repository.UserRepository;
import com.tableManager.tableManager.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
