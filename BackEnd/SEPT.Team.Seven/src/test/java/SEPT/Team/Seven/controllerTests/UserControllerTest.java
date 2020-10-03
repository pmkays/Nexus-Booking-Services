package SEPT.Team.Seven.controllerTests;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.json.JSONObject;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import SEPT.Team.Seven.controller.UserController;
import SEPT.Team.Seven.model.Customer;
import SEPT.Team.Seven.model.Role;
import SEPT.Team.Seven.model.User;
import SEPT.Team.Seven.security.SecurityUserDetailsService;
import SEPT.Team.Seven.service.UserService;

@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(UserController.class)
public class UserControllerTest {
	
	@MockBean
	private UserService service;
	
	@MockBean
	private SecurityUserDetailsService userDetailsService;


	private static String sampleJwt;
	
	@Autowired
	private MockMvc mockMvc;
	
	
	@BeforeAll
	public static void setUp()
	{
		
		sampleJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
				+ "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ."
				+ "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";	

	}
	
	@Test
	public void login_ValidUser_ReturnsToken() throws Exception
	{
		//Arrange
		JSONObject json = new JSONObject(); 
		json.put("password", "abc123");
		json.put("username", "admin");
		
		//Act and Assert
		when(service.signin("admin", "abc123")).thenReturn(Optional.of(sampleJwt));
		this.mockMvc.perform(MockMvcRequestBuilders
			      .post("/users/signin")
			      .content(json.toString())
			      .contentType(MediaType.APPLICATION_JSON))
				  .andDo(MockMvcResultHandlers.print())
				  .andExpect(MockMvcResultMatchers.status().isOk())
				  .andExpect(MockMvcResultMatchers.content().string(sampleJwt));

	}
	
	@Test
	public void login_NonExistentUser_ThrowsHttpServerException() throws Exception
	{
		//Arrange
		JSONObject json = new JSONObject(); 
		json.put("password", "abc123");
		json.put("username", "asdasd");
		
		//Act and Assert
		when(service.signin("asdasd", "abc123")).thenReturn(Optional.empty());
		this.mockMvc.perform(MockMvcRequestBuilders
			      .post("/users/signin")
			      .content(json.toString())
			      .contentType(MediaType.APPLICATION_JSON))
				  .andDo(MockMvcResultHandlers.print())
				  .andExpect(MockMvcResultMatchers.status().is4xxClientError())
				  .andExpect(MockMvcResultMatchers.content().string("403 Username or password is incorrect."));
	}
	
	@Test
	public void login_WrongPassword_ThrowsHttpServerException() throws Exception
	{
		//Arrange
		JSONObject json = new JSONObject(); 
		json.put("password", "abc126");
		json.put("username", "admin");
		
		//Act and Assert
		when(service.signin("admin", "abc126")).thenReturn(Optional.empty());
		this.mockMvc.perform(MockMvcRequestBuilders
			      .post("/users/signin")
			      .content(json.toString())
			      .contentType(MediaType.APPLICATION_JSON))
				  .andDo(MockMvcResultHandlers.print())
				  .andExpect(MockMvcResultMatchers.status().is4xxClientError())
				  .andExpect(MockMvcResultMatchers.content().string("403 Username or password is incorrect."));
	}
	
	
	@Test
	public void signup_ValidCustomer_ReturnNewCustomer() throws Exception
	{
		//Arrange
		JSONObject json = new JSONObject();
		json.put("password", "abc123");
		json.put("username", "david");
		json.put("type", "customers");
		
		Role role = new Role("ROLE_CUSTOMER", "Customer role.");
		Customer customer = new Customer("placeholder","placeholder","placeholder@placeholder.placeholder","0123456789","placeholder", "placeholder");
		User user = new User("david", "$2a$10$C/8xsj.CiUBaCJIYPpjLg.25k3RZASgu37zHD6K6CltmAvb9Z2wLa",customer,null,null,role);
		
		//Act and Assert
		when(service.signup("david","abc123", "customers")).thenReturn(Optional.of(user));
		this.mockMvc.perform(MockMvcRequestBuilders
				  .post("/users/signup")
			      .content(json.toString())
			      .contentType(MediaType.APPLICATION_JSON))
				  .andDo(MockMvcResultHandlers.print())
				  .andExpect(MockMvcResultMatchers.status().isOk());
	}
	
	@Test
	public void signup_InvalidUsernameForCustomer_ThrowException() throws Exception
	{
		//Arrange
		JSONObject json = new JSONObject(); 
		json.put("password", "abc123");
		json.put("username", "admin");
		
		//Act and Assert
		when(service.signup("admin", "abc123", "customers")).thenReturn(Optional.empty());
		this.mockMvc.perform(MockMvcRequestBuilders
			      .post("/users/signup")
			      .content(json.toString())
			      .contentType(MediaType.APPLICATION_JSON))
				  .andDo(MockMvcResultHandlers.print())
				  .andExpect(MockMvcResultMatchers.status().is4xxClientError())
				  .andExpect(MockMvcResultMatchers.content().string("403 Error processing registration."));
	}
	
	
	@Test
	public void getUserAccountNo_ExistentUser_ReturnUserID() throws Exception
	{
		//Arrange
		JSONObject json = new JSONObject(); 
		json.put("password", "abc123");
		json.put("username", "sasuke1");
		
		//Act
		when(service.getUserAccountNo("sasuke1")).thenReturn(1);
		String result = this.mockMvc.perform(MockMvcRequestBuilders
			      .post("/users/accountno")
			      .content(json.toString())
			      .contentType(MediaType.APPLICATION_JSON))
				  .andDo(MockMvcResultHandlers.print())
				  .andExpect(MockMvcResultMatchers.status().isOk())
				  .andReturn()
				  .getResponse()
				  .getContentAsString();
		
		//Assert
		assertEquals(1 , Integer.parseInt(result));
	}

	@Test
	public void getUserAccountNo_NonExistentUser_ThrowExceptions() throws Exception
	{
		//Arrange 
		JSONObject json = new JSONObject(); 
		json.put("password", "abc123");
		json.put("username", "david");
		
		//Act & Assert
		when(service.getUserAccountNo("david")).thenReturn(0);
		this.mockMvc.perform(MockMvcRequestBuilders
					.post("/users/accountno")
					.content(json.toString())
					.contentType(MediaType.APPLICATION_JSON))
					.andDo(MockMvcResultHandlers.print())
					.andExpect(MockMvcResultMatchers.status().is4xxClientError())
					.andExpect(MockMvcResultMatchers.content().string("403 Error processing registration."));
	} 
	
}
