package SEPT.Team.Seven.service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import SEPT.Team.Seven.model.Availability;
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
	
	public Optional<Availability> addAvailability(int employeeId, Date startTime, Date endTime){
		
		if (startTime == null || endTime == null) {
			return Optional.empty();
		}
		
		if (employeeRepository.findById(employeeId).isPresent()) {
			
			List<Availability> employeesAvailabilities = availabilityRepository.findAllByEmployeeId(employeeId);
			Calendar newStartCalendar = Calendar.getInstance();
			newStartCalendar.setTime(startTime);			
			
			for (Availability availability : employeesAvailabilities) {
				
				Calendar cal = Calendar.getInstance();
				cal.setTime(availability.getStartTime());	
				
				// The employee already has a shift on this day
				if (cal.get(Calendar.DATE) == newStartCalendar.get(Calendar.DATE) &&
						cal.get(Calendar.MONTH) == newStartCalendar.get(Calendar.MONTH) &&
						cal.get(Calendar.YEAR) == newStartCalendar.get(Calendar.YEAR)) {
					return Optional.empty();
				}
			}
			if (startTime.before(endTime)) {
				Calendar after24Hours = newStartCalendar;
				after24Hours.add(Calendar.DAY_OF_MONTH, 1);
				// ensures that the endTime is within a day of the start time.
				if (endTime.compareTo(after24Hours.getTime()) <= 0) {
					return Optional.of(availabilityRepository.save
			                (new Availability(employeeRepository.findById(employeeId).get(), startTime, endTime)));
				}
			}
		}
		return Optional.empty();
	}
	
	public List<Availability> getAvailabilitiesForEmployee(int employeeId) {
		List<Availability> availabilities = availabilityRepository.findAllByEmployeeId(employeeId);
		return availabilities;
	}
	

}
