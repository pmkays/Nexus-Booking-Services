package SEPT.Team.Seven.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import SEPT.Team.Seven.model.User;

public interface UserRepository extends JpaRepository<User,Integer>{
    Optional<User> findByUsername(String userName);

}
