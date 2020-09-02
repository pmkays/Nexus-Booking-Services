package SEPT.Team.Seven.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import SEPT.Team.Seven.model.Availability;
import SEPT.Team.Seven.model.Employee;
import SEPT.Team.Seven.model.User;
import SEPT.Team.Seven.model.WorkingTime;
import SEPT.Team.Seven.repo.EmployeeRepository;
import SEPT.Team.Seven.repo.WorkingTimeRepository;

@Service
public class WorkingTimeService {
	
	private WorkingTimeRepository workingTimeRepository;
	
	private EmployeeRepository employeeRepository;
	
	@Autowired
	public WorkingTimeService(WorkingTimeRepository workingTimeRepository, EmployeeRepository employeeRepository) {
		this.workingTimeRepository = workingTimeRepository;
		this.employeeRepository = employeeRepository;
	}
	
	public List<WorkingTime> getWorkingTimesForEmployee(int employeeId) {
		List<WorkingTime> workingTimes = workingTimeRepository.findAllByEmployeeId(employeeId);
		return workingTimes;
	}
	
	public Optional<WorkingTime> addWorkingTime(int employeeId, Date startTime, Date endTime) {
		if (employeeRepository.findById(employeeId).isPresent()) {
			if (startTime.before(endTime)) {
				return Optional.of(workingTimeRepository.save
		                (new WorkingTime(employeeRepository.findById(employeeId).get(), startTime, endTime)));
			}
		}
		return Optional.empty();
	}

}
