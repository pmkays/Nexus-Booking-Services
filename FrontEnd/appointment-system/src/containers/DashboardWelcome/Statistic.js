import React, { Component } from "react";
import classes from './Statistic.module.css';

export default class Statistic extends Component {
    render(){
        return(
            <div className={classes.greenBody}>
                <h3 className={classes.title}>{this.props.data}</h3>
                <span className={classes.desc}>{this.props.description}</span>
            </div>
        );
    }
}

