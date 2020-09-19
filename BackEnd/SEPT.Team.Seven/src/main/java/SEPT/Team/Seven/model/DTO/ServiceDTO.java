package SEPT.Team.Seven.model.DTO;

public class ServiceDTO {
    private int employeeId;
	private String serviceName;
	
    protected ServiceDTO() {
    }
    
	public ServiceDTO(int employeeId, String serviceName) {
		this.employeeId = employeeId;
		this.serviceName = serviceName;
	}
	
	public int getEmployeeId() {
		return employeeId;
	}

	public void setEmployeeId(int employeeId) {
		this.employeeId = employeeId;
	}
	
	public String getServiceName() {
		return serviceName;
	}
	
	public void setServiceId(String serviceName) {
		this.serviceName = serviceName;
	}



}
