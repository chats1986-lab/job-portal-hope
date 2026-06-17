package com.hope.job.repository;

import com.hope.job.modal.Education;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EducationRepository extends JpaRepository<Education, String> {
    List<Education> findByResume_IdOrderByDisplayOrderAsc(Long resumeId);
}
