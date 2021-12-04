import { makeStyles } from "@mui/styles";
import React, { useState } from "react";
import { SupportAgent, Person } from "@mui/icons-material";

const useStyles = makeStyles(() => ({
  track: {
    cursor: "pointer",
    width: "60px",
    height: "15px",
    backgroundColor: "#002244",
    color: "#FAF9F6",
    borderRadius: "10px",
    border: "2px solid black",
    display: "flex",
    position: "relative",
    fontSize: "10px",
    padding: "10px 0",
    alignItems: "center",
  },
  knob: {
    width: "30px",
    backgroundColor: "#1F305E",
    height: "30px",
    borderRadius: "50%",
    border: "2px solid black",
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    transition: "transform 250ms",
    transform: (xpos) => {
      return `translateX(${xpos}px)`;
    },
  },
  agentText: {
    marginLeft: "20px",
    marginRight: "5px",
  },
  customerText: {
    marginRight: "18px",
    marginLeft: "5px",
  },
}));

function Switch() {
  const [isOn, setIsOn] = useState(true);
  const [xpos, setXpos] = useState(-15);
  const classes = useStyles(xpos);

  return (
    <div
      className={classes.track}
      onClick={() => {
        isOn ? setXpos(45) : setXpos(-15);
        setIsOn(!isOn);
      }}
    >
      {isOn && <span className={classes.agentText}>Agent</span>}
      {!isOn && <span className={classes.customerText}>Customer</span>}
      <div className={classes.knob}>
        {!isOn && <Person />}
        {isOn && <SupportAgent />}
      </div>
    </div>
  );
}

export default Switch;
