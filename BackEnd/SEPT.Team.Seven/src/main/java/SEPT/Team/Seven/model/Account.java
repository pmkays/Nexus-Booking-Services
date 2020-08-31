package SEPT.Team.Seven.model;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@MappedSuperclass
public abstract class Account {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="id")
	private int id;
	
	@NotNull
	@NotEmpty
	@Pattern(regexp="^[a-zA-Z]+$") //must only be alpha
	@Column(name="first_name")
	private String firstName;
	
	@NotNull
	@NotEmpty
	@Pattern(regexp="^[a-zA-Z]+$") //must only be alpha
	@Column(name="last_name")
	private String lastName;
	
	@NotNull
	@NotEmpty
	@Email
	@Column(name="email")
	private String email;
	
	@NotNull
	@Size(min = 10, max = 10)
	@Pattern(regexp="^[0-9]+$") //must only be numeric
	@Column(name="phoneNo")
	private String phoneNo;
	
	@NotNull
	@NotEmpty
	@Column(name="address")
	private String address;
	
	public Account(){}
	
	public Account(String firstName, String lastName, String email, String phoneNo, String address) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.phoneNo = phoneNo;
		this.address = address;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhoneNo() {
		return phoneNo;
	}

	public void setPhoneNo(String phoneNo) {
		this.phoneNo = phoneNo;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}
	
	
	
	
}
