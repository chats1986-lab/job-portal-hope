package com.hope.job.jwt;

public class JwtConstant {
    public static final String SECRET_KEY = System.getenv("JWT_SECRET_KEY") != null ? System.getenv("JWT_SECRET_KEY") : "mySecretKeyasjdnasnakjsdnajsnjasnjansjansdnsdaksndkjasndnasd";
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String JWT_HEADER = "Authorization";
}
