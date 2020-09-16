package SEPT.Team.Seven.serviceTests;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;


import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import SEPT.Team.Seven.model.Availability;
import SEPT.Team.Seven.model.Employee;
import SEPT.Team.Seven.repo.AvailabilityRepository;
import SEPT.Team.Seven.repo.EmployeeRepository;
import SEPT.Team.Seven.service.EmployeeService;

@SpringBootTest
public class EmployeeServiceTest {
	
	@Mock
	private EmployeeRepository employeeRepository;
	
	@Mock
	private AvailabilityRepository availabilityRepository;
	
	@InjectMocks
	private EmployeeService service; 
	
	private static Employee employee;
	
	private static List<Availability> availabilities;
	
	@BeforeAll
	public static void setUp() 
	{
		Calendar startNextMonth = Calendar.getInstance();
		Calendar endNextMonth = Calendar.getInstance(); 
		startNextMonth.add(Calendar.DATE, 5);
		endNextMonth.add(Calendar.DATE, 6);
		
		Calendar startNextMonth2 = Calendar.getInstance();
		Calendar endNextMonth2 = Calendar.getInstance(); 
		startNextMonth2.add(Calendar.DATE, 8);
		endNextMonth2.add(Calendar.DATE, 9);
		
		employee = new Employee(); 
		employee.setId(4);
		availabilities = new ArrayList<Availability>();
		availabilities.add(new Availability(employee, startNextMonth.getTime(), endNextMonth.getTime()));
		availabilities.add(new Availability(employee, startNextMonth2.getTime(), endNextMonth2.getTime()));	
	}
	
	@Test
	public void getNext7DaysAvailabilitiesById_ValidEmployeeId_ReturnsAvailabilities()
	{		
		//Arrange
		when(employeeRepository.findById(4)).thenReturn(Optional.of(employee));
		when(availabilityRepository.findAllByEmployeeId(4)).thenReturn(availabilities);
		
		//Act
		List<Availability> avails = service.getNext7DaysAvailabilitiesById(4);
		
		//Assert
		//should only be 1 as the other one is outside of 7 days
		assertEquals(1, avails.size());
	}
	
	@Test
	public void getNext7DaysAvailabilitiesById_InvalidEmployeeId_ReturnsEmptyList()
	{		
		//Arrange
		when(employeeRepository.findById(8)).thenReturn(Optional.empty());
		
		//Act
		List<Availability> avails = service.getNext7DaysAvailabilitiesById(4);
		
		//Assert
		assertEquals(0, avails.size());
	}

}
