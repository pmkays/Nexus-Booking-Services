package SEPT.Team.Seven.service;

import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
	
	public Optional<WorkingTime> addWorkingTime(Employee employee, Date startTime, Date endTime) {
//		if (workingTimeRepository.findByEmployeeId(employee.getId()).isPresent()) {
//			System.out.println("yeet");
//		}
		return Optional.of(workingTimeRepository.save
                (new WorkingTime(employee, startTime, endTime)));
	}

}
