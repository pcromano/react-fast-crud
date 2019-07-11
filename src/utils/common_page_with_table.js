import React, { Fragment } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { TextField, Button, InputBase } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';

export const useToolbarStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
        display: 'flex',
    },
    searchBoxRoot: {
        padding: '2px',
        flex: '1 1 auto',
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    nowrap: {
        whiteSpace: 'nowrap',
    },
    actions: {
        color: theme.palette.text.secondary,
    },
    title: {
        flex: '0 0 auto',
    },
    searchinput: {
        borderBottom: "1px solid #cccccc",
    },
    daterange: {
        flex: '0 1 auto',
    },
    branchgroup: {
        flex: '0 1 auto',
        width: 'auto',
        transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    },
    actionButtons: {
        flex: '0 1 auto',
        width: 'auto',
    },
    searchBox: {
        flex: '0 1 auto',
        width: 'auto',
    },
    paperSearchBox: {
        display: 'flex',        
        width: 300,
        height: 34,
    },
    toolbarSearchBox: {
        display: 'flex',        
        width: 300,
        height: 40,
    },

    searchIcon: { /* for search box on list paper toolbar */
        width: 34,
        padding: 0,  
        color: '#ccc',
        backgroundColor: 'transparent',
        '&:hover': {
            backgroundColor: 'transparent',
            color: '#918b85',
        },
        flex: '0 0 auto',
    },
    clearSearchIcon: {        
        width: 24,                
        padding: 0,
        color: '#ccc',
        '&:hover': {
          color: '#e91e63',
          backgroundColor: 'transparent',
        },
        flex: '0 0 auto',
    },
    smallestIcon: {
        fontSize: 16,
        marginTop: 0,
    },
    spacer: {
        flex: '1 1 auto',
    },
    smallSpacer: {
        flex: '0 1 auto',
        width: 10,
    },
}));

export function FilterToolbar(props) {
    const { showDate1 = false, showDate2 = false, showSearch = false, trandate, setTranDate, loadList, showBranches, t, Global } = props;
    const classes = useToolbarStyles();
    return (
        <Toolbar style={{ paddingLeft: 0, paddingRight: 0, marginBottom: 5 }}
            className={classes.root}
        >
            <div className={classes.branchgroup}>
                {
                    showBranches && showBranches()
                }
            </div>

            {(showDate1 || showDate2) &&
                <div className={classes.smallSpacer}></div>
            }
            <div className={classes.daterange}>
                <Fragment>
                    {showDate1 &&
                        <TextField
                            id="dateFrom"
                            type="date"
                            style={{ textAlign: "center" }}
                            variant="filled"
                            defaultValue={trandate}
                            onChange={(e) => setTranDate(props, e)}
                        />
                    }
                    {showDate2 &&
                        <Fragment>
                            <TextField
                                id="dateTo"
                                type="date"
                                style={{ textAlign: "center" }}
                                variant="filled"
                                defaultValue={trandate}
                                onChange={(e) => setTranDate(props, e)}
                            />
                            <Button
                                onClick={() => loadList(t, {})}
                                size="small"
                                variant="contained" color="primary">
                                <Icon className={clsx(classes.smallIcon, 'far fa-calendar-check')} /> Change Date
            </Button>
                        </Fragment>
                    }
                </Fragment>

            </div>

            <div className={classes.spacer}></div>

            <div className={classes.searchBox}>

                {showSearch &&
                    <Paper className={classes.toolbarSearchBox}>
                        <IconButton className={classes.searchIcon} onClick={() => Global.startSearch(t)} aria-label="Search">
                            <Icon className={clsx(classes.smallIcon, 'fas fa-search')} />
                        </IconButton>
                        <InputBase
                            placeholder="Search…"
                            classes={{
                                root: classes.searchBoxRoot,
                                input: classes.inputInput,
                            }}
                            value={t.state.searchFor}
                            inputProps={{ 'aria-label': 'Search' }}
                            onChange={e => t.setSearch(e)}
                            onKeyPress={(event) => {
                                /* when space or enter key is pressed ; event.charCode === 32 ||*/
                                if ( event.charCode === 13) {
                                    Global.startSearch(t);
                                }
                            }}
                        />
                        {t.state.showClearSearchBtn &&
                        <IconButton className={classes.clearSearchIcon} onClick={() => Global.clearSearch(t)} aria-label="Clear Search">
                            <Icon className={clsx(classes.smallestIcon, 'fas fa-times-circle')} />
                        </IconButton>
                        }
                    </Paper>
                }
            </div>

        </Toolbar>)
}
export function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort, headRows } = props;
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };
    return (
        <TableHead>
            <TableRow>
                <TableCell style={{textAlign: 'center', padding: 0 }}>
                    #
                </TableCell>
                {headRows.map(row => (
                    row.showInList &&
                    <TableCell
                        key={row.id}
                        style={{ whiteSpace: 'nowrap' }}
                        align={row.numeric ? 'right' : 'center'}
                        padding={row.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === row.id ? order : false}
                    >
                        {row.label === 'Actions' &&
                            row.label
                        }
                        {row.label !== 'Actions' &&
                            <TableSortLabel
                                active={orderBy === row.id}
                                direction={order}
                                onClick={createSortHandler(row.id)}
                            >
                                {row.label}
                            </TableSortLabel>
                        }
                    </TableCell>
                    
                ))}
            </TableRow>
        </TableHead>
    );
}

export const EnhancedTableToolbar = props => {
    const classes = useToolbarStyles();
    const { numSelected, toolbarTitle, actionButtons, showSearchBox, t, Global } = props;
    const title = toolbarTitle;    
    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            <div className={classes.title}>
                {numSelected > 0 ? (
                    <Typography color="inherit" variant="subtitle1">
                        {numSelected} selected
          </Typography>
                ) : (
                        <Typography variant="h6" id="tableTitle">
                            {title}
                        </Typography>
                    )}
            </div>
            <div className={classes.spacer} />
            {showSearchBox &&
                <div className={classes.searchBox}>
                    <Paper className={classes.paperSearchBox}>                
                        <IconButton className={classes.searchIcon} onClick={() => Global.startSearch(t)} aria-label="Search">
                            <Icon className={clsx(classes.smallIcon, 'fas fa-search')} />
                        </IconButton>
                        <InputBase
                            placeholder="Search…"
                            classes={{
                                root: classes.searchBoxRoot,
                                input: classes.inputInput,
                            }}
                            value={t.state.searchFor}
                            inputProps={{ 'aria-label': 'Search' }}
                            onChange={e => t.setSearch(e)}
                            onKeyPress={(event) => {
                                /* when space or enter key is pressed */
                                if (event.charCode === 32 || event.charCode === 13) {                                    
                                    Global.startSearch(t);
                                }
                            }}
                        />
                        {t.state.showClearSearchBtn &&
                        <IconButton className={classes.clearSearchIcon} onClick={() => Global.clearSearch(t)} aria-label="Clear Search">
                            <Icon className={clsx(classes.smallestIcon, 'fas fa-times-circle')} />
                        </IconButton>
                        }
                        
                    </Paper>
                </div>
            }
            <div className={classes.smallSpacer} />
            <div className={classes.actions}>
                {numSelected > 0 ? (
                    <Tooltip title="Delete">
                        <IconButton aria-label="Delete">
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                ) : (

                        actionButtons()

                    )}
            </div>
        </Toolbar>
    );
};

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
};
EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};