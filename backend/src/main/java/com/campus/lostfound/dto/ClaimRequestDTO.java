package com.campus.lostfound.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ClaimRequestDTO {

    @NotNull(message = "Item ID is required")
    private Long itemId;

    @NotBlank(message = "Verification details are required")
    private String verificationDetails;

    public ClaimRequestDTO() {
    }

    public ClaimRequestDTO(Long itemId, String verificationDetails) {
        this.itemId = itemId;
        this.verificationDetails = verificationDetails;
    }

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }
    public String getVerificationDetails() { return verificationDetails; }
    public void setVerificationDetails(String verificationDetails) { this.verificationDetails = verificationDetails; }
}
