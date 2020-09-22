package SEPT.Team.Seven.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

import SEPT.Team.Seven.model.WorkingTime;

@CrossOrigin(origins = "*", allowedHeaders = "*")
public interface WorkingTimeRepository extends JpaRepository<WorkingTime, Integer>{

	Optional<WorkingTime> findByEmployeeId(int employeeId);
	
	List<WorkingTime> findAllByEmployeeId(int employeeId);

}