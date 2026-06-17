package com.hope.job.repository;

import com.hope.job.modal.SavedJob;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    List<SavedJob> findByCandidateId(Long candidateId);
    Boolean existsByCandidateIdAndJobId(Long candidateId, Long jobId);
}
