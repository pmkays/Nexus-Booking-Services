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
import SEPT.Team.Seven.model.DTO.EmployeeTimeDTO;
import SEPT.Team.Seven.service.AvailabilityService;

@RestController
@RequestMapping("/api/availability")
public class AvailabilityController {
	
	@Autowired
	private AvailabilityService availabilityService;
	
	@CrossOrigin(origins = "*", allowedHeaders = "*")
	@GetMapping("/employee/{id}")
	public List<Availability> getAvailabilitiesForEmployee(@PathVariable("id") int id) {
		List<Availability> availabilities = availabilityService.getAvailabilitiesForEmployee(id);
		return availabilities;
	}
	
	@CrossOrigin(origins = "*", allowedHeaders = "*")
    @PostMapping()
    public Availability addAvailability(@RequestBody EmployeeTimeDTO timeDto) {
       return availabilityService.addAvailability(timeDto.getEmployeeId(), timeDto.getStartTime(), timeDto.getEndTime()).orElseThrow(()->
       new HttpServerErrorException(HttpStatus.FORBIDDEN, "Error adding availability."));
    }

}
