package SEPT.Team.Seven.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpServerErrorException;

import SEPT.Team.Seven.model.WorkingTime;
import SEPT.Team.Seven.model.DTO.EditWorkingTimeDTO;
import SEPT.Team.Seven.model.DTO.EmployeeTimeDTO;
import SEPT.Team.Seven.service.WorkingTimeService;

@RestController
@RequestMapping("/api/workingTime")
public class WorkingTimeController {
	
	@Autowired
	private WorkingTimeService workingTimeService;
	
	@CrossOrigin(origins = "*", allowedHeaders = "*")
	@GetMapping("/employee/{id}")
	public List<WorkingTime> getWorkingTimesForEmployee(@PathVariable("id") int id) {
		List<WorkingTime> workingTimes = workingTimeService.getWorkingTimesForEmployee(id);
		return workingTimes;
	}
	
	@CrossOrigin(origins = "*", allowedHeaders = "*")
    @PostMapping()
    public WorkingTime addWorkingTime(@RequestBody EmployeeTimeDTO timeDto) {
       return workingTimeService.addWorkingTime(timeDto.getEmployeeId(), timeDto.getStartTime(), timeDto.getEndTime()).orElseThrow(()->
       new HttpServerErrorException(HttpStatus.FORBIDDEN, "Error adding working time."));
    }
	
	@CrossOrigin(origins = "*", allowedHeaders = "*")
    @PutMapping()
    public WorkingTime editWorkingTime(@RequestBody EditWorkingTimeDTO editWorkingTimeDTO) {
       return workingTimeService.editWorkingTime(editWorkingTimeDTO.getWorkingTimeId(), editWorkingTimeDTO.getStartTime(), editWorkingTimeDTO.getEndTime()).orElseThrow(()->
       new HttpServerErrorException(HttpStatus.FORBIDDEN, "Error editing working time."));
    }

}
