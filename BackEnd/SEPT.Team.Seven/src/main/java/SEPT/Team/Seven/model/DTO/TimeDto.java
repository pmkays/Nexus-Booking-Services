package SEPT.Team.Seven.model.DTO;

import java.util.Date;

import SEPT.Team.Seven.model.Employee;

public class TimeDto {
	

	private Employee employee;
	private Date startTime;
	private Date endTime;
	
	public TimeDto(Employee employee, Date startTime, Date endTime) {
		this.employee = employee;
		this.startTime = startTime;
		this.endTime = endTime;
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
	
	
	

}
