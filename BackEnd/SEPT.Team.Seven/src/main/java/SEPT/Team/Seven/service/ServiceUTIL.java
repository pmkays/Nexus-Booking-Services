package SEPT.Team.Seven.service;

import java.util.Date;

public class ServiceUTIL {

	public static boolean checkTimeWithin(Date baseStartTime, Date startTimeWithin, Date endTimeWithin, Date baseEndTime) {
		boolean within = false;
		
		boolean startValid = startTimeWithin.compareTo(baseStartTime) >= 0
				&& startTimeWithin.compareTo(baseEndTime) <= 0;
		boolean endValid = endTimeWithin.compareTo(baseStartTime) >= 0
				&& endTimeWithin.compareTo(baseEndTime) <= 0;
		
		within = startValid && endValid;
		return within;
		
	}
	
	
}
