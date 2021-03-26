import { React, useState, useContext } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { useStyles } from "./styles";
import { Link as RouterLink, useHistory } from "react-router-dom";
import Container from "@material-ui/core/Container";
import axios from "axios";
import { GlobalContext } from "../../ContextProvider";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="http://localhost/">
        Memories
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
export default function Register() {
  const history = useHistory();
  const classes = useStyles();
  const [formFirstName, setFormFirstName] = useState(""),
    [formLastName, setFormLastName] = useState(""),
    [formEmail, setFormEmail] = useState(""),
    [formPassword, setFormPassword] = useState("");
  const { authToken, isLoggedIn } = useContext(GlobalContext);

  const [authTokenValue, setAuthTokenValue] = authToken;
  const [isLoggedInValue, setIsLoggedInValue] = isLoggedIn;

  const [badFirstName, setBadFirstName] = useState(false);
  const [badLastName, setBadLastName] = useState(false);
  const [badEmail, setBadEmail] = useState(false);
  const [badPassword, setBadPassword] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const registerHandler = async (e) => {
    setLoading(true);
    e.preventDefault();
    const ip = await axios.get("https://ipinfo.io/json?token=da153d332a0738");
    axios
      .post("http://localhost:8000/api/register", {
        firstName: formFirstName,
        lastName: formLastName,
        email: formEmail,
        password: formPassword,
        ipAddress: ip.data.ip,
      })
      .then((response) => {
        if (response.status === 200) {
          setLoading(false);
          setIsLoggedInValue(true);
          const token = response.headers["auth-token"];
          setAuthTokenValue(token);
          localStorage.setItem("authToken", token);
          history.push("/");
        }
      })
      .catch((error) => {
        setLoading(false);
        const data = error.response.data;
        switch (data.errorStatus) {
          case "SHORTPASSWORD":
          case "LONGPASSWORD":
          case "EMPTYPASSWORD":
            setBadPassword(true);
            setFormPassword("");
            break;
          case "SHORTEMAIL":
          case "LONGEMAIL":
          case "BADEMAIL":
          case "USEREXISTS":
          case "EMPTYEMAIL":
            setBadEmail(true);
            setFormEmail("");
            break;
          case "SHORTFIRSTNAME":
          case "LONGFIRSTNAME":
          case "EMPTYFIRSTNAME":
            setBadFirstName(true);
            setFormFirstName("");
            break;
          case "SHORTLASTNAME":
          case "LONGLASTNAME":
          case "EMPTYLASTNAME":
            setBadLastName(true);
            setFormLastName("");
            break;
          default:
            break;
        }
        setErrorMessage(data.errorMessage);
      });
  };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                error={badFirstName}
                onFocus={() => {
                  setBadFirstName(false);
                  setErrorMessage("");
                }}
                fullWidth
                onChange={(e) => {
                  setFormFirstName(e.target.value);
                }}
                value={formFirstName}
                id="firstName"
                label="First Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                error={badLastName}
                onFocus={() => {
                  setBadLastName(false);
                  setErrorMessage("");
                }}
                name="lastName"
                onChange={(e) => {
                  setFormLastName(e.target.value);
                }}
                value={formLastName}
                autoComplete="lname"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                error={badEmail}
                onChange={(e) => {
                  setFormEmail(e.target.value);
                }}
                onFocus={() => {
                  setBadEmail(false);
                  setErrorMessage("");
                }}
                value={formEmail}
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                error={badPassword}
                onChange={(e) => {
                  setFormPassword(e.target.value);
                }}
                onFocus={() => {
                  setBadPassword(false);
                  setErrorMessage("");
                }}
                value={formPassword}
                autoComplete="current-password"
              />
            </Grid>
          </Grid>
          {errorMessage !== "" && (
            <Typography
              variant={"body1"}
              align="center"
              color="error"
              style={{ marginTop: "24px" }}
            >
              {errorMessage}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={(e) => registerHandler(e)}
            className={classes.submit}
            disabled={loading}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <RouterLink to="/Login" variant="body2">
                Already have an account? Sign in
              </RouterLink>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
