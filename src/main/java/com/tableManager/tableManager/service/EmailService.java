package com.tableManager.tableManager.service;

import org.springframework.stereotype.Service;

@Service
public interface EmailService {

    void forgotPasswordEmail(String to, String subject, String body);
    void contactFormEmail(String from, String subject, String body);
    String generatePasswordToken(int length);

    void clientSendMail(String from, String to, String subject, String body, String attachmentPath);
}
