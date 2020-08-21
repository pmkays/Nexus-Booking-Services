package SEPT.Team.Seven.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

import SEPT.Team.Seven.model.User;

@CrossOrigin(origins = "http://localhost:3000")
public interface UserRepository extends JpaRepository<User,Integer>{
    Optional<User> findByUsername(String userName);

}
