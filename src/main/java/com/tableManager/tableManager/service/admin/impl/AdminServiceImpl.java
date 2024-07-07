package com.tableManager.tableManager.service.admin.impl;

import com.tableManager.tableManager.model.User;
import com.tableManager.tableManager.repository.RoleRepository;
import com.tableManager.tableManager.repository.UserRepository;
import com.tableManager.tableManager.service.admin.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    public List<User> getAllUsers() {
        return new ArrayList<>(userRepository.findAll());
    }

    @Override
    public void deleteById(Long id) {
        roleRepository.deleteUserRolesByUserId(id);
        userRepository.deleteById(id);
    }
}
