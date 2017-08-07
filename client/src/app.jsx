import React from 'react';
import ReactDom from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { browserHistory, Router } from 'react-router';
import routes from './routes.js';
import Auth from './modules/Auth.js';

const axios = require('axios')
// remove tap delay, essential for MaterialUI to work properly
injectTapEventPlugin();

axios.interceptors.request.use(request => {
  axios.defaults.headers.common['Authorization'] = 'bearer ' + Auth.getToken();
  return request;
});

ReactDom.render((
  <MuiThemeProvider muiTheme={getMuiTheme()}>
    <Router history={browserHistory} routes={routes} />
  </MuiThemeProvider>), document.getElementById('react-app'));
