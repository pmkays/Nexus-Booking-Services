package SEPT.Team.Seven.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

import SEPT.Team.Seven.model.Customer;

@CrossOrigin(origins = "*", allowedHeaders = "*")
public interface CustomerRepository extends JpaRepository<Customer, Integer>{

}