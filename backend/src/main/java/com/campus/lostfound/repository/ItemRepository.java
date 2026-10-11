package com.campus.lostfound.repository;

import com.campus.lostfound.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

    @Query(value = "SELECT * FROM items WHERE " +
            "(:query IS NULL OR :query = '' OR MATCH(title, description, location_found) AGAINST(:query IN BOOLEAN MODE) OR title LIKE CONCAT('%', :query, '%') OR description LIKE CONCAT('%', :query, '%') OR location_found LIKE CONCAT('%', :query, '%')) " +
            "AND (:category IS NULL OR :category = '' OR category = :category) " +
            "AND (:status IS NULL OR :status = '' OR status = :status) " +
            "ORDER BY created_at DESC", 
            nativeQuery = true)
    List<Item> searchItems(
            @Param("query") String query,
            @Param("category") String category,
            @Param("status") String status
    );

    List<Item> findByReportedByIdOrderByCreatedAtDesc(Long userId);

    List<Item> findAllByOrderByCreatedAtDesc();
}
