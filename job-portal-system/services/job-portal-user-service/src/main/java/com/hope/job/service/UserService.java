package com.hope.job.service;

import java.util.List;

import com.hope.job.dto.response.UserResponse;
import com.hope.job.modal.User;
import com.hope.job.payload.UpdateUserRequest;

public interface UserService {

    User getUserByEmail(String email);

    User getUserById(Long id);

    List<User> getAllUsers();

    UserResponse updateProfile(String email, UpdateUserRequest user);

    // Admin Action
    UserResponse suspendUser(Long userId);
    UserResponse activateUser(Long userId);
    UserResponse deleteUser(Long userId);

}
