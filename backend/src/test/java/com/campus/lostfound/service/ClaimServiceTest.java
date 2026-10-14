package com.campus.lostfound.service;

import com.campus.lostfound.dto.ClaimRequestDTO;
import com.campus.lostfound.dto.ClaimResponseDTO;
import com.campus.lostfound.dto.ClaimStatusUpdateRequest;
import com.campus.lostfound.entity.Claim;
import com.campus.lostfound.entity.Item;
import com.campus.lostfound.entity.User;
import com.campus.lostfound.entity.enums.ClaimStatus;
import com.campus.lostfound.entity.enums.ItemCategory;
import com.campus.lostfound.entity.enums.ItemStatus;
import com.campus.lostfound.entity.enums.Role;
import com.campus.lostfound.exception.BadRequestException;
import com.campus.lostfound.repository.ClaimRepository;
import com.campus.lostfound.repository.ItemRepository;
import com.campus.lostfound.repository.UserRepository;
import com.campus.lostfound.security.CustomUserDetails;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClaimServiceTest {

    @Mock
    private ClaimRepository claimRepository;

    @Mock
    private ItemRepository itemRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ItemService itemService;

    @InjectMocks
    private ClaimService claimService;

    private User studentReporter;
    private User claimant;
    private Item item;
    private CustomUserDetails claimantDetails;

    @BeforeEach
    void setUp() {
        studentReporter = User.builder()
                .id(1L)
                .name("Reporter User")
                .email("reporter@campus.edu")
                .role(Role.STUDENT)
                .build();

        claimant = User.builder()
                .id(2L)
                .name("Claimant User")
                .email("claimant@campus.edu")
                .role(Role.STUDENT)
                .build();

        claimantDetails = new CustomUserDetails(claimant);

        item = Item.builder()
                .id(100L)
                .title("Blue Hydro Flask")
                .description("Navy blue with mountain stickers")
                .category(ItemCategory.ACCESSORIES)
                .locationFound("Campus Library 2nd Floor")
                .dateFound(LocalDate.now())
                .status(ItemStatus.UNCLAIMED)
                .reportedBy(studentReporter)
                .build();
    }

    @Test
    @DisplayName("Should create claim and transition item status to CLAIM_PENDING")
    void shouldCreateClaimSuccessfully() {
        ClaimRequestDTO request = ClaimRequestDTO.builder()
                .itemId(100L)
                .verificationDetails("Has a scratch on the bottom and a Yosemite sticker")
                .build();

        when(itemRepository.findById(100L)).thenReturn(Optional.of(item));
        when(claimRepository.existsByItemIdAndClaimantId(100L, 2L)).thenReturn(false);
        when(userRepository.findById(2L)).thenReturn(Optional.of(claimant));

        Claim savedClaim = Claim.builder()
                .id(500L)
                .item(item)
                .claimant(claimant)
                .verificationDetails(request.getVerificationDetails())
                .status(ClaimStatus.PENDING)
                .build();

        when(claimRepository.save(any(Claim.class))).thenReturn(savedClaim);

        ClaimResponseDTO response = claimService.createClaim(request, claimantDetails);

        assertNotNull(response);
        assertEquals(ClaimStatus.PENDING, response.getStatus());
        assertEquals(ItemStatus.CLAIM_PENDING, item.getStatus());
        verify(itemRepository).save(item);
    }

    @Test
    @DisplayName("Should prevent user from claiming their own reported item")
    void shouldThrowWhenClaimingOwnItem() {
        CustomUserDetails reporterDetails = new CustomUserDetails(studentReporter);
        ClaimRequestDTO request = ClaimRequestDTO.builder()
                .itemId(100L)
                .verificationDetails("This is my item")
                .build();

        when(itemRepository.findById(100L)).thenReturn(Optional.of(item));

        assertThrows(BadRequestException.class, () -> claimService.createClaim(request, reporterDetails));
    }

    @Test
    @DisplayName("Should prevent duplicate claim on the same item by the same user")
    void shouldThrowWhenClaimingAlreadyClaimedItemByUser() {
        ClaimRequestDTO request = ClaimRequestDTO.builder()
                .itemId(100L)
                .verificationDetails("Second claim attempt")
                .build();

        when(itemRepository.findById(100L)).thenReturn(Optional.of(item));
        when(claimRepository.existsByItemIdAndClaimantId(100L, 2L)).thenReturn(true);

        assertThrows(BadRequestException.class, () -> claimService.createClaim(request, claimantDetails));
    }

    @Test
    @DisplayName("Approving a claim should set item to CLAIMED and reject other pending claims")
    void shouldApproveClaimAndRejectConflictingClaims() {
        Claim claim1 = Claim.builder()
                .id(1L)
                .item(item)
                .claimant(claimant)
                .status(ClaimStatus.PENDING)
                .verificationDetails("Verified owner")
                .build();

        User claimant2 = User.builder().id(3L).name("Other Claimant").email("other@campus.edu").role(Role.STUDENT).build();
        Claim claim2 = Claim.builder()
                .id(2L)
                .item(item)
                .claimant(claim2)
                .status(ClaimStatus.PENDING)
                .verificationDetails("False claim")
                .build();

        when(claimRepository.findById(1L)).thenReturn(Optional.of(claim1));
        when(claimRepository.save(claim1)).thenReturn(claim1);
        when(claimRepository.findByItemIdOrderByCreatedAtDesc(100L)).thenReturn(List.of(claim1, claim2));

        ClaimStatusUpdateRequest updateRequest = ClaimStatusUpdateRequest.builder()
                .status(ClaimStatus.APPROVED)
                .build();

        ClaimResponseDTO result = claimService.updateClaimStatus(1L, updateRequest);

        assertNotNull(result);
        assertEquals(ClaimStatus.APPROVED, claim1.getStatus());
        assertEquals(ItemStatus.CLAIMED, item.getStatus());
        assertEquals(ClaimStatus.REJECTED, claim2.getStatus());
        verify(itemRepository).save(item);
        verify(claimRepository).save(claim2);
    }
}
