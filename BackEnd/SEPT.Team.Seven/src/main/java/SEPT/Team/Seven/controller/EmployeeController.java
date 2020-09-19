package SEPT.Team.Seven.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpServerErrorException;

import SEPT.Team.Seven.model.Availability;
import SEPT.Team.Seven.model.Service;
import SEPT.Team.Seven.model.DTO.ServiceDTO;
import SEPT.Team.Seven.service.EmployeeService;

@RestController
@RequestMapping("/api/employee")
public class EmployeeController {
	
	@Autowired
	private EmployeeService employeeService;
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/next7DaysAvai/{id}")
	public List<Availability> getNext7DaysAvailabilitiesById(@PathVariable("id") int id) {
		List<Availability> availabilities = employeeService.getNext7DaysAvailabilitiesById(id);
		return availabilities;
	}
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/services")
	public Service addServiceById(@RequestBody ServiceDTO serviceDTO) {
	    return employeeService.addServiceByName(serviceDTO.getEmployeeId(), serviceDTO.getServiceName()).orElseThrow(()->
	    new HttpServerErrorException(HttpStatus.FORBIDDEN, "Error adding service for employee."));
	}
	
	
}
