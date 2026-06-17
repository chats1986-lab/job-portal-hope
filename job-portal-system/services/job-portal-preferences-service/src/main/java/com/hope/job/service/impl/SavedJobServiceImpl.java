package com.hope.job.service.impl;

import com.hope.job.dto.response.SavedJobResponse;
import com.hope.job.mapper.PreferenceMapper;
import com.hope.job.modal.SavedJob;
import com.hope.job.payload.SavedJobRequest;
import com.hope.job.repository.SavedJobRepository;
import com.hope.job.service.SavedJobService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SavedJobServiceImpl implements SavedJobService {
    private final SavedJobRepository savedJobRepository;

    @Override
    public SavedJobResponse saveJob(Long candidateId, SavedJobRequest req) throws Exception {

        if(isSaved(candidateId, req.getJobId())){
             throw new Exception("job already saved");
        }
        SavedJob savedJob = SavedJob.builder()
                .candidateId(candidateId)
                .jobId(req.getJobId())
                .build();
        SavedJob saved = savedJobRepository.save(savedJob);
        return PreferenceMapper.toSavedJobResponse(saved);
    }

    @Override
    public void unsaveJob(Long candidateId, Long jobId) throws Exception {
        SavedJob savedJob = savedJobRepository.findById(jobId).orElseThrow(
                () -> new Exception("job not found")
        );
        if(!savedJob.getCandidateId().equals(candidateId)){
            throw new Exception("candidate not match");
        }
        savedJobRepository.delete(savedJob);
    }

    @Override
    public List<SavedJobResponse> getSavedJobs(Long candidateId) {
        return savedJobRepository.findByCandidateId(candidateId).stream()
                .map(
                        PreferenceMapper::toSavedJobResponse
                ).toList();
    }

    @Override
    public boolean isSaved(Long candidateId, Long jobId) {
        return savedJobRepository.existsByCandidateIdAndJobId(candidateId, jobId);
    }
}
