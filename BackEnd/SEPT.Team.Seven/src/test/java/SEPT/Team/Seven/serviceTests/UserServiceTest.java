package SEPT.Team.Seven.serviceTests;

import java.util.Optional;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.any;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import SEPT.Team.Seven.model.Customer;
import SEPT.Team.Seven.model.Role;
import SEPT.Team.Seven.model.User;
import SEPT.Team.Seven.repo.CustomerRepository;
import SEPT.Team.Seven.repo.RoleRepository;
import SEPT.Team.Seven.repo.UserRepository;
import SEPT.Team.Seven.security.JwtProvider;
import SEPT.Team.Seven.service.UserService;

@SpringBootTest
public class UserServiceTest 
{
	@Mock
	private UserRepository userRepository;
	@Mock
	private CustomerRepository customerRepository;
	@Mock
	private AuthenticationManager authenticationManager;
	@Mock
	private RoleRepository roleRepository;
	@Mock
	private PasswordEncoder passwordEncoder;
	@Mock
	private JwtProvider jwtProvider;
	@InjectMocks
	private UserService userService;
	
	private static Role customerRole;
	
	//new user and customer details
	private static Customer newCustomer;
	private static User newUser;
	
	//existing user and customer details
	private static User existingUser; 
	private static Customer existingCustomer; 
		
	@BeforeAll
	public static void setUp()
	{
		String pass  = "$2a$10$C/8xsj.CiUBaCJIYPpjLg.25k3RZASgu37zHD6K6CltmAvb9Z2wLa";

		customerRole = new Role("ROLE_CUSTOMER", "Customer role"); 
		newCustomer = new Customer("placeholder","placeholder","placeholder@placeholder.placeholder","0123456789","placeholder");
		newUser = new User("testUser", pass, newCustomer,null,null,customerRole);
		
		existingCustomer = new Customer("Leslie", "Uzumaki", "leslie@hotmail.com", "1234567891", "some address");
		existingCustomer.setId(1);
		existingUser = new User("leslie1", pass, existingCustomer, null, null, customerRole);
	}
	
	@Test
	public void signup_ValidUsername_ReturnsUser()
	{
		//Arrange
		when(userRepository.findByUsername("testUser")).thenReturn(Optional.empty());
		when(roleRepository.findByRoleName("ROLE_CUSTOMER")).thenReturn(Optional.of(customerRole));
		when(customerRepository.save(any(Customer.class))).thenReturn(newCustomer);
		when(userRepository.save(any(User.class))).thenReturn(newUser);
		
		//Act
		Optional<User> result  = userService.signup("testUser", "abc123");
		
		//Assert
		assertTrue(result.isPresent());		
	}
	
	@Test
	public void signup_UsernameAlreadyExists_ReturnsEmptyObject()
	{
		//Arrange
		when(userRepository.findByUsername("leslie1")).thenReturn(Optional.of(existingUser));
		when(roleRepository.findByRoleName("ROLE_CUSTOMER")).thenReturn(Optional.of(customerRole));
		
		//Act
		Optional<User> result  = userService.signup("leslie1", "abc123");
		
		//Assert
		assertFalse(result.isPresent());			
	}
	
	@Test
	public void signup_FieldsAreNullAndEmpty_ReturnsEmptyObject()
	{	
		//Arrange & Act
		Optional<User> result  = userService.signup(null, "");
		
		//Assert
		assertFalse(result.isPresent());			
	}
	
	@Test
	public void getUserAccountNo_UsernameExists_ReturnsAccountNo()
	{
		//Arrange
		when(userRepository.findByUsername("leslie1")).thenReturn(Optional.of(existingUser));

		//Act
		int result  = userService.getUserAccountNo("leslie1");
		
		//Assert
		assertEquals(1, result);
	}
	
	@Test
	public void getUserAccountNo_UsernameDoesNotExist_Returns0()
	{
		//Arrange
		when(userRepository.findByUsername("dontExist")).thenReturn(Optional.empty());
		
		//Act
		int result  = userService.getUserAccountNo("dontExist");
		
		//Assert
		assertEquals(0, result);
	}
	
	@Test
	public void getUserAccountNo_UsernameIsNull_ReturnsAccountNo()
	{
		//Arrange & Act
		int result  = userService.getUserAccountNo(null);
		
		//Assert
		assertEquals(0, result);		
	}
	
}
