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
import org.json.JSONException;
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
import org.springframework.web.bind.annotation.RequestBody;

import SEPT.Team.Seven.controller.BookingController;
import SEPT.Team.Seven.model.Booking;
import SEPT.Team.Seven.model.Customer;
import SEPT.Team.Seven.model.Employee;
import SEPT.Team.Seven.model.Service;
import SEPT.Team.Seven.model.DTO.EmployeeDateDTO;
import SEPT.Team.Seven.security.SecurityUserDetailsService;
import SEPT.Team.Seven.service.BookingService;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;


@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(BookingController.class)
public class BookingControllerTest {

	@MockBean
	BookingService bookingService; 
	
	@MockBean
	private SecurityUserDetailsService userDetailsService;
	
	@Autowired
	private MockMvc mockMvc;
	
	private static List<Booking> bookings;
	private static List<Booking> emptyBookings;
	private static Calendar start;
	private static Calendar end;
	private static Employee employee;
	private static Customer customer;
	private static Service service; 
	
	@BeforeAll
	public static void setUp()
	{
		employee = new Employee("Yuri", "Detrov", "yuri@hotmail.com", "1234567891", "some address", "fake img url", "some description");
		employee.setId(4);
		
		customer = new Customer("Leslie", "Uzumaki", "leslie@hotmail.com", "1234567891", "some address", "fake img url");
		customer.setId(1);
		
		service = new Service("service1", "fake img url", "some description");

		start = Calendar.getInstance();
		end = Calendar.getInstance(); 
		start.add(Calendar.DATE, 15);
		end.add(Calendar.DATE, 16);
		
		emptyBookings =  new ArrayList<Booking>();
		bookings = new ArrayList<Booking>();
		bookings.add(new Booking(customer,employee,start.getTime(), end.getTime(),"accepted", service));

	}
 
	@Test
	public void getBookingsForCustomer_CustomerExists_ReturnsBookings() throws Exception
	{
		//Arrange
		when(bookingService.getBookingsForCustomer(1)).thenReturn(bookings);
		
		//Act
		String result = this.mockMvc.perform(MockMvcRequestBuilders
						      .get("/api/booking/customer/1")
						      .contentType(MediaType.APPLICATION_JSON))
							  .andDo(MockMvcResultHandlers.print())
							  .andExpect(MockMvcResultMatchers.status().isOk())
							  .andReturn()
							  .getResponse()
							  .getContentAsString();

		//Assert
		JSONArray bookings = new JSONArray(result);	
		assertEquals(1, bookings.length());
		
	}
	
	@Test
	public void getBookingsForCustomer_CustomerDoesntExist_ReturnsEmptyBookings() throws Exception
	{
		//Arrange
		when(bookingService.getBookingsForCustomer(10)).thenReturn(emptyBookings);
		
		//Act
		String result = this.mockMvc.perform(MockMvcRequestBuilders
						      .get("/api/booking/customer/10")
						      .contentType(MediaType.APPLICATION_JSON))
							  .andDo(MockMvcResultHandlers.print())
							  .andExpect(MockMvcResultMatchers.status().isOk())
							  .andReturn()
							  .getResponse()
							  .getContentAsString();

		//Assert
		JSONArray bookings = new JSONArray(result);	
		assertEquals(0, bookings.length());
		
	}
	
	@Test
	public void getBookingsForEmployee_EmployeeExists_ReturnsBookings() throws Exception
	{
		//Arrange
		when(bookingService.getBookingsForEmployee(4)).thenReturn(bookings);
		
		//Act
		String result = this.mockMvc.perform(MockMvcRequestBuilders
						      .get("/api/booking/employee/4")
						      .contentType(MediaType.APPLICATION_JSON))
							  .andDo(MockMvcResultHandlers.print())
							  .andExpect(MockMvcResultMatchers.status().isOk())
							  .andReturn()
							  .getResponse()
							  .getContentAsString();

		//Assert
		JSONArray bookings = new JSONArray(result);	
		assertEquals(1, bookings.length());
		
	}
	
	@Test
	public void getBookingsForEmployee_EmployeeDoesntExist_ReturnsEmptyBookings() throws Exception
	{
		//Arrange
		when(bookingService.getBookingsForEmployee(10)).thenReturn(emptyBookings);
		
		//Act
		String result = this.mockMvc.perform(MockMvcRequestBuilders
						      .get("/api/booking/customer/10")
						      .contentType(MediaType.APPLICATION_JSON))
							  .andDo(MockMvcResultHandlers.print())
							  .andExpect(MockMvcResultMatchers.status().isOk())
							  .andReturn()
							  .getResponse()
							  .getContentAsString();

		//Assert
		JSONArray bookings = new JSONArray(result);	
		assertEquals(0, bookings.length());
		
	}
	
