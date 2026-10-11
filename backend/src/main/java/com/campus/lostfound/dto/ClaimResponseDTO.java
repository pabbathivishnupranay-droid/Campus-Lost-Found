package com.campus.lostfound.dto;

import com.campus.lostfound.entity.enums.ClaimStatus;

import java.time.LocalDateTime;

public class ClaimResponseDTO {
    private Long id;
    private ItemResponseDTO item;
    private UserSummaryDTO claimant;
    private String verificationDetails;
    private ClaimStatus status;
    private LocalDateTime createdAt;

    public ClaimResponseDTO() {
    }

    public ClaimResponseDTO(Long id, ItemResponseDTO item, UserSummaryDTO claimant, String verificationDetails,
                            ClaimStatus status, LocalDateTime createdAt) {
        this.id = id;
        this.item = item;
        this.claimant = claimant;
        this.verificationDetails = verificationDetails;
        this.status = status;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private ItemResponseDTO item;
        private UserSummaryDTO claimant;
        private String verificationDetails;
        private ClaimStatus status;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder item(ItemResponseDTO item) { this.item = item; return this; }
        public Builder claimant(UserSummaryDTO claimant) { this.claimant = claimant; return this; }
        public Builder verificationDetails(String verificationDetails) { this.verificationDetails = verificationDetails; return this; }
        public Builder status(ClaimStatus status) { this.status = status; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public ClaimResponseDTO build() {
            return new ClaimResponseDTO(id, item, claimant, verificationDetails, status, createdAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public ItemResponseDTO getItem() { return item; }
    public void setItem(ItemResponseDTO item) { this.item = item; }
    public UserSummaryDTO getClaimant() { return claimant; }
    public void setClaimant(UserSummaryDTO claimant) { this.claimant = claimant; }
    public String getVerificationDetails() { return verificationDetails; }
    public void setVerificationDetails(String verificationDetails) { this.verificationDetails = verificationDetails; }
    public ClaimStatus getStatus() { return status; }
    public void setStatus(ClaimStatus status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
