package SEPT.Team.Seven.controller;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpServerErrorException;

import SEPT.Team.Seven.model.User;
import SEPT.Team.Seven.model.DTO.LoginDto;
import SEPT.Team.Seven.service.UserService;

@RestController
@RequestMapping("/users")
public class UserController {
    private static final Logger LOGGER = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/signin")
    public String login(@RequestBody LoginDto loginDto) {
       return userService.signin(loginDto.getUsername(), loginDto.getPassword()).orElseThrow(()->
       new HttpServerErrorException(HttpStatus.FORBIDDEN, "Username or password is incorrect."));
    }
    
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/signup")
    public User signup(@RequestBody LoginDto loginDto) {
       return userService.signup(loginDto.getUsername(), loginDto.getPassword(), loginDto.getType()).orElseThrow(()->
       new HttpServerErrorException(HttpStatus.FORBIDDEN, "Error processing registration."));
    }
    
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/accountno")
    public Integer getUserAccountNo(@RequestBody LoginDto loginDto) {
    	
    	int accountNo = userService.getUserAccountNo(loginDto.getUsername());
    	
    	if(accountNo == 0) {
    		throw new HttpServerErrorException(HttpStatus.FORBIDDEN, "Error processing registration.");
    	}
    	
       return accountNo;
      
    }

    // Test method for testing authority
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/all")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<User> getAllUsers() {
        return userService.getAll();
    }

    // Will be moved to an ADVICE
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(RuntimeException.class)
    public String return400(RuntimeException ex) {
        LOGGER.error("Unable to complete transaction", ex);
        return ex.getMessage();
    }
    
}
