package com.GoHommies.service.emailservice;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class EmailService {

    private static final String RESEND_EMAILS_ENDPOINT = "https://api.resend.com/emails";

    private final RestClient restClient;

    @Value("${resend.api-key}")
    private String resendApiKey;

    @Value("${resend.from-email}")
    private String fromEmail;

    public EmailService(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder.baseUrl(RESEND_EMAILS_ENDPOINT).build();
    }

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
            Map<String, Object> payload = Map.of(
                "from", fromEmail,
                "to", new String[]{to},
                "subject", subject,
                "text", body
            );

            restClient.post()
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + resendApiKey)
                .body(payload)
                .retrieve()
                .toBodilessEntity();

            log.info("Email sent to {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Unable to send email", e);
        }
    }
}
