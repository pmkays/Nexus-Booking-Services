import moment from 'moment';

export const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties,
  };
};

export const checkValidity = (value, rules) => {
  let isValid = true;

  if (rules.required) {
    isValid = value.trim() !== "" && isValid;
  }
  if (rules.minLength) {
    isValid = value.length >= rules.minLength && isValid;
  }
  if (rules.maxLength) {
    isValid = value.length <= rules.maxLength && isValid;
  }

  if (rules.exactLength) {
    isValid = value.length === rules.exactLength && isValid;
  }

  if (rules.isEmail) {
    const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    isValid = pattern.test(value) && isValid;
  }
  
  if(rules.isLetters){
    const pattern = /^[a-zA-Z]+$/;
    isValid = pattern.test(value) && isValid;
  }

  if (rules.isNumeric) {
    const pattern = /^\d+$/;
    isValid = pattern.test(value) && isValid;
  }
  return isValid;
}


export const errorMessageToDisplay = (formField) => {
  switch (formField){
      case "firstName":
          return "Required, must only use letters";
      case "lastName":
          return "Required, must only use letters";
      case "email":
          return "Invalid email";
      case "phoneNumber":
          return "Must be 10 digits";
      case "address":
          return "Required";
      default:
          return "";
  }
}

export const uppercaseFirstCharacter = (word) => {
  return word.substring(0,1).toUpperCase() + word.substring(1);
}

export const timeDiff = (time1, time2) => {
  var duration = moment(time1).diff(moment(time2), 'hours'); 
  if(duration === 1){
      return `${duration} hour`
  }
  return `${duration} hours`
}

