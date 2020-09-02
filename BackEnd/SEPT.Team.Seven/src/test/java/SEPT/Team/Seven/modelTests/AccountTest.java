package SEPT.Team.Seven.modelTests;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;


import java.util.Set;

import SEPT.Team.Seven.model.Account;

/*
 * As account is an abstract class, we can't test it straightaway. 
 */
@SpringBootTest
public class AccountTest {

	private static Validator validator;
	
	@BeforeAll
	public static void setUp() {
		ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
	    validator = factory.getValidator();
	}
	
	/*NOTE: firstName and lastName have the same constraints, so only first
	 *		firstName will be checked.
	 */
	
	@Test
	public void firstName_Empty_ReturnsConstraintViolation() {
		
		//Arrange, Act
		Set<ConstraintViolation<Account>> constraintViolations =
			      validator.validateValue(Account.class, "firstName", "");
		
		//Assert
		assertEquals(constraintViolations.size(), 2);

		assertTrue(constraintViolations.stream().anyMatch
				(c-> c.getMessage().equals("First name must only contain letters")));
		
		assertTrue(constraintViolations.stream().anyMatch
				(c-> c.getMessage().equals("First name must not be empty")));		
		
   }
	
	@Test
	public void firstName_Null_ReturnsConstraintViolation() {
		
		//Arrange, Act
		Set<ConstraintViolation<Account>> constraintViolations =
			      validator.validateValue(Account.class, "firstName", null);
		
		//Assert
		assertEquals(2, constraintViolations.size());

		assertTrue(constraintViolations.stream().anyMatch
				(c-> c.getMessage().equals("First name must not be empty")));
		
		assertTrue(constraintViolations.stream().anyMatch
				(c-> c.getMessage().equals("First name must not be null")));		
		
   }
	
	@Test
	public void firstName_UnallowedCharacters_ReturnsConstraintViolation() {
		
		//Arrange, Act
		Set<ConstraintViolation<Account>> constraintViolations =
			      validator.validateValue(Account.class, "firstName", "a1.{}");
		
		//Assert
		assertEquals(1, constraintViolations.size());

		assertTrue(constraintViolations.stream().anyMatch
				(c-> c.getMessage().equals("First name must only contain letters")));
				
   }
	
	@Test
	public void firstName_Letters_NoConstraintViolation() {
		
		//Arrange, Act
		Set<ConstraintViolation<Account>> constraintViolations =
			      validator.validateValue(Account.class, "firstName", "Yuri");
		
		//Assert
		assertEquals(constraintViolations.size(), 0);
				
   }
	
	@Test
	public void email_Empty_ReturnsConstraintViolation() {
		
		//Arrange, Act
		Set<ConstraintViolation<Account>> constraintViolations =
			      validator.validateValue(Account.class, "email", "");
		
		//Assert
		assertEquals(1, constraintViolations.size());
		
		assertTrue(constraintViolations.stream().anyMatch
				(c-> c.getMessage().equals("Email must not be empty")));		
		
   }
	
	@Test
	public void email_Null_ReturnsConstraintViolation() {
		
		//Arrange, Act
		Set<ConstraintViolation<Account>> constraintViolations =
			      validator.validateValue(Account.class, "email", null);
		
		//Assert
		assertEquals(constraintViolations.size(), 2);

		assertTrue(constraintViolations.stream().anyMatch
				(c-> c.getMessage().equals("Email must not be empty")));
		
		assertTrue(constraintViolations.stream().anyMatch
				(c-> c.getMessage().equals("Email must not be null")));		
		
   }
	
	@Test
	public void email_InvalidInput_ReturnsConstraintViolation() {
		
		//Arrange, Act
		Set<ConstraintViolation<Account>> constraintViolations =
			      validator.validateValue(Account.class, "email", "as1.com");
		
		//Assert
		assertEquals(constraintViolations.size(), 1);

		assertTrue(constraintViolations.stream().anyMatch
				(c-> c.getMessage().equals("Email must be valid")));
		
   }
	
	@Test
	public void email_ValidInput_ReturnsConstraintViolation() {
		
		//Arrange, Act
		Set<ConstraintViolation<Account>> constraintViolations =
			      validator.validateValue(Account.class, "email", "yuri@gmail.com");
		
		//Assert
		assertEquals(constraintViolations.size(), 0);
		
   }
	
