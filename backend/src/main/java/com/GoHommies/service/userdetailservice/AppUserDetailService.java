// From: AppUserDetailService.java

package com.GoHommies.service.userdetailservice;

import java.util.Collections;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails; // Import this
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.GoHommies.entity.UserEntity;
import com.GoHommies.repository.UserRepository;

import lombok.RequiredArgsConstructor; // Import this

@Service
@RequiredArgsConstructor
public class AppUserDetailService implements UserDetailsService {

    private final UserRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        UserEntity existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found for email: " + email));
        
        if (!existingUser.isAccountVerified()) {
            throw new UsernameNotFoundException("Account not verified. Please verify your email with the OTP sent to you.");
        }
        // ✅ Add "ROLE_" prefix for Spring Security
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + existingUser.getRole().name());
        return new User(
                existingUser.getEmail(),
                existingUser.getPassword(),
                Collections.singletonList(authority)); // Pass the user's actual role
    }
}
