package com.tableManager.tableManager.controllers;

import com.tableManager.tableManager.dto.AuthResponseDTO;
import com.tableManager.tableManager.dto.LoginDTO;
import com.tableManager.tableManager.dto.RegisterDTO;
import com.tableManager.tableManager.model.User;
import com.tableManager.tableManager.security.JwtGenerator;
import com.tableManager.tableManager.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    @Autowired
    private JwtGenerator jwtGenerator;
    @Autowired
    private  AuthenticationManager authenticationManager;
    @Autowired
    private  UserService userService;


@PostMapping("/signup")
public ResponseEntity<String> signUp(@RequestBody RegisterDTO registerDTO) {
        if(userService.userEmailExists(registerDTO.getEmail()) || userService.usernameExists(registerDTO.getUsername())){
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Email/Username already exists");
        }
       User user =  userService.signUp(registerDTO);

        if(user == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        return new ResponseEntity<>("User Registered Successfully", HttpStatus.OK);

    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginDTO loginDTO) {
        Authentication authentication = authenticationManager.authenticate
                (new UsernamePasswordAuthenticationToken(loginDTO.getUsername(), loginDTO.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
             String token = jwtGenerator.generateToken(authentication);
             return new ResponseEntity<>(new AuthResponseDTO(token), HttpStatus.OK);
    }
}