	@Test
	public void phoneNo_Empty_ReturnsConstraintViolation() {
		
		//Arrange, Act
		Set<ConstraintViolation<Account>> constraintViolations =
			      validator.validateValue(Account.class, "phoneNo", "");
		
		//Assert
		assertEquals(constraintViolations.size(), 2);

		assertTrue(constraintViolations.stream().anyMatch
				(c-> c.getMessage().equals("Phone number must only contain numbers")));
		
		assertTrue(constraintViolations.stream().anyMatch
				(c-> c.getMessage().equals("Phone number must be 10 digits")));		
		
   }
	
	@Test
	public void phoneNo_Null_ReturnsConstraintViolation() {
		
		//Arrange, Act
		Set<ConstraintViolation<Account>> constraintViolations =
			      validator.validateValue(Account.class, "phoneNo", null);
		
		//Assert
		assertEquals(1, constraintViolations.size());
		
		assertTrue(constraintViolations.stream().anyMatch
				(c-> c.getMessage().equals("Phone number must not be null")));		
		
   }
	
	@Test
	public void phoneNo_Length10ButLetters_ReturnsConstraintViolation() {
		
		//Arrange, Act
		Set<ConstraintViolation<Account>> constraintViolations =
			      validator.validateValue(Account.class, "phoneNo", "abcdefghij");
		
		//Assert
		assertEquals(1, constraintViolations.size());
		
		assertTrue(constraintViolations.stream().anyMatch
				(c-> c.getMessage().equals("Phone number must only contain numbers")));		
		
   }
	
	@Test
	public void phoneNo_NumbersButLengthNot10_ReturnsConstraintViolation() {
		
		//Arrange, Act
		Set<ConstraintViolation<Account>> constraintViolations =
			      validator.validateValue(Account.class, "phoneNo", "123");
		
		//Assert
		assertEquals(1, constraintViolations.size());
		
		assertTrue(constraintViolations.stream().anyMatch
				(c-> c.getMessage().equals("Phone number must be 10 digits")));		
		
   }
	
	@Test
	public void phoneNo_LettersAndLengthNot10_ReturnsConstraintViolation() {
		
		//Arrange, Act
		Set<ConstraintViolation<Account>> constraintViolations =
			      validator.validateValue(Account.class, "phoneNo", "123abc");
		
		//Assert
		assertEquals(2, constraintViolations.size());
		
		assertTrue(constraintViolations.stream().anyMatch
				(c-> c.getMessage().equals("Phone number must be 10 digits")));
		
		assertTrue(constraintViolations.stream().anyMatch
				(c-> c.getMessage().equals("Phone number must only contain numbers")));	
		
   }
	
	@Test
	public void phoneNo_ValidInput_NoConstraintViolation() {
		
		//Arrange, Act
		Set<ConstraintViolation<Account>> constraintViolations =
			      validator.validateValue(Account.class, "phoneNo", "0449998456");
		
		constraintViolations.parallelStream().forEach(System.out::println);

		//Assert
		assertEquals(0, constraintViolations.size());		
		
   }
	
	@Test
	public void address_Empty_ReturnsConstraintViolation() {
		
		//Arrange, Act
		Set<ConstraintViolation<Account>> constraintViolations =
			      validator.validateValue(Account.class, "address", "");
		
		//Assert
		assertEquals(constraintViolations.size(), 1);
		
		assertTrue(constraintViolations.stream().anyMatch
				(c-> c.getMessage().equals("Address must not be empty")));		
		
   }
	
	@Test
	public void address_Null_ReturnsConstraintViolation() {
		
		//Arrange, Act
		Set<ConstraintViolation<Account>> constraintViolations =
			      validator.validateValue(Account.class, "address", null);
		
		//Assert
		assertEquals(2, constraintViolations.size());

		assertTrue(constraintViolations.stream().anyMatch
				(c-> c.getMessage().equals("Address must not be empty")));
		
		assertTrue(constraintViolations.stream().anyMatch
				(c-> c.getMessage().equals("Address must not be null")));		
		
   }
	
	@Test
	public void address_ValidInput_NoConstraintViolation() {
		
		//Arrange, Act
		Set<ConstraintViolation<Account>> constraintViolations =
			      validator.validateValue(Account.class, "address", 
			    		  "3 Hero Way, Gumtree, Victoria, 3036");
		
		//Assert
		assertEquals(0, constraintViolations.size());	
		
   }
}

