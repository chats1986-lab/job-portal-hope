package com.hope.job.payload;

import com.hope.job.domain.UserRole;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SignupRequest {

    @NotBlank(message = "full name is mandatory")
    private String fullName;

    @Email(message = "email is invalid")
    @NotBlank(message = "email is mandatory")
    private String email;

    @NotBlank(message = "password is mandatory")
    private String password;

    private String phone;

    @NotNull(message = "role is mandatory")
    private UserRole role;

}
