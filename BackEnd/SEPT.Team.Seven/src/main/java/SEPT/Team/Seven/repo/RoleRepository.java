package SEPT.Team.Seven.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

import SEPT.Team.Seven.model.Role;

@CrossOrigin(origins = "http://localhost:3000")
public interface RoleRepository extends JpaRepository<Role,Integer>{
    Optional<Role> findByRoleName(String roleName);

}
