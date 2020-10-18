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

import SEPT.Team.Seven.model.Admin;
import SEPT.Team.Seven.model.Customer;
import SEPT.Team.Seven.model.Employee;
import SEPT.Team.Seven.model.Role;
import SEPT.Team.Seven.model.User;
import SEPT.Team.Seven.repo.CustomerRepository;
import SEPT.Team.Seven.repo.EmployeeRepository;
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
	private EmployeeRepository employeeRepository;
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
	private static Role employeeRole;
	
	//new user and customer details
	private static Customer newCustomer;
	private static User newCustomerUser;
	
	//existing user and customer details
	private static User existingCustomerUser; 
	private static Customer existingCustomer; 
	
	//new user and employee details
	private static Employee newEmployee;
	private static User newEmployeeUser;
	
	//existing user and employee details
	private static User existingEmployeeUser; 
	private static Employee existingEmployee; 
	
	//admin details
	private static Role adminRole;
	private static Admin existingAdmin;
	private static User existingAdminUser; 

		
	@BeforeAll
	public static void setUp()
	{
		String pass  = "$2a$10$C/8xsj.CiUBaCJIYPpjLg.25k3RZASgu37zHD6K6CltmAvb9Z2wLa";

		customerRole = new Role("ROLE_CUSTOMER", "Customer role"); 
		newCustomer = new Customer("placeholder","placeholder","placeholder@placeholder.placeholder","0123456789","placeholder", "placeholder");
		newCustomerUser = new User("testCustomer", pass, newCustomer,null,null,customerRole);
		
		existingCustomer = new Customer("Leslie", "Uzumaki", "leslie@hotmail.com", "1234567891", "some address", "fake img url");
		existingCustomer.setId(1);
		existingCustomerUser = new User("leslie1", pass, existingCustomer, null, null, customerRole);
		
		employeeRole = new Role("ROLE_EMPLOYEE", "Employee role"); 
		newEmployee = new Employee("placeholder","placeholder","placeholder@placeholder.placeholder","0123456789","placeholder", "placeholder", "placeholder");
		newEmployeeUser = new User("testEmployee", pass, null,newEmployee,null,employeeRole);
		
		existingEmployee = new Employee("Yuri", "Detrov", "yuri@hotmail.com", "1234567891", "some address", "fake img url", "some description");
		existingEmployee.setId(4);
		existingEmployeeUser = new User("employee1", pass, null, existingEmployee, null, employeeRole);
		
		adminRole = new Role("ROLE_ADMIN", "Admin role");
		existingAdmin = new Admin("Juan", "Yega", "juan@hotmail.com", "1234567891", "some address", "fake img url");
		existingAdmin.setId(5);
		existingAdminUser = new User("admin", pass, null, null, existingAdmin, adminRole);
	}
	
	@Test
	public void signup_ValidUsernameForCustomer_ReturnsCustomer()
	{
		//Arrange
		when(userRepository.findByUsername("testCustomer")).thenReturn(Optional.empty());
		when(roleRepository.findByRoleName("ROLE_CUSTOMER")).thenReturn(Optional.of(customerRole));
		when(customerRepository.save(any(Customer.class))).thenReturn(newCustomer);
		when(userRepository.save(any(User.class))).thenReturn(newCustomerUser);
		
		//Act
		Optional<User> result  = userService.signup("testCustomer", "abc123", "customers");
		
		//Assert
		assertTrue(result.isPresent());		
	}
	
	@Test
	public void signup_ValidUsernameForEmployee_ReturnsEmployee()
	{
		//Arrange
		when(userRepository.findByUsername("testEmployee")).thenReturn(Optional.empty());
		when(roleRepository.findByRoleName("ROLE_EMPLOYEE")).thenReturn(Optional.of(employeeRole));
		when(employeeRepository.save(any(Employee.class))).thenReturn(newEmployee);
		when(userRepository.save(any(User.class))).thenReturn(newEmployeeUser);
		
		//Act
		Optional<User> result  = userService.signup("testEmployee", "abc123", "employees");
		
		//Assert
		assertTrue(result.isPresent());		
	}
	
	@Test
	public void signup_UsernameAlreadyExistsForCustomer_ReturnsEmptyObject()
	{
		//Arrange
		when(userRepository.findByUsername("leslie1")).thenReturn(Optional.of(existingCustomerUser));
		when(roleRepository.findByRoleName("ROLE_CUSTOMER")).thenReturn(Optional.of(customerRole));
		
		//Act
		Optional<User> result  = userService.signup("leslie1", "abc123","customers");
		
		//Assert
		assertFalse(result.isPresent());			
	}
	
	@Test
	public void signup_UsernameAlreadyExistsForEmployee_ReturnsEmptyObject()
	{
		//Arrange
		when(userRepository.findByUsername("employee1")).thenReturn(Optional.of(existingEmployeeUser));
		when(roleRepository.findByRoleName("ROLE_EMPLOYEE")).thenReturn(Optional.of(employeeRole));
		
		//Act
		Optional<User> result  = userService.signup("employee1", "abc123","customers");
		
		//Assert
		assertFalse(result.isPresent());			
	}
	
	@Test
	public void signup_FieldsAreNullAndEmpty_ReturnsEmptyObject()
	{	
		//Arrange & Act
		Optional<User> result  = userService.signup(null, "", "");
		
		//Assert
		assertFalse(result.isPresent());			
	}
	
	@Test
	public void getUserAccountNo_CustomerUsernameExists_ReturnsAccountNo()
	{
		//Arrange
		when(userRepository.findByUsername("leslie1")).thenReturn(Optional.of(existingCustomerUser));

		//Act
		int result  = userService.getUserAccountNo("leslie1");
		
		//Assert
		assertEquals(1, result);
	}
	
	@Test
	public void getUserAccountNo_EmployeeUsernameExists_ReturnsAccountNo()
	{
		//Arrange
		when(userRepository.findByUsername("employee1")).thenReturn(Optional.of(existingEmployeeUser));

		//Act
		int result  = userService.getUserAccountNo("employee1");
		
		//Assert
		assertEquals(4, result);
	}
	
	@Test
	public void getUserAccountNo_AdminUsernameExists_ReturnsAccountNo()
	{
		//Arrange
		when(userRepository.findByUsername("admin")).thenReturn(Optional.of(existingAdminUser));

		//Act
		int result  = userService.getUserAccountNo("admin");
		
		//Assert
		assertEquals(5, result);
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
