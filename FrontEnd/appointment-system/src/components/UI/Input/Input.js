import React from 'react';
import classes from './Input.module.css';

const input = (props) => {
  let inputElement = null;
  const inputClasses = [classes.InputElement];

  if (props.invalid && props.shouldValidate && props.touched) {
    inputClasses.push(classes.Invalid);
  }

  inputClasses.push('form-control');

  // inputtype is lowercase because in the html element we are spreading the props to it
  // You cannot use camelcaase in the HTML elements. eg. <input inputType="input"... is wrong
  switch (props.elementType) {
    case 'input':
      inputElement = (
        <input
          {...props.elementConfig}
          className={inputClasses.join(' ')}
          value={props.value}
          onChange={props.changed}
        />
      );
      break;
    case 'textarea':
      inputElement = (
        <textarea
          {...props.elementConfig}
          className={inputClasses.join(' ')}
          value={props.value}
          onChange={props.changed}
        />
      );
      break;
    case 'select':
      inputElement = (
        <select
          className={inputClasses.join(' ')}
          value={props.value}
          onChange={props.changed}
        >
          {props.elementConfig.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.displayValue}
            </option>
          ))}
        </select>
      );
      break;
    case 'small':
      inputElement = (
        <small className='text-danger col-sm-3'>{props.errorMessage}</small>
      );
      break;
    default:
      inputElement = (
        <input
          {...props.elementConfig}
          className={inputClasses.join(' ')}
          value={props.value}
          onChange={props.changed}
        />
      );
  }
  return (
    <div className='form-group'>
      <label className={classes.Label}>{props.label}</label>
      {inputElement}
    </div>
  );
};

export default input;