	 @Test
	 public void addBooking_ValidBooking_ReturnsBooking() throws Exception
	 {
		//Arrange
		// get 12am 2 days from today    
		Calendar bookingStart = new GregorianCalendar();
		bookingStart.set(Calendar.HOUR_OF_DAY, 0);
		bookingStart.set(Calendar.MINUTE, 0);
		bookingStart.set(Calendar.SECOND, 0);
		bookingStart.set(Calendar.MILLISECOND, 0);
		bookingStart.add(Calendar.DAY_OF_MONTH, 2);
		 
	 	//make their shift 3 hours
	 	Calendar bookingEnd = (Calendar)bookingStart.clone(); 
	 	bookingEnd.add(Calendar.HOUR_OF_DAY, 3);
			
	 	DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss");  
	 	String startStr = dateFormat.format(bookingStart.getTime());  
	 	String endStr = dateFormat.format(bookingEnd.getTime());  
		
	 	JSONObject json = new JSONObject(); 
	 	json.put("employeeId", 4);
	 	json.put("startTime", startStr);
	 	json.put("endTime", endStr);
	 	json.put("customerId", 1);
	 	json.put("serviceId", 1);
		
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

	 	Booking toAdd = new Booking(customer,employee, date1, date2, "pending", service);
		
	 	when(bookingService.addBooking(4,1, date1, date2, 1)).thenReturn(Optional.of(toAdd));
		
	 	//Act and Assert
	 	this.mockMvc.perform(MockMvcRequestBuilders
	 		      .post("/api/booking")
	 		      .content(json.toString())
	 		      .contentType(MediaType.APPLICATION_JSON))
	 			  .andDo(MockMvcResultHandlers.print())
	 			  .andExpect(MockMvcResultMatchers.status().isOk());
	 }
	
	//booking already exists on this day
	@Test
	public void addBooking_InvalidBooking_ReturnsError() throws Exception
	{
		//Arrange			
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss");  
		String startStr = dateFormat.format(start.getTime());  
		String endStr = dateFormat.format(end.getTime());  
		
		JSONObject json = new JSONObject(); 
		json.put("employeeId", 4);
		json.put("startTime", startStr);
		json.put("endTime", endStr);
		json.put("customerId", 1);
		json.put("serviceId", 1);
		
		//need to use the string to the date values when mocking since precision will be different
		Date date1 = dateFormat.parse(startStr);
		Date date2 = dateFormat.parse(endStr);		
		
		when(bookingService.addBooking(4,1, date1, date2, 1)).thenReturn(Optional.empty());
		
		//Act and Assert
		this.mockMvc.perform(MockMvcRequestBuilders
			      .post("/api/booking")
			      .content(json.toString())
			      .contentType(MediaType.APPLICATION_JSON))
				  .andDo(MockMvcResultHandlers.print())
				  .andExpect(MockMvcResultMatchers.status().is4xxClientError())
				  .andExpect(MockMvcResultMatchers.content().string("403 Error adding booking."));
		
	}
	
	@Test
	public void cancelBooking_ValidBookingOutside48Hrs_ReturnsBookingCancelled() throws Exception
	{
		//Arrange
		// get 12am 4 days from today    
		Calendar bookingStart = new GregorianCalendar();
		bookingStart.set(Calendar.HOUR_OF_DAY, 0);
		bookingStart.set(Calendar.MINUTE, 0);
		bookingStart.set(Calendar.SECOND, 0);
		bookingStart.set(Calendar.MILLISECOND, 0);
		bookingStart.add(Calendar.DAY_OF_MONTH, 4);
		 
	 	Calendar bookingEnd = (Calendar)bookingStart.clone(); 
	 	bookingEnd.add(Calendar.HOUR_OF_DAY, 3);
			
	 	DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss");  
	 	String startStr = dateFormat.format(bookingStart.getTime());  
	 	String endStr = dateFormat.format(bookingEnd.getTime());  
		
	 	JSONObject json = new JSONObject(); 
	 	json.put("employeeId", 4);
	 	json.put("startTime", startStr);
	 	json.put("endTime", endStr);
	 	json.put("customerId", 1);
	 	json.put("serviceId", 1);
		
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

	 	Booking toCancel = new Booking(customer,employee, date1, date2, "cancelled", service);
		
	 	when(bookingService.cancelBooking(4,1, date1, date2, 1)).thenReturn(Optional.of(toCancel));
		
	 	//Act and Assert
	 	this.mockMvc.perform(MockMvcRequestBuilders
	 		      .post("/api/booking/cancel")
	 		      .content(json.toString())
	 		      .contentType(MediaType.APPLICATION_JSON))
	 			  .andDo(MockMvcResultHandlers.print())
	 			  .andExpect(MockMvcResultMatchers.status().isOk());
	}
	
	@Test
	public void cancelBooking_BookingWithin48Hrs_ReturnsError() throws Exception
	{
		//Arrange
		Calendar bookingStart = new GregorianCalendar();
		bookingStart.set(Calendar.HOUR_OF_DAY, 0);
		bookingStart.set(Calendar.MINUTE, 0);
		bookingStart.set(Calendar.SECOND, 0);
		bookingStart.set(Calendar.MILLISECOND, 0);
		bookingStart.add(Calendar.DAY_OF_MONTH, 1);
		 
	 	Calendar bookingEnd = (Calendar)bookingStart.clone(); 
	 	bookingEnd.add(Calendar.HOUR_OF_DAY, 3);
			
	 	DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss");  
	 	String startStr = dateFormat.format(bookingStart.getTime());  
	 	String endStr = dateFormat.format(bookingEnd.getTime());  
		
	 	JSONObject json = new JSONObject(); 
	 	json.put("employeeId", 4);
	 	json.put("startTime", startStr);
	 	json.put("endTime", endStr);
	 	json.put("customerId", 1);
	 	json.put("serviceId", 1);
		
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
		
		when(bookingService.cancelBooking(4,1, date1, date2, 1)).thenReturn(Optional.empty());
		
		//Act and Assert
		this.mockMvc.perform(MockMvcRequestBuilders
			      .post("/api/booking/cancel")
			      .content(json.toString())
			      .contentType(MediaType.APPLICATION_JSON))
				  .andDo(MockMvcResultHandlers.print())
				  .andExpect(MockMvcResultMatchers.status().is4xxClientError())
				  .andExpect(MockMvcResultMatchers.content().string("403 Error cancelling booking."));
		
	}
	
}