import React from 'react';
import Typography from '@material-ui/core/Typography';
import axios from "axios";
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  status: {
    danger: '#e91e63',
  },
});
const drawerWidth = 220;

export const inlineStyles = {
  root: {
    display: 'flex',
    flexGrow: 1,
    width: '100%',
    padding: 0,
    marginBottom: theme.spacing(2),
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: theme.backgroundColor,
    color: theme.color,
  },
  container: {
    padding: 5,
  },
  content: {
    flexGrow: 1,
    padding: '20px 10px',
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
    width: '100%',
    padding: '20px 10px',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  topPaper: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  table: {
    minWidth: 750,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  editform: {
    padding: '10px 16px 50px',
  },

  iconButton: {
    flex: 1,
    padding: 4,
  },
  smallIcon: {
    fontSize: 16,
    color: '#fff',
    marginRight: 5,
    marginBottom: 2,
  },

  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },

  buttonBlue: {
    whiteSpace: 'nowrap',
    backgroundColor: '#6495ed',
    '&:hover': {
      color: theme.hoverColor,
      backgroundColor: '#637282',
    }
  },

  spacer: {
    flex: '1 1 100%',
  },

  textField: {
    margin: 5,
    minWidth: 185,
  },
  button: {
    margin: 3,

  },
  toolbarActionBox: {
    padding: 10,
    textAlign: 'right',
    whiteSpace: 'nowrap',
  },
  footerBox: {
    padding: 10,
    textAlign: 'center',
  },
  listitem: {
    paddingTop: 8,
    paddingBottom: 8,
    borderTop: '1px solid #ecece7 !important',
  },
  sublistitem: {
    paddingTop: 0,
    paddingBottom: 3,
  },
  toolbarButtons: {
    marginLeft: "auto",
    marginRight: -12
  },
  hide: {
    display: 'none',
  },
  nested: {
    paddingLeft: 27,
    paddingTop: 3,
    paddingBottom: 3,
    color: '#1a6db7',

  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,

  },

  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    height: 40,
    justifyContent: 'flex-end',
  },

  itemIcon: {
    minWidth: 35,
  },
  linked: {
    textDecoration: 'none',
    color: 'white',
  },
  select: {
    margin: 5,
    width: 240,
    backgroundColor: 'white',
  },
  select_edit: {
    backgroundColor: 'white',
  },
  toolbar: { minHeight: 50 },

};

export class Global {

  /* The arguments have to be passed on directly sometimes because setState is delayed */
  static loadList = (t, values) => {
    var user = JSON.parse(sessionStorage.getItem('userdata'));
    if (typeof (user.token) === 'undefined' && !user.token) return;

    var isDataLoading = (typeof values.isDataLoading === 'undefined') ? t.state.isDataLoading : values.isDataLoading;

    if (isDataLoading) return;

    var order = (typeof values.order === 'undefined') ? t.state.order : values.order;
    var orderBy = (typeof values.orderBy === 'undefined') ? t.state.orderBy : values.orderBy;
    var rowsPerPage = (typeof values.rowsPerPage === 'undefined') ? t.state.rowsPerPage : values.rowsPerPage;
    var page = (typeof values.page === 'undefined') ? t.state.page : values.page;
    var searchFor = (typeof values.searchFor === 'undefined') ? t.state.searchFor : values.searchFor;
    var branchId = (typeof values.branchId === 'undefined') ? t.state.branchId : values.branchId;

    if (t.state.hasOwnProperty('isDialogDataLoading')) {
      t.setState({ isDialogDataLoading: true });
    }
    if (t.state.hasOwnProperty('isDataLoading')) {
      t.setState({ isDataLoading: true });
    }

    var formData = new FormData();
    formData.append('token', user.token);
    formData.append('user_id', user.userdata[0].id);
    formData.append('order', order);
    formData.append('orderBy', orderBy);
    formData.append('rowsPerPage', rowsPerPage);
    formData.append('page', page);
    formData.append('searchFor', searchFor);
    formData.append('branchId', branchId);

    axios(
      {
        method: 'post',
        url: t.state.url,
        data: formData,
        config: { headers: { 'Content-Type': 'multipart/form-data' } }
      })
      .then(res => res.data)
      .then(data => {
        if (data.error) {
          t.setComponentState('notification', data.error);
        } else {
          if (data.rows) {
            var rows = data.rows;
            t.setComponentState('notification', '');
            t.setComponentState('pageTotal', data.pages);
            t.setComponentState('count', data.total);
            t.setComponentState('rows', rows);
          } else {
            t.setComponentState('rows', []);
            t.setComponentState('notification', 'Error occurred. Contact the administrator.');
          }
        }
      })
      .catch(e => {
        t.setComponentState('notification', `${e}`);
      })
      .finally(function () {
        if (t.state.hasOwnProperty('isDialogDataLoading')) {
          t.setState({ isDialogDataLoading: false });
        }
        t.setComponentState('isLoading', false);
        if (t.state.hasOwnProperty('isDataLoading')) {
          t.setState({ isDataLoading: false });
        }
      });
  }

