package SEPT.Team.Seven.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import SEPT.Team.Seven.model.Role;

public interface RoleRepository extends JpaRepository<Role,Integer>{
    Optional<Role> findByRoleName(String roleName);

}
