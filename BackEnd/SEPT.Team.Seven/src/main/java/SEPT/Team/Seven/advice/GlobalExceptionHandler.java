package SEPT.Team.Seven.advice;

import java.util.stream.Collectors;

import javax.persistence.RollbackException;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.util.NestedServletException;

@ControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(NestedServletException.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  @ResponseBody
  public ResponseEntity<Object> handleNestedServletException(NestedServletException ex) {
      System.out.println(ex.getMessage());
      return new ResponseEntity<Object>(ex.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
  }
  
  //anything that's 403
  @ResponseStatus(HttpStatus.FORBIDDEN)
  @ExceptionHandler(HttpServerErrorException.class)
  public ResponseEntity<Object> handleServerException(HttpServerErrorException ex) {
      System.out.println(ex.getMessage());
      return new ResponseEntity<Object>(ex.getMessage(),HttpStatus.FORBIDDEN);
  }
  
  //deal with the constraint violations and any other error that might come up
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler(RollbackException.class)
  public ResponseEntity<Object> handleRuntimeException(RuntimeException ex) {	  
	  String toReturn = "";
	  
	  if(ex.getCause().getCause() instanceof ConstraintViolationException){
		  toReturn = ((ConstraintViolationException) ex.getCause().getCause())
				  .getConstraintViolations()
				  .stream()
				  .map(ConstraintViolation::getMessage)
				  .collect(Collectors.joining(", "));
	  } else {
		  toReturn = ex.getMessage();
	  }
	  
      System.out.println(toReturn);
      return new ResponseEntity<Object>(toReturn,HttpStatus.BAD_REQUEST);
  }
  
  
}	
	