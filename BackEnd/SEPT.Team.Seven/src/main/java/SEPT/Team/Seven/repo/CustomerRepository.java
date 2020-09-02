package SEPT.Team.Seven.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

import SEPT.Team.Seven.model.Customer;

@CrossOrigin(origins = "http://localhost:3000")
public interface CustomerRepository extends JpaRepository<Customer, Integer>{

}