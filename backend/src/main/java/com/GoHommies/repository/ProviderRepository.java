package com.GoHommies.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.GoHommies.entity.Provider;
import com.GoHommies.entity.UserEntity;

public interface ProviderRepository extends JpaRepository<Provider, Long> {
    Optional<Provider> findByUser(UserEntity user);
    Optional<Provider> findByUserEmail(String email);
}
