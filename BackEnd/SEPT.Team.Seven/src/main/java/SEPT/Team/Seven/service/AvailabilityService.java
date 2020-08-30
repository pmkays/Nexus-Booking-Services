package SEPT.Team.Seven.service;

import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import SEPT.Team.Seven.model.Availability;
import SEPT.Team.Seven.model.Employee;
import SEPT.Team.Seven.repo.AvailabilityRepository;
import SEPT.Team.Seven.repo.EmployeeRepository;

@Service
public class AvailabilityService {
	
	private AvailabilityRepository availabilityRepository;
	
	private EmployeeRepository employeeRepository;
	
	@Autowired
	public AvailabilityService(AvailabilityRepository availabilityRepository, EmployeeRepository employeeRepository) {
		this.availabilityRepository = availabilityRepository;
		this.employeeRepository = employeeRepository;
	}
	
	public Optional<Availability> addAvailability(Employee employee, Date startTime, Date endTime) {
		if (availabilityRepository.findByEmployeeId(employee.getId()).isPresent()) {
			System.out.println("yeet");
		}
		return Optional.empty();
	}

}
