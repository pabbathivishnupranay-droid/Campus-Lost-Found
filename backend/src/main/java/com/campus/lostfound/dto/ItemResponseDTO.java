package com.campus.lostfound.dto;

import com.campus.lostfound.entity.enums.ItemCategory;
import com.campus.lostfound.entity.enums.ItemStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ItemResponseDTO {
    private Long id;
    private String title;
    private String description;
    private ItemCategory category;
    private String locationFound;
    private LocalDate dateFound;
    private String imageUrl;
    private ItemStatus status;
    private UserSummaryDTO reportedBy;
    private LocalDateTime createdAt;

    public ItemResponseDTO() {
    }

    public ItemResponseDTO(Long id, String title, String description, ItemCategory category, String locationFound,
                           LocalDate dateFound, String imageUrl, ItemStatus status, UserSummaryDTO reportedBy, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.locationFound = locationFound;
        this.dateFound = dateFound;
        this.imageUrl = imageUrl;
        this.status = status;
        this.reportedBy = reportedBy;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String title;
        private String description;
        private ItemCategory category;
        private String locationFound;
        private LocalDate dateFound;
        private String imageUrl;
        private ItemStatus status;
        private UserSummaryDTO reportedBy;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder category(ItemCategory category) { this.category = category; return this; }
        public Builder locationFound(String locationFound) { this.locationFound = locationFound; return this; }
        public Builder dateFound(LocalDate dateFound) { this.dateFound = dateFound; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public Builder status(ItemStatus status) { this.status = status; return this; }
        public Builder reportedBy(UserSummaryDTO reportedBy) { this.reportedBy = reportedBy; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public ItemResponseDTO build() {
            return new ItemResponseDTO(id, title, description, category, locationFound, dateFound, imageUrl, status, reportedBy, createdAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public ItemCategory getCategory() { return category; }
    public void setCategory(ItemCategory category) { this.category = category; }
    public String locationFound() { return locationFound; }
    public String getLocationFound() { return locationFound; }
    public void setLocationFound(String locationFound) { this.locationFound = locationFound; }
    public LocalDate getDateFound() { return dateFound; }
    public void setDateFound(LocalDate dateFound) { this.dateFound = dateFound; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public ItemStatus getStatus() { return status; }
    public void setStatus(ItemStatus status) { this.status = status; }
    public UserSummaryDTO getReportedBy() { return reportedBy; }
    public void setReportedBy(UserSummaryDTO reportedBy) { this.reportedBy = reportedBy; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
