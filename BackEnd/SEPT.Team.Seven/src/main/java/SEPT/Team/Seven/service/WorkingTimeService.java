package SEPT.Team.Seven.service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import SEPT.Team.Seven.model.Availability;
import SEPT.Team.Seven.model.Booking;
import SEPT.Team.Seven.model.WorkingTime;
import SEPT.Team.Seven.repo.AvailabilityRepository;
import SEPT.Team.Seven.repo.BookingRepository;
import SEPT.Team.Seven.repo.EmployeeRepository;
import SEPT.Team.Seven.repo.WorkingTimeRepository;

@Service
public class WorkingTimeService {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(WorkingTimeService.class);

	private WorkingTimeRepository workingTimeRepository;

	private AvailabilityRepository availabilityRepository;

	private EmployeeRepository employeeRepository;

	private BookingRepository bookingRepository;

	@Autowired
	public WorkingTimeService(WorkingTimeRepository workingTimeRepository, EmployeeRepository employeeRepository,
			AvailabilityRepository availabilityRepository, BookingRepository bookingRepository) {
		this.workingTimeRepository = workingTimeRepository;
		this.employeeRepository = employeeRepository;
		this.availabilityRepository = availabilityRepository;
		this.bookingRepository = bookingRepository;
	}

	public List<WorkingTime> getWorkingTimesForEmployee(int employeeId) {
		List<WorkingTime> workingTimes = workingTimeRepository.findAllByEmployeeId(employeeId);
		return workingTimes;
	}

	public Optional<WorkingTime> addWorkingTime(int employeeId, Date startTime, Date endTime) {

		if (startTime == null || endTime == null) {
			return Optional.empty();
		}

		if (employeeRepository.findById(employeeId).isPresent()) {

			// First checking if the employee already has a working time on this day.
			LOGGER.info("Employee is present");

			List<WorkingTime> employeesWorkingTimes = workingTimeRepository.findAllByEmployeeId(employeeId);
			Calendar newStartCalendar = Calendar.getInstance();
			newStartCalendar.setTime(startTime);

			Calendar endCalendar = Calendar.getInstance();
			endCalendar.setTime(endTime);

			for (WorkingTime workingTime : employeesWorkingTimes) {

				Calendar cal = Calendar.getInstance();
				cal.setTime(workingTime.getStartTime());

				if (cal.get(Calendar.DATE) == newStartCalendar.get(Calendar.DATE)
						&& cal.get(Calendar.MONTH) == newStartCalendar.get(Calendar.MONTH)
						&& cal.get(Calendar.YEAR) == newStartCalendar.get(Calendar.YEAR)) {
					LOGGER.info("Already has a working time on this day.");
					LOGGER.info("Working Time ID: " + workingTime.getId());
					return Optional.empty();
				}
			}

			// Now checking to see if the working time is within their availabilities
			List<Availability> employeesAvailabilities = availabilityRepository.findAllByEmployeeId(employeeId);

			for (Availability availability : employeesAvailabilities) {

				// Calendars for the availability
				Calendar startCal = Calendar.getInstance();
				startCal.setTime(availability.getStartTime());
				Calendar endCal = Calendar.getInstance();
				endCal.setTime(availability.getEndTime());

				// The employee has an availability on this day.
				if (startCal.get(Calendar.DATE) == newStartCalendar.get(Calendar.DATE)
						&& startCal.get(Calendar.MONTH) == newStartCalendar.get(Calendar.MONTH)
						&& startCal.get(Calendar.YEAR) == newStartCalendar.get(Calendar.YEAR)) {
					if (startTime.before(endTime)) {
						Calendar after24Hours = Calendar.getInstance();
						after24Hours.setTime(startTime);
						after24Hours.add(Calendar.DAY_OF_MONTH, 1);
						// ensures that the endTime is within a day of the start time.
						if (endTime.compareTo(after24Hours.getTime()) <= 0) {
							// Check that the working time is actually within the availability
							if (ServiceUTIL.checkTimeWithin(startCal.getTime(), startTime, endTime, endCal.getTime())) {
								return Optional.of(workingTimeRepository.save(new WorkingTime(
										employeeRepository.findById(employeeId).get(), startTime, endTime)));
							}

						}
					}
				}
			}
			LOGGER.info("No availability");
		}
		return Optional.empty();
	}

