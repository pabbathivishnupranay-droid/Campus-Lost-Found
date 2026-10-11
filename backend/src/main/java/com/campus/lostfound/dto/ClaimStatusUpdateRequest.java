package com.campus.lostfound.dto;

import com.campus.lostfound.entity.enums.ClaimStatus;
import jakarta.validation.constraints.NotNull;

public class ClaimStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private ClaimStatus status;

    public ClaimStatusUpdateRequest() {
    }

    public ClaimStatusUpdateRequest(ClaimStatus status) {
        this.status = status;
    }

    public ClaimStatus getStatus() { return status; }
    public void setStatus(ClaimStatus status) { this.status = status; }
}
