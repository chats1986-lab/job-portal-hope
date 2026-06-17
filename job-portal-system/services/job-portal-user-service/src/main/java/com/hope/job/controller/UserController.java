package com.hope.job.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hope.job.dto.response.UserResponse;
import com.hope.job.mapper.UserMapper;
import com.hope.job.modal.User;
import com.hope.job.payload.UpdateUserRequest;
import com.hope.job.service.UserService;


import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getProfile(
        @RequestHeader("X-User-Email") String email 
    ){
        
        User user = userService.getUserByEmail(email);
        return ResponseEntity.ok(UserMapper.toDTO(user));
    } 

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> udpateProfile(
        @RequestHeader("X-User-Email") String email,
        @RequestBody UpdateUserRequest req 
    ){
        return ResponseEntity.ok(userService.updateProfile(email, req));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUserById(
        @PathVariable Long userId
    ){
        return ResponseEntity.ok(UserMapper.toDTO(userService.getUserById(userId)));
    }

    @GetMapping("/")
    public ResponseEntity<List<UserResponse>> getAllUsers(){
        return ResponseEntity.ok(UserMapper.toDTOList(userService.getAllUsers()));
    }


    @PatchMapping("/{userId}/suspend")
    public ResponseEntity<UserResponse> suspendUser(
        @PathVariable Long userId
    ){
        return ResponseEntity.ok(userService.suspendUser(userId));
    }

    // activateUser
    @PatchMapping("/{userId}/activate")
    public ResponseEntity<UserResponse> activateUser(
        @PathVariable Long userId
    ){
        return ResponseEntity.ok(userService.activateUser(userId));
    }    

    @DeleteMapping("/{userId}/delete")
    public ResponseEntity<UserResponse> deleteUser(
        @PathVariable Long userId
    ){
        try{    
            return ResponseEntity.ok(userService.deleteUser(userId));
        }catch(Exception e){
            return ResponseEntity.badRequest().build();
        }
    }

     
}
