import React from 'react';
import {AppBar, Container, CssBaseline, Fab, IconButton, Toolbar, Typography} from "@material-ui/core";
import {Add as AddIcon, Menu as MenuIcon} from '@material-ui/icons';
import {makeStyles} from "@material-ui/core/styles";
import './App.css';
import FlagsPage from "./FlagsPage";
import NewFlagModal from "./NewFlagModal";
import ApolloClient from 'apollo-boost';
import {ApolloProvider} from '@apollo/react-hooks';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

const client = new ApolloClient({
  uri: 'http://localhost:8081/query',
});

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  addFlag: {
    position: 'fixed',
    right: 50,
    bottom: 50,
  }
}));

function App() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          <CssBaseline/>
          <AppBar position="static">
            <Toolbar>
              <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                <MenuIcon/>
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                Flaggio
              </Typography>
            </Toolbar>
          </AppBar>
          <Container fixed>
            <Switch>
              <Route exact path="/">
                <FlagsPage/>
              </Route>
              <Route path="/flags">
                <FlagsPage/>
              </Route>
            </Switch>
          </Container>
          <NewFlagModal open={open} handleClose={handleClose}/>
          <Fab color="primary" aria-label="add" className={classes.addFlag} onClick={handleClickOpen}>
            <AddIcon/>
          </Fab>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
