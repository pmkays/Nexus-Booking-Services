package SEPT.Team.Seven.model;

import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name="booking")
public class Booking {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="id")
	private int id;
	
	@ManyToOne(cascade= CascadeType.MERGE)
	@JoinColumn(name="customer_id")
	private Customer customer;
	
	@ManyToOne(cascade= CascadeType.MERGE)
	@JoinColumn(name="employee_id")
	private Employee employee;
	
	@NotNull(message="Start time must not be null")
	@Temporal(TemporalType.TIMESTAMP)
	@JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss")
	@Column(name="start_time")
	private Date startTime;
	
	@NotNull(message="End time must not be null")
	@Temporal(TemporalType.TIMESTAMP)
	@JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss")
	@Column(name="end_time")
	private Date endTime;
	
	@Column(name="status")
	private String status;
	
	@ManyToOne(cascade= CascadeType.MERGE)
	@JoinColumn(name="service_id")
	private Service service;
	
	public Booking() {}

	public Booking(Customer customer, Employee employee, Date startTime, Date endTime,
			String status, Service service) {
		this.customer = customer;
		this.employee = employee;
		this.startTime = startTime;
		this.endTime = endTime;
		this.status = status;
		this.service = service;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Customer getCustomer() {
		return customer;
	}

	public void setCustomer(Customer customer) {
		this.customer = customer;
	}

	public Employee getEmployee() {
		return employee;
	}

	public void setEmployee(Employee employee) {
		this.employee = employee;
	}

	public Date getStartTime() {
		return startTime;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	public Date getEndTime() {
		return endTime;
	}

	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Service getService() {
		return service;
	}

	public void setService(Service service) {
		this.service = service;
	}

	
}
