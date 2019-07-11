import React from 'react'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';

const useWelcomeStyles = makeStyles(theme => ({    
    paper: {
        width: '100%',
        minHeight: 100,
        padding: 15,
        margin: 0,        
        position: 'relative',
    },
    paperHasHover: {
        '&:hover': {
            backgroundColor: '#e6f9fd'
        }
    },
    hasPointer: {
        cursor: 'pointer',      
    },

    typo1: {
        color: '#4bbbce',
        fontSize: 24,
        zIndex: 10,   
        position: 'relative',
        textShadow: '1px 1px #fff',
    },
    typo2: {
        color: '#8862e0',
        fontSize: 24,
        zIndex: 10,  
        position: 'relative',
        textShadow: '1px 1px #fff',
    },
    typo3: {
        color: '#2f8ee0',
        fontSize: 24,
        zIndex: 10,  
        position: 'relative',
        textShadow: '1px 1px #fff',
    },    
    typo4: {
        color: '#f24734',
        fontSize: 24,
        zIndex: 10,  
        position: 'relative',
        textShadow: '1px 1px #fff',
    },
    icon1: {
        color: '#4bbbce',
    },
    icon2: {
        color: '#8862e0',
        textShadow: ''
    },
    icon3: {
        color: '#2f8ee0',        
    },
    icon4: {
        color: '#f24734',
    },
    icon_color1: {
        color: '#b6e0aa',
    },    
    icon_onpaper: {
        fontSize: 55,
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,  
    },
    papertitle: {
        color: '#333',
        fontSize: 16,
    },
    subtitle: {
        color: '#333',
        fontSize: 14,
        zIndex: 10,  
        position: 'relative',
    },
    bottomlink: {
        position: 'absolute',
        right: 10,
        bottom: 5,       
        fontSize: 12,
        color: '#2196f3',
    }
}));
function showProcessing() {

}
function showForApproval() {

}
function showApproved() {

}
function showApprovedAll() {

}

function Welcome() {
    const classes = useWelcomeStyles();
        return (
            <React.Fragment>
                <Grid container spacing={2}>
                    
                    <Grid item xs={12} md={3}>
                        <Paper className={clsx(classes.paper,classes.hasPointer,classes.paperHasHover)} onClick={()=>showProcessing()}>
                        <i className={clsx(classes.icon1, 'material-icons',classes.icon_onpaper)}>donut_large</i>
                            <Typography className={classes.typo1}>
                                123
                            </Typography>
                            <Typography className={classes.subtitle}>
                                Processing
                            </Typography> 
                            <Typography className={classes.bottomlink}>
                                Click here
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item  xs={12} md={3}>
                        <Paper className={clsx(classes.paper,classes.hasPointer,classes.paperHasHover)} onClick={()=>showForApproval()}>
                        <i className={clsx(classes.icon2, 'material-icons',classes.icon_onpaper)}>thumbs_up_down</i>
                        <Typography className={classes.typo2}>
                                123
                            </Typography>
                            <Typography className={classes.subtitle}>
                                For Approval
                            </Typography> 
                            <Typography className={classes.bottomlink}>
                                Click here
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Paper className={clsx(classes.paper,classes.hasPointer,classes.paperHasHover)} onClick={()=>showApproved()}>
                        <i className={clsx(classes.icon3, 'material-icons',classes.icon_onpaper)}>check_circle</i>
                        <Typography className={classes.typo3}>
                                123
                            </Typography>
                            <Typography className={classes.subtitle}>
                                Approved
                            </Typography> 
                            <Typography className={classes.bottomlink}>
                                Click here
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Paper className={clsx(classes.paper,classes.hasPointer,classes.paperHasHover)} onClick={()=>showApprovedAll()}>
                        <i className={clsx(classes.icon4, 'material-icons',classes.icon_onpaper)}>monetization_on</i>
                        <Typography className={classes.typo4}>
                                123
                            </Typography>
                            <Typography className={classes.subtitle}>
                                All Approved
                            </Typography> 
                            <Typography className={classes.bottomlink}>
                                Click here
                            </Typography>
                        </Paper>
                    </Grid>
                
                    <Grid item xs={12} md={9}>
                        <Paper className={classes.paper} style={{minHeight: 400}}>
                        <i className={clsx(classes.icon_color1, 'material-icons',classes.icon_onpaper)}>insert_chart</i>
                        <Typography className={classes.papertitle}>
                                Charts
                            </Typography> 
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Paper className={classes.paper} style={{minHeight: 400}}>
                        <i className={clsx(classes.icon_color1, 'material-icons',classes.icon_onpaper)}>people</i>
                        <Typography className={classes.papertitle}>
                                Latest Clients
                            </Typography> 
                        </Paper>
                    </Grid>
                </Grid>
                <Typography style={{position: 'fixed',bottom: 5, right: 10, fontSize: 10}}>
                    YCFC - All Rights Reserved 2019
                </Typography> 
            </React.Fragment>
        )
    }

export default Welcome;