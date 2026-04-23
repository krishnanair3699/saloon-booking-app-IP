package com.savadhika.util;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {
    @Value("${jwt.secret}") private String secret;
    @Value("${jwt.expiration}") private Long expiration;

    private SecretKey getSigningKey() {
        byte[] keyBytes = new byte[32];
        byte[] secretBytes = secret.getBytes();
        System.arraycopy(secretBytes, 0, keyBytes, 0, Math.min(secretBytes.length, 32));
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String email) {
        Date now = new Date();
        return Jwts.builder()
                .claims(new HashMap<>())
                .subject(email)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    public String extractEmail(String token) { return extractClaim(token, Claims::getSubject); }
    public Date extractExpiration(String token) { return extractClaim(token, Claims::getExpiration); }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        return claimsResolver.apply(extractAllClaims(token));
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private Boolean isTokenExpired(String token) { return extractExpiration(token).before(new Date()); }

    public Boolean validateToken(String token, String email) {
        return extractEmail(token).equals(email) && !isTokenExpired(token);
    }
}
