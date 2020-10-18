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
public class CustomerAPITests 
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
	public void getAllCustomers_AuthorisedUser_ReturnsJsonOfCustomers() throws Exception
	{

		//Arrange and Act
		//we want to get the body so we can analyse the JSON returned
		String result = this.mockMvc.perform(MockMvcRequestBuilders
			      .get("/api/customers")
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
		JSONArray customers = embedded.getJSONArray("customers");
		assertTrue(customers.length() > 0);
		
	}
	
	@Test
	@WithAnonymousUser
	public void getAllCustomers_AnonymousUser_AccessDenied() throws Exception
	{	
		//Arrange Act and Assert
		this.mockMvc.perform(MockMvcRequestBuilders
			      .get("/api/customers")
			      .contentType(MediaType.APPLICATION_JSON))
				  .andDo(MockMvcResultHandlers.print())
				  .andExpect(MockMvcResultMatchers.status().is4xxClientError())
				  .andExpect(MockMvcResultMatchers.status().reason("Access Denied"));
	}
	
	@Test
	@WithMockUser(username="admin",roles={"ADMIN"})
	public void getSpecificCustomer_AuthorisedUser_ReturnsJsonOfCustomer() throws Exception
	{
		//Arrange and Act		
		String result = this.mockMvc.perform(MockMvcRequestBuilders
			      .get("/api/customers/1")
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
		assertEquals(firstName, "Leslie");
		assertEquals(lastName, "Uzumaki");
		assertEquals(email, "leslie@hotmail.com");
	}
	
	
	
	@Test
	@WithAnonymousUser
	public void getSpecificCustomer_AnonymousUser_AccessDenied() throws Exception
	{	
		//Arrange Act and Assert
		this.mockMvc.perform(MockMvcRequestBuilders
			      .get("/api/customers/1")
			      .contentType(MediaType.APPLICATION_JSON))
				  .andDo(MockMvcResultHandlers.print())
				  .andExpect(MockMvcResultMatchers.status().is4xxClientError())
				  .andExpect(MockMvcResultMatchers.status().reason("Access Denied"));
	}
	
	@Test
	@WithMockUser(username="admin",roles={"ADMIN"})
	public void updateCustomer_ValidData_ReturnsNothing() throws Exception
	{
		//Arrange
		JSONObject requestBody = new JSONObject(); 
		requestBody.put("firstName", "Leslie");
		requestBody.put("lastName", "Uzumaki");
		requestBody.put("email", "leslie@hotmail.com");
		requestBody.put("phoneNo", "0410101010");
		requestBody.put("address", "5 Poornima Road");
		requestBody.put("img", "https://i.imgur.com/VXnG3tg.jpg");
		
		//Act and Assert
		this.mockMvc.perform(MockMvcRequestBuilders
			      .put("/api/customers/1")
			      .content(requestBody.toString())
			      .contentType(MediaType.APPLICATION_JSON))
				  .andDo(MockMvcResultHandlers.print())
				  .andExpect(MockMvcResultMatchers.status().is2xxSuccessful());
	}
	
	@Test
	@WithMockUser(username="admin",roles={"ADMIN"})
	public void updateCustomer_InvalidData_ThrowsError() throws Exception
	{
		//Arrange
		JSONObject requestBody = new JSONObject(); 
		requestBody.put("firstName", "Leslie");
		requestBody.put("lastName", "Uzumaki");
		requestBody.put("email", "leslie@hotmail.com");
		requestBody.put("phoneNo", "1234abc");
		requestBody.put("address", "updated address");
		
		//Act and Assert
		this.mockMvc.perform(MockMvcRequestBuilders
			      .put("/api/customers/1")
			      .content(requestBody.toString())
			      .contentType(MediaType.APPLICATION_JSON))
				  .andDo(MockMvcResultHandlers.print())
				  .andExpect(MockMvcResultMatchers.status().is4xxClientError());
	}
	
}
