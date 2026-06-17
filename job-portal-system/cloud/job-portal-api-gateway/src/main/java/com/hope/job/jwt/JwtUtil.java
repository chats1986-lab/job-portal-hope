package com.hope.job.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;


@Service
public class JwtUtil {
    private final SecretKey secretKey = Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes());

    public Claims extractAllClaimsFromToken(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractEmail(String token) {
        return extractAllClaimsFromToken(token).get("email", String.class);
    }
    public String extractAuthorities(String token) {
        return extractAllClaimsFromToken(token).get("authorities", String.class);
    }
    public String extractUserId(String token) {
        return String.valueOf(extractAllClaimsFromToken(token).get("userId", Integer.class));
    }

    public boolean validateToken(String token) {
        try {
            extractAllClaimsFromToken(token);
            return true;
        }catch (Exception e){
            return false;
        }
    }
}
