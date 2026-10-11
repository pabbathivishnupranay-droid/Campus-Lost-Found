package com.campus.lostfound.service;

import com.campus.lostfound.dto.ClaimRequestDTO;
import com.campus.lostfound.dto.ClaimResponseDTO;
import com.campus.lostfound.dto.ClaimStatusUpdateRequest;
import com.campus.lostfound.dto.UserSummaryDTO;
import com.campus.lostfound.entity.Claim;
import com.campus.lostfound.entity.Item;
import com.campus.lostfound.entity.User;
import com.campus.lostfound.entity.enums.ClaimStatus;
import com.campus.lostfound.entity.enums.ItemStatus;
import com.campus.lostfound.exception.BadRequestException;
import com.campus.lostfound.exception.ResourceNotFoundException;
import com.campus.lostfound.repository.ClaimRepository;
import com.campus.lostfound.repository.ItemRepository;
import com.campus.lostfound.repository.UserRepository;
import com.campus.lostfound.security.CustomUserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    private final ItemService itemService;

    public ClaimService(ClaimRepository claimRepository,
                        ItemRepository itemRepository,
                        UserRepository userRepository,
                        ItemService itemService) {
        this.claimRepository = claimRepository;
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
        this.itemService = itemService;
    }

    @Transactional
    public ClaimResponseDTO createClaim(ClaimRequestDTO request, CustomUserDetails currentUser) {
        Item item = itemRepository.findById(request.getItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + request.getItemId()));

        if (item.getStatus() == ItemStatus.CLAIMED) {
            throw new BadRequestException("This item has already been marked as claimed.");
        }

        if (item.getReportedBy().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You cannot submit a claim for an item you reported.");
        }

        if (claimRepository.existsByItemIdAndClaimantId(item.getId(), currentUser.getId())) {
            throw new BadRequestException("You have already submitted a claim for this item.");
        }

        User claimant = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + currentUser.getId()));

        Claim claim = Claim.builder()
                .item(item)
                .claimant(claimant)
                .verificationDetails(request.getVerificationDetails().trim())
                .status(ClaimStatus.PENDING)
                .build();

        Claim savedClaim = claimRepository.save(claim);

        // Update item status to CLAIM_PENDING
        if (item.getStatus() == ItemStatus.UNCLAIMED) {
            item.setStatus(ItemStatus.CLAIM_PENDING);
            itemRepository.save(item);
        }

        return mapToDTO(savedClaim);
    }

    public List<ClaimResponseDTO> getAllClaims() {
        return claimRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ClaimResponseDTO> getMyClaims(CustomUserDetails currentUser) {
        return claimRepository.findByClaimantIdOrderByCreatedAtDesc(currentUser.getId())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ClaimResponseDTO updateClaimStatus(Long claimId, ClaimStatusUpdateRequest request) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found with id: " + claimId));

        Item item = claim.getItem();
        ClaimStatus newStatus = request.getStatus();
        claim.setStatus(newStatus);
        Claim updatedClaim = claimRepository.save(claim);

        if (newStatus == ClaimStatus.APPROVED) {
            item.setStatus(ItemStatus.CLAIMED);
            itemRepository.save(item);

            // Reject all other pending claims on this item
            List<Claim> otherClaims = claimRepository.findByItemIdOrderByCreatedAtDesc(item.getId());
            for (Claim other : otherClaims) {
                if (!other.getId().equals(claimId) && other.getStatus() == ClaimStatus.PENDING) {
                    other.setStatus(ClaimStatus.REJECTED);
                    claimRepository.save(other);
                }
            }
        } else if (newStatus == ClaimStatus.REJECTED) {
            // Check if there are other pending claims
            List<Claim> itemClaims = claimRepository.findByItemIdOrderByCreatedAtDesc(item.getId());
            boolean hasOtherPending = itemClaims.stream()
                    .anyMatch(c -> !c.getId().equals(claimId) && c.getStatus() == ClaimStatus.PENDING);

            if (!hasOtherPending && item.getStatus() != ItemStatus.CLAIMED) {
                item.setStatus(ItemStatus.UNCLAIMED);
                itemRepository.save(item);
            }
        }

        return mapToDTO(updatedClaim);
    }

    public ClaimResponseDTO mapToDTO(Claim claim) {
        User claimant = claim.getClaimant();
        UserSummaryDTO claimantDTO = UserSummaryDTO.builder()
                .id(claimant.getId())
                .name(claimant.getName())
                .email(claimant.getEmail())
                .role(claimant.getRole())
                .build();

        return ClaimResponseDTO.builder()
                .id(claim.getId())
                .item(itemService.mapToDTO(claim.getItem()))
                .claimant(claimantDTO)
                .verificationDetails(claim.getVerificationDetails())
                .status(claim.getStatus())
                .createdAt(claim.getCreatedAt())
                .build();
    }
}
