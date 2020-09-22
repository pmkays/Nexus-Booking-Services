package SEPT.Team.Seven.model.DTO;

import java.util.Date;

public class BookingDateDTO {
	private Date startTime;
	
    protected BookingDateDTO() {
    }
    
	public BookingDateDTO(Date startTime) {
		this.startTime = startTime;
	}
	
	public Date getStartTime() {
		return this.startTime;
	}
	
	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}
}
