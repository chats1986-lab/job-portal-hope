package com.hope.job.security;


public class JwtConstant {
    public static final String SECRET_KEY = System.getenv("JWT_SECRET_KEY") != null ? System.getenv("JWT_SECRET_KEY") : "mySecretKeyasjdnasnakjsdnajsnjasnjansjansdnsdaksndkjasndnasd";

}
