package com.campus.lostfound.repository;

import com.campus.lostfound.entity.Claim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {
    List<Claim> findByClaimantIdOrderByCreatedAtDesc(Long claimantId);
    List<Claim> findByItemIdOrderByCreatedAtDesc(Long itemId);
    List<Claim> findAllByOrderByCreatedAtDesc();
    boolean existsByItemIdAndClaimantId(Long itemId, Long claimantId);
}
