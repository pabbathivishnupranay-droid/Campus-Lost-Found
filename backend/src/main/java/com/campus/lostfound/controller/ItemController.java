package com.campus.lostfound.controller;

import com.campus.lostfound.dto.ItemRequestDTO;
import com.campus.lostfound.dto.ItemResponseDTO;
import com.campus.lostfound.security.CustomUserDetails;
import com.campus.lostfound.service.ItemService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @GetMapping
    public ResponseEntity<List<ItemResponseDTO>> getItems(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status
    ) {
        List<ItemResponseDTO> items = itemService.getAllItems(query, category, status);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemResponseDTO> getItemById(@PathVariable Long id) {
        ItemResponseDTO item = itemService.getItemById(id);
        return ResponseEntity.ok(item);
    }

    @GetMapping("/my")
    public ResponseEntity<List<ItemResponseDTO>> getMyItems(
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        List<ItemResponseDTO> items = itemService.getMyItems(currentUser);
        return ResponseEntity.ok(items);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ItemResponseDTO> createItem(
            @Valid @ModelAttribute ItemRequestDTO request,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        ItemResponseDTO created = itemService.createItem(request, file, currentUser);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteItem(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        itemService.deleteItem(id, currentUser);
        return ResponseEntity.ok(Map.of("message", "Item deleted successfully"));
    }
}
