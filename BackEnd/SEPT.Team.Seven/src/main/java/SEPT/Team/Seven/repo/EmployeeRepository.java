package SEPT.Team.Seven.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

import SEPT.Team.Seven.model.Employee;

@CrossOrigin(origins = "*", allowedHeaders = "*")
public interface EmployeeRepository extends JpaRepository<Employee, Integer>{
	
}
