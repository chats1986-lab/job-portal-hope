package com.hope.job.service;

import com.hope.job.payload.AuthResponse;
import com.hope.job.payload.LoginRequest;
import com.hope.job.payload.SignupRequest;

public interface AuthService {
    AuthResponse signup(SignupRequest req);

    AuthResponse login(LoginRequest req);
}
