package com.tableManager.tableManager.service.impl;

import com.tableManager.tableManager.service.EmailService;
import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMailMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class EmailServiceImpl implements EmailService {


    private final JavaMailSender mailSender;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    @Async
    public void forgotPasswordEmail(String to, String subject, String body) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("no-reply@tablemanager.ee");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }

    @Override
    @Async
    public void contactFormEmail(String from, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo("admin@tablemanager.ee");
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }

    @Override
    public String generatePasswordToken(int length){
        String UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
        String DIGITS = "0123456789";

        String allChars = UPPERCASE + LOWERCASE + DIGITS;
        StringBuilder passwordToken = new StringBuilder();

        Random random = new Random();

        for(int i=0; i<length; i++){
            int index = random.nextInt(allChars.length());
            passwordToken.append(allChars.charAt(index));
        }
        return passwordToken.toString();
    }

    @Override
    public void clientSendMail(String from, String to, String subject, String body, String attachmentPath) {
        MimeMessage mimeMessage = mailSender.createMimeMessage();

        try {
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true);
            mimeMessageHelper.setFrom(from);
            mimeMessageHelper.setTo(to);
            mimeMessageHelper.setSubject(subject);
            mimeMessageHelper.setText(body);

            FileSystemResource file = new FileSystemResource(attachmentPath);
            if(file.exists()) {
                mimeMessageHelper.addAttachment(file.getFilename(), file);
            }else{
                throw new RuntimeException("Attachment not found" + attachmentPath);
            }
            mailSender.send(mimeMessage);
        }catch(Exception e){
            throw new RuntimeException(e);
        }
    }
}
