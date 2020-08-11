import React, {useState} from 'react';
import './App.css';
import {
  FormControl,
  Button,
  createStyles, Theme, Typography, Link, Box, Tooltip, TextField, FormControlLabel, Switch, Fade
} from '@material-ui/core';
import {makeStyles} from "@material-ui/core/styles";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import axios from "axios";
import {useGoogleReCaptcha} from 'react-google-recaptcha-v3';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formContainer: {
      textAlign: "center",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      top: "30%",
      left: "50%",
      transform: "translate(-50%, 0%)",
      minWidth: "325px",
      maxWidth: "600px"
    },
    appContainer: {
      height: "calc(100vh)",
      width: "calc(100vw)",
      position: "fixed",
      backgroundColor: "#323232"
    },
    input: {
      width: "100%"
    },
    inputBox: {
      textAlign: "left",
      alignItems: "left",
      paddingLeft: 18,
      paddingRight: 18,
      paddingBottom: 18
    },
    expItems: {
      textAlign: "left",
      alignItems: "left",
      paddingLeft: 18,
      paddingBottom: 18
    },
    shortenButton: {
      textAlign: "left",
      alignItems: "left",
      paddingLeft: 10
    },
    result: {
      textAlign: "center",
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      top: "10%",
      left: "50%",
      transform: "translate(-50%, 0%)",
      minWidth: "350px",
      maxWidth: "800px"
    },
    datePicker: {
      minWidth: "225px",
      width: "225px"
    }
  }),
);

function Form() {

  const [shortLink, setShortLink] = useState('');
  const [toLink, setToLink] = useState('');
  const [expires, setExpires] = useState(false);
  const [expirationDate, setExpirationDate] = useState('');

  const { executeRecaptcha } = useGoogleReCaptcha();

  const classes = useStyles();

  const createShortLink = () => {
    if(toLink && toLink.length > 0 && executeRecaptcha) {
      executeRecaptcha("create").then((recaptchaResponse) => {
        let hasProtocol = toLink.match(/^(http|https):\/\/.*/);
        let prefix = "";
        if(!hasProtocol || hasProtocol.length === 0)
          prefix = "http://";
        let offsetMatch = new Date().toString().match(/([-+][0-9]+)\s/);
        let offset = "-00:00";
        if(offsetMatch)
          offset = offsetMatch[1];
        axios.post(`/link?to=${prefix + toLink}&recaptchaResponse=${recaptchaResponse}${(expires ?
          "&expiration=" +expirationDate + ":00" + offset.substring(0,3) + ":" + offset.substring(3) : "")}`, {
          baseURL: "/"
        }).then((response) => {
          setShortLink(response.data.shortLink);
        })
          .catch((error) => {
            console.log(error)
          });
        setToLink(prefix + toLink);
      });
    }
  };

  return (
        <div className={classes.appContainer}>
          <Fade in={shortLink.length > 0}>
            <Box className={classes.result}>
              <Typography variant={"h5"}>
                <Link href={shortLink}>
                  {shortLink}
                </Link>
                {
                  document.queryCommandSupported('copy') &&
                  <Tooltip title={"Copy"}>
                      <Box mt={2}>
                          <Button onClick={() => {
                            navigator.clipboard.writeText(shortLink)
                          }}>
                              <FileCopyIcon/>
                          </Button>
                      </Box>
                  </Tooltip>
                }
              </Typography>
            </Box>
          </Fade>
          <div className={classes.formContainer}>
            <Box m={4}>
              <FormControl style={{width: "100%"}}>
                <Box className={classes.inputBox}>
                  <TextField label="Link" type="text" value={toLink} className={classes.input}
                             onKeyPress={(ev) => {
                               if (ev.key === 'Enter') {
                                 createShortLink();
                                 ev.preventDefault();
                               }
                             }}
                             onChange={event => setToLink(event.target.value)}/>
                </Box>
                <Box className={classes.expItems}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={expires}
                        onChange={() => {
                          setExpires(!expires);
                          setExpirationDate(
                            !expires ?
                              (new Date(new Date().getTime() + (1000 * 60 * 60 * 24))).toISOString().substring(0, 16)
                              : '');
                        }
                        }
                        name="checkedB"
                        color="primary"
                      />
                    }
                    label="Expires"
                  />
                  <TextField
                    className={classes.datePicker}
                    id="datetime-local"
                    type="datetime-local"
                    value={expirationDate}
                    onChange={(e: any) => setExpirationDate(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled={!expires}
                  />
                </Box>
                <Box className={classes.shortenButton}>
                  <Button onClick={createShortLink}>Shorten</Button>
                </Box>
              </FormControl>
            </Box>
          </div>
        </div>
  );
}

export default Form;