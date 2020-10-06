package SEPT.Team.Seven.model.DTO;

import java.util.Date;

public class EditWorkingTimeDTO {
	

	private int workingTimeId;
	private Date startTime;
	private Date endTime;
	
	public EditWorkingTimeDTO(int workingTimeId, Date startTime, Date endTime) {
		this.workingTimeId = workingTimeId;
		this.startTime = startTime;
		this.endTime = endTime;
	}

	public int getWorkingTimeId() {
		return workingTimeId;
	}

	public void setWorkingTimeId(int workingTimeId) {
		this.workingTimeId = workingTimeId;
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
