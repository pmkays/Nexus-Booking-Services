import React from 'react'

const ErrorMessage = (props) => {
    return (
        <p className = "text-danger">
            {props.message}
        </p>
    )
}

export default ErrorMessage
