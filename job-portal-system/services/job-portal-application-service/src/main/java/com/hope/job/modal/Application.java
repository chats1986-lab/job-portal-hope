package com.hope.job.modal;


import com.hope.job.domain.AiShortListStatus;
import com.hope.job.domain.ApplicationStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name="applications")
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable =false)
    private Long candidateId;

    @Column(nullable =false)
    private Long jobId;

    @Column(nullable =false)
    private Long companyId;

    @Column(nullable =false)
    private Long employerId;

    @Column(nullable = false)
    private String resumeId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default    
    private ApplicationStatus status=ApplicationStatus.PENDING;

    @Column(length = 3000)
    private String coverLetter;

    private BigDecimal expectedSalary;

    private LocalDate availableFrom;

    @Builder.Default   
    private Boolean isStarred = false;

    @Column
    private Integer aiScore;

    private LocalDateTime withdrawnAt;

    private String withdrawnReason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default   
    private AiShortListStatus aiShortListStatus=AiShortListStatus.NOT_SCREENED;

    @Column(nullable = false, unique = true)
    @CreationTimestamp
    private LocalDateTime appliedAt;

    @Column(nullable = false)
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
