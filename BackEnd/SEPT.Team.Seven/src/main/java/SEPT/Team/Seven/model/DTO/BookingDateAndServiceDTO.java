package SEPT.Team.Seven.model.DTO;

import java.util.Date;

public class BookingDateAndServiceDTO {
	private Date startTime;
	private int serviceId;
	
    protected BookingDateAndServiceDTO() {
    }
    
	public BookingDateAndServiceDTO(Date startTime, int serviceId) {
		this.startTime = startTime;
		this.serviceId = serviceId;
	}
	
	public Date getStartTime() {
		return this.startTime;
	}
	
	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}
	
	public int getServiceId() {
		return this.serviceId;
	}
	
	public void setServiceId(int serviceId) {
		this.serviceId = serviceId;
	}
}
