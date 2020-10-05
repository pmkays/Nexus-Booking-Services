package SEPT.Team.Seven.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name="admin")
public class Admin extends Account {
	
	@Column(name="img")
	private String img;
	
	public Admin(String firstName, String lastName, String email, String phoneNo, String address, String img) {
		super(firstName,lastName,email,phoneNo, address);
		this.img = img;
	}
	
	public Admin() {};
	
	public void setImg(String img) {
		this.img = img;
	}
	
	public String getImg() {
		return this.img;
	}
}

