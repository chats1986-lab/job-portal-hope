package com.hope.job.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hope.job.modal.SavedJob;

@Repository
public interface SavedJobRepository extends JpaRepository <SavedJob, Long> {
    Optional<SavedJob> findByUserIdAndJobId(Long userId, Long jobId);

    List<SavedJob> findByUserIdOrderBySavedAtDesc(Long userId);

    boolean existsByUserIdAndJobId(Long userId, Long jobId);

    void deleteByUserIdAndJobId(Long userId, Long jobId);

}
