package SEPT.Team.Seven.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpServerErrorException;

import SEPT.Team.Seven.model.Availability;
import SEPT.Team.Seven.model.DTO.TimeDto;
import SEPT.Team.Seven.service.AvailabilityService;

@RestController
@RequestMapping("/api/availability")
public class AvailabilityController {
	
	@Autowired
	private AvailabilityService availabilityService;
	
	@CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/add")
    public Availability addAvailability(@RequestBody TimeDto timeDto) {
       return availabilityService.addAvailability(timeDto.getEmployee(), timeDto.getStartTime(), timeDto.getEndTime()).orElseThrow(()->
       new HttpServerErrorException(HttpStatus.FORBIDDEN, "Error adding availability."));
    }

}
