package SEPT.Team.Seven.serviceTests;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import SEPT.Team.Seven.model.Availability;
import SEPT.Team.Seven.model.Employee;
import SEPT.Team.Seven.model.WorkingTime;
import SEPT.Team.Seven.repo.AvailabilityRepository;
import SEPT.Team.Seven.repo.EmployeeRepository;
import SEPT.Team.Seven.repo.WorkingTimeRepository;
import SEPT.Team.Seven.service.WorkingTimeService;

@SpringBootTest
public class WorkingTimeServiceTest {
	
	@Mock
	private EmployeeRepository employeeRepository;
	
	@Mock
	private WorkingTimeRepository workingTimeRepository;
	
	@Mock
	private AvailabilityRepository availabilityRepository;
	
	@InjectMocks
	private WorkingTimeService service; 
	
	private static Employee employee;
	
	private static List<Availability> availabilities;
	
	private static List<WorkingTime> workingTimes;
	
	@BeforeAll
	public static void setUp() {
		
		//setup all the necessary time-related variables
		Calendar startNextMonth = Calendar.getInstance();
		Calendar endNextMonth = Calendar.getInstance(); 
		startNextMonth.add(Calendar.DATE, 15);
		startNextMonth.add(Calendar.HOUR, 1);
		endNextMonth.add(Calendar.DATE, 16);
		endNextMonth.add(Calendar.HOUR, -1);

		
		Calendar startAvail2 = Calendar.getInstance();
		Calendar endAvail2 = Calendar.getInstance(); 
		startAvail2.add(Calendar.DATE, 17);
		startAvail2.add(Calendar.MINUTE, 1);
		endAvail2.add(Calendar.DATE, 18);
		endAvail2.add(Calendar.MINUTE, -1);
		
		employee = new Employee(); 
		
		//set up 2 availabilities
		availabilities = new ArrayList<Availability>();
		Availability availabilityPresent = new Availability(employee, startNextMonth.getTime(), endNextMonth.getTime());
		Availability availabilityPresent2 = new Availability(employee, startAvail2.getTime(), endAvail2.getTime());
		availabilities.add(availabilityPresent);
		availabilities.add(availabilityPresent2);
		
		//set up a working time that corresponds with one of the 2 availabilities
		workingTimes = new ArrayList<WorkingTime>();
		WorkingTime wtPresent = new WorkingTime(employee, startNextMonth.getTime(), endNextMonth.getTime());
		workingTimes.add(wtPresent);
		
	}
	
	@Test
	public void addWorkingTime_ValidDates_ReturnsTheWorkingTime()
	{	
		//Arrange
		
		//start in 17 days, 2 hrs after midnight
		Calendar start = Calendar.getInstance(); 
		start.add(Calendar.DATE, 17);
		start.add(Calendar.MINUTE, 2);
		
		//end 5 hours before the midnight the next day, i.e. 17 hr shift
		Calendar end = Calendar.getInstance(); 
		end.add(Calendar.DATE, 18);
		end.add(Calendar.MINUTE, -2);
		WorkingTime workingTimeToAdd = new WorkingTime(employee, start.getTime(), end.getTime());
		
		when(workingTimeRepository.save(any(WorkingTime.class))).thenReturn(workingTimeToAdd);
		when(workingTimeRepository.findAllByEmployeeId(4)).thenReturn(workingTimes);
		when(employeeRepository.findById(4)).thenReturn(Optional.of(employee));
		when(availabilityRepository.findAllByEmployeeId(4)).thenReturn(availabilities);
		//Act
		Optional<WorkingTime> result = service.addWorkingTime(4, start.getTime(), end.getTime());
		
		//Assert
		assertTrue(result.isPresent()); 
		
	}
	
	@Test
	public void addWorkingTime_InvalidDate_WorkingTimeNotPresent()
	{
		
		//Arrange
		Calendar start = Calendar.getInstance(); 
		Calendar end = Calendar.getInstance(); 
		start.add(Calendar.DATE, 18);
		end.add(Calendar.DATE, 17);
		
		//start time can't be after end time
		WorkingTime workingTimeToAdd = new WorkingTime(employee, start.getTime(), end.getTime());
		
		when(workingTimeRepository.save(any(WorkingTime.class))).thenReturn(workingTimeToAdd);
		when(workingTimeRepository.findAllByEmployeeId(4)).thenReturn(workingTimes);
		when(employeeRepository.findById(4)).thenReturn(Optional.of(employee));
		when(availabilityRepository.findAllByEmployeeId(4)).thenReturn(availabilities);

		//Act
		Optional<WorkingTime> result = service.addWorkingTime(4, start.getTime(), end.getTime());
		
		//Assert
		assertFalse(result.isPresent()); 
		
	}
	
	@Test
	public void addWorkingTime_WorkingTimeOutsideOfAvailability_WorkingTimeNotPresent()
	{
		
		//Arrange
		Calendar start = Calendar.getInstance(); 
		Calendar end = Calendar.getInstance(); 
		start.add(Calendar.DATE, 5);
		end.add(Calendar.DATE, 6);
		WorkingTime workingTimeToAdd = new WorkingTime(employee, start.getTime(), end.getTime());
		
		when(workingTimeRepository.save(any(WorkingTime.class))).thenReturn(workingTimeToAdd);
		when(workingTimeRepository.findAllByEmployeeId(4)).thenReturn(workingTimes);
		when(employeeRepository.findById(4)).thenReturn(Optional.of(employee));
		when(availabilityRepository.findAllByEmployeeId(4)).thenReturn(availabilities);

		//Act
		Optional<WorkingTime> result = service.addWorkingTime(4, start.getTime(), end.getTime());
		
		//Assert
		assertFalse(result.isPresent()); 
		
	}
	
	@Test
	public void addWorkingTime_WorkingTimeAlreadyExists_WorkingTimeNotPresent()
	{
		
		//Arrange
		Calendar start = Calendar.getInstance(); 
		Calendar end = Calendar.getInstance(); 
		start.add(Calendar.DATE, 15);
		end.add(Calendar.DATE, 16);
		WorkingTime workingTimeToAdd = new WorkingTime(employee, start.getTime(), end.getTime());
		
		when(workingTimeRepository.save(any(WorkingTime.class))).thenReturn(workingTimeToAdd);
		when(workingTimeRepository.findAllByEmployeeId(4)).thenReturn(workingTimes);
		when(employeeRepository.findById(4)).thenReturn(Optional.of(employee));
		when(availabilityRepository.findAllByEmployeeId(4)).thenReturn(availabilities);

		//Act
		Optional<WorkingTime> result = service.addWorkingTime(4, start.getTime(), end.getTime());
		
		//Assert
		assertFalse(result.isPresent()); 
		
	}
	
	
	@Test
	public void addWorkingTime_NullDates_WorkingTimeNotPresent()
	{
		//Arrange & //Act
		Optional<WorkingTime> result = service.addWorkingTime(4, null, null);
		
		//Assert
		assertTrue(!result.isPresent()); 		
	}

}
