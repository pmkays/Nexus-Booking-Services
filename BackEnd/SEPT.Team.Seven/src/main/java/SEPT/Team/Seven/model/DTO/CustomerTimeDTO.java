package SEPT.Team.Seven.model.DTO;

import java.util.Date;

public class CustomerTimeDTO extends TimeDTO{
	

	private int customerId;
	
	public CustomerTimeDTO(int customerId, Date startTime, Date endTime) {
		super(startTime, endTime);
		this.customerId = customerId;
	}

	public int getCustomerId() {
		return customerId;
	}

	public void setCustomerId(int customerId) {
		this.customerId = customerId;
	}
	

}
