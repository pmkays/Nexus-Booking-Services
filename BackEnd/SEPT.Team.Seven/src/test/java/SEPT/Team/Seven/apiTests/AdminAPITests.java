package SEPT.Team.Seven.apiTests;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;


@SpringBootTest
public class AdminAPITests 
{
	private MockMvc mockMvc;
	
	 @Autowired
	private WebApplicationContext webApplicationContext;
	 
	@BeforeEach
	public void setUp()
	{
		mockMvc =  MockMvcBuilders.webAppContextSetup(webApplicationContext)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .build();
	}
	
	@Test
	@WithMockUser(username="admin",roles={"ADMIN"})
	public void getAllAdmins_AuthorisedUser_ReturnsJsonOfAdmins() throws Exception
	{

		//Arrange and Act
		//we want to get the body so we can analyse the JSON returned
		String result = this.mockMvc.perform(MockMvcRequestBuilders
			      .get("/api/admins")
			      .contentType(MediaType.APPLICATION_JSON))
				  .andDo(MockMvcResultHandlers.print())
				  .andExpect(MockMvcResultMatchers.status().isOk())
				  .andReturn()
				  .getResponse()
				  .getContentAsString();
		
		//Assert
		JSONObject json = new JSONObject(result);	
		//the json returns in an object called "_embedded", which then has an array of accounts
		JSONObject embedded =  (JSONObject) json.get("_embedded");
		JSONArray admins = embedded.getJSONArray("admins");
		assertTrue(admins.length() > 0);
		
	}
	
	@Test
	@WithAnonymousUser
	public void getAllAdmins_AnonymousUser_AccessDenied() throws Exception
	{	
		//Arrange Act and Assert
		this.mockMvc.perform(MockMvcRequestBuilders
			      .get("/api/admins")
			      .contentType(MediaType.APPLICATION_JSON))
				  .andDo(MockMvcResultHandlers.print())
				  .andExpect(MockMvcResultMatchers.status().is4xxClientError())
				  .andExpect(MockMvcResultMatchers.status().reason("Access Denied"));
	}
	
	@Test
	@WithMockUser(username="admin",roles={"ADMIN"})
	public void getSpecificAdmin_AuthorisedUser_ReturnsJsonOfAdmin() throws Exception
	{
		//Arrange and Act		
		String result = this.mockMvc.perform(MockMvcRequestBuilders
			      .get("/api/admins/5")
			      .contentType(MediaType.APPLICATION_JSON))
				  .andDo(MockMvcResultHandlers.print())
				  .andExpect(MockMvcResultMatchers.status().isOk())
				  .andReturn()
				  .getResponse()
				  .getContentAsString();
		
		JSONObject json = new JSONObject(result);
		String firstName = (String) json.get("firstName");
		String lastName = (String) json.get("lastName");
		String email = (String) json.get("email");
		
		//Assert
		assertEquals(firstName, "Juan");
		assertEquals(lastName, "Yega");
		assertEquals(email, "juan@hotmail.com");
	}
	
	
	
	@Test
	@WithAnonymousUser
	public void getSpecificAdmin_AnonymousUser_AccessDenied() throws Exception
	{	
		//Arrange Act and Assert
		this.mockMvc.perform(MockMvcRequestBuilders
			      .get("/api/admins/5")
			      .contentType(MediaType.APPLICATION_JSON))
				  .andDo(MockMvcResultHandlers.print())
				  .andExpect(MockMvcResultMatchers.status().is4xxClientError())
				  .andExpect(MockMvcResultMatchers.status().reason("Access Denied"));
	}
	
	@Test
	@WithMockUser(username="admin",roles={"ADMIN"})
	public void updateAdmin_ValidData_ReturnsNothing() throws Exception
	{
		//Arrange
		JSONObject requestBody = new JSONObject(); 
		requestBody.put("firstName", "Juan");
		requestBody.put("lastName", "Yega");
		requestBody.put("email", "juan@hotmail.com");
		requestBody.put("phoneNo", "0410567343");
		requestBody.put("address", "2 Digger Road");
		requestBody.put("img", "https://i.imgur.com/hCEQVy0.jpg");
		
		//Act and Assert
		this.mockMvc.perform(MockMvcRequestBuilders
			      .put("/api/admins/5")
			      .content(requestBody.toString())
			      .contentType(MediaType.APPLICATION_JSON))
				  .andDo(MockMvcResultHandlers.print())
				  .andExpect(MockMvcResultMatchers.status().is2xxSuccessful());
	}
	
	@Test
	@WithMockUser(username="admin",roles={"ADMIN"})
	public void updateAdmin_InvalidData_ThrowsError() throws Exception
	{
		//Arrange
		JSONObject requestBody = new JSONObject(); 
		requestBody.put("firstName", "Juan");
		requestBody.put("lastName", "Yega");
		requestBody.put("email", "juan@hotmail.com");
		requestBody.put("phoneNo", "1234abc");
		requestBody.put("address", "updated addressss");

		//Act and Assert
		this.mockMvc.perform(MockMvcRequestBuilders
			      .put("/api/admins/5")
			      .content(requestBody.toString())
			      .contentType(MediaType.APPLICATION_JSON))
				  .andDo(MockMvcResultHandlers.print())
				  .andExpect(MockMvcResultMatchers.status().is4xxClientError());
		
	}
	
}
