package com.hope.job.repository;

import com.hope.job.modal.JobTag;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobTagRepository extends JpaRepository<JobTag, Long> {
    boolean existsByName(String name);
    boolean existsBySlug(String slug);
}
