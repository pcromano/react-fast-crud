import React, { Fragment, Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import 'date-fns';
import '../../styles.css';
import { EnhancedTableToolbar, EnhancedTableHead, FilterToolbar } from '../../utils/common_page_with_table';
import { Global, inlineStyles } from '../../utils/global';
import SnackerBar from '../../utils/SnackerBar';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { Link, Grid, MenuItem } from '@material-ui/core';

const reportTitle = "Clients";
const EntityName = 'Client';
const editPage = 'clients.edit';

export default class Clients extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 1,
            branchId: 0,
            deleteDialogOpen: false,
            dialogAddEditOpen: false,
            dense: false,
            id: 0,
            isLoading: true,
            isDataLoading: false,
            isDialogDataLoading: false,
            notification: '',
            objName: '',
            order: 'asc',
            orderBy: 'firstName',
            page: 0,
            pageTotal: 0,
            rows: [],
            rowsPerPage: 10,
            searchFor: '',
            selected: [],
            snackBarMsg: '',
            snackBarMsgType: '',
            snackBarOpen: false,
            showClearSearchBtn: false,
            url: process.env.REACT_APP_CLIENTS_URL,
            schema: [],
        };
    }
    openSnackBar = (snackBarMsg, snackBarMsgType, snackBarOpen) => {
        this.setState({ snackBarMsg: snackBarMsg, snackBarMsgType: snackBarMsgType, snackBarOpen: snackBarOpen });
    }
    setComponentState = (sState, vState) => {
        this.setState({ [sState]: vState });
    }
    handleTextfieldChange = (name, key) => e => {
        var values = { ...this.state.schema };
        values[key].value = e.target.value;
        this.setState({ values });
    }
    handleRequestSort = (event, property) => {
        var isDesc = this.state.order === 'desc';
        var order = isDesc || this.state.orderBy !== property ? 'asc' : 'desc';
        var values = {
            order: order,
            orderBy: property,
        };
        this.setComponentState('order', order);
        this.setComponentState('orderBy', property);
        Global.loadList(this, values);
    }
    setSearch = (e) => {
        var v = e.target.value;
        this.setState({ searchFor: v });
        if (v) {
            this.setComponentState('showClearSearchBtn', true);
        } else {
            this.setComponentState('showClearSearchBtn', false);
        }
    }

    handleSelectAllClick = (event) => {
        if (event.target.checked) {
            var newSelecteds = this.state.rows.map(n => n.name);
            this.setComponentState('selected', newSelecteds);
            return;
        }
        this.setComponentState('selected', []);
    }

    handleChangePage = (event, newPage) => {
        this.setComponentState('page', newPage);        
        Global.loadList(this, {page: newPage});
    }

    handleChangeRowsPerPage = (event) => {
        this.setComponentState('rowsPerPage', event.target.value);
        Global.loadList(this, {rowsPerPage: event.target.value});
    }

    handleChangeDense = (event) => {
        this.setComponentState('dense', event.target.checked);
    }

    handleDialogClose = () => {
        this.setDeleteDialogOpen(false);
    }
    confirmDeleteRow(id, name) {
        this.setState({ id: id });
        this.setState({ objName: name });
        this.setDeleteDialogOpen(true);
    }
    confirmDeletion = (id) => {
        Global.deleteRow(this, id);
    }
    setDeleteDialogOpen = (v) => {
        this.setState({ deleteDialogOpen: v });
        if (!v) {
            Global.loadList(this, {});
        }
    }
    setEditDialogOpen = (v) => {
        this.setState({ dialogAddEditOpen: v });
        if (!v) {
            var formValues = this.state.schema;
            var values = { ...this.state.schema };
            formValues.forEach((row, key) => {
                values[key].error = '';
                values[key].value = '';
                this.setState({ values });
            })
            Global.loadList(this, {});
        }
    }
    showDetails = (id) => {
        this.props.parentComponent.selectMenu('clients.details',id,{});        
    }
    editRow = (id) => {
        this.props.parentComponent.selectMenu(editPage,id,{});
        /* Use this 2 lines below instead of you want to edit in a dialog box */
        // Global.getOneRow(this, id);
        // this.setEditDialogOpen(true);
    }

    addNew = () => {           
        this.editRow(0);
        /* Use the codes below if you want popup for editing */
        // var values = { ...this.state.schema };
        // values.id = 0;
        // this.setState({ values });
        // this.setEditDialogOpen(true);
    }

    actionButtons = () => {
        return (
            <Button onClick={this.addNew} style={inlineStyles.buttonBlue} variant='contained' size="small">
                <i className="material-icons">person_add</i> <span>New {EntityName}</span>
            </Button>
        )
    }

    componentDidMount() {
        if (this.state.isLoading && !this.state.isDataLoading) {            
            Global.getSchema(this, false);
            Global.getDataRows(this, process.env.REACT_APP_BRANCHES_URL, 'branches');
        }
    }
    render() {
        var headRows = [];
        var formValues = this.state.schema;
        formValues.forEach((row) => {
            headRows.push({ id: row.name, label: row.label, numeric: row.numeric, showInList: row.showInList });
        });

        headRows.push({ id: 'action', label: 'Actions', numeric: false, showInList: true });
        var branches = this.state.branches;
        return (
            <Fragment>
                {!this.isDataLoading &&
                    <FilterToolbar
                        showBranches={() => {
                            return (
                                <Paper>
                                    <TextField
                                        select
                                        margin="dense"
                                        value={this.state.branchId ? this.state.branchId : 0}
                                        onChange={e => Global.setBranch(this, e.target.value)}
                                        style={inlineStyles.select}
                                        disabled={this.state.isLoading}
                                    >
                                        <MenuItem value={0}>All branches</MenuItem>
                                        {branches && branches.length > 0 && branches.map((row, index) => {
                                            return (
                                                row.active &&
                                                <MenuItem key={index} value={row.id}>{row.branchname}</MenuItem>
                                            )
                                        })
                                        }

                                    </TextField>
                                </Paper>
                            )
                        }
                        }
                        showSearch={true}
                        setSearch={this.setSearch}
                        loadList={this.loadData}
                        t={this}
                        Global={Global}
                    />
                }
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
                            {this.props.parentComponent.loadingCircular()}                            
                        </Fragment>
                    }
                    {!this.state.isDataLoading &&
                        <Fragment>
                            <EnhancedTableToolbar
                                numSelected={this.state.selected ? this.state.selected.length : 0}
                                toolbarTitle={reportTitle}
                                actionButtons={this.actionButtons}
                                t={this}
                                Global={Global}
                            />
                            <div style={inlineStyles.tableWrapper}>
                                <Table
                                    style={inlineStyles.table}
                                    aria-labelledby="tableTitle"
                                    size={this.state.dense ? 'medium' : 'small'}
                                >
                                    <EnhancedTableHead
                                        numSelected={this.state.selected ? this.state.selected.length : 0}
                                        order={this.state.order}
                                        orderBy={this.state.orderBy}
                                        onSelectAllClick={this.handleSelectAllClick}
                                        onRequestSort={this.handleRequestSort}
                                        headRows={headRows}
                                    />
                                    <TableBody>
                                        {this.state.rows && this.state.rows.length > 0 && this.state.rows.map((row, index) => {
                                            const labelId = `table-row-${index}`;
                                            return (
                                                <TableRow
                                                    hover
                                                    key={index}
                                                >
                                                    <TableCell className="listRowNum" id={labelId} scope="row" padding="none" align="center">
                                                        {index + 1 + (this.state.page * this.state.rowsPerPage)} 
                                                    </TableCell>
                                                    {formValues.filter(col => col.showInList).map((col, colindex) => {
                                                        const colval = colindex
                                                            ? row[col.name]
                                                            : (<Link to="#" onClick={() => this.showDetails(row.id)} aria-label="Edit row">{row[col.name]}</Link>);
                                                        return (
                                                            <TableCell key={colindex} align={col.numeric ? 'right' : (col.align ? col.align : 'left')}>
                                                                {col.name === 'branchId' ? row.branchname : colval}
                                                            </TableCell>
                                                        );
                                                    })
                                                    }

                                                    <TableCell align="center" style={{ whiteSpace: 'nowrap' }}>
                                                        <IconButton style={inlineStyles.iconButton} onClick={() => this.editRow(row.id)} aria-label="Edit row">
                                                            <Icon className={'fas fa-edit fa-small '} color="primary" />
                                                        </IconButton>
                                                        <IconButton style={inlineStyles.iconButton} onClick={() => this.confirmDeleteRow(row.id, row.firstName)} aria-label="Delete row">
                                                            <Icon className={'fas fa-trash-alt fa-small'} color="error" />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                        }
                                        {this.state.rows && !this.state.rows.length &&
                                            <TableRow><TableCell align="center" colSpan={8}>{"No result"}</TableCell></TableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </div>
                            {!this.state.isDataLoading && this.state.pageTotal > 1 &&
                                <TablePagination
                                    rowsPerPageOptions={[10, 25, 50, 100]}
                                    component="div"
                                    count={this.state.count}
                                    rowsPerPage={this.state.rowsPerPage}
                                    page={this.state.page}
                                    backIconButtonProps={{
                                        'aria-label': 'Previous Page',
                                    }}
                                    nextIconButtonProps={{
                                        'aria-label': 'Next Page',
                                    }}
                                    onChangePage={this.handleChangePage}
                                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                />
                            }
                        </Fragment>
                    }
                </Paper>
                <FormControlLabel
                    control={<Switch checked={this.state.dense} onChange={this.handleChangeDense} />}
                    label="Show bigger cells"
                />
                <Dialog
                    open={this.state.deleteDialogOpen}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Confirm"}</DialogTitle>
                    <DialogContent dividers>
                        <DialogContentText id="alert-dialog-description"></DialogContentText>
                        <div style={{ padding: 15 }}>
                            Do you want to continue deleting "{this.state.objName}"?
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setDeleteDialogOpen(false)} variant='contained' color="secondary" size="small" style={inlineStyles.button}>
                            No
                    </Button>
                        <Button onClick={() => this.confirmDeletion(this.state.id)} variant='contained' color="primary" size="small" style={inlineStyles.button} autoFocus>
                            Yes
                    </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={this.state.dialogAddEditOpen}
                    aria-labelledby="alert-dialog2-title"
                    aria-describedby="alert-dialog2-description"
                >
                    <DialogTitle id="alert-dialog2-title">{this.state.id ? "Edit " + EntityName : "Add a " + EntityName}</DialogTitle>
                    <DialogContent dividers>
                        <DialogContentText id="alert-dialog2-description">* Required</DialogContentText>
                        <Fragment>

                            {
                                this.state.notification &&
                                <Typography paragraph color="error" align="center" style={{ 'padding': 5 }}>
                                    {this.state.notification}
                                </Typography>
                            }
                            {
                                this.state.isDialogDataLoading &&
                                this.props.parentComponent.loadingCircular()
                            }
                            {!this.state.isDialogDataLoading &&
                                <Fragment>
                                    <Grid container spacing={2}>
                                        {formValues.map((row, index) => {
                                            return (
                                                <Grid item xs={12} md={4} key={index}>
                                                    <TextField
                                                        error={row.error ? true : false}
                                                        variant="outlined"
                                                        margin="dense"
                                                        name={row.name}
                                                        required={row.required}
                                                        label={row.error ? row.error : row.label}
                                                        value={row.value}
                                                        onChange={this.handleTextfieldChange(row.name, index)}
                                                        disabled={this.state.isDialogDataLoading}
                                                    />
                                                </Grid>
                                            )
                                        })
                                        }
                                    </Grid>
                                </Fragment>
                            }

                        </Fragment>


                    </DialogContent>
                    <DialogActions>
                        <Button onClick={Global.handleSaveForm(this)} variant='contained' color="primary" size="small" style={inlineStyles.button} autoFocus>
                            Save
                    </Button>
                        <Button onClick={() => this.setEditDialogOpen(false)} variant='contained' color="secondary" size="small" style={inlineStyles.button}>
                            Cancel
                    </Button>
                    </DialogActions>
                </Dialog>
                <SnackerBar msg={this.state.snackBarMsg} msgType={this.state.snackBarMsgType} opened={this.state.snackBarOpen} t={this} />
            </Fragment>
        );
    }
}
