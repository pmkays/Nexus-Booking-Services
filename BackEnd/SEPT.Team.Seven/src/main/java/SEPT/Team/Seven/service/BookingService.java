package SEPT.Team.Seven.service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import SEPT.Team.Seven.model.Booking;
import SEPT.Team.Seven.model.WorkingTime;
import SEPT.Team.Seven.repo.BookingRepository;
import SEPT.Team.Seven.repo.CustomerRepository;
import SEPT.Team.Seven.repo.EmployeeRepository;
import SEPT.Team.Seven.repo.ServiceRepository;
import SEPT.Team.Seven.repo.WorkingTimeRepository;

@Service
public class BookingService {

	private BookingRepository bookingRepository;
	private WorkingTimeRepository workingTimeRepository;
	private EmployeeRepository employeeRepository;
	private CustomerRepository customerRepository;
	private ServiceRepository serviceRepository;

	public BookingService(BookingRepository bookingRepository, WorkingTimeRepository workingTimeRepository, 
			EmployeeRepository employeeRepository, CustomerRepository customerRepository, 
			ServiceRepository serviceRepository) {
		this.workingTimeRepository = workingTimeRepository;
		this.employeeRepository = employeeRepository;
		this.customerRepository = customerRepository;
		this.serviceRepository = serviceRepository;
		this.bookingRepository = bookingRepository;
	}

	public List<Booking> getBookingsForCustomer(int customerId) {
		List<Booking> bookings = bookingRepository.findAllByCustomerId(customerId);
		return bookings;
	}

	public List<Booking> getBookingsForEmployee(int employeeId) {
		List<Booking> bookings = bookingRepository.findAllByEmployeeId(employeeId);
		return bookings;
	}

	public Optional<Booking> addBooking(int employeeId, int customerId, Date startTime, Date endTime,
			int serviceId) {
		
		if (startTime == null || endTime == null) {
			return Optional.empty();
		}
		
		if (!serviceRepository.findById(serviceId).isPresent()) {
			return Optional.empty();
		}

		// ensure that the customer and employee actually exist
		if (employeeRepository.findById(employeeId).isPresent() &&
				customerRepository.findById(customerId).isPresent()) {
			
			// now check that a customer doesn't have a booking on that day already			
			List<Booking> customersBookings = bookingRepository.findAllByCustomerId(customerId);
			Calendar newStartCal = Calendar.getInstance();
			newStartCal.setTime(startTime);
			Calendar newEndCal = Calendar.getInstance();
			newEndCal.setTime(endTime);
			
			for (Booking booking : customersBookings) {
				Calendar cal = Calendar.getInstance();
				cal.setTime(booking.getStartTime());
				
				if (cal.get(Calendar.DATE) == newStartCal.get(Calendar.DATE) &&
						cal.get(Calendar.MONTH) == newStartCal.get(Calendar.MONTH) &&
						cal.get(Calendar.YEAR) == newStartCal.get(Calendar.YEAR)) {
					return Optional.empty();
				}
			}
			
			// now check that the booking is within the employee's working times
			List<WorkingTime> employeesWorkingTimes = workingTimeRepository.findAllByEmployeeId(employeeId);
			
			for (WorkingTime workingTime : employeesWorkingTimes) {
				Calendar workingTimeStart = Calendar.getInstance();
				workingTimeStart.setTime(workingTime.getStartTime());
				Calendar workingTimeEnd = Calendar.getInstance();
				workingTimeEnd.setTime(workingTime.getEndTime());
				
				// The employee has a working time on this date
				if (workingTimeStart.get(Calendar.DATE) == newStartCal.get(Calendar.DATE) &&
						workingTimeStart.get(Calendar.MONTH) == newStartCal.get(Calendar.MONTH) &&
						workingTimeStart.get(Calendar.YEAR) == newStartCal.get(Calendar.YEAR)) {
					
					if (newStartCal.before(newEndCal)) {
						
						// Check that the booking is actually within the working time
						boolean startValid = newStartCal.compareTo(workingTimeStart) >= 0 && newStartCal.compareTo(workingTimeEnd) <= 0;
						boolean endValid = newEndCal.compareTo(workingTimeStart) >= 0 && newEndCal.compareTo(workingTimeEnd) <= 0;
						
						if (startValid && endValid) {
							return Optional.of(bookingRepository.save(
									new Booking(customerRepository.findById(customerId).get(),
											employeeRepository.findById(employeeId).get(),
											startTime, endTime, "accepted",
											serviceRepository.findById(serviceId).get())));
							
						}
						
					}
					
				}
				
				
			}
			
			
		}

		return Optional.empty();
	}

}
