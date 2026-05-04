package com.GoHommies.config;
// for create the admin mannually so need this class

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.GoHommies.entity.UserEntity;
import com.GoHommies.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedAdminUser();
        seedServiceProviderUser();
    }

    private void seedAdminUser() {
        String adminEmail = "admin@qcare.com";
        
        if (!userRepository.existsByEmail(adminEmail)) {
            UserEntity admin = UserEntity.builder()
                    .fullName("Admin User")
                    .email(adminEmail)
                    .password(passwordEncoder.encode("admin123"))
                    .role(UserEntity.Role.ADMIN)
                    .accountVerified(true)
                    .resetOtpExpireAt(0L)
                    .verifyOtpExpireAt(0L)
                    .build();
            
            userRepository.save(admin);
            log.info("✅ Admin user created: {}", adminEmail);
        } else {
            // Fix existing admin record: ensure accountVerified = true and role = ADMIN
            userRepository.findByEmail(adminEmail).ifPresent(admin -> {
                boolean changed = false;
                if (!admin.isAccountVerified()) {
                    admin.setAccountVerified(true);
                    changed = true;
                    log.info("🔧 Fixed accountVerified=true for admin");
                }
                if (admin.getRole() != UserEntity.Role.ADMIN) {
                    admin.setRole(UserEntity.Role.ADMIN);
                    changed = true;
                    log.info("🔧 Fixed role=ADMIN for admin");
                }
                if (changed) userRepository.save(admin);
                else log.info("ℹ️ Admin user already exists and is valid");
            });
        }
    }

    private void seedServiceProviderUser() {
        String email = "serviceprovider@gohomies.com";

        UserEntity user = userRepository.findByEmail(email).orElseGet(() -> {
            UserEntity created = UserEntity.builder()
                    .fullName("Service Provider")
                    .email(email)
                    .password(passwordEncoder.encode("provider123"))
                    .role(UserEntity.Role.SERVICEPROVIDER)
                    .accountVerified(true)
                    .resetOtpExpireAt(0L)
                    .verifyOtpExpireAt(0L)
                    .build();

            userRepository.save(created);
            log.info("✅ Service provider user created: {}", email);
            return created;
        });

        // keep it idempotent: fix role/verified if someone edited the row manually
        boolean changed = false;
        if (user.getRole() != UserEntity.Role.SERVICEPROVIDER) {
            user.setRole(UserEntity.Role.SERVICEPROVIDER);
            changed = true;
        }
        if (!user.isAccountVerified()) {
            user.setAccountVerified(true);
            changed = true;
        }
        if (changed) {
            userRepository.save(user);
            log.info("🔧 Fixed service provider user flags: {}", email);
        }
    }
}