	public Optional<WorkingTime> editWorkingTime(int workingTimeId, Date startTime, Date endTime) {

		Calendar newStartCalendar = Calendar.getInstance();
		newStartCalendar.setTime(startTime);

		// first we find the workingTime
		if (workingTimeRepository.findById(workingTimeId).isPresent()) {
			WorkingTime workingTime = workingTimeRepository.findById(workingTimeId).get();

			// Check that this new edited date is still the same as the old date.
			// Only times are allowed to be different.

			Calendar oldStartCalendar = Calendar.getInstance();
			oldStartCalendar.setTime(workingTime.getStartTime());

			if (oldStartCalendar.get(Calendar.DATE) == newStartCalendar.get(Calendar.DATE)
					&& oldStartCalendar.get(Calendar.MONTH) == newStartCalendar.get(Calendar.MONTH)
					&& oldStartCalendar.get(Calendar.YEAR) == newStartCalendar.get(Calendar.YEAR)) {

				// Now check that it is still within the availability.

				for (Availability availability : availabilityRepository.findAll()) {
					Calendar availabilityStartCal = Calendar.getInstance();
					availabilityStartCal.setTime(availability.getStartTime());

					Calendar availabilityEndCal = Calendar.getInstance();
					availabilityEndCal.setTime(availability.getEndTime());

					if (newStartCalendar.get(Calendar.DATE) == availabilityStartCal.get(Calendar.DATE)
							&& newStartCalendar.get(Calendar.MONTH) == availabilityStartCal.get(Calendar.MONTH)
							&& newStartCalendar.get(Calendar.YEAR) == availabilityStartCal.get(Calendar.YEAR)) {

						// now we need to make sure the dates are valid.
						// so check that the start time is at most a day before the endtime

						if (startTime.before(endTime)) {

							Calendar after24Hours = Calendar.getInstance();
							after24Hours.setTime(startTime);
							after24Hours.add(Calendar.DAY_OF_MONTH, 1);

							if (endTime.compareTo(after24Hours.getTime()) <= 0) {

								// Check that the working time is actually within the availability
								if (ServiceUTIL.checkTimeWithin(availabilityStartCal.getTime(), startTime, endTime,
										availabilityEndCal.getTime())) {

									// Now we have to check that this change won't mess up any bookings.
									// ie, make them go over a working time.

									for (Booking booking : bookingRepository
											.findAllByEmployeeId(workingTime.getEmployee().getId())) {

										// only consider bookings on the same date.

										Calendar bookingStartCal = Calendar.getInstance();
										bookingStartCal.setTime(booking.getStartTime());

										if (newStartCalendar.get(Calendar.DATE) == bookingStartCal.get(Calendar.DATE)
												&& newStartCalendar.get(Calendar.MONTH) == bookingStartCal
														.get(Calendar.MONTH)
												&& newStartCalendar.get(Calendar.YEAR) == bookingStartCal
														.get(Calendar.YEAR)
												&& booking.getStatus().equals("pending")) {

											LOGGER.info("Booking being checked against new working time: "
													+ booking.getId());

											boolean bookingStartValid = booking.getStartTime().compareTo(startTime) >= 0
													&& booking.getStartTime().compareTo(endTime) <= 0;
											boolean bookingEndValid = booking.getEndTime().compareTo(startTime) >= 0
													&& booking.getEndTime().compareTo(endTime) <= 0;

											if (!bookingStartValid || !bookingEndValid) {

												LOGGER.info(
														"One of the bookings are affected by the new working times");
												LOGGER.info("That is, booking with ID: " + booking.getId());
												return Optional.empty();
											}

										}
									}

									// if this is reached, then all the checks pass and the working time is valid.
									workingTime.setStartTime(startTime);
									workingTime.setEndTime(endTime);

									workingTimeRepository.save(workingTime);
									return Optional.of(workingTime);

								} else {
									LOGGER.info("The new working times are not within the availabilities");
									return Optional.empty();
								}

							} else {
								LOGGER.info("Start time is not at most 24 hours before the end time");
								return Optional.empty();
							}
						}

					}
				}

			} else {
				LOGGER.info("The edited date is different to the old one. This is not allowed.");
				return Optional.empty();
			}

		}

		return Optional.empty();
	}

}
