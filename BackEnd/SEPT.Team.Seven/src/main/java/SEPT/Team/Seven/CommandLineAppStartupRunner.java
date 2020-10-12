package SEPT.Team.Seven;

import java.util.Calendar;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import SEPT.Team.Seven.model.Availability;
import SEPT.Team.Seven.model.Booking;
import SEPT.Team.Seven.model.WorkingTime;
import SEPT.Team.Seven.repo.AvailabilityRepository;
import SEPT.Team.Seven.repo.BookingRepository;
import SEPT.Team.Seven.repo.CustomerRepository;
import SEPT.Team.Seven.repo.EmployeeRepository;
import SEPT.Team.Seven.repo.ServiceRepository;
import SEPT.Team.Seven.repo.WorkingTimeRepository;

// just using this class to seed data based on when the backend is deployed
@Component
public class CommandLineAppStartupRunner implements CommandLineRunner {
	@Autowired
	private AvailabilityRepository availabilityRepository;

	@Autowired
	private EmployeeRepository employeeRepository;

	@Autowired
	private ServiceRepository serviceRepository;

	@Autowired
	private BookingRepository bookingRepository;

	@Autowired
	private CustomerRepository customerRepository;

	@Autowired
	private WorkingTimeRepository workingTimeRepository;

	@Override
	public void run(String... args) throws Exception {
		System.out.println("Filling seeded data");
		fillSeededData();
		System.out.println("Finished");

	}

	private void fillSeededData() {
		// first check if no data has been seeded already. If no data has been seeded,
		// then we'll seed.
		// otherwise leave it.
		List<Availability> availabilities = availabilityRepository.findAllByEmployeeId(4);

		if (!availabilities.isEmpty()) {
			System.out.println("Data already seeded. Will not seed any more data.");
			return;
		}

		fillPastData();
		
		fillFutureData();
		
	}

	private void fillPastData() {
		Calendar start = Calendar.getInstance();
		Calendar end = Calendar.getInstance();

		start.set(Calendar.HOUR_OF_DAY, 0);
		start.set(Calendar.MINUTE, 0);
		start.set(Calendar.SECOND, 0);

		start.add(Calendar.MONTH, -1);

		end.setTime(start.getTime());
		end.add(Calendar.HOUR_OF_DAY, 9);

		System.out.println(employeeRepository.findById(4).get().getFirstName());

		// for alternating customer and employee ids
		int serviceId = 1;
		int employeeId = 4;
		int customerId = 1;

		for (int i = 1; i < 14; ++i) {
			start.add(Calendar.DATE, 2);
			end.add(Calendar.DATE, 2);

			Calendar bookingTimeStart = Calendar.getInstance();
			Calendar bookingTimeEnd = Calendar.getInstance();
			bookingTimeStart.setTime(start.getTime());
			bookingTimeEnd.setTime(bookingTimeStart.getTime());
			bookingTimeStart.add(Calendar.HOUR_OF_DAY, 1);
			bookingTimeEnd.add(Calendar.HOUR_OF_DAY, 2);

			bookingRepository.save(new Booking(customerRepository.findById(customerId).get(),
					employeeRepository.findById(employeeId).get(), bookingTimeStart.getTime(), bookingTimeEnd.getTime(),
					"completed", serviceRepository.findById(serviceId).get()));

			if (i % 2 == 0) {

				bookingTimeStart.add(Calendar.HOUR_OF_DAY, 1);
				bookingTimeEnd.add(Calendar.HOUR_OF_DAY, 2);

				bookingRepository.save(new Booking(customerRepository.findById(customerId).get(),
						employeeRepository.findById(employeeId).get(), bookingTimeStart.getTime(),
						bookingTimeEnd.getTime(), "completed", serviceRepository.findById(serviceId).get()));
			} else if (i % 3 == 0) {

				bookingRepository.save(new Booking(customerRepository.findById(customerId).get(),
						employeeRepository.findById(employeeId).get(), bookingTimeStart.getTime(),
						bookingTimeEnd.getTime(), "completed", serviceRepository.findById(serviceId).get()));

				bookingTimeStart.add(Calendar.HOUR_OF_DAY, 1);
				bookingTimeEnd.add(Calendar.HOUR_OF_DAY, 2);

				bookingRepository.save(new Booking(customerRepository.findById(customerId).get(),
						employeeRepository.findById(employeeId).get(), bookingTimeStart.getTime(),
						bookingTimeEnd.getTime(), "completed", serviceRepository.findById(serviceId).get()));

				bookingTimeStart.add(Calendar.HOUR_OF_DAY, 1);
				bookingTimeEnd.add(Calendar.HOUR_OF_DAY, 2);

				bookingRepository.save(new Booking(customerRepository.findById(customerId).get(),
						employeeRepository.findById(employeeId).get(), bookingTimeStart.getTime(),
						bookingTimeEnd.getTime(), "completed", serviceRepository.findById(serviceId).get()));

			}

			if (serviceId == 4) {
				serviceId = 1;
			} else {
				++serviceId;
			}

			if (employeeId == 5) {
				employeeId = 4;
			} else {
				++employeeId;
			}
			
			if (customerId == 5) {
				customerId = 1;
			} else {
				++customerId;
			}

		}
	}

