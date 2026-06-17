package com.hope.job.service.Impl;

import java.time.LocalDateTime;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hope.job.domain.UserRole;
import com.hope.job.domain.UserStatus;
import com.hope.job.exception.BusinessException;
import com.hope.job.exception.ResourceNotFoundException;
import com.hope.job.mapper.UserMapper;
import com.hope.job.modal.User;
import com.hope.job.payload.AuthResponse;
import com.hope.job.payload.LoginRequest;
import com.hope.job.payload.SignupRequest;
import com.hope.job.repository.UserRepository;
import com.hope.job.security.CustomUserDetailsService;
import com.hope.job.security.JwtProvider;
import com.hope.job.service.AuthService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final CustomUserDetailsService customUserDetailsService;

    @Override
    public AuthResponse signup(SignupRequest req) {

        if (userRepository.existsByEmail(req.getEmail())) {
            throw new BusinessException("Email already registered: " + req.getEmail());
        }

        if (req.getRole() == UserRole.ROLE_ADMIN) {
            throw new BusinessException("Cannot self register as a role admin");
        }

        // TODO: Create user
        User user = User.builder()
                .fullName(req.getFullName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(req.getRole())
                .phone(req.getPhone())
                .lastLogin(LocalDateTime.now())
                .status(UserStatus.ACTIVE)
                .build();

        // Password Encoding

        // Save User
        User savedUser = userRepository.save(user);

        Authentication authentication = new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtProvider.generateToken(authentication, savedUser.getId());

        AuthResponse res = new AuthResponse();
        res.setTitle("welcome " + savedUser.getFullName());
        res.setMessage("Your account has been created successfully");
        res.setJwt(jwt);
        res.setUser(UserMapper.toDTO(savedUser));

        return res;
    }

    @Override
    public AuthResponse login(LoginRequest req) {

        Authentication authentication = authenticate(req.getEmail(), req.getPassword());
        
        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(req.getEmail());

        String jwt = jwtProvider.generateToken(authentication, user.getId());

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        AuthResponse res = new AuthResponse();
        res.setTitle("welcome back " + user.getFullName());
        res.setMessage("Login successfully");
        res.setJwt(jwt);
        res.setUser(UserMapper.toDTO(user));

        return res;

    }

    private Authentication authenticate(String email, String password){
        UserDetails userDetails =  customUserDetailsService.loadUserByUsername(email);

        if(userDetails == null){
            throw new ResourceNotFoundException("User", "email", email);
        }

        if(!passwordEncoder.matches(password, userDetails.getPassword())){
            throw new BusinessException("Invalid password");
        }

        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }

}
