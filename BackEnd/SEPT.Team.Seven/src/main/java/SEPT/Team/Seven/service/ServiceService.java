package SEPT.Team.Seven.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Service;

import SEPT.Team.Seven.model.Employee;
import SEPT.Team.Seven.model.WorkingTime;
import SEPT.Team.Seven.repo.EmployeeRepository;
import SEPT.Team.Seven.repo.WorkingTimeRepository;

@Service
public class ServiceService {

	private EmployeeRepository employeeRepository;
	private WorkingTimeRepository workingTimeRepository;

	public ServiceService(EmployeeRepository employeeRepository, WorkingTimeRepository workingTimeRepository) {
		this.employeeRepository = employeeRepository;
		this.workingTimeRepository = workingTimeRepository;
	}

	public List<SEPT.Team.Seven.model.Service> findServiceByDate(Date startTime) {
		// TODO Auto-generated method stub
		Calendar cal = Calendar.getInstance();
		cal.setTime(startTime);

		List<SEPT.Team.Seven.model.Service> services = new ArrayList<SEPT.Team.Seven.model.Service>();

		// Look for employees that have a working time on this date.
		for (Employee employee : employeeRepository.findAll()) {
			for (WorkingTime workingTime : workingTimeRepository.findAllByEmployeeId(employee.getId())) {
				Calendar workingTimeCal = Calendar.getInstance();
				workingTimeCal.setTime(workingTime.getStartTime());
				if (cal.get(Calendar.DATE) == workingTimeCal.get(Calendar.DATE)
						&& cal.get(Calendar.MONTH) == workingTimeCal.get(Calendar.MONTH)
						&& cal.get(Calendar.YEAR) == workingTimeCal.get(Calendar.YEAR)) {
					// then add all their services to the list
					for (SEPT.Team.Seven.model.Service service : employee.getServices()) {
						if (!services.contains(service)) {
							services.add(service);
						}
					}
					
					// break out of inner for loop and check next employee
					break;
				}
			}
		}

		return services;
	}
	
	
}
