package com.GoHommies.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "traveller")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Traveller {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private UserEntity user;

    @Column(name = "image_url", length = 512)
    private String profileUrl;

    @Column(name = "cover_photo_url", length = 512)
    private String coverPhotoUrl;

    private String phone;
    private String address;
    private java.time.LocalDate birthday;

    @Enumerated(EnumType.STRING)
    private Gender gender;
    private Integer age;
    private String location;
    private String bio;

    public enum Gender {
        MALE, FEMALE, OTHER
    }

    // 🌍 Travel-related fields
    private String travelStyle;
    // e.g. "Budget", "Luxury", "Backpacking"

    // ⚡ Better: store as list (JPA will create separate table)
    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> interests;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> languages;

    // ✈️ Trips relationship
    @OneToMany(mappedBy = "traveller", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Trip> trips;

    // ⭐ Trust system (future use)
    private Double rating = 0.0;
    private Integer tripsCount = 0;

    // ✅ Profile completion flag
    private Boolean isProfileComplete = false;

    // ⏱️ Timestamps
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

}

