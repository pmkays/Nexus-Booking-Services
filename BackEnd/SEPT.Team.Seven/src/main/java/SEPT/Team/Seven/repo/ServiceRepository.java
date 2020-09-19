package SEPT.Team.Seven.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

import SEPT.Team.Seven.model.Service;

@CrossOrigin(origins = "http://localhost:3000")
public interface ServiceRepository extends JpaRepository<Service, Integer>{

	Optional<Service> findByName(String name);
}
