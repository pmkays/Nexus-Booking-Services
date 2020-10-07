package SEPT.Team.Seven.model.DTO;

import java.util.Date;

// class used to find the available times of a booking for a given employee and date.
public class EmployeeDateDTO {
	

	private int employeeId;
	private Date date;
	
	public EmployeeDateDTO(int employeeId, Date date) {
		this.employeeId = employeeId;
		this.date = date;
	}

	public int getEmployeeId() {
		return employeeId;
	}

	public void setEmployeeId(int employeeId) {
		this.employeeId = employeeId;
	}
	
	public void setDate(Date date) {
		this.date = date;
	}
	
	public Date getDate() {
		return date;
	}
	
	

}
