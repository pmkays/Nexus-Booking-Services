package SEPT.Team.Seven.service;

import java.util.ArrayList;
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

	private final String PENDING = "pending";

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
					if (!(newStartCal.compareTo(endCal) >= 0 || newEndCal.compareTo(cal) <= 0)
							&& booking.getStatus().equals(PENDING)) {
						// so if these conditions are not meant, we'll return empty.
						return Optional.empty();
					}
				}
			}

			// Check that the employee doesn't already have an overlapping booking
			// THIS CODE IS REPEATED FOR THE CUSTOMERS BOOKINGS. could probably move into
			// own method
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
					// or it ends before the booking starts. Also only consider this booking if it's
					// accepted.
					if (!(newStartCal.compareTo(endCal) >= 0 || newEndCal.compareTo(cal) <= 0)
							&& booking.getStatus().equals(PENDING)) {
						// so if these conditions are not meant, we'll return empty.
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
						if (ServiceUTIL.checkTimeWithin(workingTimeStart.getTime(), newStartCal.getTime(),
								newEndCal.getTime(), workingTimeEnd.getTime())) {
							return Optional.of(
									bookingRepository.save(new Booking(customerRepository.findById(customerId).get(),
											employeeRepository.findById(employeeId).get(), startTime, endTime, PENDING,
											serviceRepository.findById(serviceId).get())));

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
			if (ServiceUTIL.checkTimeWithin(startTime, booking.getStartTime(), booking.getEndTime(), endTime)) {
				toReturn.add(booking);
			}
		}

		return toReturn;
	}

	// this is the exact same as the method above. Could be extrapolated into own
	// helper
	// method once refactoring
	public List<Booking> findBookingsByCustomerAndDate(int customerId, Date startTime, Date endTime) {
		List<Booking> toReturn = new ArrayList<Booking>();
		List<Booking> bookings = bookingRepository.findAllByCustomerId(customerId);

		for (Booking booking : bookings) {
			if (ServiceUTIL.checkTimeWithin(startTime, booking.getStartTime(), booking.getEndTime(), endTime)) {
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
			if (ServiceUTIL.checkTimeWithin(startTime, booking.getStartTime(), booking.getEndTime(), endTime)) {
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
		List<Booking> bookings = bookingRepository.findAllByEmployeeId(employeeId);
		for (Booking booking : bookings) {
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

	public Optional<Booking> getBookingById(int id) {
		return bookingRepository.findById(id);
	}

	public List<String> findAvailableTimesByDateAndEmployee(int employeeId, Date date) {
		// first we find the working time on this date that the employee has.
		List<String> times = new ArrayList<String>();

		if (employeeRepository.findById(employeeId).isPresent()) {

			Calendar cal = Calendar.getInstance();
			cal.setTime(date);

			for (WorkingTime workingTime : workingTimeRepository.findAllByEmployeeId(employeeId)) {
				Calendar workingTimeStart = Calendar.getInstance();
				workingTimeStart.setTime(workingTime.getStartTime());

				// find the employee's working time on this day.
				if (workingTimeStart.get(Calendar.DATE) == cal.get(Calendar.DATE)
						&& workingTimeStart.get(Calendar.MONTH) == cal.get(Calendar.MONTH)
						&& workingTimeStart.get(Calendar.YEAR) == cal.get(Calendar.YEAR)) {

					int start = workingTimeStart.get(Calendar.HOUR_OF_DAY);

					Calendar workingTimeEnd = Calendar.getInstance();
					workingTimeEnd.setTime(workingTime.getEndTime());

					int end = workingTimeEnd.get(Calendar.HOUR_OF_DAY);
					
					if (end == 0) {
						end = 24;
					}

					boolean hourIsAvailable = true;

					// starting from the starting hour of the working time, check every
					// hour and ensure they do not already have a booking on that hour.
					// bookings are only allowed every hour which is why we can do it this way.
					for (int i = start; i < end; ++i) {

						hourIsAvailable = true;

						Calendar hourCalendar = Calendar.getInstance();
						hourCalendar.setTime(date);
						hourCalendar.add(Calendar.HOUR_OF_DAY, i);

						for (Booking booking : bookingRepository.findAllByEmployeeId(employeeId)) {
							Calendar bookingStart = Calendar.getInstance();
							bookingStart.setTime(booking.getStartTime());

							Calendar bookingEnd = Calendar.getInstance();
							bookingEnd.setTime(booking.getEndTime());

							// only consider bookings on the day and that are pending
							if (bookingStart.get(Calendar.DATE) == cal.get(Calendar.DATE)
									&& bookingStart.get(Calendar.MONTH) == cal.get(Calendar.MONTH)
									&& bookingStart.get(Calendar.YEAR) == cal.get(Calendar.YEAR)
									&& booking.getStatus().equals(PENDING)) {

								// if the hour is within a booking's start and endtime, it's not available.
								// invalid if current hour is after a bookings start time and also before its
								// end time.
								if (hourCalendar.getTime().compareTo(bookingStart.getTime()) >= 0
										&& hourCalendar.getTime().compareTo(bookingEnd.getTime()) < 0) {
									hourIsAvailable = false;
									break;
								}
							}
						}

						// now if the hour is available, we add it to the list of strings in the format
						// we need for frontend.
						if (hourIsAvailable) {
							String hour = "";
							if (i < 10) {
								hour = "0";
							}

							String time = hour + i + ":00";

							times.add(time);

						}
					}

					return times;
				}
			}

			return times;
		}

		return times;
	}
	
	public Optional<Booking> completeBooking(int employeeId, int customerId, Date startTime, Date endTime,
			int serviceId) {

		Optional<Booking> toReturn = Optional.empty();
		List<Booking> bookings = bookingRepository.findAllByEmployeeId(employeeId);
		for (Booking booking : bookings) {
			if (booking.getCustomer().getId() == customerId && booking.getStartTime().compareTo(startTime) == 0
					&& booking.getEndTime().compareTo(endTime) == 0 && booking.getService().getId() == serviceId) {
				Calendar present = Calendar.getInstance();
				// check that the booking is in the past
				if (present.getTime().compareTo(endTime) >= 0) {
					booking.setStatus("complete");
					bookingRepository.save(booking);
					toReturn = Optional.of(booking);
					break;
				}
			}
		}
		return toReturn;
	}

}
