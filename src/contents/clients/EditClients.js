import React, { Fragment, Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import SnackerBar from '../../utils/SnackerBar';
import { Global, inlineStyles } from '../../utils/global';
import { EnhancedTableToolbar } from '../../utils/common_page_with_table';
import { Box, MenuItem, Grid } from '@material-ui/core';

import 'date-fns';
import '../../styles.css';

const EntityName = 'Client';

export default class EditClients extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.recordID ? props.recordID : 0,
            referer: 'clients',
            notification: '',
            isLoading: true,
            isDataLoading: false,
            selectedID: 0,
            branchId: 0,
            branches: [],
            objName: '',
            schema: [],
            snackBarMsg: '',
            snackBarMsgType: '',
            snackBarOpen: false,
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

    actionButtons = () => {
        return (
            <Box style={inlineStyles.toolbarActionBox}>
                <Button onClick={Global.handleSaveForm(this)} style={inlineStyles.button} color="primary" variant='contained' size="small">
                    <Icon className="fas fa-save" style={inlineStyles.smallIcon}></Icon>Save
                </Button>

                <Button onClick={this.handleCancel} style={inlineStyles.button} color="secondary" variant='contained' size="small">
                    <Icon className={"fas fa-times-circle"} style={inlineStyles.smallIcon}></Icon>Cancel
                </Button>
            </Box>
        )
    }
    handleCancel = () => {
        this.props.selectMenu('clients');
    }

    componentDidMount() {
        if (this.state.isLoading && !this.state.isDataLoading) {
            Global.getDataRows(this, process.env.REACT_APP_BRANCHES_URL, 'branches');
            Global.getSchema(this, true); /* if second parameter is true, the record to edit will be loaded (getOneRow()) */
        }
    }
    render() {
        const reportTitle = this.props.recordID && this.props.recordID > 0 ? "Edit " + EntityName : 'Add New ' + EntityName;
        var values = this.state.schema;
        var menuItems;
        return (
            <Fragment>
                <Paper style={inlineStyles.paper}>
                    {
                        this.state.notification &&
                        <Typography paragraph color="error" align="center" style={{ 'padding': 20 }}>
                            {this.state.notification}
                        </Typography>
                    }
                    {
                        this.state.isDataLoading &&
                        <Fragment>
                            <div style={{ 'padding': 50, 'textAlign': 'center' }}>
                                <CircularProgress />
                            </div>
                        </Fragment>
                    }
                    {!this.state.isDataLoading &&
                        <Fragment>
                            <EnhancedTableToolbar
                                numSelected={0}
                                toolbarTitle={reportTitle}
                                actionButtons={this.actionButtons}
                            />
                            <form autoComplete="off" style={inlineStyles.editform}>
                                <Grid container spacing={2}>
                                    {values.filter((row) => row.type === 'text').map((row, index) => {
                                        return (
                                            <Grid item xs={12} md={4} key={index}>
                                                <TextField
                                                    error={row.error ? true : false}
                                                    variant="outlined"
                                                    margin="dense"
                                                    name={row.name}
                                                    required={row.required}
                                                    placeholder={row.placeholder ? row.placeholder : row.label}
                                                    label={row.error ? row.error : row.label}
                                                    value={row.value}
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
                                            <Grid item xs={12} md={row.gridsize ? row.gridsize : 4}key={index}>
                                                <TextField
                                                    select
                                                    variant="outlined"
                                                    margin="dense"
                                                    name={row.name}
                                                    label={row.error ? row.error : 'Choose '+row.label}
                                                    value={row.value ? row.value : ''}
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
                                    {values.filter((row) => row.type === 'textarea').map((row, index) => {
                                        return (
                                            <Grid item xs={12} md={12} key={index}>
                                                <TextField
                                                    multiline
                                                    rows="4"
                                                    style={{ height: 50 }}
                                                    error={row.error ? true : false}
                                                    variant="outlined"
                                                    margin="dense"
                                                    name={row.name}
                                                    required={row.required}
                                                    label={row.error ? row.error : row.label}
                                                    value={row.value}
                                                    onChange={this.handleTextfieldChange(row.name)}
                                                    disabled={this.state.isDataLoading}
                                                />
                                            </Grid>
                                        )
                                    })
                                    }
                                </Grid>
                            </form>
                        </Fragment>
                    }                    
                </Paper>
                <SnackerBar msg={this.state.snackBarMsg} msgType={this.state.snackBarMsgType} opened={this.state.snackBarOpen} t={this} />
            </Fragment>
        );
    }
}

