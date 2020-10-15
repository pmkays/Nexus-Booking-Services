package SEPT.Team.Seven.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import SEPT.Team.Seven.model.Availability;
import SEPT.Team.Seven.model.Employee;
import SEPT.Team.Seven.model.WorkingTime;
import SEPT.Team.Seven.repo.AvailabilityRepository;
import SEPT.Team.Seven.repo.EmployeeRepository;
import SEPT.Team.Seven.repo.ServiceRepository;
import SEPT.Team.Seven.repo.WorkingTimeRepository;

@Service
public class EmployeeService {

	private EmployeeRepository employeeRepository;
	private AvailabilityRepository availabilityRepository;
	private ServiceRepository serviceRepository;
	private WorkingTimeRepository workingTimeRepository;

	public EmployeeService(EmployeeRepository employeeRepository, AvailabilityRepository availabilityRepository,
			ServiceRepository serviceRepository, WorkingTimeRepository workingTimeRepository) {
		this.employeeRepository = employeeRepository;
		this.availabilityRepository = availabilityRepository;
		this.serviceRepository = serviceRepository;
		this.workingTimeRepository = workingTimeRepository;
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
					
					//checking if working time on this date already exists for employee
					boolean alreadyExistingWorkingTime = false;

					Calendar availabilityStart = Calendar.getInstance();
					availabilityStart.setTime(availability.getStartTime());

					// check no working time already on this day
					for (WorkingTime workingTime : workingTimeRepository.findAllByEmployeeId(employeeId)) {
						Calendar workingTimeStart = Calendar.getInstance();
						workingTimeStart.setTime(workingTime.getStartTime());
						if (workingTimeStart.get(Calendar.DATE) == availabilityStart.get(Calendar.DATE)
								&& workingTimeStart.get(Calendar.MONTH) == availabilityStart.get(Calendar.MONTH)
								&& workingTimeStart.get(Calendar.YEAR) == availabilityStart.get(Calendar.YEAR)) {
							alreadyExistingWorkingTime = true;
							break;
						}
					}
					
					if (!alreadyExistingWorkingTime) {
						toReturn.add(availability);
					}

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

	public Optional<SEPT.Team.Seven.model.Service> removeServiceByName(int employeeId, String name) {
		// check that the service is actually a service offered in the database
		if (serviceRepository.findByName(name).isPresent()) {
			SEPT.Team.Seven.model.Service serviceToRemove = serviceRepository.findByName(name).get();
			// check that the employee exists
			if (employeeRepository.findById(employeeId).isPresent()) {
				Employee employee = employeeRepository.findById(employeeId).get();
				employee.deleteFromServices(serviceToRemove);

				// Saving the updated employee
				employeeRepository.save(employee);
				return Optional.of(serviceToRemove);
			}
		}

		return Optional.empty();
	}

	public List<Employee> findEmployeeByDate(Date startTime) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(startTime);

		List<Employee> employees = new ArrayList<Employee>();

		// Look for employees that have a working time on this date.
		for (Employee employee : employeeRepository.findAll()) {
			for (WorkingTime workingTime : workingTimeRepository.findAllByEmployeeId(employee.getId())) {
				Calendar workingTimeCal = Calendar.getInstance();
				workingTimeCal.setTime(workingTime.getStartTime());
				if (cal.get(Calendar.DATE) == workingTimeCal.get(Calendar.DATE)
						&& cal.get(Calendar.MONTH) == workingTimeCal.get(Calendar.MONTH)
						&& cal.get(Calendar.YEAR) == workingTimeCal.get(Calendar.YEAR)) {
					// then add them to the list.
					employees.add(employee);
					break;
				}
			}
		}

		return employees;
	}

	public List<Employee> findEmployeesByServiceAndDate(int serviceId, Date startTime) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(startTime);

		List<Employee> employees = new ArrayList<Employee>();

		// Look for employees that have a working time on this date.
		for (Employee employee : employeeRepository.findAll()) {
			for (WorkingTime workingTime : workingTimeRepository.findAllByEmployeeId(employee.getId())) {
				Calendar workingTimeCal = Calendar.getInstance();
				workingTimeCal.setTime(workingTime.getStartTime());
				if (cal.get(Calendar.DATE) == workingTimeCal.get(Calendar.DATE)
						&& cal.get(Calendar.MONTH) == workingTimeCal.get(Calendar.MONTH)
						&& cal.get(Calendar.YEAR) == workingTimeCal.get(Calendar.YEAR)) {
					// Then check if this employee has the service passed in.
					for (SEPT.Team.Seven.model.Service service : employee.getServices()) {
						if (service.getId() == serviceId) {
							// if they have the service, add them to the list.
							if (!employees.contains(employee)) {
								employees.add(employee);
								break;
							}
						}
					}

					break;
				}
			}
		}

		return employees;
	}
}
