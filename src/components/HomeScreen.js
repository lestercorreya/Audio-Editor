import React, { useState } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  mainContainer: {
    backgroundImage: "url(/images/background.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "100vw",
    height: "100vh",
    padding: "50px",
  },
  errorText: {
    marginTop: "20px",
    color: "red",
    fontSize: "20px",
  },
}));

function HomeScreen() {
  const navigate = useNavigate();
  const classes = useStyles();
  const [errorText, setErrorText] = useState("");

  function fileUploaded(e) {
    if (
      e.target.value.split(`\\`).at(-1).split(".").at(-1) == "mp3" ||
      e.target.value.split(`\\`).at(-1).split(".").at(-1) == "wav"
    ) {
      let src = URL.createObjectURL(e.target.files[0]);
      navigate("/play", { state: { src: src } });
    } else {
      setErrorText("Please upload .mp3 or .wav file");
    }
  }

  return (
    <div className={classes.mainContainer}>
      <input
        style={{ display: "none" }}
        id="contained-button-file"
        type="file"
        onChange={fileUploaded}
      />
      <label htmlFor="contained-button-file">
        <Button variant="contained" color="error" component="span">
          Upload an Audio
        </Button>
      </label>
      <div className={classes.errorText}>{errorText}</div>
    </div>
  );
}

export default HomeScreen;
