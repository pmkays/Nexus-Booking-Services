package SEPT.Team.Seven.serviceTests;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

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
		service = new Service("service1", "fake img url", "some description");
		service.setId(1);
		
		startTime = Calendar.getInstance();
		endTime = Calendar.getInstance(); 
		startTime.add(Calendar.DATE, 5);
		endTime.add(Calendar.DATE, 6);
		
		existingCustomer = new Customer("Leslie", "Uzumaki", "leslie@hotmail.com", "1234567891", "some address", "fake img url");
		existingCustomer.setId(1);
		
		existingEmployee = new Employee("Yuri", "Detrov", "yuri@hotmail.com", "1234567891", "some address", "fake img url", "some description");
		existingEmployee.setId(4);
	}
	
	@Test
	public void addBooking_EmptyValues_ReturnsEmptyObject()
	{
		//Act and Assert
		Optional<Booking> booking = bookingService.addBooking(4, 1, null, null, 1);
		
		//Assert
		assertFalse(booking.isPresent());		
	}
	
	@Test
	public void addBooking_NonexistentService_ReturnsEmptyObject()
	{	
		//Arrange
		when(serviceRepository.findById(10)).thenReturn(Optional.empty());
		
		//Act
		Optional<Booking> booking = bookingService.addBooking(4, 1, startTime.getTime(), endTime.getTime(), 10);
		
		//Assert
		assertFalse(booking.isPresent());	
	}
	
	@Test
	public void addBooking_NonexistingEmployeeAndCustomer_ReturnsEmptyObject()
	{
		//Arrange
		when(serviceRepository.findById(1)).thenReturn(Optional.of(service));
		when(employeeRepository.findById(4)).thenReturn(Optional.empty());
		when(customerRepository.findById(1)).thenReturn(Optional.empty());
		
		//Act
		Optional<Booking> booking = bookingService.addBooking(4, 1, startTime.getTime(), endTime.getTime(), 1);
		
		//Assert
		assertFalse(booking.isPresent());	
		
	}
	
	@Test
	public void addBooking_CustomerAlreadyHasBookingOnThatDay_ReturnsEmptyObject()
	{
		//Arrange
		List<Booking> bookings = new ArrayList<Booking>();
		bookings.add(new Booking(existingCustomer, existingEmployee, startTime.getTime(), endTime.getTime(),
				"accepted", service));
		
		when(serviceRepository.findById(1)).thenReturn(Optional.of(service));
		when(employeeRepository.findById(4)).thenReturn(Optional.of(existingEmployee));
		when(customerRepository.findById(1)).thenReturn(Optional.of(existingCustomer));
		when(bookingRepository.findAllByCustomerId(1)).thenReturn(bookings);
		
		//Act
		Optional<Booking> booking = bookingService.addBooking(4, 1, startTime.getTime(), endTime.getTime(), 1);
		
		//Assert
		assertFalse(booking.isPresent());	
		
	}
	
	@Test
	public void addBooking_EmployeeDoesntHaveWorkingTimeThatDay_ReturnsEmptyObject()
	{
		//Arrange
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
		
		//Act
		Optional<Booking> booking = bookingService.addBooking(4, 1, startTime.getTime(), endTime.getTime(), 1);
		
		//Assert
		assertFalse(booking.isPresent());			
	}
	
	@Test
	public void addBooking_StartTimeBeforeTime_ReturnsEmptyObject()
	{
		//Arrange
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
		
		//Act
		Optional<Booking> booking = bookingService.addBooking(4, 1, endTime.getTime(), startTime.getTime(), 1);
		
		//Assert
		assertFalse(booking.isPresent());			
	}
	

	@Test
	public void addBooking_BookingNotWithinWorkingTime_ReturnsEmptyObject()
	{
		//Arrange
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
		
		//Act
		Optional<Booking> booking = bookingService.addBooking(4, 1, workStartTime.getTime(),workEndTime.getTime(), 1);
		
		//Assert
		assertFalse(booking.isPresent());			
	}
	
	@Test
	public void addBooking_ValidBooking_ReturnsBookingObject()
	{
		//Arrange
		Calendar workStartTime = Calendar.getInstance();
		Calendar workEndTime = Calendar.getInstance(); 
		workStartTime.add(Calendar.DATE, 100);
		workEndTime.add(Calendar.DATE, 101);
		
		List<Booking> bookings = new ArrayList<Booking>();
		
		List<WorkingTime> workingTimes = new ArrayList<WorkingTime>();
		workingTimes.add(new WorkingTime(existingEmployee, workStartTime.getTime(), workEndTime.getTime()));
		
		workStartTime.add(Calendar.HOUR_OF_DAY, 1);
		workEndTime.add(Calendar.HOUR_OF_DAY, -1);
		Booking bookingMade = new Booking(existingCustomer, existingEmployee, workStartTime.getTime(), workEndTime.getTime(),
				"pending", service);

		when(serviceRepository.findById(1)).thenReturn(Optional.of(service));
		when(employeeRepository.findById(4)).thenReturn(Optional.of(existingEmployee));
		when(customerRepository.findById(1)).thenReturn(Optional.of(existingCustomer));
		when(bookingRepository.findAllByCustomerId(1)).thenReturn(bookings);
		when(workingTimeRepository.findAllByEmployeeId(4)).thenReturn(workingTimes);
		when(bookingRepository.save(any(Booking.class))).thenReturn(bookingMade);
		
		//Act
		Optional<Booking> booking = bookingService.addBooking(4, 1, workStartTime.getTime(),workEndTime.getTime(), 1);
		
		//Assert
		assertTrue(booking.isPresent());			
	}
	
	@Test
	public void cancelBooking_ValidBookingOutside48Hrs_ReturnsBooking()
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
			
        
		Booking bookingMade = new Booking(existingCustomer, existingEmployee, bookingStart.getTime(), bookingEnd.getTime(),
				"pending", service);
	
		List<Booking> bookings = new ArrayList<Booking>();
		bookings.add(bookingMade);
		when(bookingRepository.findAllByEmployeeId(4)).thenReturn(bookings);
		when(bookingRepository.save(any(Booking.class))).thenReturn(bookingMade);
		
		//Act
		Optional<Booking> booking = bookingService.cancelBooking(4, 1, bookingStart.getTime(),bookingEnd.getTime(), 1);
		
		//Assert
		assertTrue(booking.isPresent());			
	}
	
	@Test
	public void cancelBooking_InvalidBookingWithin48Hrs_ReturnsBooking()
	{
		//Arrange
		// get 12am 4 days from today    
		Calendar bookingStart = new GregorianCalendar();
		bookingStart.set(Calendar.HOUR_OF_DAY, 0);
		bookingStart.set(Calendar.MINUTE, 0);
		bookingStart.set(Calendar.SECOND, 0);
		bookingStart.set(Calendar.MILLISECOND, 0);
		bookingStart.add(Calendar.DAY_OF_MONTH, 1);
		 
	 	Calendar bookingEnd = (Calendar)bookingStart.clone(); 
	 	bookingEnd.add(Calendar.HOUR_OF_DAY, 3);
			
        
		Booking bookingMade = new Booking(existingCustomer, existingEmployee, bookingStart.getTime(), bookingEnd.getTime(),
				"pending", service);
	
		List<Booking> bookings = new ArrayList<Booking>();
		bookings.add(bookingMade);
		when(bookingRepository.findAllByEmployeeId(4)).thenReturn(bookings);
		when(bookingRepository.save(any(Booking.class))).thenReturn(bookingMade);
		
		//Act
		Optional<Booking> booking = bookingService.cancelBooking(4, 1, bookingStart.getTime(),bookingEnd.getTime(), 1);
		
		//Assert
		assertFalse(booking.isPresent());			
	}
	
	@Test
	public void findAvailableTimesByDateAndEmployee_NoWorkingTimes_ReturnsEmptyListOfTimes()
	{
		//Arrange
		// get 12am 4 days from today    
		Calendar bookingStart = new GregorianCalendar();
		bookingStart.set(Calendar.HOUR_OF_DAY, 0);
		bookingStart.set(Calendar.MINUTE, 0);
		bookingStart.set(Calendar.SECOND, 0);
		bookingStart.set(Calendar.MILLISECOND, 0);
		bookingStart.add(Calendar.DAY_OF_MONTH, 1);
		 
		List<WorkingTime> emptyWT = new ArrayList<WorkingTime>();
		when(employeeRepository.findById(4)).thenReturn(Optional.of(existingEmployee));
		when(workingTimeRepository.findAllByEmployeeId(4)).thenReturn(emptyWT);
		
		//Act
		List<String> times = bookingService.findAvailableTimesByDateAndEmployee(4, bookingStart.getTime());
		
		//Assert
		assertTrue(times.isEmpty());			
	}
	
	@Test
	public void findAvailableTimesByDateAndEmployee_FreeDay_ReturnsListOfTimes()
	{
		//Arrange
		Calendar workStartTime = new GregorianCalendar();
		workStartTime.set(Calendar.HOUR_OF_DAY, 0);
		workStartTime.set(Calendar.MINUTE, 0);
		workStartTime.set(Calendar.SECOND, 0);
		workStartTime.set(Calendar.MILLISECOND, 0);
		workStartTime.add(Calendar.DAY_OF_MONTH, 4);
		 
	 	Calendar workEndTime = (Calendar)workStartTime.clone(); 
	 	workEndTime.add(Calendar.HOUR_OF_DAY, 9);
		
		List<Booking> bookings = new ArrayList<Booking>();
		
		List<WorkingTime> workingTimes = new ArrayList<WorkingTime>();
		workingTimes.add(new WorkingTime(existingEmployee, workStartTime.getTime(), workEndTime.getTime()));
		
		when(employeeRepository.findById(4)).thenReturn(Optional.of(existingEmployee));
		when(bookingRepository.findAllByEmployeeId(4)).thenReturn(bookings);
		when(workingTimeRepository.findAllByEmployeeId(4)).thenReturn(workingTimes);
		
		//Act
		List<String> times = bookingService.findAvailableTimesByDateAndEmployee(4, workStartTime.getTime());
		
		//Assert - there are 9 slots still free
		assertEquals(9, times.size());			
	}
	
	@Test
	public void findAvailableTimesByDateAndEmployee_SomeSlotsTaken_ReturnsListOfTimes()
	{
		//Arrange - 12am in 4 days time
		Calendar workStartTime = new GregorianCalendar();
		workStartTime.set(Calendar.HOUR_OF_DAY, 0);
		workStartTime.set(Calendar.MINUTE, 0);
		workStartTime.set(Calendar.SECOND, 0);
		workStartTime.set(Calendar.MILLISECOND, 0);
		workStartTime.add(Calendar.DAY_OF_MONTH, 4);	 
	 	Calendar workEndTime = (Calendar)workStartTime.clone(); 
	 	workEndTime.add(Calendar.HOUR_OF_DAY, 9);
	 	
		Calendar bookingStartTime = (Calendar)workStartTime.clone();
		bookingStartTime.set(Calendar.HOUR_OF_DAY, 3);
	 	Calendar bookingEndTime = (Calendar)bookingStartTime.clone(); 
	 	bookingEndTime.add(Calendar.HOUR_OF_DAY, 2);
		
		List<Booking> bookings = new ArrayList<Booking>();
		
		List<WorkingTime> workingTimes = new ArrayList<WorkingTime>();
		workingTimes.add(new WorkingTime(existingEmployee, workStartTime.getTime(), workEndTime.getTime()));
		
		Booking bookingMade = new Booking(existingCustomer, existingEmployee, bookingStartTime.getTime(), bookingEndTime.getTime(),
				"pending", service);
		bookings.add(bookingMade);
		
		when(employeeRepository.findById(4)).thenReturn(Optional.of(existingEmployee));
		when(bookingRepository.findAllByEmployeeId(4)).thenReturn(bookings);
		when(workingTimeRepository.findAllByEmployeeId(4)).thenReturn(workingTimes);
			
		//Act
		List<String> times = bookingService.findAvailableTimesByDateAndEmployee(4, workStartTime.getTime());
		
		//Assert 12-9, but booking has 2 hr slot so only 7 slots left
		assertEquals(7, times.size());			
	}
	
}
