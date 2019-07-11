import React, { Fragment, Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Badge from '@material-ui/core/Badge';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Welcome from './contents/Welcome'
import NotFound from './contents/NotFound';
import SignIn from './forms/Signin';
import Users from './contents/settings/Users';
import { loadCSS } from 'fg-loadcss';
import Edituser from './contents/settings/Edituser';
import { inlineStyles } from './utils/global';
import Roles from './contents/settings/Roles';
import Clients from './contents/clients/Clients';
import EditClients from './contents/clients/EditClients';
import Branches from './contents/settings/Branches';
import ClientDetails from './contents/clients/Details';

require('dotenv').config();

const menuItems = [
  { name: 'Clients', menuid: 'clients', icon: <i className="material-icons">contacts</i> },  
  {
    name: 'Settings', menuid: 'settings', icon: <i className="material-icons">settings</i>,
    subItems: [
      { name: 'Branches', menuid: 'settings.branches' },
      { name: 'Users', menuid: 'settings.users' },
      { name: 'Roles', menuid: 'settings.roles' }
    ]
  },
];

const theme = createMuiTheme({
  overrides: {
    MuiButton: {
      label: { // after the dash
        color: 'white',
        position: 'relative',
      },
    },
    MuiIconButton: {
      colorInherit: {
        color: 'inherit',
      },
    },
    MuiSelect: {
      root: {
        margin: 0,
        padding: 0,
      },
      selectMenu: {
        width: '100%',
        minHeight: 16,
        margin: 1,
        padding: '1px !important',
      }
    },
    MuiTab: {
      root: {
        padding: '3 12',
        '&:hover': {
          color: '#3c8dd4',
        }
      },
      labelIcon: {
        padding: 0,
        paddingTop: 0,
      }
    },
    MuiTablePagination: {
      input: {
        flexShrink: 1,
        border: '1px solid #ccc',
        width: 75,
      },
      select: {
        paddingRight: 24,
        textAlignLast: 'left !important',
      },
      selectRoot: {
        marginRight: 16,
        width: 45,
      }
    },
    MuiTypography: {
      body1: {
        fontSize: 14,
      }
    },
    MuiMenuItem: {
      root: {
        minHeight: 36,
      }
    },
    MuiTextField: {
      root: {
        width: '100%',
      }
    },
    MuiLink: {
      root: {
        cursor: 'pointer',
        color: '#1a6db7',
      }
    },
    MuiDialogContentText: {
      root: {
        marginBottom: 10,
        fontSize: 10,
      }
    },
    MuiInputBase: {
      root: {
        width: '100%',
        padding: '5px 10px',
        fontSize: 14,
      },
      input: {
        width: '90%',
      }
    }
  },
  palette: {
    primary: {
      main: '#3c8dd4',
      light: '#ccc',
      dark: '#6ab4f5'
    },
    secondary: {
      main: '#d32f2f'
    },
    action: {
      main: '#6495ed',
      light: '#ccc',
      dark: '#637282',
    }
  },

});

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leftDrawerOpen: true,
      recordID: 0,
      snackBarMsg: { msg: '', type: '' },
      anchorEl: null,
      selectedMenu: '/',
      collapseMenu_loans: false,
      collapsed_cmc: false,
      collapsed_gl: false,
      collapsed_trans: false,
      collapsed_loanreports: false,
      collapsed_actgrep: false,
      collapsed_settings: false,
      menuId: 'primary-search-account-menu',
    }
  }
  
  collapseMenu_settings = (v) => {
    this.setState({ collapsed_settings: v });
  }

  componentDidMount() {
    loadCSS(
      'https://use.fontawesome.com/releases/v5.1.0/css/all.css',
      document.querySelector('#font-awesome-css'),
    );
  }

  selectMenu = (sMenuitem, Id, oMsg) => {
    var states = this.state;
    states.recordID = Id;
    if (typeof oMsg !== 'undefined') {
      states.snackBarMsg = oMsg;
    } else {
      states.snackBarMsg = { msg: '', type: '' };
    }
    states.selectedMenu = sMenuitem;
    this.setState({ states });
  }

  handleCollapseMenu = (menuId) => {
    switch (menuId) {      
      case 'trans':        
        // if (this.state.collapsed_settings) this.collapseMenu_settings(false);
        // this.collapseMenu_trans(!this.state.collapsed_trans);
        break;      
      case 'settings':
        //if (this.state.collapsed_trans) this.collapseMenu_trans(false);        
        this.collapseMenu_settings(!this.state.collapsed_settings);
        break;
      default:
        // if (this.state.collapsed_trans) this.collapseMenu_trans(false);
        if (this.state.collapsed_settings) this.collapseMenu_settings(false);
    }
  }

  handleProfileMenuOpen = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  }
  handleLeftDrawer = () => {
    this.setState({ leftDrawerOpen: !this.state.leftDrawerOpen });
  }

  logout = () => {
    this.handleMenuClose();
    sessionStorage.clear();
  }

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  }

  loadingCircular = () => {
    return (
      <Fragment>
        <div style={{ 'padding': 50, 'textAlign': 'center' }}>
          <CircularProgress />
        </div>
      </Fragment>
    )
  }

  render() {
    var userdata = JSON.parse(sessionStorage.getItem('userdata') ? sessionStorage.getItem('userdata') : '[]');
    var content = '';
    var recId = this.state.recordID ? this.state.recordID : 0;
    switch (this.state.selectedMenu) {
      case '':
      case '/':
      case 'welcome':
        content = <Welcome />;
        break;
      case 'clients':
        content = <Clients parentComponent={this} theme={theme} />;
        break;
      case 'clients.edit':
        content = <EditClients parentComponent={this} theme={theme} />;
        break;
      case 'clients.details':
        if (recId) {
          content = <ClientDetails parentComponent={this} theme={theme} />;
        }
        break;
      case 'settings.branches':
        content = <Branches parentComponent={this} theme={theme} />;
        break;
      case 'settings.users':
        content = <Users parentComponent={this} theme={theme} />;
        break;
      case 'settings.edituser':
        content = <Edituser parentComponent={this} theme={theme} />;
        break;
      case 'settings.roles':
        content = <Roles parentComponent={this} theme={theme} />;
        break;
      default:
        content = <NotFound />;
        break;
    }
    if (!content) {
      content = this.loadingCircular();
    }
    var itemKey = 0;

    return (
      <Box className={"maincontainer"}>
        <MuiThemeProvider theme={theme}>
          {userdata.userdata &&
            <Fragment>
              <CssBaseline />

              <AppBar position="fixed" style={inlineStyles.appBar}>
                <Toolbar>
                  <IconButton
                    edge="start"
                    style={inlineStyles.menuButton}
                    color="inherit"
                    aria-label="Open drawer"
                    onClick={() => this.handleLeftDrawer()}
                  >
                    <MenuIcon />
                  </IconButton>

                  <Typography variant="h6" noWrap>
                    <Link to="/" onClick={() => this.selectMenu('')} style={inlineStyles.linked}>{process.env.REACT_APP_NAME}</Link>
                  </Typography>
                  <IconButton
                    style={inlineStyles.toolbarButtons}
                    aria-label="0 notifications"
                    color="inherit">
                    <Badge badgeContent={0} color="secondary">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="Account of current user"
                    aria-controls={this.state.menuId}
                    aria-haspopup="true"
                    onClick={this.handleProfileMenuOpen}
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton>
                  <Typography style={{ 'marginLeft': 6, 'fontSize': '80%' }}>{userdata.userdata[0].firstname}</Typography>
                </Toolbar>
              </AppBar>
              <Menu
                anchorEl={this.state.anchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                id={this.state.menuId}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={this.state.anchorEl ? true : false}
                onClose={this.handleMenuClose}
              >
                <MenuItem onClick={this.handleMenuClose}>Profile</MenuItem>
                <MenuItem onClick={this.handleMenuClose}>My account</MenuItem>
                <MenuItem onClick={this.logout}>Logout</MenuItem>
              </Menu>
              <Drawer
                style={inlineStyles.drawer}
                variant="persistent"
                anchor="left"
                open={this.state.leftDrawerOpen}
                classes={{
                  paper: 'drawerPaper',
                }}
              >
                <div style={inlineStyles.toolbar} />
                <List component="nav" aria-label="Main mailbox folders">
                  {menuItems.map((row) => {
                    itemKey++;
                    var collapsedMenu;
                    switch (row.menuid) {
                      // case 'trans':
                      //   collapsedMenu = this.state.collapsed_trans;
                      //   break;                      
                      default:
                        collapsedMenu = this.state.collapsed_settings;
                        break;
                    }

                    return (
                      <Fragment key={itemKey}>
                        {!row.subItems &&
                          <Fragment>
                            <ListItem button style={inlineStyles.listitem} onClick={() => this.selectMenu(row.menuid)}>
                              <ListItemIcon style={inlineStyles.itemIcon}>{row.icon}</ListItemIcon>
                              <ListItemText primary={row.name} />
                            </ListItem>
                          </Fragment>
                        }
                        {
                          row.subItems &&
                          <Fragment>
                            <ListItem button onClick={() => this.handleCollapseMenu(row.menuid)} style={inlineStyles.listitem}>
                              <ListItemIcon style={inlineStyles.itemIcon}>{row.icon}</ListItemIcon>
                              <ListItemText primary={row.name} />
                              {collapsedMenu ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            <Collapse component="li" in={collapsedMenu} timeout="auto" unmountOnExit>
                              <List style={inlineStyles.sublistitem}>
                                {row.subItems.map((subrow) => {
                                  itemKey++;
                                  return (
                                    <ListItem key={itemKey}
                                      button style={inlineStyles.nested} onClick={() => this.selectMenu(subrow.menuid)}>
                                      {!subrow.inProgress &&
                                        <i className="material-icons">arrow_right</i>
                                      }                                      
                                      <ListItemText primary={subrow.name} />

                                    </ListItem>
                                  )
                                })
                                }

                              </List>
                            </Collapse>
                          </Fragment>
                        }
                      </Fragment>
                    )
                  })
                  }

                </List>
              </Drawer>
              <main
                style={this.state.leftDrawerOpen === true ? inlineStyles.contentShift : inlineStyles.content}
              >
                <div style={inlineStyles.drawerHeader} />

                {content}

              </main>
            </Fragment>
          }
          {!userdata.userdata &&
            <Fragment>
              <SignIn />
            </Fragment>
          }
        </MuiThemeProvider>
      </Box>
    );
  }
}
