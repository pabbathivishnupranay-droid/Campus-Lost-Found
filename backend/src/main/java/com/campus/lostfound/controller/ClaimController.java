package com.campus.lostfound.controller;

import com.campus.lostfound.dto.ClaimRequestDTO;
import com.campus.lostfound.dto.ClaimResponseDTO;
import com.campus.lostfound.dto.ClaimStatusUpdateRequest;
import com.campus.lostfound.security.CustomUserDetails;
import com.campus.lostfound.service.ClaimService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    @PostMapping
    public ResponseEntity<ClaimResponseDTO> submitClaim(
            @Valid @RequestBody ClaimRequestDTO request,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        ClaimResponseDTO created = claimService.createClaim(request, currentUser);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SECURITY', 'ADMIN')")
    public ResponseEntity<List<ClaimResponseDTO>> getAllClaims() {
        List<ClaimResponseDTO> claims = claimService.getAllClaims();
        return ResponseEntity.ok(claims);
    }

    @GetMapping("/my")
    public ResponseEntity<List<ClaimResponseDTO>> getMyClaims(
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        List<ClaimResponseDTO> claims = claimService.getMyClaims(currentUser);
        return ResponseEntity.ok(claims);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('SECURITY', 'ADMIN')")
    public ResponseEntity<ClaimResponseDTO> updateClaimStatus(
            @PathVariable Long id,
            @Valid @RequestBody ClaimStatusUpdateRequest request
    ) {
        ClaimResponseDTO updated = claimService.updateClaimStatus(id, request);
        return ResponseEntity.ok(updated);
    }
}
