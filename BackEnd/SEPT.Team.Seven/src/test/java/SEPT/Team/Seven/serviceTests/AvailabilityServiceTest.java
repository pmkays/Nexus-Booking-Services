package SEPT.Team.Seven.serviceTests;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;
import static org.junit.jupiter.api.Assertions.assertTrue;


import java.util.ArrayList;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.List;

import SEPT.Team.Seven.model.Availability;
import SEPT.Team.Seven.model.Employee;
import SEPT.Team.Seven.repo.AvailabilityRepository;
import SEPT.Team.Seven.repo.EmployeeRepository;
import SEPT.Team.Seven.service.AvailabilityService;

@SpringBootTest
public class AvailabilityServiceTest {
	
	@Mock
	private EmployeeRepository employeeRepository;
	
	@Mock
	private AvailabilityRepository availabilityRepository;
	
	@InjectMocks
	private AvailabilityService service; 
	
	private static Employee employee;
	
	private static List<Availability> availabilities;
	
	@BeforeAll
	public static void setUp() {
		Calendar startNextMonth = Calendar.getInstance();
		Calendar endNextMonth = Calendar.getInstance(); 
		startNextMonth.add(Calendar.DATE, 15);
		endNextMonth.add(Calendar.DATE, 16);
		
		employee = new Employee(); 
		availabilities = new ArrayList<Availability>();
		Availability availabilityPresent = new Availability(employee, startNextMonth.getTime(), endNextMonth.getTime());
		availabilities.add(availabilityPresent);	
		
	}
	
	@Test
	public void addAvailability_ValidDates_ReturnsTheNewAvailability()
	{	
		//Arrange
		// get 12am 2 days from today    
		Calendar start = new GregorianCalendar();
		start.set(Calendar.HOUR_OF_DAY, 0);
		start.set(Calendar.MINUTE, 0);
		start.set(Calendar.SECOND, 0);
		start.set(Calendar.MILLISECOND, 0);
		start.add(Calendar.DAY_OF_MONTH, 2);
		Calendar end = (Calendar)start.clone(); 
	 	end.add(Calendar.HOUR_OF_DAY, 3);

		Availability availabilityToAdd = new Availability(employee, start.getTime(), end.getTime());
		
		when(availabilityRepository.save(any(Availability.class))).thenReturn(availabilityToAdd);
		when(employeeRepository.findById(4)).thenReturn(Optional.of(employee));
		when(availabilityRepository.findAllByEmployeeId(4)).thenReturn(availabilities);

		//Act
		Optional<Availability> result = service.addAvailability(4, start.getTime(), end.getTime());
		
		//Assert
		assertTrue(result.isPresent()); 
		
	}
	
	@Test
	public void addAvailability_InvalidDates_AvailabilityNotPresent()
	{
		
		//Arrange
		Calendar start = Calendar.getInstance(); 
		Calendar end = Calendar.getInstance(); 
		start.add(Calendar.DATE, 2);
		end.add(Calendar.DATE, 1);
		Availability availabilityToAdd = new Availability(employee, start.getTime(), end.getTime());
		
		when(availabilityRepository.save(any(Availability.class))).thenReturn(availabilityToAdd);
		when(employeeRepository.findById(4)).thenReturn(Optional.of(employee));
		when(availabilityRepository.findAllByEmployeeId(4)).thenReturn(availabilities);

		//Act
		Optional<Availability> result = service.addAvailability(4, start.getTime(), end.getTime());
		
		//Assert
		assertTrue(!result.isPresent()); 
		
	}
	
	@Test
	public void addAvailability_AvailabilityAlreadyExists_AvailabilityNotPresent()
	{
		
		//Arrange
		Calendar start = Calendar.getInstance(); 
		Calendar end = Calendar.getInstance(); 
		start.add(Calendar.DATE, 15);
		end.add(Calendar.DATE, 16);
		Availability availabilityToAdd = new Availability(employee, start.getTime(), end.getTime());
		
		when(availabilityRepository.save(any(Availability.class))).thenReturn(availabilityToAdd);
		when(employeeRepository.findById(4)).thenReturn(Optional.of(employee));
		when(availabilityRepository.findAllByEmployeeId(4)).thenReturn(availabilities);

		//Act
		Optional<Availability> result = service.addAvailability(4, start.getTime(), end.getTime());
		
		//Assert
		assertTrue(!result.isPresent()); 
		
	}
	
	@Test
	public void addAvailability_NullDates_AvailabilityNotPresent()
	{
		//Arrange & Act
		Optional<Availability> result = service.addAvailability(4, null, null);
		
		//Assert
		assertTrue(!result.isPresent()); 		
	}
	
	
	

}
