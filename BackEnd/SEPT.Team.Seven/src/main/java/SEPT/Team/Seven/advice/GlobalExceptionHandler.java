package SEPT.Team.Seven.advice;

import java.util.stream.Collectors;

import javax.persistence.RollbackException;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
	
  private static final Logger LOGGER = LoggerFactory.getLogger(GlobalExceptionHandler.class);

  @ExceptionHandler(NestedServletException.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  @ResponseBody
  public ResponseEntity<Object> handleNestedServletException(NestedServletException ex) {
	  LOGGER.error("Unable to complete transaction", ex);
      return new ResponseEntity<Object>(ex.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
  }
  
  //anything that's 403
  @ResponseStatus(HttpStatus.FORBIDDEN)
  @ExceptionHandler(HttpServerErrorException.class)
  public ResponseEntity<Object> handleServerErrorException(HttpServerErrorException ex) {
	  LOGGER.error("Unable to complete transaction", ex);
      return new ResponseEntity<Object>(ex.getMessage(),HttpStatus.FORBIDDEN);
  }
  
  //deal with the constraint violations and any exceptions that might come up
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler(RollbackException.class)
  public ResponseEntity<Object> handleRuntimeException(RuntimeException ex) {	    
	  String toReturn = "";
	  
	  //have to navigate down the exception tree twice to get to constraint violations
	  if(ex.getCause().getCause() instanceof ConstraintViolationException){
		  toReturn = ((ConstraintViolationException) ex.getCause().getCause())
				  .getConstraintViolations()
				  .stream()
				  .map(ConstraintViolation::getMessage)
				  .collect(Collectors.joining(", "));
	  } else {
		  toReturn = ex.getMessage();
	  }
	  
	  LOGGER.error("Unable to complete transaction", ex);
      return new ResponseEntity<Object>(toReturn,HttpStatus.BAD_REQUEST);
  }
  
  
}	
	