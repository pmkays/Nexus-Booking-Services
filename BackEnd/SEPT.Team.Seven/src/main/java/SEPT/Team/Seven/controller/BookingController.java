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
import SEPT.Team.Seven.model.DTO.BookingDTO;
import SEPT.Team.Seven.model.DTO.CustomerTimeDTO;
import SEPT.Team.Seven.model.DTO.EmployeeDateDTO;
import SEPT.Team.Seven.model.DTO.EmployeeTimeDTO;
import SEPT.Team.Seven.model.DTO.TimeDTO;
import SEPT.Team.Seven.service.BookingService;

@RestController
@RequestMapping("/api/booking")
public class BookingController {

	@Autowired
	private BookingService bookingService;
	
	@CrossOrigin(origins = "*", allowedHeaders = "*")
	@GetMapping("/{id}")
	public Booking getBookingById(@PathVariable("id") int id) {
		return bookingService.getBookingById(id).orElseThrow(()->
	       new HttpServerErrorException(HttpStatus.FORBIDDEN, "Error retrieving booking."));
	}
	
	@CrossOrigin(origins = "*", allowedHeaders = "*")
	@GetMapping("/customer/{id}")
	public List<Booking> getBookingsForCustomer(@PathVariable("id") int id) {
		List<Booking> bookings = bookingService.getBookingsForCustomer(id);
		return bookings;
	}
	
	@CrossOrigin(origins = "*", allowedHeaders = "*")
	@GetMapping("/employee/{id}")
	public List<Booking> getBookingsForEmployee(@PathVariable("id") int id) {
		List<Booking> bookings = bookingService.getBookingsForEmployee(id);
		return bookings;
	}
	
	@CrossOrigin(origins = "*", allowedHeaders = "*")
	@GetMapping("/admin")
	public List<Booking> getAllBookings() {
		List<Booking> bookings = bookingService.getAllBookings();
		return bookings;
	}
	
	@CrossOrigin(origins = "*", allowedHeaders = "*")
    @PostMapping()
    public Booking addBooking(@RequestBody BookingDTO bookingDto) {
       return bookingService.addBooking(bookingDto.getEmployeeId(), bookingDto.getCustomerId(),
    		   bookingDto.getStartTime(), bookingDto.getEndTime(), bookingDto.getServiceId()).orElseThrow(()->
       new HttpServerErrorException(HttpStatus.FORBIDDEN, "Error adding booking."));
    }
	
	@CrossOrigin(origins = "*", allowedHeaders = "*")
    @PostMapping("/cancel")
    public Booking cancelBooking(@RequestBody BookingDTO bookingDto) {
       return bookingService.cancelBooking(bookingDto.getEmployeeId(), bookingDto.getCustomerId(),
    		   bookingDto.getStartTime(), bookingDto.getEndTime(), bookingDto.getServiceId()).orElseThrow(()->
       new HttpServerErrorException(HttpStatus.FORBIDDEN, "Error cancelling booking."));
    }
	
	@CrossOrigin(origins = "*", allowedHeaders = "*")
    @PostMapping("/complete")
    public Booking completeBooking(@RequestBody BookingDTO bookingDto) {
       return bookingService.completeBooking(bookingDto.getEmployeeId(), bookingDto.getCustomerId(),
    		   bookingDto.getStartTime(), bookingDto.getEndTime(), bookingDto.getServiceId()).orElseThrow(()->
       new HttpServerErrorException(HttpStatus.FORBIDDEN, "Error completing booking."));
    }
	
	@CrossOrigin(origins = "*", allowedHeaders = "*")
	@PostMapping("/employee/findAllByDate")
	public List<Booking> findBookingsByEmployeeAndDate(@RequestBody EmployeeTimeDTO employeeTimeDTO) {
		return bookingService.findBookingsByEmployeeAndDate(employeeTimeDTO.getEmployeeId(),
				employeeTimeDTO.getStartTime(), employeeTimeDTO.getEndTime());
	}
	
	@CrossOrigin(origins = "*", allowedHeaders = "*")
	@PostMapping("/customer/findAllByDate")
	public List<Booking> findBookingsByCustomerAndDate(@RequestBody CustomerTimeDTO customerTimeDTO) {
		return bookingService.findBookingsByCustomerAndDate(customerTimeDTO.getCustomerId(),
				customerTimeDTO.getStartTime(), customerTimeDTO.getEndTime());
	}
	
	@CrossOrigin(origins = "*", allowedHeaders = "*")
	@PostMapping("/findAllByDate")
	public List<Booking> findBookingsDate(@RequestBody TimeDTO timeDTO) {
		return bookingService.findBookingsByDate(
				timeDTO.getStartTime(), timeDTO.getEndTime());
	}
	
	@CrossOrigin(origins = "*", allowedHeaders = "*")
	@PostMapping("/findAvailable")
	public List<String> findAvailableTimesByDateAndEmployee(@RequestBody EmployeeDateDTO employeeDateDTO) {
		return bookingService.findAvailableTimesByDateAndEmployee(
				employeeDateDTO.getEmployeeId(), employeeDateDTO.getDate());
	}
	
	
	
}