  static getDataRows = (t, url, stateRows) => {
    var user = JSON.parse(sessionStorage.getItem('userdata'));
    if (typeof (user.token) === 'undefined' && !user.token) return;

    var formData = new FormData();
    formData.append('token', user.token);
    formData.append('user_id', user.userdata[0].id);
    formData.append('action', 'getAll');
    axios(
      {
        method: 'post',
        url: url,
        data: formData,
      })
      .then(res => res.data)
      .then(data => {
        if (data.error) {
          console.log('error fetching the data');
          return [];
        } else {
          if (data.rows) {
            t.setState({ [stateRows]: data.rows });
          } else {
            console.log('error fetching the data');
            return [];
          }
        }
      })
      .catch(e => {
        console.log('Caught error: ', `${e}`);
        return [];
      });
  }
  static setStateValue = (t, name, v) => {
    var schema = t.state.schema;
    var values = { ...t.state.schema };
    schema.find((o, i) => {
      if (o.name === name) {
        values[i].value = v;
        return true;
      }
    });
    t.setState({ values });
  }
  static setStateValues = (t, data) => {
    var schema = t.state.schema;
    var values = { ...t.state.schema };
    for (var key in data.rows) {
      if (data.rows.hasOwnProperty(key)) {
        schema.find((o, i) => {
          if (o.name === key) {
            values[i].value = data.rows[key] === null ? '' : data.rows[key];
            return true;
          }
        });
      }
    }
    t.setState({ values });
  }
  static getOneRow = (t, id) => {
    var user = JSON.parse(sessionStorage.getItem('userdata'));
    if (typeof (user.token) === 'undefined' && !user.token) return;

    if (t.state.hasOwnProperty('isDialogDataLoading')) {
      t.setState({ isDialogDataLoading: true });
    } else {
      t.setState({ isDataLoading: true });
    }
    t.setState({ id: id });

    var formData = new FormData();
    formData.append('token', user.token);
    formData.append('user_id', user.userdata[0].id);
    formData.append('id', id);
    formData.append('action', 'select');
    axios(
      {
        method: 'post',
        url: t.state.url,
        data: formData,
      })
      .then(res => res.data)
      .then(data => {
        if (data.error) {
          t.setComponentState('notification', data.error);
        } else {
          if (data.rows) {
            this.setStateValues(t, data);
          } else {
            t.setComponentState('notification', 'error fetching the data');
          }
        }
      })
      .catch(e => {
        t.setComponentState('notification', `Getting one row: ${e}`);
      })
      .finally(function () {
        if (t.state.hasOwnProperty('isDialogDataLoading')) {
          t.setState({ isDialogDataLoading: false });
        }
        if (t.state.hasOwnProperty('isDataLoading')) {
          t.setState({ isDataLoading: false });
        }
      });
  }

  static getSchema = (t, dataForEdit) => {
    var user = JSON.parse(sessionStorage.getItem('userdata'));
    if (typeof (user.token) === 'undefined' && !user.token) return;

    t.setState({ isDataLoading: true });

    var formData = new FormData();
    formData.append('token', user.token);
    formData.append('user_id', user.userdata[0].id);
    formData.append('action', 'schema');
    axios(
      {
        method: 'post',
        url: t.state.url,
        data: formData,
      })
      .then(res => res.data)
      .then(data => {
        if (data.error) {
          t.setComponentState('notification', 'error fetching the data');
        } else {
          if (data.length) {
            t.setComponentState('schema', data);
          } else {
            t.setComponentState('notification', 'error fetching the data');

          }
        }
      })
      .catch(e => {
        t.setComponentState('notification', `${e}`);
      })
      .finally(function () {
        if (dataForEdit) {
          if (t.props.parentComponent.state.recordID) {
            Global.getOneRow(t, t.props.parentComponent.state.recordID);
          } else {
            t.setState({ isDataLoading: false });
          }
        } else {
          t.setState({ isDataLoading: true });
          Global.loadList(t, { isDataLoading: false });
        }
      });
  }

