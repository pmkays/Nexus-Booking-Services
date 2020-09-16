package SEPT.Team.Seven.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import org.springframework.stereotype.Service;

import SEPT.Team.Seven.model.Availability;
import SEPT.Team.Seven.repo.AvailabilityRepository;
import SEPT.Team.Seven.repo.EmployeeRepository;
import SEPT.Team.Seven.repo.ServiceRepository;

@Service
public class EmployeeService {

	private EmployeeRepository employeeRepository;
	private AvailabilityRepository availabilityRepository;
	
	public EmployeeService(EmployeeRepository employeeRepository, AvailabilityRepository availabilityRepository,
			ServiceRepository serviceRepository) {
		this.employeeRepository = employeeRepository;
		this.availabilityRepository = availabilityRepository;
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
}
