package com.hope.job.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hope.job.modal.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);

    boolean existsByEmail(String email);
}
