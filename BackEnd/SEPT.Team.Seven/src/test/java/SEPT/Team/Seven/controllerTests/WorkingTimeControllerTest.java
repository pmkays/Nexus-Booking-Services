package SEPT.Team.Seven.controllerTests;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
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

import SEPT.Team.Seven.controller.WorkingTimeController;
import SEPT.Team.Seven.model.Availability;
import SEPT.Team.Seven.model.Employee;
import SEPT.Team.Seven.model.WorkingTime;
import SEPT.Team.Seven.security.SecurityUserDetailsService;
import SEPT.Team.Seven.service.WorkingTimeService;

@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(WorkingTimeController.class)
public class WorkingTimeControllerTest {

	@MockBean
	WorkingTimeService workingTimeService;
	
	@MockBean
	private SecurityUserDetailsService userDetailsService;	
	
	@Autowired
	private MockMvc mockMvc;
	
	private static List<WorkingTime> emptyList;
	private static List<WorkingTime> workingTimes;
	private static List<Availability> availabilities;
	private static Employee employee;
	private static Calendar start;
	private static Calendar end;
	
	@BeforeAll
	public static void setUp() {
		employee = new Employee("Paula", "Kurniawan", "iannguyen@hotmail.yeet", "0123456789", "4 yeet court");
		employee.setId(4);
		
		start = Calendar.getInstance();
		end = Calendar.getInstance(); 
		start.add(Calendar.DATE, 1);
		end.add(Calendar.DATE, 2);
		
		Calendar startNextWeek = Calendar.getInstance();
		Calendar endNextWeek = Calendar.getInstance(); 
		startNextWeek.add(Calendar.DATE, 7);
		endNextWeek.add(Calendar.DATE, 8);
		
		workingTimes = new ArrayList<WorkingTime>();
		workingTimes.add(new WorkingTime(employee, start.getTime(), end.getTime()));
		workingTimes.add(new WorkingTime(employee, startNextWeek.getTime(), endNextWeek.getTime()));
		
		emptyList = new ArrayList<WorkingTime>();
		
		//set up 2 availabilities
		availabilities = new ArrayList<Availability>();
		availabilities.add(new Availability(employee, start.getTime(), start.getTime()));	
		availabilities.add(new Availability(employee, startNextWeek.getTime(), endNextWeek.getTime()));				

	}
	
	@Test
	public void getWorkingTimesForEmployee_idOfEmployeeThatExists_ReturnsWorkingTimes() throws Exception {
		
		when(workingTimeService.getWorkingTimesForEmployee(4)).thenReturn(workingTimes);
		
		String result = this.mockMvc.perform(MockMvcRequestBuilders
			      .get("/api/workingTime/employee/5")
			      .contentType(MediaType.APPLICATION_JSON))
				  .andDo(MockMvcResultHandlers.print())
				  .andExpect(MockMvcResultMatchers.status().isOk())
				  .andReturn()
				  .getResponse()
				  .getContentAsString();
				  
		JSONArray json = new JSONArray(result);	
		assertTrue(json.length() >= 0);
		
	}
	
	@Test
	public void getWorkingTimesForEmployee_idOfEmployeeThatDoesNotExist_ReturnsWorkingTimes() throws Exception {
		
		when(workingTimeService.getWorkingTimesForEmployee(5)).thenReturn(emptyList);
		
		String result = this.mockMvc.perform(MockMvcRequestBuilders
			      .get("/api/workingTime/employee/5")
			      .contentType(MediaType.APPLICATION_JSON))
				  .andDo(MockMvcResultHandlers.print())
				  .andExpect(MockMvcResultMatchers.status().isOk())
				  .andReturn()
				  .getResponse()
				  .getContentAsString();
				  
		JSONArray json = new JSONArray(result);	
		assertTrue(json.length() == 0);
		
	}
	
	@Test
	public void addWorkingTime_ValidWorkingTime_ReturnsWorkingTime() throws Exception
	{
		//Arrange
		//working time within the availability
		Calendar workStart = Calendar.getInstance();
		Calendar workEnd = Calendar.getInstance(); 
		workStart.add(Calendar.DATE, 7);
		workStart.add(Calendar.MINUTE, 1);
		workEnd.add(Calendar.DATE, 8);
		workEnd.add(Calendar.MINUTE, -1);

				
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss");  
		String startStr = dateFormat.format(workStart.getTime());  
		String endStr = dateFormat.format(workEnd.getTime());  
		
		JSONObject json = new JSONObject(); 
		json.put("employeeId", 4);
		json.put("startTime", startStr);
		json.put("endTime", endStr);
		
		//need to use the string to the date values when mocking since precision will be different
		Date date1 = dateFormat.parse(startStr);
		Date date2 = dateFormat.parse(endStr);
		WorkingTime toAdd = new WorkingTime(employee, date1, date2);
		
		when(workingTimeService.addWorkingTime(4, date1, date2)).thenReturn(Optional.of(toAdd));
		
		//Act and Assert
		this.mockMvc.perform(MockMvcRequestBuilders
			      .post("/api/workingTime")
			      .content(json.toString())
			      .contentType(MediaType.APPLICATION_JSON))
				  .andDo(MockMvcResultHandlers.print())
				  .andExpect(MockMvcResultMatchers.status().isOk());		
	}
	
	@Test
	public void addWorkingTime_InvalidWorkingTime_ReturnsError() throws Exception
	{
		//Arrange
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss");  
		String startStr = dateFormat.format(start.getTime());  
		String endStr = dateFormat.format(end.getTime());  

		
		JSONObject json = new JSONObject(); 
		json.put("employeeId", 4);
		json.put("startTime", startStr);
		json.put("endTime", endStr);
		
		//need to use the string to the date values when mocking since precision will be different
		Date date1 = dateFormat.parse(startStr);
		Date date2 = dateFormat.parse(endStr);

		when(workingTimeService.addWorkingTime(4, date1, date2)).thenReturn(Optional.empty());
		
		//Act and Assert
		this.mockMvc.perform(MockMvcRequestBuilders
						      .post("/api/workingTime")
						      .content(json.toString())
						      .contentType(MediaType.APPLICATION_JSON))
							  .andDo(MockMvcResultHandlers.print())
							  .andExpect(MockMvcResultMatchers.status().is4xxClientError())
							  .andExpect(MockMvcResultMatchers.content().string("403 Error adding working time."));
		
	}

}
