package com.hope.job.service.Impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hope.job.domain.UserStatus;
import com.hope.job.dto.response.UserResponse;
import com.hope.job.exception.ResourceNotFoundException;
import com.hope.job.mapper.UserMapper;
import com.hope.job.modal.User;
import com.hope.job.payload.UpdateUserRequest;
import com.hope.job.repository.UserRepository;
import com.hope.job.service.UserService;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public User getUserByEmail(String email) {
         User user = userRepository.findByEmail(email);
         if(user == null) {
             throw new ResourceNotFoundException("User", "email", email);
         }
         return user;
    }


    @Override
    public User getUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User", id));
        return user;
    }

    @Override
    public List<User> getAllUsers() {

        List<User> users = userRepository.findAll();
        if(users.isEmpty()) {
            throw new ResourceNotFoundException("No users found");
        }
        return users;
    }

    @Override
    public UserResponse updateProfile(String email, UpdateUserRequest req) {
         User user = getUserByEmail(email);

         if(user.getFullName() != null){
            user.setFullName(req.getFullName());
         }
          
         if(user.getPhone() != null){
            user.setPhone(req.getPhone());
         }

         if(user.getProfileImage() != null && req.getProfileImage() != null){
            user.setProfileImage(req.getProfileImage());
         }

        return UserMapper.toDTO(userRepository.save(user));
         
        
    }


    @Override
    public UserResponse suspendUser(Long userId) {
         User user = getUserById(userId);
         user.setStatus(UserStatus.SUSPENDED);
         user.setSuspendedAt(LocalDateTime.now());
         return UserMapper.toDTO(userRepository.save(user));

    }

    @Override
    public UserResponse activateUser(Long userId) {
         User user = getUserById(userId);
         user.setStatus(UserStatus.ACTIVE);
         user.setSuspendedAt(null);
         return UserMapper.toDTO(userRepository.save(user));
    }

    @Override
    public UserResponse deleteUser(Long userId) {
        User user = getUserById(userId);
        user.setStatus(UserStatus.DELETED);
        user.setDeletedAt(LocalDateTime.now());
        return UserMapper.toDTO(userRepository.save(user)); 
    }

}
