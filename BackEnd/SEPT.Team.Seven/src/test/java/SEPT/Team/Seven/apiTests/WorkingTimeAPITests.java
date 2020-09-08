package SEPT.Team.Seven.apiTests;

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
public class WorkingTimeAPITests {
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
	public void getAllWorkingTimes_AuthorisedUser_ReturnsJsonOfWorkingTimes() throws Exception
	{

		//Arrange and Act
		//we want to get the body so we can analyse the JSON returned
		String result = this.mockMvc.perform(MockMvcRequestBuilders
			      .get("/api/workingTimes")
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
		JSONArray times = embedded.getJSONArray("workingTimes");
		assertTrue(times.length() > 0);
		
	}
	
	@Test
	@WithAnonymousUser
	public void getAllWorkingTimes_AnonymousUser_AccessDenied() throws Exception
	{	
		//Arrange Act and Assert
		this.mockMvc.perform(MockMvcRequestBuilders
			      .get("/api/workingTimes")
			      .contentType(MediaType.APPLICATION_JSON))
				  .andDo(MockMvcResultHandlers.print())
				  .andExpect(MockMvcResultMatchers.status().is4xxClientError())
				  .andExpect(MockMvcResultMatchers.status().reason("Access Denied"));
	}
	
	@Test
	@WithMockUser(username="admin",roles={"ADMIN"})
	public void getSpecificWorkingTime_AuthorisedUser_ReturnsJsonOfWorkingTime() throws Exception
	{
		//Arrange and Act		
		String result = this.mockMvc.perform(MockMvcRequestBuilders
			      .get("/api/workingTimes/1")
			      .contentType(MediaType.APPLICATION_JSON))
				  .andDo(MockMvcResultHandlers.print())
				  .andExpect(MockMvcResultMatchers.status().isOk())
				  .andReturn()
				  .getResponse()
				  .getContentAsString();
		
		assertTrue(!result.isEmpty());
	}
	
	
	@Test
	@WithAnonymousUser
	public void getSpecificWorkingTime_AnonymousUser_AccessDenied() throws Exception
	{	
		//Arrange Act and Assert
		this.mockMvc.perform(MockMvcRequestBuilders
			      .get("/api/workingTimes/1")
			      .contentType(MediaType.APPLICATION_JSON))
				  .andDo(MockMvcResultHandlers.print())
				  .andExpect(MockMvcResultMatchers.status().is4xxClientError())
				  .andExpect(MockMvcResultMatchers.status().reason("Access Denied"));
	}


}
