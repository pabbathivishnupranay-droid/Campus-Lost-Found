package com.campus.lostfound.service;

import com.campus.lostfound.dto.ItemRequestDTO;
import com.campus.lostfound.dto.ItemResponseDTO;
import com.campus.lostfound.dto.UserSummaryDTO;
import com.campus.lostfound.entity.Item;
import com.campus.lostfound.entity.User;
import com.campus.lostfound.entity.enums.ItemStatus;
import com.campus.lostfound.entity.enums.Role;
import com.campus.lostfound.exception.ResourceNotFoundException;
import com.campus.lostfound.repository.ItemRepository;
import com.campus.lostfound.repository.UserRepository;
import com.campus.lostfound.security.CustomUserDetails;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItemService {

    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public ItemService(ItemRepository itemRepository,
                       UserRepository userRepository,
                       FileStorageService fileStorageService) {
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional
    public ItemResponseDTO createItem(ItemRequestDTO request, MultipartFile file, CustomUserDetails currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + currentUser.getId()));

        String imageUrl = null;
        if (file != null && !file.isEmpty()) {
            imageUrl = fileStorageService.storeFile(file);
        }

        Item item = Item.builder()
                .title(request.getTitle().trim())
                .description(request.getDescription().trim())
                .category(request.getCategory())
                .locationFound(request.getLocationFound().trim())
                .dateFound(request.getDateFound())
                .imageUrl(imageUrl)
                .status(ItemStatus.UNCLAIMED)
                .reportedBy(user)
                .build();

        Item savedItem = itemRepository.save(item);
        return mapToDTO(savedItem);
    }

    public List<ItemResponseDTO> getAllItems(String query, String category, String status) {
        String cleanQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
        String cleanCategory = (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("ALL")) ? category.trim() : null;
        String cleanStatus = (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("ALL")) ? status.trim() : null;

        List<Item> items = itemRepository.searchItems(cleanQuery, cleanCategory, cleanStatus);
        return items.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public ItemResponseDTO getItemById(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));
        return mapToDTO(item);
    }

    public List<ItemResponseDTO> getMyItems(CustomUserDetails currentUser) {
        if (currentUser == null) {
            throw new BadRequestException("User must be authenticated.");
        }
        List<Item> items = itemRepository.findByReportedByIdOrderByCreatedAtDesc(currentUser.getId());
        return items.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Transactional
    public void deleteItem(Long id, CustomUserDetails currentUser) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));

        boolean isReporter = item.getReportedBy().getId().equals(currentUser.getId());
        boolean isStaff = currentUser.getRole() == Role.ADMIN || currentUser.getRole() == Role.SECURITY;

        if (!isReporter && !isStaff) {
            throw new AccessDeniedException("You are not authorized to delete this item.");
        }

        itemRepository.delete(item);
    }

    public ItemResponseDTO mapToDTO(Item item) {
        User reportedBy = item.getReportedBy();
        UserSummaryDTO userSummary = UserSummaryDTO.builder()
                .id(reportedBy.getId())
                .name(reportedBy.getName())
                .email(reportedBy.getEmail())
                .role(reportedBy.getRole())
                .build();

        return ItemResponseDTO.builder()
                .id(item.getId())
                .title(item.getTitle())
                .description(item.getDescription())
                .category(item.getCategory())
                .locationFound(item.getLocationFound())
                .dateFound(item.getDateFound())
                .imageUrl(item.getImageUrl())
                .status(item.getStatus())
                .reportedBy(userSummary)
                .createdAt(item.getCreatedAt())
                .build();
    }
}
