package SEPT.Team.Seven.serviceTests;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.List;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import SEPT.Team.Seven.model.Employee;
import SEPT.Team.Seven.model.Service;
import SEPT.Team.Seven.model.WorkingTime;
import SEPT.Team.Seven.repo.AvailabilityRepository;
import SEPT.Team.Seven.repo.EmployeeRepository;
import SEPT.Team.Seven.repo.ServiceRepository;
import SEPT.Team.Seven.repo.WorkingTimeRepository;
import SEPT.Team.Seven.service.ServiceService;

import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;


@SpringBootTest
public class ServiceServiceTest 
{
	@Mock
	private AvailabilityRepository availabilityRepository;
	
	@Mock
	private WorkingTimeRepository workingTimeRepository;
	
	@Mock
	private EmployeeRepository employeeRepository;
	
	@Mock
	private ServiceRepository serviceRepository;
	
	@InjectMocks
	private ServiceService serviceService; 
	
	private static Employee existingEmployee1; 
	private static Employee existingEmployee2; 
	
	private static List<Employee> existingEmployees;
	
	private static List<WorkingTime> workingTimesEmployee1;
	private static List<WorkingTime> workingTimesEmployee2;
		
	@BeforeAll
	public static void setUp()
	{
		Service service1 = new Service("Manicure", "someUrl", "some description");
		Service service2 = new Service("Pedicure", "someUrl", "some description");
		Service service3 = new Service("Salon", "someUrl", "some description");
		Service service4 = new Service("Spa", "someUrl", "some description");
		
		existingEmployee1 = new Employee("Yuri", "Detrov", "yuri@hotmail.com", "1234567891", "some address", "fake img url", "some description");
		existingEmployee1.setId(4);
		existingEmployee1.addToServices(service1);
		existingEmployee1.addToServices(service2);
		
		existingEmployee2 = new Employee("Sammy", "Detrov", "sammy@hotmail.com", "1234567891", "some address", "fake img url", "some description");
		existingEmployee2.setId(5);
		existingEmployee2.addToServices(service3);
		existingEmployee2.addToServices(service4);
		
		existingEmployees = new ArrayList<Employee>();
		existingEmployees.add(existingEmployee1);
		existingEmployees.add(existingEmployee2);
		
		/*
		 * Visualisation: Assume TODAY is Monday and WTs are within 7 days: 
		 * WT1: Wednesday 12-3 (+2 days)
		 * WT2: Saturday 12-5 (+5 days)
		 * WT3: Wednesday 12-8 (+2 days)
		 * WT4: Friday 12-8 (+4 days)
		 * WT5: Thursday 12-4 (+3 days)
		 */
		
		Calendar wtStart1 = new GregorianCalendar();
		wtStart1.set(Calendar.HOUR_OF_DAY, 0);
		wtStart1.set(Calendar.MINUTE, 0);
		wtStart1.set(Calendar.SECOND, 0);
		wtStart1.set(Calendar.MILLISECOND, 0);
		wtStart1.add(Calendar.DAY_OF_MONTH, 2); // +2 days 
		 
	 	Calendar wtEnd1 = (Calendar)wtStart1.clone(); 
	 	wtEnd1.add(Calendar.HOUR_OF_DAY, 3); //12-3 shift
	 	
	 	Calendar wtStart2 = (Calendar)wtStart1.clone();
	 	wtStart2.add(Calendar.DAY_OF_MONTH, 3);	// +2 +3 = +5 days 	
	 	Calendar wtEnd2 = (Calendar)wtStart2.clone();
	 	wtEnd1.add(Calendar.HOUR_OF_DAY, 5); //12-5 shift
	 	
	 	Calendar wtStart3 = (Calendar)wtStart1.clone();// +2 days since copied from wtStart1
	 	Calendar wtEnd3 = (Calendar)wtStart3.clone();
	 	wtEnd3.add(Calendar.HOUR_OF_DAY, 8); //12-8 shift
	 	
	 	Calendar wtStart4 = (Calendar)wtStart1.clone();
	 	wtStart4.add(Calendar.DAY_OF_MONTH, 2); // +2 +3 = +4 days 
	 	Calendar wtEnd4 = (Calendar)wtStart4.clone();
	 	wtEnd4.add(Calendar.HOUR_OF_DAY, 8); //12-8 shift
	 	
	 	Calendar wtStart5 = (Calendar)wtStart1.clone();
	 	wtStart5.add(Calendar.DAY_OF_MONTH, 1); // +2 +1 = +4 days 
	 	Calendar wtEnd5 = (Calendar)wtStart5.clone();
	 	wtEnd5.add(Calendar.HOUR_OF_DAY, 4); //12-4 shift
		
	 	workingTimesEmployee1 = new ArrayList<WorkingTime>();
		workingTimesEmployee1.add(new WorkingTime(existingEmployee1, wtStart1.getTime(), wtEnd1.getTime()));
		workingTimesEmployee1.add(new WorkingTime(existingEmployee1, wtStart2.getTime(), wtEnd2.getTime()));
		
	 	workingTimesEmployee2 = new ArrayList<WorkingTime>();
		workingTimesEmployee2.add(new WorkingTime(existingEmployee2, wtStart3.getTime(), wtEnd3.getTime()));
		workingTimesEmployee2.add(new WorkingTime(existingEmployee2, wtStart4.getTime(), wtEnd4.getTime()));
		workingTimesEmployee2.add(new WorkingTime(existingEmployee2, wtStart5.getTime(), wtEnd5.getTime()));

	}
	
