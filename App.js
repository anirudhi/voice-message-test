import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { AppLoading, Permissions } from 'expo';
import { StyleSheet, Text, View, TouchableOpacity, TouchableHighlight, Image } from 'react-native';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import * as FileSystem from "expo-file-system";
// import WaveForm from 'react-native-audiowaveform';

const BACKGROUND_COLOR = "#FFF8ED";


function WaveformList(props) {
  // return props.recordingArr.map((uri) =>
  //   // <Text>
  //   //   {uri}
  //   // </Text>
  //   <WaveForm
  //     source={uri}
  //     waveFormStyle={{ waveColor: 'red', scrubColor: 'white' }}
  //   >
  //   </WaveForm>
  // );
  return (<Text>{props.recordingArr[props.recordingArr.length - 1]}</Text>)
}

export default function App() {
  const [recording, setRecording] = useState(null);
  const [recordingArr, setRecordingArr] = useState([]);
  const [hasRecordingPermission, setRecordingPermission] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState({
    isRecording: false,
    recordingDuration: null,
  });
  const [soundStatus, setSoundStatus] = useState({
    soundPosition: null,
    soundDuration: null,
    isPlaying: false,
    isPlaybackAllowed: false,
  });

  let sound = null
  let isSeeking = false

  recordingSettings = Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY;

  function updateScreenForRecordingStatus(status) {
    if (status.canRecord) {
      setRecordingStatus({
        isRecording: status.isRecording,
        recordingDuration: status.durationMillis,
      });
    } else if (status.isDoneRecording) {
      setRecordingStatus({
        isRecording: false,
        recordingDuration: status.durationMillis,
      });
    }
  }

  function updateScreenForSoundStatus(status) {
    if (status.isLoaded) {
      setSoundStatus({
        soundDuration: status.durationMillis ?? null,
        soundPosition: status.positionMillis,
        isPlaying: status.isPlaying,
        isPlaybackAllowed: true,
      });
    } else {
      setSoundStatus({
        soundDuration: null,
        soundPosition: null,
        isPlaybackAllowed: false,
      });
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  }

  function getMMSSFromMillis(millis) {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);

    const padWithZero = (number) => {
      const string = number.toString();
      if (number < 10) {
        return "0" + string;
      }
      return string;
    };
    return padWithZero(minutes) + ":" + padWithZero(seconds);
  }

  function onSeekSliderValueChange(value) {
    if (sound != null && !isSeeking) {
      isSeeking = true;
      sound.pauseAsync();
    }
  };

  async function onSeekSliderSlidingComplete(value) {
    if (sound != null) {
      isSeeking = false;
      const seekPosition = value * (soundStatus.soundDuration || 0);
      sound.playFromPositionAsync(seekPosition);
    }
  };

  function getSeekSliderPosition() {
    if (
      sound != null &&
      soundStatus.soundPosition != null &&
      soundStatus.soundDuration != null
    ) {
      return soundStatus.soundPosition / soundStatus.soundDuration;
    }
    return 0;
  }

  function getPlaybackTimestamp() {
    if (
      sound != null &&
      soundStatus.soundPosition != null &&
      soundStatus.soundDuration != null
    ) {
      return `${getMMSSFromMillis(
        soundStatus.soundPosition
      )} / ${getMMSSFromMillis(soundStatus.soundDuration)}`;
    }
    return "";
  }

  function onPlayPausePressed() {
    if (sound != null) {
      if (soundStatus.isPlaying) {
        sound.pauseAsync();
      } else {
        sound.playAsync();
      }
    }
  };

  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log('Starting recording..');
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      status = await recording.startAsync();
      updateScreenForRecordingStatus(status)
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(null);
    status = await recording.stopAndUnloadAsync();
    updateScreenForRecordingStatus(status)
    const uri = recording.getURI();
    setRecordingArr(recordingArr.concat(uri))
    console.log('Recording stopped and stored at', uri);
    // Get sound for playback
    const { new_sound, status } = await recording.createNewLoadedSoundAsync(
      {
        isLooping: true,
        isMuted: false,
        volume: 1.0,
        rate: 1.0,
        shouldCorrectPitch: true,
      },
      updateScreenForSoundStatus
    );
    sound = new_sound;
  }


  let waveform = recordingArr.length > 0 ?
    recordingArr.map((info) => {
      <Text>
        {JSON.stringify(info)}
      </Text>
    }) : null

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.ButtonStyle}
        onPressIn={startRecording}
        onPressOut={stopRecording}
      >
        <Image
          source={require('./assets/round_mic_black_48pt_3x.png')}
        />
      </TouchableOpacity>
      <Text>{recordingStatus.isRecording ? "recording" : "not recording"}</Text>
      <WaveformList recordingArr={recordingArr} />
      <StatusBar style="auto" />
      <View style={styles.playbackContainer}>
        <TouchableHighlight
          underlayColor={BACKGROUND_COLOR}
          style={styles.wrapper}
          onPress={onPlayPausePressed}
        // disabled={!this.state.isPlaybackAllowed || this.state.isLoading}
        >
          <Image
            style={styles.image}
            source={
              soundStatus.isPlaying
                ? require('./assets/baseline_pause_black_18dp.png')
                : require('./assets/baseline_play_arrow_black_18dp.png')
            }
          />
        </TouchableHighlight>
        <Slider
          style={styles.playbackSlider}
          // trackImage={Icons.TRACK_1.module}
          // thumbImage={Icons.THUMB_1.module}
          value={getSeekSliderPosition}
          onValueChange={onSeekSliderValueChange}
          onSlidingComplete={onSeekSliderSlidingComplete}
        // disabled={!this.state.isPlaybackAllowed || this.state.isLoading}
        />
        <Text>
          {getPlaybackTimestamp()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ButtonStyle: {
    backgroundColor: '#9DEBD9',
    padding: 10
  },
  playbackContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    // minHeight: Icons.THUMB_1.height * 2.0,
    // maxHeight: Icons.THUMB_1.height * 2.0,
  },
  playbackSlider: {
    alignSelf: "stretch",
  },
  playbackTimestamp: {
    textAlign: "right",
    alignSelf: "stretch",
    paddingRight: 20,
  },
});
