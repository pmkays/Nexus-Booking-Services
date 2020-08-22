package SEPT.Team.Seven.model;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name="customer")
public class Customer extends Account {
	public Customer(String firstName, String lastName, String email, String phoneNo, String address) {
		super(firstName,lastName,email,phoneNo, address);
	}
	
	public Customer() {};
}
