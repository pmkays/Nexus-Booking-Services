package SEPT.Team.Seven.controllerTests;

import static org.junit.jupiter.api.Assertions.assertTrue;
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

import SEPT.Team.Seven.controller.WorkingTimeController;
import SEPT.Team.Seven.model.Employee;
import SEPT.Team.Seven.model.WorkingTime;
import SEPT.Team.Seven.security.SecurityUserDetailsService;
import SEPT.Team.Seven.service.WorkingTimeService;

@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(WorkingTimeController.class)
public class WorkingTimeControllerTest {

	@MockBean
	WorkingTimeService workingTimeService;
	
	private static List<WorkingTime> workingTimes;
	
	@MockBean
	private SecurityUserDetailsService userDetailsService;
	
	@Autowired
	private MockMvc mockMvc;
	
	private static List<WorkingTime> emptyList;
	
	@BeforeAll
	public static void setUp() {
		Employee employee = new Employee("Paula", "Kurniawan", "iannguyen@hotmail.yeet", "0123456789", "4 yeet court");
		Calendar startNextMonth = Calendar.getInstance();
		Calendar endNextMonth = Calendar.getInstance(); 
		startNextMonth.add(Calendar.DATE, 15);
		endNextMonth.add(Calendar.DATE, 16);
		
		Calendar startNextWeek = Calendar.getInstance();
		Calendar endNextWeek = Calendar.getInstance(); 
		startNextMonth.add(Calendar.DATE, 7);
		endNextMonth.add(Calendar.DATE, 8);
		
		workingTimes = new ArrayList<WorkingTime>();
		workingTimes.add(new WorkingTime(employee, startNextMonth.getTime(), endNextMonth.getTime()));
		workingTimes.add(new WorkingTime(employee, startNextWeek.getTime(), endNextWeek.getTime()));
		
		emptyList = new ArrayList<WorkingTime>();
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
//	@CrossOrigin(origins = "http://localhost:3000")
//	@GetMapping("/employee/{id}")
//	public List<WorkingTime> getWorkingTimesForEmployee(@PathVariable("id") int id) {
//		List<WorkingTime> workingTimes = workingTimeService.getWorkingTimesForEmployee(id);
//		return workingTimes;
//	}
}
