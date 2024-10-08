package com.tableManager.tableManager.service.impl;

import com.tableManager.tableManager.model.Role;
import com.tableManager.tableManager.dto.RegisterDTO;
import com.tableManager.tableManager.model.User;
import com.tableManager.tableManager.repository.RoleRepository;
import com.tableManager.tableManager.repository.UserRepository;
import com.tableManager.tableManager.security.dao.MyUserDetails;
import com.tableManager.tableManager.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;


    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public Boolean userEmailExists(String email) {
        User user = userRepository.findByEmail(email);

        if(user != null){
            return true;
        }else{
            return false;
        }
    }

    @Override
    public User signUp(RegisterDTO registerDTO) {
        User user = new User();
        user.setUsername(registerDTO.getUsername());
        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        user.setEmail(registerDTO.getEmail());
        user.setFirstName(registerDTO.getFirstName());
        user.setLastName(registerDTO.getLastName());
        user.setRoles(findByName("USER"));
        userRepository.save(user);

        return user;
    }

    @Override
    public Set<Role> findByName(String roleName) {
        Set<Role> roles = new HashSet<>();
        roles.add(roleRepository.findByName(roleName));
       return roles;
    }

    @Override
    public boolean usernameExists(String username) {
        User user = userRepository.findByUsername(username);

        if(user != null){
            return true;
        }else{
            return false;
        }
    }

    @Override
    public Long getCurrentUserId() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication != null&& authentication.getPrincipal() instanceof MyUserDetails){
            MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
            User user = userRepository.findByUsername(userDetails.getUsername());
            return user.getId();
        }
        return null;
    }

    @Override
    public String findByRoleId(Set<Role> roles) {

     String userRoleName = "";
     for(Role role: roles){
         userRoleName = role.getName();
     }
     return userRoleName;
    }

    @Override
    public User findbyId(Long currentUserId) {
       return userRepository.findById(currentUserId)
               .orElseThrow(()->new RuntimeException("User not found"));
    }

    @Override
    public User findbyEmail(String email) {
        return userRepository.findByEmail(email);
    }
}

