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

import SEPT.Team.Seven.model.Booking;
import SEPT.Team.Seven.model.DTO.BookingDto;
import SEPT.Team.Seven.service.BookingService;

@RestController
@RequestMapping("/api/booking")
public class BookingController {

	@Autowired
	private BookingService bookingService;
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/customer/{id}")
	public List<Booking> getBookingsForCustomer(@PathVariable("id") int id) {
		List<Booking> bookings = bookingService.getBookingsForCustomer(id);
		return bookings;
	}
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/employee/{id}")
	public List<Booking> getBookingsForEmployee(@PathVariable("id") int id) {
		List<Booking> bookings = bookingService.getBookingsForEmployee(id);
		return bookings;
	}
	
	@CrossOrigin(origins = "http://localhost:3000")
    @PostMapping()
    public Booking addBooking(@RequestBody BookingDto bookingDto) {
       return bookingService.addBooking(bookingDto.getEmployeeId(), bookingDto.getCustomerId(),
    		   bookingDto.getStartTime(), bookingDto.getEndTime(), bookingDto.getServiceId()).orElseThrow(()->
       new HttpServerErrorException(HttpStatus.FORBIDDEN, "Error adding booking."));
    }
	
}
