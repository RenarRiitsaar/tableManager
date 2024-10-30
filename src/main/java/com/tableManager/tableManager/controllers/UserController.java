package com.tableManager.tableManager.controllers;

import com.tableManager.tableManager.dto.UserDTO;
import com.tableManager.tableManager.model.Role;
import com.tableManager.tableManager.model.User;
import com.tableManager.tableManager.repository.RoleRepository;
import com.tableManager.tableManager.service.impl.UserServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/user")
@CrossOrigin("*")
public class UserController {

    private final UserServiceImpl userService;
    private final RoleRepository roleRepository;
    private static final String DIR_PREFIX = "/data01/virt131441/domeenid/www.tablemanager.ee/logos";


    public UserController(UserServiceImpl userService, RoleRepository roleRepository) {
        this.userService = userService;

        this.roleRepository = roleRepository;
    }

    @DeleteMapping("/{logoUrl}")
    public ResponseEntity<Void> deletePhoto(@PathVariable String logoUrl) {
        String imagePath = DIR_PREFIX + logoUrl;

        File file = new File(imagePath);

        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        boolean isDeleted = file.delete();

        if (!isDeleted) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/activateTrial/{id}")
    public ResponseEntity<?> activateTrial(@PathVariable Long id){
        User user = userService.findbyId(id);

        if(user != null){
          userService.activateTrial(user);
            return new ResponseEntity<>(HttpStatus.OK);

        }else{
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/editUserInfo")
    public ResponseEntity<?> editUserInfo(@RequestBody UserDTO userDTO) {
        Long currentUserId = userService.getCurrentUserId();

        if(currentUserId != null){
           userService.updateUserInfo(userDTO);

            return new ResponseEntity<>(HttpStatus.OK);
        } else{
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/deleteUser")
    public ResponseEntity<?> deleteUser() {
        Long userId = userService.getCurrentUserId();
        roleRepository.deleteUserRolesByUserId(userId);

        if(userId != null ){
            try {
                Thread.sleep(500);
                userService.deleteUser(userId);
                return new ResponseEntity<>(HttpStatus.OK);
            }catch (Exception e){
                return new ResponseEntity<>(HttpStatus.CONFLICT);
            }

        }else{
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
