package SEPT.Team.Seven.model.DTO;

import java.util.Date;

public class EmployeeTimeDTO extends TimeDTO{
	

	private int employeeId;
	
	public EmployeeTimeDTO(int employeeId, Date startTime, Date endTime) {
		super(startTime, endTime);
		this.employeeId = employeeId;
	}

	public int getEmployeeId() {
		return employeeId;
	}

	public void setEmployeeId(int employeeId) {
		this.employeeId = employeeId;
	}
	
	

}
