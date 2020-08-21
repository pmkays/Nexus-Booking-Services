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
import org.springframework.stereotype.Service;

import SEPT.Team.Seven.model.Role;
import SEPT.Team.Seven.model.User;
import SEPT.Team.Seven.repo.UserRepository;
import SEPT.Team.Seven.security.JwtFilter;
import SEPT.Team.Seven.security.JwtProvider;

@Service
public class UserService {

	private static final Logger LOGGER = LoggerFactory.getLogger(JwtFilter.class);

	private UserRepository userRepository;

	private AuthenticationManager authenticationManager;

	//private RoleRepository roleRepository;

	//private AccountRepository accountRepository;

	//private PasswordEncoder passwordEncoder;

	private JwtProvider jwtProvider;

	@Autowired
	public UserService(UserRepository userRepository, AuthenticationManager authenticationManager,
			JwtProvider jwtProvider) {
		this.userRepository = userRepository;
		this.authenticationManager = authenticationManager;
		//this.roleRepository = roleRepository;
		//this.passwordEncoder = passwordEncoder;
		this.jwtProvider = jwtProvider;
	}

//    public Authentication signin(String username, String password) {
//        return authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
//    }

	public Optional<String> signin(String username, String password) {
		LOGGER.info("Using logging in");
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
				} else if (user.get().getRole().getRoleName().equals("ROLE_ADMIN")){
					System.out.println("User Role: " + user.get().getRole().getRoleName());
					token = Optional.of(jwtProvider.createToken(username, roles, user.get().getAdmin().getId()));
				}
				
			} catch (AuthenticationException e) {
				LOGGER.info("Log in failed.");
			}
		}
		return token;

	}

// WIP code for signing up users
//    public Optional<User> signup(String username, String password) {
//        if (!userRepository.findByUsername(username).isPresent()) {
//            Optional<Role> role = roleRepository.findByRoleName("ROLE_USER");
//            Optional<Account> account = accountRepository.findBy
//            return Optional.of(userRepository.save
//                    (new User(username,
//                            password,
//                            role));
//        }
//        return Optional.empty();
//    }

	public List<User> getAll() {
		return userRepository.findAll();
	}
}