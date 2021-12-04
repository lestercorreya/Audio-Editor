import { makeStyles } from "@mui/styles";
import React, { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import WaveSurfer from "wavesurfer.js";
import RegionPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min.js";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js";
import MarkerPlugin from "wavesurfer.js/dist/plugin/wavesurfer.markers.min.js";
import Switch from "./Switch";
import {
  Pause,
  PlayArrow,
  Replay,
  ContentCut,
  VolumeDown,
  VolumeUp,
  AddCircle,
  RemoveCircle,
} from "@mui/icons-material";

const useStyles = makeStyles(() => ({
  controls: {
    display: "flex",
    marginTop: "20px",
    justifyContent: "space-around",
  },
  trimButton: {
    display: "flex",
    cursor: "pointer",
    boxShadow:
      "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
    border: "none",
    backgroundColor: "#00003d",
    color: "#FAF9F6",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "5px",
    padding: "5px 7px",
  },
  volumeSlider: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  zoomSlider: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  trimButtonHint: {
    width: "150px",
    backgroundColor: "rgba(0,0,0,0.9)",
    color: "#FAF9F6",
    textAlign: "center",
    padding: "10px",
    borderRadius: "20px",
    position: "absolute",
    top: "50px",
  },
  trimButtonContainer: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
}));

const buttonStyles = {
  cursor: "pointer",
  borderRadius: "50%",
  padding: "5px",
  boxShadow:
    "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
};

function Player() {
  const classes = useStyles();
  const waveformRef = useRef();
  const timelineRef = useRef();
  const [isPlaying, setIsPlaying] = useState(true);
  const { state } = useLocation();
  const { src } = state;
  const navigate = useNavigate();
  const [initialDuration, setInitialDuration] = useState();
  const [wavesurfer, setWavesurfer] = useState(undefined);
  const [showTrimButtonHint, setShowTrimButtonHint] = useState(false);

  useEffect(() => {
    if (waveformRef.current) {
      let tempWaveSurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "cornflowerBlue",
        progressColor: "darkBlue",
        plugins: [
          RegionPlugin.create({}),
          MarkerPlugin.create({}),
          TimelinePlugin.create({
            container: timelineRef.current,
            timeInterval: 0.2,
            height: 10,
          }),
        ],
      });

      setWavesurfer(tempWaveSurfer);

      tempWaveSurfer.on("region-update-end", function (region) {
        tempWaveSurfer.clearMarkers();

        tempWaveSurfer.addMarker({
          time: region.start,
          label: "A",
          color: "#ff990a",
          position: "top",
        });

        tempWaveSurfer.addMarker({
          time: region.end,
          label: "B",
          color: "#00ffcc",
          position: "top",
        });
      });

      tempWaveSurfer.load(src);

      tempWaveSurfer.on("error", function () {
        navigate("/");
      });

      tempWaveSurfer.on("ready", function () {
        setInitialDuration((prev) => {
          if (!prev) return tempWaveSurfer.getDuration();
          return prev;
        });

        tempWaveSurfer.play();

        tempWaveSurfer.addRegion({
          start: 0,
          end: tempWaveSurfer.getDuration(),
          color: "hsla(10, 10%, 10%, 0.1)",
          loop: false,
          multiple: false,
        });

        tempWaveSurfer.addMarker({
          time: 0,
          label: "A",
          color: "#ff990a",
          position: "top",
        });

        tempWaveSurfer.addMarker({
          time: tempWaveSurfer.getDuration(),
          label: "B",
          color: "#00ffcc",
          position: "top",
        });
      });
    }
  }, []);

  function pauseClicked() {
    if (!wavesurfer) return;
    setIsPlaying(false);
    wavesurfer.pause();
  }

  function playClicked() {
    if (!wavesurfer) return;
    setIsPlaying(true);
    wavesurfer.play();
  }

  function replayClicked() {
    if (!wavesurfer) return;
    wavesurfer.play(0);
    setIsPlaying(true);
  }

  function volumeChanged(e) {
    if (!wavesurfer) return;
    wavesurfer.setVolume(e.target.value);
  }

  function zoomChanged(e, initialDuration) {
    console.log(initialDuration);

    wavesurfer.zoom(
      e.target.value * (initialDuration / wavesurfer.getDuration())
    );
  }

  function trim() {
    if (!wavesurfer) return;
    const start =
      wavesurfer.regions.list[
        Object.keys(wavesurfer.regions.list)[0]
      ].start.toFixed(2);
    const end =
      wavesurfer.regions.list[
        Object.keys(wavesurfer.regions.list)[0]
      ].end.toFixed(2);
    const originalBuffer = wavesurfer.backend.buffer;
    var emptySegment = wavesurfer.backend.ac.createBuffer(
      originalBuffer.numberOfChannels,
      (end - start) * (originalBuffer.sampleRate * 1),
      originalBuffer.sampleRate
    );

    for (var i = 0; i < originalBuffer.numberOfChannels; i++) {
      var chanData = originalBuffer.getChannelData(i);
      var segmentChanData = emptySegment.getChannelData(i);
      for (
        var j = 0, len = chanData.length;
        j < end * originalBuffer.sampleRate;
        j++
      ) {
        segmentChanData[j] = chanData[j + start * originalBuffer.sampleRate];
      }
    }

    wavesurfer.loadDecodedBuffer(emptySegment);

    wavesurfer.clearRegions();

    wavesurfer.addRegion({
      start: 0,
      end: wavesurfer.getDuration(),
      color: "hsla(10, 10%, 10%, 0.1)",
      loop: false,
      multiple: false,
    });

    setIsPlaying(true);
  }

  return (
    <>
      <div ref={waveformRef} className={classes.player}></div>
      <div ref={timelineRef} className={classes.timeline}></div>
      <div className={classes.controls}>
        <Switch />
        {isPlaying && (
          <Pause onClick={pauseClicked} style={buttonStyles} fontSize="large" />
        )}
        {!isPlaying && (
          <PlayArrow
            onClick={playClicked}
            style={buttonStyles}
            fontSize="large"
          />
        )}
        <Replay onClick={replayClicked} style={buttonStyles} fontSize="large" />
        <div className={classes.trimButtonContainer}>
          <button
            className={classes.trimButton}
            onClick={trim}
            onMouseEnter={() => setShowTrimButtonHint(true)}
            onMouseLeave={() => setShowTrimButtonHint(false)}
          >
            <ContentCut fontSize="small" />
            <span style={{ marginLeft: "5px" }}>Trim</span>
          </button>
          {showTrimButtonHint && (
            <div className={classes.trimButtonHint}>
              Please drag the markers A and B located at the start and end of
              the audio
            </div>
          )}
        </div>
        <div className={classes.volumeSlider}>
          <VolumeDown />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            onChange={(e) => volumeChanged(e)}
          />
          <VolumeUp />
        </div>
        <div className={classes.zoomSlider}>
          <RemoveCircle fontSize="small" />
          <input
            type="range"
            min="50"
            max="200"
            onChange={(e) => zoomChanged(e, initialDuration)}
          />
          <AddCircle fontSize="small" />
        </div>
      </div>
    </>
  );
}

export default Player;
