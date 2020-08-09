import React from 'react';
import intl from 'react-intl-universal';
import { hot } from 'react-hot-loader';
import { NavLink } from 'react-router-dom';
import { enUS } from '../../locales/en-US';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Icon from '@material-ui/core/Icon';
import MenuIcon from '@material-ui/icons/Menu';
import AssignmentInd from '@material-ui/icons/AssignmentInd';
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { IAccountReducerState } from '../../reducers/reducer_account';
import { redirect } from '../../helpers/history';
import './HomeNav.scss';

interface IHomeNavProps {
  logout: () => void;
  account: IAccountReducerState;
}

interface IHomeNavState {
  readonly isOpen: boolean;
  readonly anchorEl: null | any;
}

class HomeNavComponent extends React.Component<IHomeNavProps, IHomeNavState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isOpen: false,
      anchorEl: null,
    };
  }
  private toggleMenu = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }
  private handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({ anchorEl: event.currentTarget });
  }
  private handleClose = () => {
    this.setState({ anchorEl: null });
  }
  public userLinks() {
    const PROFILE = intl.get('HOMENAV.PROFILE').d(enUS.HOMENAV.PROFILE);
    const LOGOUT = intl.get('HOMENAV.LOGOUT').d(enUS.HOMENAV.LOGOUT);
    const open = Boolean(this.state.anchorEl);
    const redirectProfile = () => redirect('/profile');
    return (
      <React.Fragment>
        <MenuList className="menu">
          <MenuItem
            className="account-menu-item"
            disableRipple={true}
            disableTouchRipple={true}
            onClick={redirectProfile}
          >
            {PROFILE}
          </MenuItem>
          <MenuItem
            className="account-menu-item logout"
            disableRipple={true}
            disableTouchRipple={true}
            onClick={this.props.logout}
          >
            {LOGOUT}
          </MenuItem>
          <MenuItem className="account-menu-icon" disableRipple={true} disableTouchRipple={true}>
            <Icon
              aria-owns={open ? 'account-menu' : undefined}
              onClick={this.handleMenu}
            >
              <i className="icon-settings account-settings-gear" aria-hidden="true" />
            </Icon>
          </MenuItem>
        </MenuList>
        <Menu
          id="account-menu"
          anchorEl={this.state.anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={open}
          onClose={this.handleClose}
          className="account-menu"
        >
          <MenuItem disableRipple={true} disableTouchRipple={true} onClick={redirectProfile}>
            <ListItemIcon>
              <AssignmentInd/>
            </ListItemIcon>
            <ListItemText
              inset={true}
              primary={PROFILE}
            />
          </MenuItem>
          <MenuItem
            className="logout"
            disableRipple={true}
            disableTouchRipple={true}
            onClick={this.props.logout}
          >
            <ListItemIcon>
              <PowerSettingsNew />
            </ListItemIcon>
            <ListItemText
              inset={true}
              primary={LOGOUT}
            />
          </MenuItem>
        </Menu>
      </React.Fragment>
    );
  }
  public render() {
    return (
      <AppBar position="fixed" color="inherit">
        <Toolbar className="homenav-wrapper">
          <div>
            <Icon onClick={this.toggleMenu} className="iconButton" aria-label="Menu">
              <MenuIcon />
            </Icon>
          </div>
          {this.userLinks()}
          <SwipeableDrawer
            className="drawer"
            open={this.state.isOpen}
            onOpen={this.toggleMenu}
            onClose={this.toggleMenu}
          >
            {this.userLinks()}
          </SwipeableDrawer>
        </Toolbar>
      </AppBar>
    );
  }
}

export default hot(module)(HomeNavComponent);
