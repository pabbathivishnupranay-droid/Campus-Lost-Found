package com.campus.lostfound.repository;

import com.campus.lostfound.entity.Item;
import com.campus.lostfound.entity.enums.ItemCategory;
import com.campus.lostfound.entity.enums.ItemStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

    @Query("SELECT i FROM Item i WHERE " +
            "(:query IS NULL OR :query = '' OR LOWER(i.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(i.description) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(i.locationFound) LIKE LOWER(CONCAT('%', :query, '%'))) " +
            "AND (:category IS NULL OR i.category = :category) " +
            "AND (:status IS NULL OR i.status = :status) " +
            "ORDER BY i.createdAt DESC")
    List<Item> searchItems(
            @Param("query") String query,
            @Param("category") ItemCategory category,
            @Param("status") ItemStatus status
    );

    List<Item> findByReportedByIdOrderByCreatedAtDesc(Long userId);

    List<Item> findAllByOrderByCreatedAtDesc();
}
