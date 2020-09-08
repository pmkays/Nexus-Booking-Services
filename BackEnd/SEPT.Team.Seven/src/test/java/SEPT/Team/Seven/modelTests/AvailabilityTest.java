package SEPT.Team.Seven.modelTests;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Calendar;
import java.util.Date;
import java.util.Set;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import SEPT.Team.Seven.model.Availability;

@SpringBootTest
public class AvailabilityTest {
	
	private static Validator validator;
	
	@BeforeAll
	public static void setUp() {
		ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
	    validator = factory.getValidator();
	}
	
	@Test
	public void startTime_InPast_ReturnsConstraintViolation(){
		 
		//Arrange
		Calendar cal = Calendar.getInstance();
		cal.add(Calendar.DATE, -1);
		Date dateInPast = cal.getTime();
		
		//Act
		Set<ConstraintViolation<Availability>> constraintViolations =
			      validator.validateValue(Availability.class, "startTime", dateInPast);
		
		//Assert
		assertEquals(constraintViolations.size(), 1);

		assertTrue(constraintViolations.stream().anyMatch
				(c-> c.getMessage().equals("Start time must not be in the past")));
	
	}
	
	@Test
	public void startTime_Null_ReturnsConstraintViolation(){

		//Arrange, Act
		Set<ConstraintViolation<Availability>> constraintViolations =
			      validator.validateValue(Availability.class, "startTime", null);
		
		//Assert
		assertEquals(constraintViolations.size(), 1);

		assertTrue(constraintViolations.stream().anyMatch
				(c-> c.getMessage().equals("Start time must not be null")));
	
	}
	
	@Test
	public void startTime_InFuture_ReturnsNoError(){

		//Arrange
		Calendar cal = Calendar.getInstance();
		cal.add(Calendar.DATE, 1);
		Date dateInFuture = cal.getTime();
		
		//Act
		Set<ConstraintViolation<Availability>> constraintViolations =
			      validator.validateValue(Availability.class, "startTime", dateInFuture);
		
		//Assert
		assertEquals(constraintViolations.size(), 0);
	
	}
	
	@Test
	public void endTime_InPast_ReturnsConstraintViolation(){
		 
		//Arrange
		Calendar cal = Calendar.getInstance();
		cal.add(Calendar.DATE, -1);
		Date dateInPast = cal.getTime();
		
		//Act
		Set<ConstraintViolation<Availability>> constraintViolations =
			      validator.validateValue(Availability.class, "endTime", dateInPast);
		
		//Assert
		assertEquals(constraintViolations.size(), 1);

		assertTrue(constraintViolations.stream().anyMatch
				(c-> c.getMessage().equals("End time must not be in the past")));
	
	}
	
	@Test
	public void endTime_Null_ReturnsConstraintViolation(){

		//Arrange, Act
		Set<ConstraintViolation<Availability>> constraintViolations =
			      validator.validateValue(Availability.class, "endTime", null);
		
		//Assert
		assertEquals(constraintViolations.size(), 1);

		assertTrue(constraintViolations.stream().anyMatch
				(c-> c.getMessage().equals("End time must not be null")));
	
	}
	
	@Test
	public void endTime_InFuture_ReturnsNoError(){

		//Arrange
		Calendar cal = Calendar.getInstance();
		cal.add(Calendar.DATE, 1);
		Date dateInFuture = cal.getTime();
		
		//Act
		Set<ConstraintViolation<Availability>> constraintViolations =
			      validator.validateValue(Availability.class, "endTime", dateInFuture);
		
		//Assert
		assertEquals(constraintViolations.size(), 0);
	
	}

}
