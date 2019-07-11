import React, { Fragment, Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import SnackerBar from '../../utils/SnackerBar';
import { Global, inlineStyles, TabContainer } from '../../utils/global';
import { MenuItem, Grid } from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import 'date-fns';
import '../../styles.css';

export default class ClientDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.parentComponent.recordID ? props.parentComponent.recordID : 0,
            referer: 'clients',
            notification: '',
            isLoading: true,
            isDataLoading: false,
            clientPhoto: null,
            selectedID: 0,
            branchId: 0,
            branches: [],
            objName: '',
            schema: [],
            snackBarMsg: '',
            snackBarMsgType: '',
            snackBarOpen: false,
            selectedTabIndex: 0,
            url: process.env.REACT_APP_CLIENTS_URL,
        };
    }
    openSnackBar = (snackBarMsg, snackBarMsgType, snackBarOpen) => {
        this.setState({ snackBarMsg: snackBarMsg, snackBarMsgType: snackBarMsgType, snackBarOpen: snackBarOpen });
    }
    handleTextfieldChange = (name) => event => {
        Global.setStateValue(this, name, event.target.value);
        return;
    };
    setComponentState = (sState, vState) => {
        this.setState({ [sState]: vState });
    }

    setBranch = (v) => {
        var values = { ...this.state.schema }
        values.branchId = v.target.value;
        this.setState({ values });
    }

    handleCancel = () => {
        this.props.parentComponent.selectMenu('clients');
    }

    handleTabChange = (event, newVal) => {
        if (typeof newVal == 'number') {
            this.handleChangeTabIndex(newVal);
        }
    }
    handleChangeTabIndex = (newVal) => {
        this.setState({ selectedTabIndex: newVal });
    }
    componentDidMount() {
        if (this.state.isLoading && !this.state.isDataLoading) {
            if (this.props.parentComponent.state.snackBarMsg.msg) {
                var propSnackBar = this.props.parentComponent.state.snackBarMsg;
                this.openSnackBar(propSnackBar.msg, propSnackBar.type, true);
                this.props.parentComponent.setState({ snackBarMsg: { msg: '', type: '' } });
            }
            Global.getSchema(this, true); /* if second parameter is true, the record to edit will be loaded (getOneRow()) */
            Global.getDataRows(this, process.env.REACT_APP_BRANCHES_URL, 'branches');
        }
    }    

    render() {
        var values = this.state.schema;
        var menuItems;
        return (
            <Fragment>
                <Paper style={inlineStyles.paper}>
                    <AppBar position="static" color="default">
                        <Tabs
                            value={this.state.selectedTabIndex}
                            onChange={this.handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="fullWidth"
                        >
                            <Tab label="" icon={<div className="tabIcon"><i className="material-icons">person_pin</i> <span>
                                {values.filter((row) => row.name === 'firstName').map((row, index) => {
                                    return <span key={index}>{row.value} </span>
                                })
                                }
                                {values.filter((row) => row.name === 'LastName').map((row, index) => {
                                    return <span key={index}>{row.value.charAt(0)} </span>
                                })
                                }
                            </span></div>} />
                            <Tab label="" icon={<div className="tabIcon"><i className="material-icons">streetview</i> <span>Financial Info</span></div>} />
                            <Tab label="" icon={<div className="tabIcon"><i className="material-icons">local_atm</i> <span>Loans</span></div>} />
                            <Tab label="" icon={<div className="tabIcon"><i className="material-icons">store_mall_directory</i> <span>Collateral</span></div>} />
                            <Tab label="" icon={<div className="tabIcon"><i className="material-icons">check_box</i> <span>SOA</span></div>} />
                            <Tab label="" icon={<div className="tabIcon"><i className="material-icons">thumb_up_alt</i> <span>Payments</span></div>} />
                        </Tabs>
                    </AppBar>
                    <SwipeableViews
                        axis={this.props.theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={this.state.selectedTabIndex}
                        onChangeIndex={this.handleChangeTabIndex}
                    >
                        <TabContainer dir={this.props.theme.direction}>
                            {
                                this.state.notification &&
                                <Typography paragraph color="error" align="center" style={{ 'padding': 20 }}>
                                    {this.state.notification}
                                </Typography>
                            }
                            {
                                this.state.isDataLoading &&
                                <Fragment>                                    
                                        {this.props.parentComponent.loadingCircular()}                                    
                                </Fragment>
                            }
                            <form autoComplete="off">
                                <Grid container spacing={1}>
                                    <Grid item xs={12} md={9} className='clientInfoGrid'>
                                        {!this.state.isDataLoading &&
                                            <Fragment>

                                                <Grid container spacing={1}>
                                                    {values.filter((row) => row.type === 'text').map((row, index) => {
                                                        return (
                                                            <Grid item xs={12} md={4} key={index}>
                                                                <TextField
                                                                    error={row.error ? true : false}
                                                                    variant="outlined"
                                                                    margin="dense"
                                                                    name={row.name}
                                                                    type={row.name === 'dateOfBirth' ? 'date' : 'text'}
                                                                    required={row.required}
                                                                    placeholder={row.placeholder ? row.placeholder : row.label}
                                                                    label={row.error ? row.error : row.label}
                                                                    value={row.value}
                                                                    InputLabelProps={{
                                                                        shrink: true,
                                                                    }}
                                                                    onChange={this.handleTextfieldChange(row.name)}
                                                                    disabled={this.state.isDataLoading}
                                                                />
                                                            </Grid>
                                                        )
                                                    })
                                                    }
                                                    {values.filter(row => row.type === 'select').map((row, index) => {
                                                        menuItems = row.items;
                                                        return (
                                                            <Grid item xs={12} md={row.gridsize ? row.gridsize : 4} key={index}>
                                                                <TextField
                                                                    select
                                                                    variant="outlined"
                                                                    margin="dense"
                                                                    name={row.name}
                                                                    label={row.error ? row.error : 'Choose ' + row.label}
                                                                    value={row.value ? row.value : ''}
                                                                    InputLabelProps={{
                                                                        shrink: true,
                                                                    }}
                                                                    onChange={this.handleTextfieldChange(row.name)}
                                                                    style={inlineStyles.select_edit}
                                                                    className="select_edit"
                                                                    disabled={this.state.isDataLoading}
                                                                >
                                                                    <MenuItem value={0}>Choose {row.label}</MenuItem>
                                                                    {row.label === 'Branch' && this.state.branches.length > 0 && this.state.branches.map((itemrow, itemindex) => {
                                                                        return (
                                                                            itemrow.active &&
                                                                            <MenuItem key={itemindex} value={itemrow.id}>{itemrow.branchname}</MenuItem>
                                                                        )
                                                                    })
                                                                    }
                                                                    {
                                                                        row.label !== 'Branch' && menuItems.length > 0 && menuItems.map((itemrow, itemindex) => {
                                                                            return (
                                                                                <MenuItem key={itemindex} value={itemrow.id}>{itemrow.value}</MenuItem>
                                                                            )
                                                                        })
                                                                    }

                                                                </TextField>
                                                            </Grid>
                                                        )
                                                    })
                                                    }
                                                </Grid>


                                            </Fragment>
                                        }
                                    </Grid>
                                    <Grid item xs={12} md={3} className='photoGrid'>
                                        {!this.state.isDataLoading &&
                                            <Fragment>
                                                <Grid container spacing={1} style={{ padding: 15, paddingRight: 0, textAlign: 'center' }}>
                                                    {values.filter((row) => row.type === 'image').map((row, index) => {
                                                        var clientPhoto = this.state.clientPhoto ? this.state.clientPhoto : '//beta.ycfcserver.com/' +row.value;
                                                        return (
                                                            <Fragment key={index}>                                                                                                                                                                                                
                                                                {row.value &&
                                                                    <img src={ clientPhoto}  onError={()=>{this.setState({clientPhoto:'person.png'})}} alt='-' style={{ width: 'auto', maxHeight: 310, margin: 'auto' }} />
                                                                }
                                                                {!row.value &&
                                                                    <i className="material-icons" style={{ fontSize: 200, color: '#ccc', margin: 'auto' }} >
                                                                        account_box
                                                                </i>
                                                                }
                                                            </Fragment>
                                                        )
                                                    })
                                                    }
                                                </Grid>
                                            </Fragment>
                                        }
                                    </Grid>
                                    <Grid item xs={12} md={12} className='remarksGrid'>
                                        {!this.state.isDataLoading &&
                                            <Fragment>
                                                <Grid container spacing={1}>
                                                    {values.filter((row) => row.type === 'textarea').map((row, index) => {
                                                        return (
                                                            <Grid item xs={12} md={12} key={index}>
                                                                <TextField
                                                                    multiline
                                                                    rows="2"
                                                                    error={row.error ? true : false}
                                                                    variant="outlined"
                                                                    margin="dense"
                                                                    name={row.name}
                                                                    required={row.required}
                                                                    label={row.error ? row.error : row.label}
                                                                    value={row.value}
                                                                    InputLabelProps={{
                                                                        shrink: true
                                                                    }}
                                                                    onChange={this.handleTextfieldChange(row.name)}
                                                                    disabled={this.state.isDataLoading}
                                                                />
                                                            </Grid>
                                                        )
                                                    })
                                                    }
                                                </Grid>

                                            </Fragment>
                                        }
                                    </Grid>
                                    <Grid item xs={12} md={12} className='buttonsGrid'>
                                        <Button onClick={Global.handleSaveForm(this)} style={inlineStyles.button} color="primary" variant='contained' size="small">
                                            <Icon className="fas fa-save" style={inlineStyles.smallIcon}></Icon>Save
                                            </Button>
                                    </Grid>
                                </Grid>
                            </form>

                        </TabContainer>
                        <TabContainer dir={this.props.theme.direction} id='financialInfo'>
                            {
                                this.state.notification &&
                                <Typography paragraph color="error" align="center" style={{ 'padding': 20 }}>
                                    {this.state.notification}
                                </Typography>
                            }
                            {
                                this.state.isDataLoading &&
                                <Fragment>
                                    {this.props.parentComponent.loadingCircular()}
                                </Fragment>
                            }
                        </TabContainer>
                        <TabContainer dir={this.props.theme.direction} id='loansInfo'>
                            {
                                this.state.notification &&
                                <Typography paragraph color="error" align="center" style={{ 'padding': 20 }}>
                                    {this.state.notification}
                                </Typography>
                            }
                            {
                                this.state.isDataLoading &&
                                <Fragment>
                                    {this.props.parentComponent.loadingCircular()}
                                </Fragment>
                            }
                        </TabContainer>
                        <TabContainer dir={this.props.theme.direction} id='collateral'>
                            {
                                this.state.notification &&
                                <Typography paragraph color="error" align="center" style={{ 'padding': 20 }}>
                                    {this.state.notification}
                                </Typography>
                            }
                            {
                                this.state.isDataLoading &&
                                <Fragment>
                                    {this.props.parentComponent.loadingCircular()}
                                </Fragment>
                            }
                        </TabContainer>
                        <TabContainer dir={this.props.theme.direction} id='soa'>
                            {
                                this.state.notification &&
                                <Typography paragraph color="error" align="center" style={{ 'padding': 20 }}>
                                    {this.state.notification}
                                </Typography>
                            }
                            {
                                this.state.isDataLoading &&
                                <Fragment>
                                    {this.props.parentComponent.loadingCircular()}
                                </Fragment>
                            }
                        </TabContainer>
                        <TabContainer dir={this.props.theme.direction} id='payments'>
                            {
                                this.state.notification &&
                                <Typography paragraph color="error" align="center" style={{ 'padding': 20 }}>
                                    {this.state.notification}
                                </Typography>
                            }
                            {
                                this.state.isDataLoading &&
                                <Fragment>
                                    {this.props.parentComponent.loadingCircular()}
                                </Fragment>
                            }
                        </TabContainer>
                    </SwipeableViews>

                </Paper>
                <SnackerBar msg={this.state.snackBarMsg} msgType={this.state.snackBarMsgType} opened={this.state.snackBarOpen} t={this} />
            </Fragment>
        );
    }
}