	private void fillFutureData() {
		Calendar start = Calendar.getInstance();
		Calendar end = Calendar.getInstance();

		start.set(Calendar.HOUR_OF_DAY, 0);
		start.set(Calendar.MINUTE, 0);
		start.set(Calendar.SECOND, 0);

		end.setTime(start.getTime());
		end.add(Calendar.HOUR_OF_DAY, 22);

		System.out.println(employeeRepository.findById(4).get().getFirstName());

		// for alternating customer and employee ids
		int serviceId = 1;
		int employeeId = 4;
		int customerId = 1;

		for (int i = 1; i < 30; ++i) {
			start.add(Calendar.DATE, 2);
			end.add(Calendar.DATE, 2);

			Calendar workingTimeStart = Calendar.getInstance();
			Calendar workingTimeEnd = Calendar.getInstance();
			workingTimeStart.setTime(start.getTime());
			workingTimeEnd.setTime(end.getTime());
			workingTimeStart.add(Calendar.HOUR_OF_DAY, 1);
			workingTimeEnd.add(Calendar.HOUR_OF_DAY, -1);

			availabilityRepository.save(
					new Availability(employeeRepository.findById(employeeId).get(), start.getTime(), end.getTime()));
			workingTimeRepository.save(new WorkingTime(employeeRepository.findById(employeeId).get(),
					workingTimeStart.getTime(), workingTimeEnd.getTime()));

			Calendar bookingTimeStart = Calendar.getInstance();
			Calendar bookingTimeEnd = Calendar.getInstance();
			bookingTimeStart.setTime(workingTimeStart.getTime());
			bookingTimeEnd.setTime(bookingTimeStart.getTime());
			bookingTimeStart.add(Calendar.HOUR_OF_DAY, 1);
			bookingTimeEnd.add(Calendar.HOUR_OF_DAY, 2);

			bookingRepository.save(new Booking(customerRepository.findById(1).get(),
					employeeRepository.findById(employeeId).get(), bookingTimeStart.getTime(), bookingTimeEnd.getTime(),
					"pending", serviceRepository.findById(serviceId).get()));

			if (i % 2 == 0) {

				bookingTimeStart.add(Calendar.HOUR_OF_DAY, 1);
				bookingTimeEnd.add(Calendar.HOUR_OF_DAY, 2);

				bookingRepository.save(new Booking(customerRepository.findById(customerId).get(),
						employeeRepository.findById(employeeId).get(), bookingTimeStart.getTime(),
						bookingTimeEnd.getTime(), "pending", serviceRepository.findById(serviceId).get()));
			} else if (i % 3 == 0) {

				bookingRepository.save(new Booking(customerRepository.findById(customerId).get(),
						employeeRepository.findById(employeeId).get(), bookingTimeStart.getTime(),
						bookingTimeEnd.getTime(), "pending", serviceRepository.findById(serviceId).get()));

				bookingTimeStart.add(Calendar.HOUR_OF_DAY, 1);
				bookingTimeEnd.add(Calendar.HOUR_OF_DAY, 2);

				bookingRepository.save(new Booking(customerRepository.findById(customerId).get(),
						employeeRepository.findById(employeeId).get(), bookingTimeStart.getTime(),
						bookingTimeEnd.getTime(), "pending", serviceRepository.findById(serviceId).get()));

				bookingTimeStart.add(Calendar.HOUR_OF_DAY, 1);
				bookingTimeEnd.add(Calendar.HOUR_OF_DAY, 2);

				bookingRepository.save(new Booking(customerRepository.findById(customerId).get(),
						employeeRepository.findById(employeeId).get(), bookingTimeStart.getTime(),
						bookingTimeEnd.getTime(), "pending", serviceRepository.findById(serviceId).get()));

			}

			if (serviceId == 4) {
				serviceId = 1;
			} else {
				++serviceId;
			}

			if (employeeId == 5) {
				employeeId = 4;
			} else {
				++employeeId;
			}
			
			if (customerId == 5) {
				customerId = 1;
			} else {
				++customerId;
			}

		}
	}
}