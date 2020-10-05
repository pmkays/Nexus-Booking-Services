package SEPT.Team.Seven.model;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name="customer")
public class Customer extends Account {
	
	@OneToMany(mappedBy="customer")
	private List<Booking> bookings;
	
	@Column(name="img")
	private String img;
	
	public Customer(String firstName, String lastName, String email, String phoneNo, String address, String img) {
		super(firstName,lastName,email,phoneNo, address);
		this.img = img;
	}
	
	public Customer() {};
	
	public void addToBookings(Booking booking) {
		bookings.add(booking);
	}
	
	public void setImg(String img) {
		this.img = img;
	}
	
	public String getImg() {
		return this.img;
	}
}
