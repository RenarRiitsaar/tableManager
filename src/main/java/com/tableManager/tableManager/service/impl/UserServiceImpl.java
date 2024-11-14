package com.tableManager.tableManager.service.impl;

import com.tableManager.tableManager.dto.UserDTO;
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

import java.time.LocalDateTime;
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

        if (user != null) {
            return true;
        } else {
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

        if (user != null) {
            return true;
        } else {
            return false;
        }
    }

    @Override
    public Long getCurrentUserId() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof MyUserDetails) {
            MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
            User user = userRepository.findByUsername(userDetails.getUsername());
            return user.getId();
        }
        return null;
    }

    @Override
    public String findByRoleId(Set<Role> roles) {

        String userRoleName = "";
        for (Role role : roles) {
            userRoleName = role.getName();
        }
        return userRoleName;
    }

    @Override
    public User findbyId(Long currentUserId) {
        return userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public User findbyEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public void updateUserInfo(UserDTO userDTO) {
        Long userId = getCurrentUserId();
        User user = findbyId(userId);
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));


        userRepository.save(user);
    }

    @Override
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }


    @Override
    public void setRandomPassword(User user, String password) {
        user.setPassword(passwordEncoder.encode(password));
    }

    @Override
    public void updateResetPasswordToken(String token, String email) {
        User user = userRepository.findByEmail(email);

        if (user != null) {
            user.setPasswordResetToken(token);
            userRepository.save(user);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    @Override
    public User findBypasswordResetToken(String token) {
        return userRepository.findByPasswordResetToken(token);
    }

    @Override
    public void updatePassword(User user, String newPassword) {

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setPasswordResetToken(null);
        userRepository.save(user);
    }

    @Override
    public void activateTrial(User user) {
        user.setTrialDate(LocalDateTime.now());
        user.setTrialEndDate(LocalDateTime.now().plusDays(30));
        user.setEnabled(true);

        userRepository.save(user);
    }

    @Override
    public void endTrial(User user) {
        user.setHasTrial(false);
        user.setEnabled(false);
        userRepository.save(user);
    }

    @Override
    public void setSubscription(Long sessionUser, LocalDateTime now, LocalDateTime localDateTime) {
        User user = userRepository.findById(sessionUser)
                .orElseThrow(() -> new RuntimeException("User not found (payment intent)"));

        user.setSubscriptionStartDate(now);
        user.setSubscriptionEndDate(localDateTime);
        user.setEnabled(true);
        userRepository.save(user);
    }

    @Override
    public void endSubscription(User user) {
        user.setEnabled(false);
        user.setHasTrial(false);
        userRepository.save(user);
    }
}

