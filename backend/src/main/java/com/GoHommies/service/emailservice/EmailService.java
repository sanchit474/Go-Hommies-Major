package com.GoHommies.service.emailservice;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendWelcomeEmail(String toEmail, String name) {
        sendEmail(toEmail, "Welcome to GoHommies!",
            "Hello " + name + ",\n\nThanks for registering with us!\n\nRegards,\nGoHommies Team");
    }

    @Async
    public void sendResetOtpMail(String toEmail, String otp) {
        sendEmail(toEmail, "Password Reset OTP",
            "Your OTP for resetting your password is " + otp + ". Use this OTP to proceed with password reset.");
    }

    @Async
    public void sendOtpMail(String toEmail, String otp) {
        sendEmail(toEmail, "Account Verification OTP",
            "Your OTP is " + otp + ". Verify your account.");
    }

    private void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("Email sent to {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Unable to send email", e);
        }
    }
}
