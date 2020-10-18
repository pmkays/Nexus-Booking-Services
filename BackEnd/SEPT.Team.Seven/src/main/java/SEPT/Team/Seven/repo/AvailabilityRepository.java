package SEPT.Team.Seven.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

import SEPT.Team.Seven.model.Availability;

@CrossOrigin(origins = "*", allowedHeaders = "*")
public interface AvailabilityRepository extends JpaRepository<Availability, Integer>{
	Optional<Availability> findByEmployeeId(int employeeId);
	
	List<Availability> findAllByEmployeeId(int employeeId);
	
}