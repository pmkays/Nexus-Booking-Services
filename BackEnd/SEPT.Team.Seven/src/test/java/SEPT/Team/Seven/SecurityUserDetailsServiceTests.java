package SEPT.Team.Seven;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import SEPT.Team.Seven.model.Account;
import SEPT.Team.Seven.model.Role;
import SEPT.Team.Seven.model.User;
import SEPT.Team.Seven.repo.UserRepository;
import SEPT.Team.Seven.security.JwtProvider;
import SEPT.Team.Seven.security.SecurityUserDetailsService;

import static org.junit.Assert.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Optional;

@SpringBootTest
public class SecurityUserDetailsServiceTests {
	
	@Mock
	static UserRepository userRepository;
	@Mock
	static JwtProvider provider;
	@InjectMocks
	static SecurityUserDetailsService service;
	static User validUser;

	
	@BeforeAll
	static void initialiseMock() {
		userRepository = mock(UserRepository.class);
		
		service = new SecurityUserDetailsService();
		
		provider = mock(JwtProvider.class);
		
		Account account = new Account("Juan","Yega","juan@hotmail.com", "410567343","1 Digger Road");
		Role role = new Role("ROLE_ADMIN", "Admin role");
		validUser = new User("admin", "$2a$10$C/8xsj.CiUBaCJIYPpjLg.25k3RZASgu37zHD6K6CltmAvb9Z2wLa", account, role);
		
		
	}
	
	@Test
	void loadUserByUsername_ValidUser_ReturnCorrectlyBuiltUserDetails()
	{	
		//Arrange
		when(userRepository.findByUsername("admin")).thenReturn((Optional<User>) Optional.of(validUser));
		
		//Act
		UserDetails details = service.loadUserByUsername("admin");
		
		//Assert
		assertEquals(details.getUsername(), "admin");
		assertEquals(details.getPassword(), "$2a$10$C/8xsj.CiUBaCJIYPpjLg.25k3RZASgu37zHD6K6CltmAvb9Z2wLa");
		boolean roleIsAdmin = false;
		for(GrantedAuthority role : details.getAuthorities())
		{
			if(role.getAuthority().equals("ROLE_ADMIN"))
			{
				roleIsAdmin = true;
			}
		}
		
		assertTrue(roleIsAdmin);
	}
	
	@Test
	void loadUserByUsername_InvalidUser_ThrowsUsernameNotFoundException()
	{
		//Arrange
		when(userRepository.findByUsername("msdasd")).thenReturn(Optional.empty());
		
		//Act and Assert
		assertThrows(UsernameNotFoundException.class,()-> service.loadUserByUsername("msdasd"));
	}
	
	//loadUserByJwtToken and loadUserByJwtTokenAndDatabase don't need to be tested as
	//they are almost entirely reliant on loadUserByUsername and the jwtprovider methods
	//have also been tested prior.
}