  static handleSaveForm = (t) => (e) => {
    e.preventDefault();
    var errorFound = this.validate(t);
    if (errorFound) {
      //t.setComponentState('notification','Fill up required fields');
      return;
    }
    let user = JSON.parse(sessionStorage.getItem('userdata'));
    if (typeof (user.token) === 'undefined' && !user.token) return;

    if (t.state.hasOwnProperty('isDialogDataLoading')) {
      t.setComponentState('isDialogDataLoading', true);
    } else {
      t.setComponentState('isDataLoading', true);
    }

    var formData = new FormData();
    formData.append('id', t.state.id);
    formData.append('user_id', user.userdata[0].id);
    formData.append('token', user.token);
    formData.append('action', 'save');

    var formValues = t.state.schema;
    var values = { ...t.state.schema };
    formValues.forEach((row, key) => {
      formData.append(row.name, row.value);
      values[key].error = '';
      t.setState({ values });
    })

    var result = '';
    var thisClass = this;
    axios(
      {
        method: 'post',
        url: t.state.url,
        data: formData,
      })
      .then(res => res.data)
      .then(data => {
        if (data.error) {
          t.setComponentState('notification', data.error);
        } else {
          if (data.result && data.result === 'success') {
            result = data.result;
            if (t.state.hasOwnProperty('redirectTo')) {
              result = 'redirected';
              var id = data.id ? data.id : 0;
              t.props.parentComponent.selectMenu(t.state.redirectTo, id, { msg: 'Record successfully saved', type: 'success' });

            } else {
              t.openSnackBar('Record successfully saved', 'success', true);
              if (t.state.hasOwnProperty('editDialogOpen')) {
                t.setComponentState('editDialogOpen', false);
              }
              if (t.state.hasOwnProperty('isDialogDataLoading')) { /* if saving from a dialog popup */
                // var values = {
                //   isDataLoading: false,
                //   page: 0
                // };
                // this.loadList(t, values);
              }
            }

          } else {
            t.setComponentState('notification', 'Error occurred. Contact the administrator.');
          }
        }
      })
      .catch(e => {
        t.setComponentState('notification', `${e}`);
      })
      .finally(function () {
        if (result === 'redirected') return;
        if (result === 'success' && t.state.hasOwnProperty('isDialogDataLoading')) {
          t.setComponentState('isDialogDataLoading', false);
          var values = {
            isDataLoading: false,
            page: 0
          };
          thisClass.loadList(t, values);
        }
        t.setComponentState('isDataLoading', false);
      });
  }

  static handleDialogCancel = (t) => {
    if (t.state.hasOwnProperty('editDialogOpen')) {
      t.setComponentState('editDialogOpen', false);
    }
    this.initializeEditDialogValues(t);
    this.loadList(t, {});
  }

  static initializeEditDialogValues = (t) => {
    /* initialize the values and error messages after closing the edit dialog for next edit */
    var formValues = t.state.schema;
    var values = { ...t.state.schema };
    formValues.forEach((row, key) => {
      values[key].error = '';
      values[key].value = '';
    })
    t.setState({ values });
  }

  static deleteRow = (t) => {
    let user = JSON.parse(sessionStorage.getItem('userdata'));
    if (typeof (user.token) === 'undefined' && !user.token) return;
    if (t.state.isDataLoading) return;

    if (t.state.hasOwnProperty('isDialogDataLoading')) {
      t.setComponentState('isDialogDataLoading', true);
    } else {
      t.setComponentState('isDataLoading', true);
    }

    var formData = new FormData();
    formData.append('id', t.state.id);
    formData.append('user_id', user.userdata[0].id);
    formData.append('token', user.token);
    formData.append('action', 'delete');

    axios(
      {
        method: 'post',
        url: t.state.url,
        data: formData,
      })
      .then(res => res.data)
      .then(data => {
        if (data.error) {
          t.setComponentState('notification', data.error);
        } else {
          if (data.result && data.result === 'success') {
            t.openSnackBar('Record successfully deleted', 'success', true);
          } else {
            t.setComponentState('notification', 'Error occurred. Contact the administrator.');
          }
        }
      })
      .catch(e => {
        t.setComponentState('notification', `${e}`);
      })
      .finally(function () {
        if (t.state.hasOwnProperty('deleteDialogOpen')) {
          t.setDeleteDialogOpen(false); /*loadList gets triggered here */
        }
        if (t.state.hasOwnProperty('isDialogDataLoading')) {
          t.setComponentState('isDialogDataLoading', false);
        }
      });
  }
  static setBranch = (t, v) => {
    t.setComponentState('branchId', v);
    var values = {
      branchId: v,
    };
    this.loadList(t, values);
  }

  static startSearch = (t) => {
    t.setComponentState('page', 0);
    this.loadList(t, { page: 0 });
  }

  static clearSearch = (t) => {
    t.setState({ searchFor: '' });
    t.setComponentState('page', 0);
    t.setComponentState('showClearSearchBtn', false);
    var values = {
      searchFor: '',
      page: 0,
    };
    this.loadList(t, values);
  }
  static validate = (t) => {
    var errorFound = false;
    var formValues = t.state.schema;
    var values = { ...t.state.schema };

    formValues.forEach((row, key) => {
      if (row.required && !row.value && row.name !== 'email') {
        values[key].error = row.label + ' is required';
        t.setState({ values });
        errorFound = true;
      } else if (row.name === 'email' && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(row.value)) {
        values[key].error = 'Invalid email';
        t.setState({ values });
        errorFound = true;
      }
    })
    return errorFound;
  }

  static isEmpty = (obj) => {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }

}

export function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}
