package SEPT.Team.Seven;

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
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
public class AccountsAPITests 
{
	private MockMvc mockMvc;
	
	 @Autowired
	private WebApplicationContext webApplicationContext;
	 
	@BeforeEach
	public void initialise()
	{
		mockMvc =  MockMvcBuilders.webAppContextSetup(webApplicationContext)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .build();
	}
	
	@Test
	@WithMockUser(username="admin",roles={"ADMIN"})
	public void getAllAccounts_AuthorisedUser_ReturnsJsonOfAccounts() throws Exception
	{

		//Arrange and Act
		//we want to get the body so we can analyse the JSON returned
		String result = this.mockMvc.perform(MockMvcRequestBuilders
			      .get("/api/accounts")
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
		JSONArray accounts = embedded.getJSONArray("accounts");
		assertTrue(accounts.length() > 0);
		
	}
	
	@Test
	@WithAnonymousUser
	public void getAllAccounts_AnonymousUser_AccessDenied() throws Exception
	{	
		//Arrange Act and Assert
		this.mockMvc.perform(MockMvcRequestBuilders
			      .get("/api/accounts")
			      .contentType(MediaType.APPLICATION_JSON))
				  .andDo(MockMvcResultHandlers.print())
				  .andExpect(MockMvcResultMatchers.status().is4xxClientError())
				  .andExpect(MockMvcResultMatchers.status().reason("Access Denied"));
	}
	
	@Test
	@WithMockUser(username="admin",roles={"ADMIN"})
	public void getSpecificAccount_AuthorisedUser_ReturnsJsonOfAccounts() throws Exception
	{
		//TODO Aqram: the url will be "api/accounts/1"

		//Arrange and Act

		
		//Assert
		//assert first name is "Leslie"
		//assert last name is "Uzumaki"
		//assert email is "leslie@hotmail.com"

	}
	
	
	
	@Test
	@WithAnonymousUser
	public void getSpecificAccount_AnonymousUser_AccessDenied() throws Exception
	{	
		//TODO Aqram: the url will be "api/accounts/1"
		
		//Arrange Act and Assert
	}
}
