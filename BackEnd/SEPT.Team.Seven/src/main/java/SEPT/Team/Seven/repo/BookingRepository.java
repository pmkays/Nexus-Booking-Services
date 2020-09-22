package SEPT.Team.Seven.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

import SEPT.Team.Seven.model.Booking;

@CrossOrigin(origins = "*", allowedHeaders = "*")
public interface BookingRepository extends JpaRepository<Booking, Integer>{

	List<Booking> findAllByCustomerId(int customerId);

	List<Booking> findAllByEmployeeId(int employeeId);

}

