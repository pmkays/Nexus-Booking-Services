package SEPT.Team.Seven.serviceTests;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.any;


import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import SEPT.Team.Seven.model.Booking;
import SEPT.Team.Seven.model.Customer;
import SEPT.Team.Seven.model.Employee;
import SEPT.Team.Seven.model.Service;
import SEPT.Team.Seven.model.WorkingTime;
import SEPT.Team.Seven.repo.BookingRepository;
import SEPT.Team.Seven.repo.CustomerRepository;
import SEPT.Team.Seven.repo.EmployeeRepository;
import SEPT.Team.Seven.repo.ServiceRepository;
import SEPT.Team.Seven.repo.WorkingTimeRepository;
import SEPT.Team.Seven.service.BookingService;

@SpringBootTest
public class BookingServiceTest {
	
	@Mock
	private BookingRepository bookingRepository;
	
	@Mock
	private WorkingTimeRepository workingTimeRepository;
	
	@Mock
	private EmployeeRepository employeeRepository;
	
	@Mock
	private CustomerRepository customerRepository;
	
	@Mock
	private ServiceRepository serviceRepository;
	
	@InjectMocks
	private BookingService bookingService; 
	
	private static Service service;
	
	private static Calendar startTime;
	private static Calendar endTime;
	private static Employee existingEmployee; 
	private static Customer existingCustomer; 

	@BeforeAll
	public static void setUp()
	{
		service = new Service("service1");
		
		startTime = Calendar.getInstance();
		endTime = Calendar.getInstance(); 
		startTime.add(Calendar.DATE, 5);
		endTime.add(Calendar.DATE, 6);
		
		existingCustomer = new Customer("Leslie", "Uzumaki", "leslie@hotmail.com", "1234567891", "some address");
		existingCustomer.setId(1);
		
		existingEmployee = new Employee("Yuri", "Detrov", "yuri@hotmail.com", "1234567891", "some address");
		existingEmployee.setId(4);
	}
	
	@Test
	public void addBooking_EmptyValues_ReturnsEmptyObject()
	{
		Optional<Booking> booking = bookingService.addBooking(4, 1, null, null, 1);
		
		assertFalse(booking.isPresent());		
	}
	
	@Test
	public void addBooking_NonexistentService_ReturnsEmptyObject()
	{	
		when(serviceRepository.findById(10)).thenReturn(Optional.empty());
		 
		Optional<Booking> booking = bookingService.addBooking(4, 1, startTime.getTime(), endTime.getTime(), 10);
				
		assertFalse(booking.isPresent());	
	}
	
	@Test
	public void addBooking_NonexistingEmployeeAndCustomer_ReturnsEmptyObject()
	{
		when(serviceRepository.findById(1)).thenReturn(Optional.of(service));
		when(employeeRepository.findById(4)).thenReturn(Optional.empty());
		when(customerRepository.findById(1)).thenReturn(Optional.empty());
		Optional<Booking> booking = bookingService.addBooking(4, 1, startTime.getTime(), endTime.getTime(), 1);
		
		assertFalse(booking.isPresent());	
		
	}
	
	@Test
	public void addBooking_CustomerAlreadyHasBookingOnThatDay_ReturnsEmptyObject()
	{
		List<Booking> bookings = new ArrayList<Booking>();
		bookings.add(new Booking(existingCustomer, existingEmployee, startTime.getTime(), endTime.getTime(),
				"accepted", service));
		
		when(serviceRepository.findById(1)).thenReturn(Optional.of(service));
		when(employeeRepository.findById(4)).thenReturn(Optional.of(existingEmployee));
		when(customerRepository.findById(1)).thenReturn(Optional.of(existingCustomer));
		when(bookingRepository.findAllByCustomerId(1)).thenReturn(bookings);
		
		Optional<Booking> booking = bookingService.addBooking(4, 1, startTime.getTime(), endTime.getTime(), 1);
		
		assertFalse(booking.isPresent());	
		
	}
	
	@Test
	public void addBooking_EmployeeDoesntHaveWorkingTimeThatDay_ReturnsEmptyObject()
	{
		Calendar workStartTime = Calendar.getInstance();
		Calendar workEndTime = Calendar.getInstance(); 
		workStartTime.add(Calendar.DATE, 1);
		workEndTime.add(Calendar.DATE, 2);
		
		List<Booking> bookings = new ArrayList<Booking>();
		
		List<WorkingTime> workingTimes = new ArrayList<WorkingTime>();
		workingTimes.add(new WorkingTime(existingEmployee, workStartTime.getTime(), workEndTime.getTime()));
		
		when(serviceRepository.findById(1)).thenReturn(Optional.of(service));
		when(employeeRepository.findById(4)).thenReturn(Optional.of(existingEmployee));
		when(customerRepository.findById(1)).thenReturn(Optional.of(existingCustomer));
		when(bookingRepository.findAllByCustomerId(1)).thenReturn(bookings);
		when(workingTimeRepository.findAllByEmployeeId(4)).thenReturn(workingTimes);
		
		Optional<Booking> booking = bookingService.addBooking(4, 1, startTime.getTime(), endTime.getTime(), 1);
		
		assertFalse(booking.isPresent());			
	}
	
