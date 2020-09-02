package SEPT.Team.Seven.springSecurityTests;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import SEPT.Team.Seven.security.JwtFilter;
import SEPT.Team.Seven.security.SecurityUserDetailsService;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.security.core.userdetails.User.withUsername;

import java.io.IOException;
import java.util.Optional;

import javax.servlet.ServletException;

@SpringBootTest
class JWTFilterTests {
	
	static SecurityUserDetailsService service;
	static MockHttpServletRequest request;
	
	static MockHttpServletResponse response;
	
	@BeforeAll
	public static void setUp()
	{
		service = mock(SecurityUserDetailsService.class);		
		request = new MockHttpServletRequest();
		response =  new MockHttpServletResponse();
	}
	
	
	@Test
	void getBearerToken_ValidBearerToken_ReturnsCleanedToken() {		
		//Arrange
		String sampleJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
				+ "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ."
				+ "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";		
		String sampleBearerToken = "Bearer" + sampleJWT; 
		
		//Act
		JwtFilter filter = new JwtFilter(service);		
		Optional<String> cleanedToken = filter.getBearerToken(sampleBearerToken);
		
		//Assert
		assertTrue(cleanedToken.isPresent());
		cleanedToken.ifPresent(token -> assertTrue(!token.startsWith("Bearer")));
				
	}
	
	@Test
	void getBearerToken_InvalidBearerToken_ReturnsEmptyOptionalObject() {
		//Arrange
		String sampleJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
				+ "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ."
				+ "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";		
		String sampleBearerToken = "asdhjk" + sampleJWT; 
		
		//Act
		JwtFilter filter = new JwtFilter(service);
		Optional<String> cleanedToken = filter.getBearerToken(sampleBearerToken);
		
		//Assert
		assertFalse(cleanedToken.isPresent());
				
	}
	
	@Test
	void getBearerToken_NullBearerToken_ReturnsEmptyOptionalObject() {
		//Arrange
		
		//Act
		JwtFilter filter = new JwtFilter(service);
		Optional<String> cleanedToken = filter.getBearerToken(null);
		
		//Assert
		assertFalse(cleanedToken.isPresent());
				
	}
	
	@Test
	void doFilter_ValidAuthorisationHeaderAndValidUserDetails_UserIsAuthorised() throws IOException, ServletException {
		//Arrange
		String sampleJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
				+ "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ."
				+ "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";		
		String sampleBearerToken = "Bearer" + sampleJWT;
		
		//remove any headers made by other test methods
		request.removeHeader("Authorization");
		request.addHeader("Authorization", sampleBearerToken);
		UserDetails details = withUsername("admin")
                .password("abc123")
                .authorities("ADMIN")
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(false)
                .build();
		
		//mock this method of the userdetails service as it will be called later in doFilter()
		when(service.loadUserByJwtToken(sampleJWT)).thenReturn((Optional<UserDetails>) Optional.of(details));
		
		//Act
		JwtFilter filter = new JwtFilter(service);
		filter.doFilter(request, response, new MockFilterChain());
		
		//Assert
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		assertEquals(((UserDetails)auth.getPrincipal()).getUsername(), "admin");	
		assertEquals(((UserDetails)auth.getPrincipal()).getPassword(), "abc123");
//		auth.getAuthorities().forEach(role->assertEquals(role.getAuthority(), "ADMIN"));

		boolean roleIsAdmin = false;
		for(GrantedAuthority role : auth.getAuthorities())
		{
			if(role.getAuthority().contentEquals("ADMIN"))
			{
				roleIsAdmin = true;
			}
		}
		
		assertTrue(roleIsAdmin);
	}
	
	@Test
	void doFilter_ValidAuthorisationHeaderAndEmptyInvalidUserDetails_UserIsNotAuthorised() 
			throws IOException, ServletException{
		//Arrange
		String sampleJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
				+ "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ."
				+ "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";		
		String sampleBearerToken = "Bearer" + sampleJWT;
		
		//remove any headers made by other test methods
		request.removeHeader("Authorization");
		request.addHeader("Authorization", sampleBearerToken);
		
		//mock this method of the userdetails service as it will be called later in doFilter()
		when(service.loadUserByJwtToken(sampleJWT)).thenReturn(Optional.empty());
		
		//Act
		JwtFilter filter = new JwtFilter(service);
		filter.doFilter(request, response, new MockFilterChain());
		
		//Assert
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		assertNull(auth);
	}
	
	//no need to check for invalid authorisation header and invalid user details 
	//since this test proves it wouldn't proceed if authorisation header is invalid
	@Test
	void doFilter_InvalidAuthorisationHeaderAndValidUserDetails_UserIsNotAuthorised() 
			throws IOException, ServletException {
		//Arrange
		String sampleJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
				+ "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ."
				+ "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";		
		String sampleBearerToken = "asdasdasf" + sampleJWT;
		
		//remove any headers made by other test methods
		request.removeHeader("Authorization");
		request.addHeader("Authorization", sampleBearerToken);
		UserDetails details = withUsername("admin")
                .password("abc123")
                .authorities("ADMIN")
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(false)
                .build();
		
		//mock this method of the userdetails service as it will be called later in doFilter()
		//but it shouldn't even be called as the bearer token wouldn't be cleaned properly
		when(service.loadUserByJwtToken(sampleJWT)).thenReturn((Optional<UserDetails>) Optional.of(details));

		//Act
		JwtFilter filter = new JwtFilter(service);
		filter.doFilter(request, response, new MockFilterChain());
		
		//Assert
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		assertNull(auth);
	}


}
