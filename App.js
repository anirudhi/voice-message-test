import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { AppLoading, Permissions } from 'expo';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from "expo-file-system";
import WaveForm from 'react-native-audiowaveform';

function WaveformList(props) {
  // return props.recordingArr.map((uri) =>
  //   // <Text>
  //   //   {uri}
  //   // </Text>
  //   <WaveForm
  //     source={require(uri)}
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

  recordingSettings = Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY;

  useEffect(() => {
    async function getPermission() {
      console.log('Requesting permissions..');
      const response = await Audio.requestPermissionsAsync();
      setRecordingPermission(response.status === "granted")
    }
    getPermission()
  }, []);

  updateScreenForRecordingStatus = (status) => {
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
    console.log(recordingArr.length)
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
          style={styles.ImageIconStyle}
        />
      </TouchableOpacity>
      <Text>{recordingStatus.isRecording ? "recording" : "not recording"}</Text>
      <WaveformList recordingArr={recordingArr} />
      <StatusBar style="auto" />
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
  }
});
