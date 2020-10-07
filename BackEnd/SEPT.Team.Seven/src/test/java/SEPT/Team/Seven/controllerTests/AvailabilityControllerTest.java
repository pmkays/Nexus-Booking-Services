package SEPT.Team.Seven.controllerTests;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAccessor;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
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
	private static Employee employee;
	
	@BeforeAll
	public static void setUp()
	{
		employee = new Employee("Yuri", "Detrov", "yuri@hotmail.com", "1234567891", "some address", "some img url", "some description");
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

	}
	
	@Test
	public void getAvailabilitiesForEmployee_IdOfEmployeeThatExists_ReturnsAvailabilities() throws Exception
	{
		//Arrange
		when(availabilityService.getAvailabilitiesForEmployee(4)).thenReturn(availabilities);
		
		//Act
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
		//Arrange
		when(availabilityService.getAvailabilitiesForEmployee(8)).thenReturn(emptyAvailabilities);
		
		//Act
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
	 public void addAvailability_ValidAvailability_ReturnsAvailability() throws Exception
	 {
		//Arrange
		// get 12am 2 days from today    
		Calendar availStart = new GregorianCalendar();
		availStart.set(Calendar.HOUR_OF_DAY, 0);
		availStart.set(Calendar.MINUTE, 0);
		availStart.set(Calendar.SECOND, 0);
		availStart.set(Calendar.MILLISECOND, 0);
		availStart.add(Calendar.DAY_OF_MONTH, 2);
		 
	 	//make their availability 3 hours
	 	Calendar availEnd = (Calendar)availStart.clone(); 
	 	availEnd.add(Calendar.HOUR_OF_DAY, 3);
				
	 	DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss");  
	 	String startStr = dateFormat.format(availStart.getTime());  
	 	String endStr = dateFormat.format(availEnd.getTime());  
		
	 	JSONObject json = new JSONObject(); 
	 	json.put("employeeId", 4);
	 	json.put("startTime", startStr);
	 	json.put("endTime", endStr);
		
	 	//need to use the string to the date values when mocking since precision will be different
	 	//Parse to iso local date time, i.e. yyyy-MM-ddThh:mm:ss
		ZoneId defaultZoneId = ZoneId.systemDefault();
	 	TemporalAccessor format1 = DateTimeFormatter.ISO_LOCAL_DATE_TIME.parse(startStr);
	 	TemporalAccessor format2 = DateTimeFormatter.ISO_LOCAL_DATE_TIME.parse(endStr);
		
		//need to use localdatetime to get both date and time, which can be retrieved from temporal accessor
        LocalDateTime localDate1 = LocalDateTime.from(format1);
        LocalDateTime localDate2 = LocalDateTime.from(format2);

        //convert the local date time to date to pass into the method params
        Date date1 = Date.from(localDate1.atZone(defaultZoneId).toInstant());
        Date date2 = Date.from(localDate2.atZone(defaultZoneId).toInstant());
	 	Availability toAdd = new Availability(employee, date1, date2);
		
	 	when(availabilityService.addAvailability(4, date1, date2)).thenReturn(Optional.of(toAdd));
		
	 	//Act and Assert
	 	this.mockMvc.perform(MockMvcRequestBuilders
	 		      .post("/api/availability")
	 		      .content(json.toString())
	 		      .contentType(MediaType.APPLICATION_JSON))
	 			  .andDo(MockMvcResultHandlers.print())
	 			  .andExpect(MockMvcResultMatchers.status().isOk());
	 }
	
	//availability already exists on this day
	@Test
	public void addAvailability_InvalidAvailability_ReturnsError() throws Exception
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

		when(availabilityService.addAvailability(4, date1, date2)).thenReturn(Optional.empty());
		
		//Act and Assert
		this.mockMvc.perform(MockMvcRequestBuilders
						      .post("/api/availability")
						      .content(json.toString())
						      .contentType(MediaType.APPLICATION_JSON))
							  .andDo(MockMvcResultHandlers.print())
							  .andExpect(MockMvcResultMatchers.status().is4xxClientError())
							  .andExpect(MockMvcResultMatchers.content().string("403 Error adding availability."));
		
	}
	
	
}