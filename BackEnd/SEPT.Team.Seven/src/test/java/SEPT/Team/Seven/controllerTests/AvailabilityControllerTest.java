package SEPT.Team.Seven.controllerTests;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Optional;

import org.json.JSONArray;
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


import SEPT.Team.Seven.controller.AvailabilityController;
import SEPT.Team.Seven.model.Availability;
import SEPT.Team.Seven.model.Employee;

import SEPT.Team.Seven.security.SecurityUserDetailsService;
import SEPT.Team.Seven.service.AvailabilityService;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;


@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(AvailabilityController.class)
public class AvailabilityControllerTest {

	@MockBean
	AvailabilityService availabilityService; 
	
	@MockBean
	private SecurityUserDetailsService userDetailsService;
	
	@Autowired
	private MockMvc mockMvc;
	
	
	private static List<Availability> availabilities;
	
	private static List<Availability> emptyAvailabilities; 
	
	private static Calendar start;
	private static Calendar end;
	
	private static Availability availabilityToAdd;
	
	private static Calendar startNewAvail; 
	private static Calendar endNewAvail; 
	
	
	@BeforeAll
	public static void setUp()
	{
		Employee employee = new Employee("hello", "world", "a@a.com", "1234567889", "blah"); 
		employee.setId(4);
		
		start = Calendar.getInstance();
		end = Calendar.getInstance(); 
		start.add(Calendar.DATE, 15);
		end.add(Calendar.DATE, 16);
		
		Calendar start2 = Calendar.getInstance();
		Calendar end2 = Calendar.getInstance(); 
		start2.add(Calendar.DATE, 17);
		end2.add(Calendar.DATE, 18);
		
		availabilities = new ArrayList<Availability>();
		availabilities.add(new Availability(employee, start.getTime(), end.getTime()));
		availabilities.add(new Availability(employee, start2.getTime(), end2.getTime()));
		
		emptyAvailabilities = new ArrayList<Availability>();
		
		Calendar startNewAvail = Calendar.getInstance();
		Calendar endNewAvail = Calendar.getInstance(); 
		startNewAvail.add(Calendar.DATE, 20);
		endNewAvail.add(Calendar.DATE, 21);

	}
	
	@Test
	public void getAvailabilitiesForEmployee_IdOfEmployeeThatExists_ReturnsAvailabilities() throws Exception
	{
		//employee exists 
		when(availabilityService.getAvailabilitiesForEmployee(4)).thenReturn(availabilities);
		
		String result = this.mockMvc.perform(MockMvcRequestBuilders
						      .get("/api/availability/employee/4")
						      .contentType(MediaType.APPLICATION_JSON))
							  .andDo(MockMvcResultHandlers.print())
							  .andExpect(MockMvcResultMatchers.status().isOk())
							  .andReturn()
							  .getResponse()
							  .getContentAsString();

		//Assert
		JSONArray availabilities = new JSONArray(result);	
		assertEquals(2, availabilities.length());
		
	}
	
	@Test
	public void getAvailabilitiesForEmployee_NonExistentEmployeeId_ReturnsNoAvailabilities() throws Exception
	{
		//employee exists 
		when(availabilityService.getAvailabilitiesForEmployee(8)).thenReturn(emptyAvailabilities);
		
		String result = this.mockMvc.perform(MockMvcRequestBuilders
						      .get("/api/availability/employee/8")
						      .contentType(MediaType.APPLICATION_JSON))
							  .andDo(MockMvcResultHandlers.print())
							  .andExpect(MockMvcResultMatchers.status().isOk())
							  .andReturn()
							  .getResponse()
							  .getContentAsString();

		//Assert
		JSONArray availabilities = new JSONArray(result);	
		assertEquals(0, availabilities.length());
		
	}
	
	@Test
	public void addAvailability_AvailabilityAlreadyExists_ReturnsAvailabilities() throws Exception
	{
//		System.out.println(start.getTime().toString());
		DateFormat dateFormat = new SimpleDateFormat("yyyy-mm-dd'T'hh:mm:ss");  
		String startStr = dateFormat.format(start.getTime());  
		String endStr = dateFormat.format(end.getTime());  

		
		JSONObject json = new JSONObject(); 
		json.put("employeeId", 4);
		json.put("startTime", startStr);
		json.put("endTime", endStr);

		
		//employee exists 
		when(availabilityService.addAvailability(4, start.getTime(), end.getTime())).thenReturn(Optional.empty());
		
		this.mockMvc.perform(MockMvcRequestBuilders
						      .post("/api/availability")
						      .content(json.toString())
						      .contentType(MediaType.APPLICATION_JSON))
							  .andDo(MockMvcResultHandlers.print())
							  .andExpect(MockMvcResultMatchers.status().is4xxClientError())
							  .andExpect(MockMvcResultMatchers.content().string("403 Error adding availability."));

		
	}
	
	
}