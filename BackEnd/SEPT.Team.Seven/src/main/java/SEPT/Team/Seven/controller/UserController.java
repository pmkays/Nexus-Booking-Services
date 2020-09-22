package SEPT.Team.Seven.controller;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpServerErrorException;

import SEPT.Team.Seven.model.User;
import SEPT.Team.Seven.model.DTO.LoginDto;
import SEPT.Team.Seven.service.UserService;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @PostMapping("/signin")
    public String login(@RequestBody LoginDto loginDto) {
       return userService.signin(loginDto.getUsername(), loginDto.getPassword()).orElseThrow(()->
       new HttpServerErrorException(HttpStatus.FORBIDDEN, "Username or password is incorrect."));
    }
    
    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @PostMapping("/signup")
    public User signup(@RequestBody LoginDto loginDto) {
       return userService.signup(loginDto.getUsername(), loginDto.getPassword(), loginDto.getType()).orElseThrow(()->
       new HttpServerErrorException(HttpStatus.FORBIDDEN, "Error processing registration."));
    }
    
    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @PostMapping("/accountno")
    public Integer getUserAccountNo(@RequestBody LoginDto loginDto) {
    	
    	int accountNo = userService.getUserAccountNo(loginDto.getUsername());
    	
    	if(accountNo == 0) {
    		throw new HttpServerErrorException(HttpStatus.FORBIDDEN, "Error processing registration.");
    	}
    	
       return accountNo;
      
    }

    // Test method for testing authority
    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping("/all")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<User> getAllUsers() {
        return userService.getAll();
    }
    
}
