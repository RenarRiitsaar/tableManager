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

    @Override
    public boolean setActive(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        if(!user.isEnabled()){
            user.setEnabled(true);
            userRepository.save(user);
            return true;

        }else{
            user.setEnabled(false);
            userRepository.save(user);
            return false;
        }
    }

    @Override
    public User findById(Long id) {

        return userRepository.findById(id).
                orElseThrow(() -> new RuntimeException("User not found"));
    }
}
