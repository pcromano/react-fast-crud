import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { styled } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import axios from "axios";

function Footer() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {process.env.REACT_APP_COMPANY} - All Rights Reserved
    </Typography>
  );
}
const StyledAvatar = styled(Avatar)({
  margin: 'auto',
  backgroundColor: 'red',
});
const StyledPaper = styled(Paper)({
  alignItems: 'center',
  padding: 20,
});
const StyledBox = styled(Box)({
  margin: '5.5% auto',
  maxWidth: 460,
  position: 'relative',
  width: '90%'
})

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMsg: null,
      isLoading: false,
      referer: 'cas',
    }
  }
  send = (event) => {
    event.preventDefault();
    const formData = new FormData(this.form);
    formData.append('referdby', this.state.referer)
    let url = process.env.REACT_APP_LOGIN_URL;
    this.setState({ isLoading: true });
    sessionStorage.clear();
    axios(
      {
        method: 'post',
        url: url,
        data: formData,
        config: { headers: { 'Content-Type': 'multipart/form-data' } }
      })
        .then(res => res.data)
        .then(data => {
          console.log(data);
          if (data.error) {
            this.setState({ errorMsg: data.error });
            this.setState({ isLoading: false });
          } else {
            if (data.userdata[0].firstname) {
              let userdata = JSON.stringify(data, null, "\t");
              sessionStorage.setItem('userdata', userdata);
              this.setState({ errorMsg: null });
              window.location.reload();
            } else {
              this.setState({ errorMsg: 'Error occurred. Contact the administrator.' });
              this.setState({ isLoading: false });
            }
          }
        })
        .catch(e => {
          this.setState({ errorMsg: `${e}` });
          this.setState({ isLoading: false });
        });
  }
  render() {
    return (
      <StyledBox>
        <StyledPaper>
          <Container component="main" maxWidth="xs">
            <CssBaseline />

            <Typography component="h1" variant="h4" align="center">
              {process.env.REACT_APP_NAME}
        </Typography>
            <Box mt={2} >
              <StyledAvatar>
                <LockOutlinedIcon />
              </StyledAvatar>
            </Box>
            {this.state.errorMsg && <Box>
              <Typography color="error" align="center">
                {this.state.errorMsg}
              </Typography>
            </Box>}

            <form ref={el => (this.form = el)}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Username or Email Address"
                name="email"
                autoComplete="email"
                disabled={this.state.isLoading}
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                disabled={this.state.isLoading}
                autoComplete="current-password"
              />
              <Box mt={2}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={this.state.isLoading}
                  onClick={(e) => this.send(e)}
                >{this.state.isLoading ? "Signing in..." : "Sign In"}

                </Button>
              </Box>
              <Box mt={2}>
                <Typography align="center">
                  <Link href="#" variant="body2">
                    Forgot password?
              </Link>
                </Typography>
              </Box>
            </form>

          </Container>
        </StyledPaper>
        <Box mt={5}>
          <Footer />
        </Box>
      </StyledBox>
    );
  }
}

export default SignIn;