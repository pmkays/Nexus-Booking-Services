package SEPT.Team.Seven.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

import SEPT.Team.Seven.model.WorkingTime;

@CrossOrigin(origins = "http://localhost:3000")
public interface WorkingTimeRepository extends JpaRepository<WorkingTime, Integer>{

}