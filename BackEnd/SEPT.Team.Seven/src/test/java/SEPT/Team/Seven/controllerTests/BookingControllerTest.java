package SEPT.Team.Seven.controllerTests;

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

import SEPT.Team.Seven.controller.BookingController;
import SEPT.Team.Seven.model.Booking;
import SEPT.Team.Seven.model.Customer;
import SEPT.Team.Seven.model.Employee;
import SEPT.Team.Seven.model.Service;
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
		employee = new Employee("Yuri", "Detrov", "yuri@hotmail.com", "1234567891", "some address");
		employee.setId(4);
		
		customer = new Customer("Leslie", "Uzumaki", "leslie@hotmail.com", "1234567891", "some address");
		customer.setId(1);
		
		service = new Service("service1");

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
		Calendar bookingStart = Calendar.getInstance();
		Calendar bookingEnd = Calendar.getInstance(); 
		bookingStart.add(Calendar.DATE, 5);
		bookingEnd.add(Calendar.DATE, 6);
				
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
		Date date1 = dateFormat.parse(startStr);
		Date date2 = dateFormat.parse(endStr);
		Booking toAdd = new Booking(customer,employee, date1, date2, "accepted", service);
		
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
	
	
	
}