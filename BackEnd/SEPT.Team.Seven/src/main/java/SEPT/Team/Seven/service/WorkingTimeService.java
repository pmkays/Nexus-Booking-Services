package SEPT.Team.Seven.service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import SEPT.Team.Seven.model.Availability;

import SEPT.Team.Seven.model.WorkingTime;
import SEPT.Team.Seven.repo.AvailabilityRepository;
import SEPT.Team.Seven.repo.EmployeeRepository;
import SEPT.Team.Seven.repo.WorkingTimeRepository;

@Service
public class WorkingTimeService {
	
	private WorkingTimeRepository workingTimeRepository;
	
	private AvailabilityRepository availabilityRepository;
	
	private EmployeeRepository employeeRepository;
	
	@Autowired
	public WorkingTimeService(WorkingTimeRepository workingTimeRepository, EmployeeRepository employeeRepository,
			AvailabilityRepository availabilityRepository) {
		this.workingTimeRepository = workingTimeRepository;
		this.employeeRepository = employeeRepository;
		this.availabilityRepository = availabilityRepository;
	}
	
	public List<WorkingTime> getWorkingTimesForEmployee(int employeeId) {
		List<WorkingTime> workingTimes = workingTimeRepository.findAllByEmployeeId(employeeId);
		return workingTimes;
	}
	
	public Optional<WorkingTime> addWorkingTime(int employeeId, Date startTime, Date endTime){
		
		if (startTime == null || endTime == null) {
			return Optional.empty();
		}
		
		if (employeeRepository.findById(employeeId).isPresent()) {
			
			// First checking if the employee already has a working time on this day.
			
			List<WorkingTime> employeesWorkingTimes = workingTimeRepository.findAllByEmployeeId(employeeId);
			Calendar newStartCalendar = Calendar.getInstance();
			newStartCalendar.setTime(startTime);	
			
			Calendar endCalendar = Calendar.getInstance();
			endCalendar.setTime(endTime);		
			
			for (WorkingTime workingTime : employeesWorkingTimes) {
				
				Calendar cal = Calendar.getInstance();
				cal.setTime(workingTime.getStartTime());	
				
				if (cal.get(Calendar.DATE) == newStartCalendar.get(Calendar.DATE) &&
						cal.get(Calendar.MONTH) == newStartCalendar.get(Calendar.MONTH) &&
						cal.get(Calendar.YEAR) == newStartCalendar.get(Calendar.YEAR)) {
					return Optional.empty();
				}
			}
			
			// Now checking to see if the working time is within their availabilities
			List<Availability> employeesAvailabilities = availabilityRepository.findAllByEmployeeId(employeeId);		
			
			for (Availability availability : employeesAvailabilities) {
				
				// Calendars for the availability
				Calendar startCal = Calendar.getInstance();
				startCal.setTime(availability.getStartTime());
				Calendar endCal = Calendar.getInstance();
				endCal.setTime(availability.getEndTime());
				
				// The employee has an availability on this day.
				if (startCal.get(Calendar.DATE) == newStartCalendar.get(Calendar.DATE) &&
						startCal.get(Calendar.MONTH) == newStartCalendar.get(Calendar.MONTH) &&
								startCal.get(Calendar.YEAR) == newStartCalendar.get(Calendar.YEAR)) {
					if (startTime.before(endTime)) {
						Calendar after24Hours = newStartCalendar;
						after24Hours.add(Calendar.DAY_OF_MONTH, 1);
						// ensures that the endTime is within a day of the start time.
						if (endTime.compareTo(after24Hours.getTime()) <= 0) {
							// Check that the working time is actually within the availability
							boolean startValid = startTime.compareTo(startCal.getTime()) >= 0 && startTime.compareTo(endCal.getTime()) <= 0;
							boolean endValid = endTime.compareTo(startCal.getTime()) >= 0 && endTime.compareTo(endCal.getTime()) <= 0;
							if (startValid && endValid) {
								return Optional.of(workingTimeRepository.save
						                (new WorkingTime(employeeRepository.findById(employeeId).get(), startTime, endTime)));
							}
							
						}
					}
				}
			}
		}
		return Optional.empty();
	}

}
