package com.tableManager.tableManager.service;


import com.tableManager.tableManager.dto.UserDTO;
import com.tableManager.tableManager.model.Role;
import com.tableManager.tableManager.dto.RegisterDTO;
import com.tableManager.tableManager.model.User;

import java.time.LocalDateTime;
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

    void updateUserInfo(UserDTO userDTO);

    void deleteUser(Long userId);


    void setRandomPassword(User user, String password);

    void updateResetPasswordToken(String token, String email);

    User findBypasswordResetToken(String token);

    void updatePassword(User user, String newPassword);

    void activateTrial(User user);

    void endTrial(User user);

    void setSubscription(Long sessionUser, LocalDateTime now, LocalDateTime localDateTime);

    void endSubscription(User user);
}
