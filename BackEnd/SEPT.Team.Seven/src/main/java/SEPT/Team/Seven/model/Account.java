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
	
	@NotNull(message="First name must not be null")
	@NotEmpty(message="First name must not be empty")
	@Pattern(regexp="^[a-zA-Z]+$", message="First name must only contain letters")
	@Column(name="first_name")
	private String firstName;
	
	@NotNull(message="Last name must not be null")
	@NotEmpty(message="Last name must not be empty")
	@Pattern(regexp="^[a-zA-Z]+$", message="Last name must only contain letters")
	@Column(name="last_name")
	private String lastName;
	
	@NotNull(message="Email must not be null")
	@NotEmpty(message="Email must not be empty")
	@Email(message="Email must be valid")
	@Column(name="email")
	private String email;
	
	@NotNull(message="Phone number must not be null")
	@Size(min = 10, max = 10, message = "Phone number must be 10 digits")
	@Pattern(regexp="^[0-9]+$", message="Phone number must only contain numbers")
	@Column(name="phoneNo")
	private String phoneNo;
	
	@NotNull (message="Address must not be null")
	@NotEmpty (message="Address must not be empty")
	@Column(name="address")
	private String address;
	
	@Column(name="img")
	private String img;
	
	public Account(){}
	
	public Account(String firstName, String lastName, String email, String phoneNo, String address, String img) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.phoneNo = phoneNo;
		this.address = address;
		this.img = img;
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
	
	public void setImg(String img) {
		this.img = img;
	}
	
	public String getImg() {
		return this.img;
	}
	
	
}
