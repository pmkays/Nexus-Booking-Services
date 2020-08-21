import React from "react";

const Profile = (props) => {   
    
    return(
        <div>
            <label>First Name: {props.account.firstName}</label>
            <br />
            <label>Last Name: {props.account.lastName}</label>
            <br />
            <label>Address: {props.account.address}</label>
            <br />
            <label>Email: {props.account.email}</label>
            <br />
            <label>Phone Number: {props.account.phoneNo}</label>
        </div>
    );

}

export default Profile;