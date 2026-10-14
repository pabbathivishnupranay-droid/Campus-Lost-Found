package com.campus.lostfound.service;

import com.campus.lostfound.dto.ItemRequestDTO;
import com.campus.lostfound.dto.ItemResponseDTO;
import com.campus.lostfound.entity.Item;
import com.campus.lostfound.entity.User;
import com.campus.lostfound.entity.enums.ItemCategory;
import com.campus.lostfound.entity.enums.ItemStatus;
import com.campus.lostfound.entity.enums.Role;
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
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ItemServiceTest {

    @Mock
    private ItemRepository itemRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private FileStorageService fileStorageService;

    @InjectMocks
    private ItemService itemService;

    private User student;
    private CustomUserDetails userDetails;
    private Item item;

    @BeforeEach
    void setUp() {
        student = User.builder()
                .id(1L)
                .name("Alex Student")
                .email("alex@campus.edu")
                .role(Role.STUDENT)
                .build();

        userDetails = new CustomUserDetails(student);

        item = Item.builder()
                .id(10L)
                .title("MacBook Pro 14")
                .description("Silver, Space Black case")
                .category(ItemCategory.ELECTRONICS)
                .locationFound("Main Auditorium Row F")
                .dateFound(LocalDate.now())
                .status(ItemStatus.UNCLAIMED)
                .reportedBy(student)
                .build();
    }

    @Test
    @DisplayName("Should create item successfully with UNCLAIMED status")
    void shouldCreateItemSuccessfully() {
        ItemRequestDTO request = ItemRequestDTO.builder()
                .title("MacBook Pro 14")
                .description("Silver, Space Black case")
                .category(ItemCategory.ELECTRONICS)
                .locationFound("Main Auditorium Row F")
                .dateFound(LocalDate.now())
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(student));
        when(itemRepository.save(any(Item.class))).thenReturn(item);

        ItemResponseDTO response = itemService.createItem(request, null, userDetails);

        assertNotNull(response);
        assertEquals("MacBook Pro 14", response.getTitle());
        assertEquals(ItemStatus.UNCLAIMED, response.getStatus());
        verify(itemRepository).save(any(Item.class));
    }

    @Test
    @DisplayName("Reporter should be authorized to delete own reported item")
    void shouldAllowReporterToDeleteItem() {
        when(itemRepository.findById(10L)).thenReturn(Optional.of(item));

        assertDoesNotThrow(() -> itemService.deleteItem(10L, userDetails));
        verify(itemRepository).delete(item);
    }

    @Test
    @DisplayName("Unauthorized user cannot delete another user's item")
    void shouldThrowWhenNonOwnerTriesToDelete() {
        User otherUser = User.builder()
                .id(99L)
                .name("Unrelated Student")
                .email("unrelated@campus.edu")
                .role(Role.STUDENT)
                .build();
        CustomUserDetails otherDetails = new CustomUserDetails(otherUser);

        when(itemRepository.findById(10L)).thenReturn(Optional.of(item));

        assertThrows(AccessDeniedException.class, () -> itemService.deleteItem(10L, otherDetails));
        verify(itemRepository, never()).delete(item);
    }

    @Test
    @DisplayName("Campus Security or Admin can delete any item")
    void shouldAllowStaffToDeleteAnyItem() {
        User securityOfficer = User.builder()
                .id(50L)
                .name("Officer Davis")
                .email("davis@campus.edu")
                .role(Role.SECURITY)
                .build();
        CustomUserDetails staffDetails = new CustomUserDetails(securityOfficer);

        when(itemRepository.findById(10L)).thenReturn(Optional.of(item));

        assertDoesNotThrow(() -> itemService.deleteItem(10L, staffDetails));
        verify(itemRepository).delete(item);
    }
}
