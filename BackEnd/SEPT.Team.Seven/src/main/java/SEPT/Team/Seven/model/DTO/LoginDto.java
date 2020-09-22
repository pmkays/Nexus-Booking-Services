package SEPT.Team.Seven.model.DTO;


public class LoginDto {
	    private String username;

	    private String password;
	    
	    private String type;

	    protected LoginDto() {
	    }

	    public LoginDto(String username, String password) {
	        this.username = username;
	        this.password = password;
	    }

	    public String getUsername() {
	        return username;
	    }

	    public void setUsername(String username) {
	        this.username = username;
	    }

	    public String getPassword() {
	        return password;
	    }

	    public void setPassword(String password) {
	        this.password = password;
	    }

		public String getType() {
			return type;
		}

		public void setType(String type) {
			this.type = type;
		}
	    
	    

}
