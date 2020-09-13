package SEPT.Team.Seven.model.DTO;

import java.util.Date;

public class BookingDto {
    private int employeeId;
    private int customerId;
	private Date startTime;
	private Date endTime;
	private int serviceId;
	
    protected BookingDto() {
    }
    
	public BookingDto(int employeeId, int customerId, Date startTime, Date endTime, String accountType, int serviceId) {
		this.employeeId = employeeId;
		this.customerId = customerId;
		this.startTime = startTime;
		this.endTime = endTime;
		this.serviceId = serviceId;
	}

	public int getCustomerId() {
		return customerId;
	}

	public void setCustomerId(int customerId) {
		this.customerId = customerId;
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
	
	public int getServiceId() {
		return serviceId;
	}
	
	public void setServiceId(int serviceId) {
		this.serviceId = serviceId;
	}



}