	@Test
	public void addBooking_StartTimeBeforeTime_ReturnsEmptyObject()
	{
		Calendar workStartTime = Calendar.getInstance();
		Calendar workEndTime = Calendar.getInstance(); 
		workStartTime.add(Calendar.DATE, 1);
		workEndTime.add(Calendar.DATE, 2);
		
		List<Booking> bookings = new ArrayList<Booking>();
		
		List<WorkingTime> workingTimes = new ArrayList<WorkingTime>();
		workingTimes.add(new WorkingTime(existingEmployee, workStartTime.getTime(), workEndTime.getTime()));
		
		when(serviceRepository.findById(1)).thenReturn(Optional.of(service));
		when(employeeRepository.findById(4)).thenReturn(Optional.of(existingEmployee));
		when(customerRepository.findById(1)).thenReturn(Optional.of(existingCustomer));
		when(bookingRepository.findAllByCustomerId(1)).thenReturn(bookings);
		when(workingTimeRepository.findAllByEmployeeId(4)).thenReturn(workingTimes);
		
		Optional<Booking> booking = bookingService.addBooking(4, 1, endTime.getTime(), startTime.getTime(), 1);
		
		assertFalse(booking.isPresent());			
	}
	

	@Test
	public void addBooking_BookingNotWithinWorkingTime_ReturnsEmptyObject()
	{
		Calendar workStartTime = Calendar.getInstance();
		Calendar workEndTime = Calendar.getInstance(); 
		workStartTime.add(Calendar.DATE, 5);
		workEndTime.add(Calendar.DATE, 6);
		
		List<Booking> bookings = new ArrayList<Booking>();
		
		List<WorkingTime> workingTimes = new ArrayList<WorkingTime>();
		workingTimes.add(new WorkingTime(existingEmployee, workStartTime.getTime(), workEndTime.getTime()));
		
		when(serviceRepository.findById(1)).thenReturn(Optional.of(service));
		when(employeeRepository.findById(4)).thenReturn(Optional.of(existingEmployee));
		when(customerRepository.findById(1)).thenReturn(Optional.of(existingCustomer));
		when(bookingRepository.findAllByCustomerId(1)).thenReturn(bookings);
		when(workingTimeRepository.findAllByEmployeeId(4)).thenReturn(workingTimes);
		
		workStartTime.add(Calendar.HOUR_OF_DAY, -1);
		workEndTime.add(Calendar.HOUR_OF_DAY, 5);
		Optional<Booking> booking = bookingService.addBooking(4, 1, workStartTime.getTime(),workEndTime.getTime(), 1);
		
		assertFalse(booking.isPresent());			
	}
	
	@Test
	public void addBooking_ValidBooking_ReturnsEmptyObject()
	{
		Calendar workStartTime = Calendar.getInstance();
		Calendar workEndTime = Calendar.getInstance(); 
		workStartTime.add(Calendar.DATE, 5);
		workEndTime.add(Calendar.DATE, 6);
		
		List<Booking> bookings = new ArrayList<Booking>();
		
		List<WorkingTime> workingTimes = new ArrayList<WorkingTime>();
		workingTimes.add(new WorkingTime(existingEmployee, workStartTime.getTime(), workEndTime.getTime()));
		
		workStartTime.add(Calendar.HOUR_OF_DAY, 1);
		workEndTime.add(Calendar.HOUR_OF_DAY, -1);
		Booking bookingMade = new Booking(existingCustomer, existingEmployee, workStartTime.getTime(), workEndTime.getTime(),
				"accepted", service);

		when(serviceRepository.findById(1)).thenReturn(Optional.of(service));
		when(employeeRepository.findById(4)).thenReturn(Optional.of(existingEmployee));
		when(customerRepository.findById(1)).thenReturn(Optional.of(existingCustomer));
		when(bookingRepository.findAllByCustomerId(1)).thenReturn(bookings);
		when(workingTimeRepository.findAllByEmployeeId(4)).thenReturn(workingTimes);
		when(bookingRepository.save(any(Booking.class))).thenReturn(bookingMade);
		

		Optional<Booking> booking = bookingService.addBooking(4, 1, workStartTime.getTime(),workEndTime.getTime(), 1);
		
		assertTrue(booking.isPresent());			
	}
	
	
	
}
