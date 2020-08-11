import React from 'react';
import './App.css';
import {
  CssBaseline,
  ThemeProvider,
  createMuiTheme
} from '@material-ui/core';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import Form from "./Form";

function App() {

  const theme = createMuiTheme({
    palette: {
      type: "dark"
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GoogleReCaptchaProvider reCaptchaKey="6Lecn70ZAAAAAKcMJxr_Aw6qMgZ74UaypsEuLZcf">
       <Form />
      </GoogleReCaptchaProvider>
    </ThemeProvider>
  );
}

export default App;
