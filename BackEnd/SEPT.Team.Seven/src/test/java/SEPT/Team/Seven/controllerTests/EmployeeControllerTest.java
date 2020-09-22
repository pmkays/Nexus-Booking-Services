package SEPT.Team.Seven.controllerTests;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import org.json.JSONArray;
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

import SEPT.Team.Seven.controller.EmployeeController;
import SEPT.Team.Seven.model.Availability;
import SEPT.Team.Seven.model.Employee;
import SEPT.Team.Seven.security.SecurityUserDetailsService;
import SEPT.Team.Seven.service.EmployeeService;

@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(EmployeeController.class)
public class EmployeeControllerTest {

	@MockBean
	private EmployeeService service;
	
	@MockBean
	private SecurityUserDetailsService userDetailsService;
	
	@Autowired
	private MockMvc mockMvc;
	
	private static Employee employee;
	private static List<Availability> availabilities;
	private static List<Availability> empty;
	
	@BeforeAll
	public static void setUp()
	{
		Calendar startNextMonth = Calendar.getInstance();
		Calendar endNextMonth = Calendar.getInstance(); 
		startNextMonth.add(Calendar.DATE, 5);
		endNextMonth.add(Calendar.DATE, 6);
		
		employee = new Employee(); 
		employee.setId(4);
		availabilities = new ArrayList<Availability>();
		availabilities.add(new Availability(employee, startNextMonth.getTime(), endNextMonth.getTime()));
		
		empty = new ArrayList<Availability>();
	}
	
	@Test
	public void getNext7DaysAvailabilitiesById_ValidEmployee_ReturnsListOfAvailabilities() throws Exception
	{
		//Arrange, Act and assert
		when(service.getNext7DaysAvailabilitiesById(4)).thenReturn(availabilities);
		String result = this.mockMvc.perform(MockMvcRequestBuilders
					      .get("/api/employee/next7DaysAvai/4")
					      .contentType(MediaType.APPLICATION_JSON))
						  .andDo(MockMvcResultHandlers.print())
						  .andExpect(MockMvcResultMatchers.status().isOk())
						  .andReturn()
						  .getResponse()
						  .getContentAsString();
		
		JSONArray avails = new JSONArray(result);
		
		assertEquals(1, avails.length());

	}
	
	@Test
	public void getNext7DaysAvailabilitiesById_InvalidEmployee_ReturnsEmptyListOfAvailabilities() throws Exception
	{
		//Arrange, Act and assert
		when(service.getNext7DaysAvailabilitiesById(8)).thenReturn(empty);
		String result = this.mockMvc.perform(MockMvcRequestBuilders
					      .get("/api/employee/next7DaysAvai/4")
					      .contentType(MediaType.APPLICATION_JSON))
						  .andDo(MockMvcResultHandlers.print())
						  .andExpect(MockMvcResultMatchers.status().isOk())
						  .andReturn()
						  .getResponse()
						  .getContentAsString();
		
		JSONArray avails = new JSONArray(result);
		
		assertEquals(0, avails.length());

	}
}
