package SEPT.Team.Seven;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;

import SEPT.Team.Seven.model.Role;
import SEPT.Team.Seven.security.JwtFilter;
import SEPT.Team.Seven.security.JwtProvider;
import io.jsonwebtoken.JwtException;

@SpringBootTest
public class JwtProviderTests 
{
	/*NOTE that createToken() is just a JWT token builder method and will not be tested.
	 * If other methods in the JwtProvider class are able to decrypt tokens created by CreateToken()
	 * and utilise its contents, then assume that createToken() is a working, valid method.
	*/
	
	static List<Role> roles;
	static JwtProvider provider;
	@BeforeAll
	static void initialiseRoles()
	{
		roles = new ArrayList<Role>();		
		roles.add(new Role("ADMIN", "Admin role"));
		provider = new JwtProvider("paulahasajob",600000);
	}
	
	@Test
	void isValidToken_ValidJwtToken_ReturnsTrue() {
		//Arrange
		String token = provider.createToken("admin", roles);
		
		//Act and Assert
		assertTrue(provider.isValidToken(token));	
				
	}
	
	@Test
	void isValidToken_InvalidJwtToken_ReturnsFalse() {		
		//Arrange
		String token = "adfuiaduisyyuasdasdhjk."
				+ "eyJzdWIiOigafhdRE1JTiJ9X"
				+ "SwiaWF0IjoxNTk2ODcascasdAiOjE1OTY4Nzc2ODJ9."
				+ "Jhnkb7DasFImvlaUR8o";
		
		//Act and Assert
		assertFalse(provider.isValidToken(token));					
	}
	
	@Test
	void getUsername_ValidJwtToken_ReturnsUsernameOfAdmin() {		
		//Arrange
		String token = provider.createToken("admin", roles);
		
		//Act and Assert
		assertEquals(provider.getUsername(token), "admin");				
	}
	
	@Test
	void getUsername_InvalidJwtToken_ThrowsJwtException() {		
		//Arrange
		String token = "adfuiaduisyyuasdasdhjk."
				+ "eyJzdWIiOigafhdRE1JTiJ9X"
				+ "SwiaWF0IjoxNTk2ODcascasdAiOjE1OTY4Nzc2ODJ9."
				+ "Jhnkb7DasFImvlaUR8o";
		
		//Act and Assert
		assertThrows(JwtException.class,()-> provider.getUsername(token));					
	}
	
	@Test
	void getUsername_NullJwtToken_ThrowsIllegalArgumentException() {		
		//Arrange Act and Assert
		assertThrows(IllegalArgumentException.class,()-> provider.getUsername(null));					
	}
	
	@Test
	void getRoles_ValidJwtToken_ReturnsRoleAsADMIN() {		
		//Arrange
		String token = provider.createToken("admin", roles);
		List<GrantedAuthority> roles = AuthorityUtils.createAuthorityList("ADMIN");

		assertEquals(provider.getRoles(token), roles);				
	}
	
	@Test
	void getRoles_InvalidJwtToken_ThrowsJwtException() {		
		//Arrange
		String token = "adfuiaduisyyuasdasdhjk."
				+ "eyJzdWIiOigafhdRE1JTiJ9X"
				+ "SwiaWF0IjoxNTk2ODcascasdAiOjE1OTY4Nzc2ODJ9."
				+ "Jhnkb7DasFImvlaUR8o";
		
		//Act and Assert
		assertThrows(JwtException.class,()-> provider.getRoles(token));					
	}
	
	@Test
	void getRoles_NullJwtToken_ThrowsIllegalArgumentException() {		
		//Arrange Act and Assert
		assertThrows(IllegalArgumentException.class,()-> provider.getRoles(null));					
	}
}
