import { React, useState, useEffect, useContext } from "react";
import {
  Container,
  Typography,
  Grow,
  Grid,
  AppBar,
  ThemeProvider,
  useMediaQuery,
} from "@material-ui/core";
import memories from "../images/memories.png";
import useStyles from "../styles";
import Form from "./Form";
import axios from "axios";
import Posts from "./Posts";
import { theme } from "../Theme";
import loading from "../images/loading.gif";
import { GlobalContext } from "../ContextProvider";
import { Redirect } from "react-router-dom";

function App() {
  const classes = useStyles();

  const { posts, authToken, isLoggedIn } = useContext(GlobalContext);
  const [postsValue, setPostsValue] = posts;
  const [authTokenValue, setAuthTokenValue] = authToken;
  const [isLoggedInValue, setIsLoggedInValue] = isLoggedIn;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getPosts = () => {
      axios
        .get("http://localhost:8000/posts/", {
          headers: {
            authToken: authTokenValue,
          },
        })
        .then((response) => {
          setIsLoading(false);
          if (response.status === 200) {
            setPostsValue(response.data);
          } else {
            console.log(response);
          }
        })
        .catch((error) => console.log(error));
    };
    if (isLoggedInValue) {
      getPosts();
    }
  }, [isLoggedInValue, authTokenValue, setPostsValue]);
  const matchesXs = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <ThemeProvider theme={theme}>
      {isLoggedIn && (
        <Container maxWidth="lg">
          <AppBar position="static" color="inherit" className={classes.appBar}>
            <Typography className={classes.heading} variant="h2" align="center">
              Memories
            </Typography>
            <img
              src={memories}
              alt="memories"
              height="40"
              className={classes.image}
            />
          </AppBar>
          <Grow in>
            <Container>
              <Grid
                container
                justify="center"
                alignItems="stretch"
                spacing={3}
                direction={matchesXs ? "column-reverse" : "row"}
              >
                <Grid
                  item
                  xs={12}
                  md={8}
                  container
                  justify="center"
                  alignItems="center"
                >
                  {!isLoading ? <Posts /> : <img src={loading} alt="loading" />}
                </Grid>
                <Grid item xs={12} md={4}>
                  <Form />
                </Grid>
              </Grid>
            </Container>
          </Grow>
        </Container>
      )}
      {!isLoggedInValue && <Redirect to="/Login" />}
    </ThemeProvider>
  );
}

export default App;