	@Test
	public void findServiceByDate_NoServicesThisDate_ReturnsEmptyList()
	{
		//Arrange
		Calendar date = new GregorianCalendar();
		date.set(Calendar.HOUR_OF_DAY, 0);
		date.set(Calendar.MINUTE, 0);
		date.set(Calendar.SECOND, 0);
		date.set(Calendar.MILLISECOND, 0);
		date.add(Calendar.DAY_OF_MONTH, 6); // +6 days no WT present
	 	
		when(employeeRepository.findAll()).thenReturn(existingEmployees);
		when(workingTimeRepository.findAllByEmployeeId(4)).thenReturn(workingTimesEmployee1);
		when(workingTimeRepository.findAllByEmployeeId(5)).thenReturn(workingTimesEmployee2);

		
		List<Service> services = serviceService.findServiceByDate(date.getTime());
		
		assertTrue(services.isEmpty());
	}
	
	@Test
	public void findServiceByDate_ServicesPresentThisDateOneEmployee_ReturnsListOfServices()
	{
		Calendar date = new GregorianCalendar();
		date.set(Calendar.HOUR_OF_DAY, 1);
		date.set(Calendar.MINUTE, 0);
		date.set(Calendar.SECOND, 0);
		date.set(Calendar.MILLISECOND, 0);
		date.add(Calendar.DAY_OF_MONTH, 5); // +5 days from now at 1am
		
		when(employeeRepository.findAll()).thenReturn(existingEmployees);
		when(workingTimeRepository.findAllByEmployeeId(4)).thenReturn(workingTimesEmployee1);
		when(workingTimeRepository.findAllByEmployeeId(5)).thenReturn(workingTimesEmployee2);
		
		List<Service> services = serviceService.findServiceByDate(date.getTime());
		
		assertEquals(2, services.size());
		assertTrue(services.stream().anyMatch(x-> x.getName().equals("Manicure")));
		assertTrue(services.stream().anyMatch(x-> x.getName().equals("Pedicure")));

	}
	
	@Test
	public void findServiceByDate_ServicesPresentThisDateMultipleEmployees_ReturnsListOfServices()
	{
		Calendar date = new GregorianCalendar();
		date.set(Calendar.HOUR_OF_DAY, 1);
		date.set(Calendar.MINUTE, 0);
		date.set(Calendar.SECOND, 0);
		date.set(Calendar.MILLISECOND, 0);
		date.add(Calendar.DAY_OF_MONTH, 2); // +2 days from now at 1am
		
		when(employeeRepository.findAll()).thenReturn(existingEmployees);
		when(workingTimeRepository.findAllByEmployeeId(4)).thenReturn(workingTimesEmployee1);
		when(workingTimeRepository.findAllByEmployeeId(5)).thenReturn(workingTimesEmployee2);
		
		List<Service> services = serviceService.findServiceByDate(date.getTime());
		
		assertEquals(4, services.size());
		assertTrue(services.stream().anyMatch(x-> x.getName().equals("Manicure")));
		assertTrue(services.stream().anyMatch(x-> x.getName().equals("Pedicure")));
		assertTrue(services.stream().anyMatch(x-> x.getName().equals("Spa")));
		assertTrue(services.stream().anyMatch(x-> x.getName().equals("Salon")));

	}
	
	@Test
	public void findServiceByDate_NoEmployees_ReturnsEmptyListOfServices()
	{
		Calendar date = new GregorianCalendar();
		date.set(Calendar.HOUR_OF_DAY, 1);
		date.set(Calendar.MINUTE, 0);
		date.set(Calendar.SECOND, 0);
		date.set(Calendar.MILLISECOND, 0);
		date.add(Calendar.DAY_OF_MONTH, 2); // +2 days from now at 1am
		
		List<Employee> empty = new ArrayList<Employee>();
		when(employeeRepository.findAll()).thenReturn(empty);
		
		List<Service> services = serviceService.findServiceByDate(date.getTime());
		
		assertEquals(0, services.size());
	}
	
	@Test
	public void findServiceByDate_NoWorkingTimes_ReturnsEmptyListOfServices()
	{
		Calendar date = new GregorianCalendar();
		date.set(Calendar.HOUR_OF_DAY, 1);
		date.set(Calendar.MINUTE, 0);
		date.set(Calendar.SECOND, 0);
		date.set(Calendar.MILLISECOND, 0);
		date.add(Calendar.DAY_OF_MONTH, 2); // +2 days from now at 1am
		
		List<WorkingTime> emptyWT = new ArrayList<WorkingTime>();

		when(employeeRepository.findAll()).thenReturn(existingEmployees);
		when(workingTimeRepository.findAllByEmployeeId(4)).thenReturn(emptyWT);
		when(workingTimeRepository.findAllByEmployeeId(5)).thenReturn(emptyWT);
		
		List<Service> services = serviceService.findServiceByDate(date.getTime());
		
		assertEquals(0, services.size());
	}

}
