package com.tableManager.tableManager.controllers;


import com.tableManager.tableManager.model.User;
import com.tableManager.tableManager.service.impl.EmailServiceImpl;
import com.tableManager.tableManager.service.impl.UserServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/email")
@CrossOrigin("*")
public class EmailController {

    private final EmailServiceImpl emailService;
    private final UserServiceImpl userService;
    private final PasswordEncoder passwordEncoder;
    private String BASE_UPLOAD_DIR = "/data01/virt131441/domeenid/www.tablemanager.ee/clientAttachmentUpload/";


    public EmailController(EmailServiceImpl emailService, UserServiceImpl userService, PasswordEncoder passwordEncoder) {
        this.emailService = emailService;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }


    @PostMapping("/forgotPassword")
    public ResponseEntity<String> sendForgotPasswordEmail(@RequestParam String to) {
        String subject = "Forgotten Password - Tablemanager";
        String token = emailService.generatePasswordToken(30);

            userService.updateResetPasswordToken(token, to);
            String resetPasswordLink = "Your password reset link: " + "https://tablemanager.ee/resetPassword?token=" + token
                    +"\n If you didn't order password reset, ignore this email.";
            emailService.forgotPasswordEmail(to, subject, resetPasswordLink);
            return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/resetPassword")
    public ResponseEntity<?> resetPassword(@RequestParam String token, @RequestParam String password) {
        User user = userService.findBypasswordResetToken(token);

        try{
            if(user.getId() != null) {
                userService.updatePassword(user, password);
                return new ResponseEntity<>(HttpStatus.OK);
            }else{
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/contact")
    public ResponseEntity<String> sendContactEmail(@RequestParam String from, @RequestParam String subject, @RequestParam String body ) {

        emailService.contactFormEmail(from, subject, body);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/sendEmail")
    public ResponseEntity<String> clientSendEmail(@RequestParam String from,
                                                  @RequestParam String to,
                                                  @RequestParam String subject,
                                                  @RequestParam String body,
                                                  @RequestParam String attachmentPath ) {


            emailService.clientSendMail(from,to,subject,body,attachmentPath);
            try {
                Files.deleteIfExists(Path.of(attachmentPath));
            }catch (Exception e){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(HttpStatus.OK);

    }

 @PostMapping("/uploadFile")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam MultipartFile file, @RequestParam Long id) {
        try{
            String clientDirPath = BASE_UPLOAD_DIR + id;
            Path clientDir = Paths.get(clientDirPath);

            if(!Files.exists(clientDir)){
                Files.createDirectories(clientDir);
            }
            Path filePath = clientDir.resolve(file.getOriginalFilename());
            file.transferTo(filePath.toFile());
            Map<String, String> res = new HashMap<>();
            res.put("filePath", filePath.toString());

            return new ResponseEntity<>(res,HttpStatus.OK);

        }catch(Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
 }

}
