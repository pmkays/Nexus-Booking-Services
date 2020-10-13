package SEPT.Team.Seven.model;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name="admin")
public class Admin extends Account {
	
	
	public Admin(String firstName, String lastName, String email, String phoneNo, String address, String img) {
		super(firstName,lastName,email,phoneNo, address, img);
	}
	
	public Admin() {};
	
}

