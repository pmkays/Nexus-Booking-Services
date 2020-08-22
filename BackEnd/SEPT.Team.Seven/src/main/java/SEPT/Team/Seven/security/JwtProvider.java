package SEPT.Team.Seven.security;

import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import SEPT.Team.Seven.model.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JwtProvider {

	private String roleKey = "roles";

	private JwtParser parser;

	private String secretKey;
	private long validFor;

	@Autowired
	public JwtProvider(@Value("${security.jwt.token.secret-key}") String secretKey,
			@Value("${security.jwt.token.expiration}") long validityInMilliseconds) {

		this.secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
		this.validFor = validityInMilliseconds;
	}

	//Create JWT string given username and roles.
	public String createToken(String username, List<Role> roles, int userId) {
		// Username is the subject
		Claims claims = Jwts.claims().setSubject(username);
		// Convert roles to Spring Security SimpleGrantedAuthority objects,
		// Add to Simple Granted Authority objects to claims

		claims.put("userId", userId);
		claims.put(roleKey, roles.stream().map(role -> new SimpleGrantedAuthority(role.getRoleName()))
				.filter(Objects::nonNull).collect(Collectors.toList()));
		// Build the Token
		Date now = new Date();
		return Jwts.builder().setClaims(claims).setIssuedAt(now)
				.setExpiration(new Date(now.getTime() + validFor))
				.signWith(SignatureAlgorithm.HS256, secretKey).compact();
	}

	 //Validate the JWT String
	public boolean isValidToken(String token) {
		try {
			Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
			return true;
		} catch (JwtException | IllegalArgumentException e) {
			return false;
		}
	}

	//Get the username from the token string
	public String getUsername(String token) throws JwtException, IllegalArgumentException {
		return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody().getSubject();
	}

	//Get the roles from the token string - as we may implement users with multiple roles
	public List<GrantedAuthority> getRoles(String token) throws JwtException, IllegalArgumentException{
		
		List<Map<String, String>> roleClaims = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody()
				.get(roleKey, List.class);
		
		return roleClaims.stream().map(roleClaim -> new SimpleGrantedAuthority(roleClaim.get("authority")))
				.collect(Collectors.toList());
	}
}
