package com.tableManager.tableManager.controllers.admin;

import com.tableManager.tableManager.dto.UserDTO;
import com.tableManager.tableManager.model.Ticket;
import com.tableManager.tableManager.model.User;
import com.tableManager.tableManager.repository.TicketRepository;
import com.tableManager.tableManager.repository.UserRepository;
import com.tableManager.tableManager.service.UserService;
import com.tableManager.tableManager.service.admin.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.net.http.HttpResponse;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
@RequestMapping("/api/admin")
@CrossOrigin("*")
public class AdminController {

    private final AdminService adminService;
    private final UserRepository userRepository;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/users")
    public ResponseEntity<?> getUsers(){
       return ResponseEntity.ok(adminService.getAllUsers());
    }

    @DeleteMapping("/users/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id){
        adminService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/users/toggleUser/{id}")
    public ResponseEntity<?> toggleUser(@PathVariable Long id){
        adminService.setActive(id);

        return new ResponseEntity<>(HttpStatus.OK);
    }
    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id){
        User user = userRepository.findById(id).orElse(null);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserDTO user){

        User usr = adminService.findById(id);
        usr.setFirstName(user.getFirstName());
        usr.setLastName(user.getLastName());
        if(userService.userEmailExists(user.getEmail()) && !Objects.equals(user.getEmail(), usr.getEmail())){
            return new ResponseEntity<>("Email already exists", HttpStatus.CONFLICT);
        }else {
            usr.setEmail(user.getEmail());
        }

        usr.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(usr);

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
