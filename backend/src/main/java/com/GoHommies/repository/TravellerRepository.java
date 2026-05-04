package com.GoHommies.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.GoHommies.entity.Traveller;
import com.GoHommies.entity.UserEntity;

@Repository
public interface TravellerRepository extends JpaRepository<Traveller, Long>, JpaSpecificationExecutor<Traveller> {
    Optional<Traveller> findByUser(UserEntity user);
}
