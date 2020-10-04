package SEPT.Team.Seven.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import SEPT.Team.Seven.model.Availability;
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

	public Optional<Booking> addBooking(int employeeId, int customerId, Date startTime, Date endTime, int serviceId) {

		System.out.println(startTime);
		System.out.println(endTime);

		if (startTime == null || endTime == null) {
			return Optional.empty();
		}

		if (!serviceRepository.findById(serviceId).isPresent()) {
			return Optional.empty();
		}

		// ensure that the customer and employee actually exist
		if (employeeRepository.findById(employeeId).isPresent()
				&& customerRepository.findById(customerId).isPresent()) {

			// now check that a customer doesn't have a booking on that day already that
			// overlaps
			List<Booking> customersBookings = bookingRepository.findAllByCustomerId(customerId);
			Calendar newStartCal = Calendar.getInstance();
			newStartCal.setTime(startTime);
			Calendar newEndCal = Calendar.getInstance();
			newEndCal.setTime(endTime);

			for (Booking booking : customersBookings) {
				Calendar cal = Calendar.getInstance();
				Calendar endCal = Calendar.getInstance();
				cal.setTime(booking.getStartTime());
				endCal.setTime(booking.getEndTime());

				if (cal.get(Calendar.DATE) == newStartCal.get(Calendar.DATE)
						&& cal.get(Calendar.MONTH) == newStartCal.get(Calendar.MONTH)
						&& cal.get(Calendar.YEAR) == newStartCal.get(Calendar.YEAR)) {
					// now we have to check that the times dont overlap
					// so this is checking that the new start is after the booking is done,
					// or it ends before the booking starts.
					if (!(newStartCal.compareTo(endCal) >= 0 || newEndCal.compareTo(cal) <= 0) && booking.getStatus().equals("accepted")) {
						// so if these conditions are not meant, we'll return empty.
						System.out.println("IS ACCEPTED: " + booking.getStatus().equals("accepted"));
						System.out.println("BOOKING ID: " + booking.getId());
						System.out.println("OVERLAPS WITH ANOTHER BOOKING");
						return Optional.empty();
					}
				}
			}
			
			// Check that the employee doesn't already have an overlapping booking
			// THIS CODE IS REPEATED FOR THE CUSTOMERS BOOKINGS. could probably move into own method
			// when REFACTORING
			List<Booking> employeesBookings = bookingRepository.findAllByEmployeeId(employeeId);
			for (Booking booking : employeesBookings) {
				Calendar cal = Calendar.getInstance();
				Calendar endCal = Calendar.getInstance();
				cal.setTime(booking.getStartTime());
				endCal.setTime(booking.getEndTime());

				if (cal.get(Calendar.DATE) == newStartCal.get(Calendar.DATE)
						&& cal.get(Calendar.MONTH) == newStartCal.get(Calendar.MONTH)
						&& cal.get(Calendar.YEAR) == newStartCal.get(Calendar.YEAR)) {
					// now we have to check that the times dont overlap
					// so this is checking that the new start is after the booking is done,
					// or it ends before the booking starts. Also only consider this booking if it's accepted.
					if (!(newStartCal.compareTo(endCal) >= 0 || newEndCal.compareTo(cal) <= 0) && booking.getStatus().equals("accepted")) {
						// so if these conditions are not meant, we'll return empty.
						System.out.println("OVERLAPS WITH ANOTHER BOOKING");
						return Optional.empty();
					}
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
				if (workingTimeStart.get(Calendar.DATE) == newStartCal.get(Calendar.DATE)
						&& workingTimeStart.get(Calendar.MONTH) == newStartCal.get(Calendar.MONTH)
						&& workingTimeStart.get(Calendar.YEAR) == newStartCal.get(Calendar.YEAR)) {

					if (newStartCal.before(newEndCal)) {

						// Check that the booking is actually within the working time
						boolean startValid = newStartCal.compareTo(workingTimeStart) >= 0
								&& newStartCal.compareTo(workingTimeEnd) <= 0;
						boolean endValid = newEndCal.compareTo(workingTimeStart) >= 0
								&& newEndCal.compareTo(workingTimeEnd) <= 0;

						if (startValid && endValid) {
							return Optional.of(
									bookingRepository.save(new Booking(customerRepository.findById(customerId).get(),
											employeeRepository.findById(employeeId).get(), startTime, endTime,
											"accepted", serviceRepository.findById(serviceId).get())));

						}

					}

				}

			}

		}

		return Optional.empty();
	}

	public List<Booking> findBookingsByEmployeeAndDate(int employeeId, Date startTime, Date endTime) {
		List<Booking> toReturn = new ArrayList<Booking>();
		List<Booking> bookings = bookingRepository.findAllByEmployeeId(employeeId);
		
		for (Booking booking : bookings) {
			boolean startValid = booking.getStartTime().compareTo(startTime) >= 0
					&& booking.getStartTime().compareTo(endTime) <= 0;
			boolean endValid = booking.getEndTime().compareTo(startTime) >= 0
					&& booking.getEndTime().compareTo(endTime) <= 0;
			if (startValid && endValid) {
				toReturn.add(booking);
			}
		}
		
		return toReturn;
	}
	
	// this is the exact same as the method above. Could be extrapolated into own helper
	// method once refactoring
	public List<Booking> findBookingsByCustomerAndDate(int customerId, Date startTime, Date endTime) {
		List<Booking> toReturn = new ArrayList<Booking>();
		List<Booking> bookings = bookingRepository.findAllByCustomerId(customerId);
		
		for (Booking booking : bookings) {
			boolean startValid = booking.getStartTime().compareTo(startTime) >= 0
					&& booking.getStartTime().compareTo(endTime) <= 0;
			boolean endValid = booking.getEndTime().compareTo(startTime) >= 0
					&& booking.getEndTime().compareTo(endTime) <= 0;
			if (startValid && endValid) {
				toReturn.add(booking);
			}
		}
		
		return toReturn;
	}
	
	// same deal with this.
	public List<Booking> findBookingsByDate(Date startTime, Date endTime) {
		List<Booking> toReturn = new ArrayList<Booking>();
		List<Booking> bookings = bookingRepository.findAll();
		
		for (Booking booking : bookings) {
			boolean startValid = booking.getStartTime().compareTo(startTime) >= 0
					&& booking.getStartTime().compareTo(endTime) <= 0;
			boolean endValid = booking.getEndTime().compareTo(startTime) >= 0
					&& booking.getEndTime().compareTo(endTime) <= 0;
			if (startValid && endValid) {
				toReturn.add(booking);
			}
		}
		
		return toReturn;
	}

	public List<Booking> getAllBookings() {
		return bookingRepository.findAll();
	}
	
	public Optional<Booking> cancelBooking(int employeeId, int customerId, Date startTime, Date endTime,
			int serviceId) {
		
		Optional<Booking> toReturn = Optional.empty();
		
		for (Booking booking : bookingRepository.findAllByEmployeeId(employeeId)) {
			if (booking.getCustomer().getId() == customerId && booking.getStartTime().compareTo(startTime) == 0
					&& booking.getEndTime().compareTo(endTime) == 0 && booking.getService().getId() == serviceId) {
				Calendar TwoDaysInFuture = Calendar.getInstance();
				TwoDaysInFuture.add(Calendar.DATE, 2);
				// check that the booking is after 2 days from the current time
				if (TwoDaysInFuture.getTime().compareTo(startTime) < 0) {
					booking.setStatus("cancelled");
					bookingRepository.save(booking);
					toReturn = Optional.of(booking);
					break;
				}
			}
		}
		return toReturn;
	}



}


