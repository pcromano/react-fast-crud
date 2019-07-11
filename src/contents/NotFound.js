import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography';

class NotFound extends Component {
    render() {
        return (
            <React.Fragment>
            <Typography className="h2">
                404 Not Found
            </Typography>
        </React.Fragment>
        )
    }
}

export default NotFound