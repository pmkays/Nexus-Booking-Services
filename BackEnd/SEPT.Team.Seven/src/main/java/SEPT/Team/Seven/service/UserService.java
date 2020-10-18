package SEPT.Team.Seven.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import SEPT.Team.Seven.model.Customer;
import SEPT.Team.Seven.model.Employee;
import SEPT.Team.Seven.model.Role;
import SEPT.Team.Seven.model.User;
import SEPT.Team.Seven.repo.CustomerRepository;
import SEPT.Team.Seven.repo.EmployeeRepository;
import SEPT.Team.Seven.repo.RoleRepository;
import SEPT.Team.Seven.repo.UserRepository;
import SEPT.Team.Seven.security.JwtFilter;
import SEPT.Team.Seven.security.JwtProvider;

@Service
public class UserService {

	private static final Logger LOGGER = LoggerFactory.getLogger(JwtFilter.class);

	private UserRepository userRepository;

	private CustomerRepository customerRepository;

	private EmployeeRepository employeeRepository;

	private AuthenticationManager authenticationManager;

	private RoleRepository roleRepository;

	private PasswordEncoder passwordEncoder;

	private JwtProvider jwtProvider;

	@Autowired
	public UserService(UserRepository userRepository, CustomerRepository customerRepository,
			EmployeeRepository employeeRepository, AuthenticationManager authenticationManager,
			RoleRepository roleRepository, PasswordEncoder passwordEncoder, JwtProvider jwtProvider) {
		this.userRepository = userRepository;
		this.customerRepository = customerRepository;
		this.employeeRepository = employeeRepository;
		this.authenticationManager = authenticationManager;
		this.roleRepository = roleRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtProvider = jwtProvider;
	}

	public Optional<String> signin(String username, String password) {
		LOGGER.info("Using logging in");
		
		if(isNullOrEmpty(username) || isNullOrEmpty(password)) {
			return Optional.empty();
		}
		
		Optional<String> token = Optional.empty();
		Optional<User> user = userRepository.findByUsername(username);
		if (user.isPresent()) {
			try {
				authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
				List<Role> roles = new ArrayList<>();
				roles.add(user.get().getRole());
				if (user.get().getRole().getRoleName().equals("ROLE_CUSTOMER")) {
					token = Optional.of(jwtProvider.createToken(username, roles, user.get().getCustomer().getId()));
				} else if (user.get().getRole().getRoleName().equals("ROLE_EMPLOYEE")) {
					token = Optional.of(jwtProvider.createToken(username, roles, user.get().getEmployee().getId()));
				} else if (user.get().getRole().getRoleName().equals("ROLE_ADMIN")) {
					token = Optional.of(jwtProvider.createToken(username, roles, user.get().getAdmin().getId()));
				}

			} catch (AuthenticationException e) {
				LOGGER.info("Log in failed.");
			}
		}
		return token;

	}
	// String firstName, String lastName, String email, String phoneNo, String
	// address
	// User(String username, String password, Customer customer, Employee employee,
	// Admin admin, Role role)
	// public Customer(String firstName, String lastName, String email, String
	// phoneNo, String address)
	public Optional<User> signup(String username, String password, String type) {
		if (!userRepository.findByUsername(username).isPresent()) {
			Optional<Role> role = null;
			if (type.equals("customers")) {
				role = roleRepository.findByRoleName("ROLE_CUSTOMER");
				Customer customer = customerRepository.save(new Customer("placeholder","placeholder","placeholder@placeholder.placeholder","0123456789","placeholder", "placeholder"));
				return Optional.of(userRepository
						.save(new User(username, this.passwordEncoder.encode(password), customer, null, null, role.get())));
			}
			if (type.equals("employees")) {
				role = roleRepository.findByRoleName("ROLE_EMPLOYEE");
				Employee employee = employeeRepository.save(new Employee("placeholder","placeholder","placeholder@placeholder.placeholder","0123456789","placeholder", "placeholder", "placeholder"));
				return Optional.of(userRepository
						.save(new User(username, this.passwordEncoder.encode(password), null, employee, null, role.get())));
			}
      
		}
		return Optional.empty();
	}

	public Integer getUserAccountNo(String username) {
		if (userRepository.findByUsername(username).isPresent()) {
			Optional<User> user = userRepository.findByUsername(username);

			if (user.get().getCustomer() != null)
				return user.get().getCustomer().getId();
			if (user.get().getEmployee() != null)
				return user.get().getEmployee().getId();
			if (user.get().getAdmin() != null)
				return user.get().getAdmin().getId();
		}
		return 0;
	}

	public List<User> getAll() {
		return userRepository.findAll();
	}
	
	private boolean isNullOrEmpty(String value) {
		return (value == null || value.isEmpty());
	}
}