package com.campus.lostfound.dto;

import com.campus.lostfound.entity.enums.ItemCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

public class ItemRequestDTO {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Category is required")
    private ItemCategory category;

    @NotBlank(message = "Location found is required")
    private String locationFound;

    @NotNull(message = "Date found is required")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate dateFound;

    public ItemRequestDTO() {
    }

    public ItemRequestDTO(String title, String description, ItemCategory category, String locationFound, LocalDate dateFound) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.locationFound = locationFound;
        this.dateFound = dateFound;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String title;
        private String description;
        private ItemCategory category;
        private String locationFound;
        private LocalDate dateFound;

        public Builder title(String title) { this.title = title; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder category(ItemCategory category) { this.category = category; return this; }
        public Builder locationFound(String locationFound) { this.locationFound = locationFound; return this; }
        public Builder dateFound(LocalDate dateFound) { this.dateFound = dateFound; return this; }

        public ItemRequestDTO build() {
            return new ItemRequestDTO(title, description, category, locationFound, dateFound);
        }
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public ItemCategory getCategory() { return category; }
    public void setCategory(ItemCategory category) { this.category = category; }
    public String getLocationFound() { return locationFound; }
    public void setLocationFound(String locationFound) { this.locationFound = locationFound; }
    public LocalDate getDateFound() { return dateFound; }
    public void setDateFound(LocalDate dateFound) { this.dateFound = dateFound; }
}
