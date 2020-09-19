package SEPT.Team.Seven.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Optional;

import org.hibernate.internal.util.beans.BeanInfoHelper.ReturningBeanInfoDelegate;
import org.springframework.stereotype.Service;

import SEPT.Team.Seven.model.Availability;
import SEPT.Team.Seven.model.Employee;
import SEPT.Team.Seven.repo.AvailabilityRepository;
import SEPT.Team.Seven.repo.EmployeeRepository;
import SEPT.Team.Seven.repo.ServiceRepository;

@Service
public class EmployeeService {

	private EmployeeRepository employeeRepository;
	private AvailabilityRepository availabilityRepository;
	private ServiceRepository serviceRepository;
	
	public EmployeeService(EmployeeRepository employeeRepository, AvailabilityRepository availabilityRepository,
			ServiceRepository serviceRepository) {
		this.employeeRepository = employeeRepository;
		this.availabilityRepository = availabilityRepository;
		this.serviceRepository = serviceRepository;
	}
	
	public List<Availability> getNext7DaysAvailabilitiesById(int employeeId) {
		
		List<Availability> toReturn = new ArrayList<Availability>();
		// Check if employee Exists
		if (employeeRepository.findById(employeeId).isPresent()) {
			// Get all availabilities for that employee
			List<Availability> availabilities = availabilityRepository.findAllByEmployeeId(employeeId);
			Calendar weekInFuture = Calendar.getInstance();
			weekInFuture.add(Calendar.DATE, 7);
			
			// Check each availability and if before a week from now add to toReturn list.
			for (Availability availability : availabilities) {
				int timediff = availability.getStartTime().compareTo(weekInFuture.getTime());
				if (timediff <= 0) {
					toReturn.add(availability);
				}
			}
		}
		
		return toReturn;
		
	}

	public Optional<SEPT.Team.Seven.model.Service> addServiceByName(int employeeId, String name) {
		// check that the service is actually a service offered in the database
		if (serviceRepository.findByName(name).isPresent()) {
			SEPT.Team.Seven.model.Service serviceToAdd = serviceRepository.findByName(name).get();
			// check that the employee exists
			if (employeeRepository.findById(employeeId).isPresent()) {
				Employee employee = employeeRepository.findById(employeeId).get();
				employee.addToServices(serviceToAdd);
				
				// Saving the updated employee
				employeeRepository.save(employee);
				return Optional.of(serviceToAdd);
			}
		}

		return Optional.empty();
	}
}
