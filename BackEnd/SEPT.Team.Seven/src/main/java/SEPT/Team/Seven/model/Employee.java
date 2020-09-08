package SEPT.Team.Seven.model;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name="employee")
public class Employee extends Account {
	
	@OneToMany(mappedBy="employee")
	private List<WorkingTime> workingTimes;
	
	@OneToMany(mappedBy="employee")
	private List<Availability> availabilities;
	
	public Employee(String firstName, String lastName, String email, String phoneNo, String address) {
		super(firstName,lastName,email,phoneNo, address);
	}
	
	public Employee() {};
	
	public void addToWorkingTime(WorkingTime time) {
		workingTimes.add(time);
	}
	
	public void addToAvailability(Availability time) {
		availabilities.add(time);
	}
}
