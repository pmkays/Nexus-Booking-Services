package SEPT.Team.Seven.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import SEPT.Team.Seven.model.Service;
import SEPT.Team.Seven.model.DTO.BookingDateDTO;
import SEPT.Team.Seven.service.ServiceService;

@RestController
@RequestMapping("/api/service")
public class ServiceController {
	
	@Autowired
	private ServiceService serviceService;
	
	@CrossOrigin(origins = "*", allowedHeaders = "*")
	@PostMapping("/findAllByDate")
	public List<Service> findServiceByDate(@RequestBody BookingDateDTO bookingDateDTO) {
		return serviceService.findServiceByDate(bookingDateDTO.getStartTime());
	}
	
}
