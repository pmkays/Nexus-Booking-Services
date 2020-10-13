package SEPT.Team.Seven.model;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name="customer")
public class Customer extends Account {
	
	@OneToMany(mappedBy="customer")
	private List<Booking> bookings;
	
	public Customer(String firstName, String lastName, String email, String phoneNo, String address, String img) {
		super(firstName,lastName,email,phoneNo, address, img);
	}
	
	public Customer() {};
	
	public void addToBookings(Booking booking) {
		bookings.add(booking);
	}

}
