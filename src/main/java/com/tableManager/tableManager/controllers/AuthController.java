package com.tableManager.tableManager.controllers;

import com.tableManager.tableManager.dto.AuthResponseDTO;
import com.tableManager.tableManager.dto.LoginDTO;
import com.tableManager.tableManager.dto.RegisterDTO;
import com.tableManager.tableManager.model.Sales;
import com.tableManager.tableManager.model.User;
import com.tableManager.tableManager.security.JwtGenerator;
import com.tableManager.tableManager.service.UserService;
import com.tableManager.tableManager.service.impl.SalesServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private JwtGenerator jwtGenerator;
    @Autowired
    private  AuthenticationManager authenticationManager;
    @Autowired
    private  UserService userService;
    @Autowired
    private SalesServiceImpl salesService;

    private final String BASE_UPLOAD_DIR = "/data01/virt131441/domeenid/www.tablemanager.ee/clientSales/";


@PostMapping("/signup")
public ResponseEntity<User> signUp(@RequestBody RegisterDTO registerDTO) {


        if(userService.userEmailExists(registerDTO.getEmail()) ||
                userService.usernameExists(registerDTO.getUsername())){
            return new ResponseEntity<>( HttpStatus.BAD_REQUEST);
        }

         User user =  userService.signUp(registerDTO);
        return new ResponseEntity<>(user,HttpStatus.OK);

    }

    @PostMapping("/checkTrial")
    public ResponseEntity<AuthResponseDTO> checkSubscription(@RequestBody LoginDTO loginDTO) {
        User user = userService.findByUsername(loginDTO.getUsername());
        List<Sales> sales = salesService.getSalesByUserId(user.getId());


        if( user.getTrialEndDate() != null && user.isHasTrial() &&
                user.getTrialEndDate().isBefore(LocalDateTime.now())){
            userService.endTrial(user);
        }

        if(user.getSubscriptionStartDate() != null && user.isEnabled()
                && user.getSubscriptionEndDate().isBefore(LocalDateTime.now())){

            userService.endSubscription(user);
        }

        for(Sales sale : sales){
            Path file = Path.of(BASE_UPLOAD_DIR + user.getId() + "/" + sale.getInvoiceNumber() + ".pdf");

            if(Files.exists(file) && sale.getSaleDate().isBefore(LocalDateTime.now().minusDays(90))){
                try {
                    Files.delete(file);
                }catch(Exception e){
                    e.printStackTrace();
                    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                }
            }
        }

        return new ResponseEntity<>(HttpStatus.OK);

    }
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginDTO loginDTO) {

        User user = userService.findByUsername(loginDTO.getUsername());
        checkSubscription(loginDTO);

        Authentication authentication = authenticationManager.authenticate
                (new UsernamePasswordAuthenticationToken(loginDTO.getUsername(), loginDTO.getPassword()));


                SecurityContextHolder.getContext().setAuthentication(authentication);
                String token = jwtGenerator.generateToken(authentication);
                String roleName = userService.findByRoleId(user.getRoles());

                return new ResponseEntity<>(new AuthResponseDTO(token, roleName, user.getId(),
                        user.getUsername(), user.getEmail(),user.isEnabled(), user.isHasTrial()), HttpStatus.OK);

    }
}
