package SEPT.Team.Seven.advice;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.util.NestedServletException;

@ControllerAdvice
public class ConstraintViolationHandler {

  @ExceptionHandler(NestedServletException.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  @ResponseBody
  public Object processValidationError(NestedServletException ex) {
      String errorMessage = ex.getMessage();
      System.out.println(errorMessage);
      return ex;
  }
}	
	