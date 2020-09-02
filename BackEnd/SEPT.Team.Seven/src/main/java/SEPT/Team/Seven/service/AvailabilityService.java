package SEPT.Team.Seven.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import SEPT.Team.Seven.model.Availability;
import SEPT.Team.Seven.model.Employee;
import SEPT.Team.Seven.model.WorkingTime;
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
	
	public Optional<Availability> addAvailability(int employeeId, Date startTime, Date endTime) {
		System.out.println("error");
		if (employeeRepository.findById(employeeId).isPresent()) {
			if (startTime.before(endTime)) {
				return Optional.of(availabilityRepository.save
		                (new Availability(employeeRepository.findById(employeeId).get(), startTime, endTime)));
			}
		}
		return Optional.empty();
	}
	
	public List<Availability> getAvailabilitiesForEmployee(int employeeId) {
		List<Availability> availabilities = availabilityRepository.findAllByEmployeeId(employeeId);
		return availabilities;
	}

}
