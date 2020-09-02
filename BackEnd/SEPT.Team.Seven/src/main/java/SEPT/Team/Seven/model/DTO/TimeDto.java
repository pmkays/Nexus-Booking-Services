package SEPT.Team.Seven.model.DTO;

import java.util.Date;

import SEPT.Team.Seven.model.Employee;

public class TimeDto {
	

	private int employeeId;
	private Date startTime;
	private Date endTime;
	
	public TimeDto(int employeeId, Date startTime, Date endTime) {
		this.employeeId = employeeId;
		this.startTime = startTime;
		this.endTime = endTime;
	}

	public int getEmployeeId() {
		return employeeId;
	}

	public void setEmployeeId(int employeeId) {
		this.employeeId = employeeId;
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
