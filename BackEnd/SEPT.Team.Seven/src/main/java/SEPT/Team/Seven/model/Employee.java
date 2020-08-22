package SEPT.Team.Seven.model;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name="employee")
public class Employee extends Account {
	public Employee(String firstName, String lastName, String email, String phoneNo, String address) {
		super(firstName,lastName,email,phoneNo, address);
	}
	
	public Employee() {};
}
