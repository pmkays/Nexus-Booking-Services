import React from 'react';
import { hot } from 'react-hot-loader';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import MenuIcon from '@material-ui/icons/Menu';
import { IAccountReducerState } from '../../reducers/reducer_account';
import './IndexNav.scss';
import { Typography } from '@material-ui/core';
import { redirect } from '../../helpers/history';

interface IIndexNavState {
  readonly isOpen: boolean;
  readonly isLoggedIn: boolean;
}
interface IIndexNavProps {
  account?: IAccountReducerState;
}

class IndexNav extends React.Component<IIndexNavProps, IIndexNavState> {
  constructor(props: any) {
    super(props);
    // const isLoggedIn = this.props.userBusiness.userId !== undefined
    // && this.props.userBusiness.jwt !== undefined
    // && this.props.userBusiness.userId.length !== 0;
    this.state = {
      isOpen: false,
      isLoggedIn: false,
    };
  }
  private toggleMenu = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }
  private redirectIndex = () => {
    redirect('/');
  }
  private redirectLogin = () => {
    redirect('/login');
  }
  private redirectRegister = () => {
    redirect('/register');
  }
  public render() {
    return (
      <React.Fragment>
        <AppBar position="static" className="appbar" color="inherit">
          <Toolbar className="nav-wrapper">
            <div>
              <Typography onClick={this.redirectIndex}>SEPT</Typography>
            </div>
            <List className="mobileMenuIcon">
              <ListItem>
                <IconButton onClick={this.toggleMenu} aria-label="Menu">
                    <MenuIcon />
                </IconButton>
              </ListItem>
            </List>
            <List className="menuMain">
              <ListItem button={true} onClick={this.redirectLogin}>
                <ListItemText primary="Login" />
              </ListItem>
              <ListItem button={true} onClick={this.redirectRegister}>
                <ListItemText primary="Register" />
              </ListItem>
            </List>
          </Toolbar>
        </AppBar>
        <SwipeableDrawer
          open={this.state.isOpen}
          onOpen={this.toggleMenu}
          onClose={this.toggleMenu}
          anchor="right"
        >
          <List className="menuMobile">
            <ListItem button={false} className="closeMobileMenuButton">
              <IconButton onClick={this.toggleMenu}>
                <ClearIcon />
              </IconButton>
            </ListItem>
            <ListItem button={true}>
              <ListItemIcon>
                <MenuIcon />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button={true}>
              <ListItemIcon>
                <MenuIcon />
              </ListItemIcon>
              <ListItemText primary="Register" />
            </ListItem>
          </List>
        </SwipeableDrawer>
      </React.Fragment>
    );
  }
}

export default hot(module)(IndexNav);
