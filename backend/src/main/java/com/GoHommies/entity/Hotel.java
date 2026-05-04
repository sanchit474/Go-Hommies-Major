package com.GoHommies.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "hotel")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_user_id", nullable = false)
    private Provider provider;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String location;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "total_seats", nullable = false)
    private Integer totalSeats;

    @Column(name = "available_seats", nullable = false)
    private Integer availableSeats;

    @Column(name = "price_per_night", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerNight;

    @Column(name = "avg_rating")
    private Double avgRating = 0.0;

    @Column(name = "total_ratings")
    private Integer totalRatings = 0;

    @Column(nullable = false)
    private Boolean isActive = true;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "hotel_room_photo", joinColumns = @JoinColumn(name = "hotel_id"))
    @Column(name = "photo_url", length = 512)
    private List<String> roomPhotoUrls = new ArrayList<>();

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // // getters and setters
    // public Long getId() { return id; }
    // public Provider getProvider() { return provider; }
    // public void setProvider(Provider provider) { this.provider = provider; }
    // public String getName() { return name; }
    // public void setName(String name) { this.name = name; }
    // public String getLocation() { return location; }
    // public void setLocation(String location) { this.location = location; }
    // public String getDescription() { return description; }
    // public void setDescription(String description) { this.description = description; }
    // public Integer getTotalSeats() { return totalSeats; }
    // public void setTotalSeats(Integer totalSeats) { this.totalSeats = totalSeats; }
    // public Integer getAvailableSeats() { return availableSeats; }
    // public void setAvailableSeats(Integer availableSeats) { this.availableSeats = availableSeats; }
    // public BigDecimal getPricePerNight() { return pricePerNight; }
    // public void setPricePerNight(BigDecimal pricePerNight) { this.pricePerNight = pricePerNight; }
    // public Double getAvgRating() { return avgRating; }
    // public void setAvgRating(Double avgRating) { this.avgRating = avgRating; }
    // public Integer getTotalRatings() { return totalRatings; }
    // public void setTotalRatings(Integer totalRatings) { this.totalRatings = totalRatings; }
    // public Boolean getIsActive() { return isActive; }
    // public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    // public List<String> getRoomPhotoUrls() { return roomPhotoUrls; }
    // public void setRoomPhotoUrls(List<String> roomPhotoUrls) { this.roomPhotoUrls = roomPhotoUrls; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
