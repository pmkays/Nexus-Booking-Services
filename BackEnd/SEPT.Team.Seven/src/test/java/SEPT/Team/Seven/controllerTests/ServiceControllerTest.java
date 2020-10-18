package SEPT.Team.Seven.controllerTests;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

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

import SEPT.Team.Seven.controller.ServiceController;
import SEPT.Team.Seven.model.Service;
import SEPT.Team.Seven.security.SecurityUserDetailsService;
import SEPT.Team.Seven.service.ServiceService;

@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(ServiceController.class)
public class ServiceControllerTest 
{
	@MockBean
	ServiceService serviceService; 
	
	@MockBean
	private SecurityUserDetailsService userDetailsService;
	
	@Autowired
	private MockMvc mockMvc;
	
	private static List<Service> services; 
	
	@BeforeAll
	public static void setUp()
	{
		Service service1 = new Service("Manicure", "someUrl", "some description");
		Service service2 = new Service("Pedicure", "someUrl", "some description");
		
		services = new ArrayList<Service>();
		services.add(service1);
		services.add(service2);
	}
	
	@Test
	public void findServiceByDate_ServicesPresentOnDate_ReturnsServices() throws Exception
	{
		//Arrange
		Calendar date = new GregorianCalendar();
		date.set(Calendar.HOUR_OF_DAY, 1);
		date.set(Calendar.MINUTE, 0);
		date.set(Calendar.SECOND, 0);
		date.set(Calendar.MILLISECOND, 0);
		date.add(Calendar.DAY_OF_MONTH, 2); // +2 days from now at 1am
		
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss");  
	 	String dateStr = dateFormat.format(date.getTime());  
		
	 	JSONObject json = new JSONObject(); 
	 	json.put("startTime", dateStr);

	 	//need to use the string to the date values when mocking since precision will be different
	 	//Parse to iso local date time, i.e. yyyy-MM-ddThh:mm:ss
		ZoneId defaultZoneId = ZoneId.systemDefault();
	 	TemporalAccessor format1 = DateTimeFormatter.ISO_LOCAL_DATE_TIME.parse(dateStr);
		
		//need to use localdatetime to get both date and time, which can be retrieved from temporal accessor
        LocalDateTime localDate1 = LocalDateTime.from(format1);

        //convert the local date time to date to pass into the method params
        Date date1 = Date.from(localDate1.atZone(defaultZoneId).toInstant());

		when(serviceService.findServiceByDate(date1)).thenReturn(services);
		
		//Act
		String result = this.mockMvc.perform(MockMvcRequestBuilders
						      .post("/api/service/findAllByDate")
						      .content(json.toString())
						      .contentType(MediaType.APPLICATION_JSON))				
							  .andDo(MockMvcResultHandlers.print())
							  .andExpect(MockMvcResultMatchers.status().isOk())
							  .andReturn()
							  .getResponse()
							  .getContentAsString();

		//Assert
		JSONArray services = new JSONArray(result);			
		assertEquals(2, services.length());		
	}
	
	@Test
	public void findServiceByDate_ServicesNotPresentOnDate_ReturnsServices() throws Exception
	{
		//Arrange
		Calendar date = new GregorianCalendar();
		date.set(Calendar.HOUR_OF_DAY, 1);
		date.set(Calendar.MINUTE, 0);
		date.set(Calendar.SECOND, 0);
		date.set(Calendar.MILLISECOND, 0);
		date.add(Calendar.DAY_OF_MONTH, 9); // +9 days from now at 1am
		
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss");  
	 	String dateStr = dateFormat.format(date.getTime());  
		
	 	JSONObject json = new JSONObject(); 
	 	json.put("startTime", dateStr);

	 	//need to use the string to the date values when mocking since precision will be different
	 	//Parse to iso local date time, i.e. yyyy-MM-ddThh:mm:ss
		ZoneId defaultZoneId = ZoneId.systemDefault();
	 	TemporalAccessor format1 = DateTimeFormatter.ISO_LOCAL_DATE_TIME.parse(dateStr);
		
		//need to use localdatetime to get both date and time, which can be retrieved from temporal accessor
        LocalDateTime localDate1 = LocalDateTime.from(format1);

        //convert the local date time to date to pass into the method params
        Date date1 = Date.from(localDate1.atZone(defaultZoneId).toInstant());

		when(serviceService.findServiceByDate(date1)).thenReturn(new ArrayList<Service>());
		
		//Act
		String result = this.mockMvc.perform(MockMvcRequestBuilders
						      .post("/api/service/findAllByDate")
						      .content(json.toString())
						      .contentType(MediaType.APPLICATION_JSON))				
							  .andDo(MockMvcResultHandlers.print())
							  .andExpect(MockMvcResultMatchers.status().isOk())
							  .andReturn()
							  .getResponse()
							  .getContentAsString();

		//Assert
		JSONArray services = new JSONArray(result);			
		assertEquals(0, services.length());		
	}
	
}
