import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { AppLoading, Permissions } from 'expo';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Audio } from 'expo-av';
import WaveForm from 'react-native-audiowaveform';

export default function App() {
  const [recording, setRecording] = useState(null);
  const [hasRecordingPermission, setRecordingPermission] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState({
    isRecording: false,
    recordingDuration: null,
  });

  recordingSettings = Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY;


  useEffect(() => {
    console.log('Requesting permissions..');
    const response = await Audio.requestPermissionsAsync();
    setRecordingPermission(response.status === "granted")
  });

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
    if (hasRecordingPermission) {
      try {
        console.log('Starting recording..');
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
          playThroughEarpieceAndroid: false,
          staysActiveInBackground: true,
        });

        const curRecording = new Audio.Recording();
        await curRecording.prepareToRecordAsync(recordingSettings);
        curRecording.setOnRecordingStatusUpdate(updateScreenForRecordingStatus);
        setRecording(curRecording);
        await recording.startAsync(); // Will call updateScreenForRecordingStatus to update the screen.
        console.log('Recording started');
      } catch (err) {
        console.error('Failed to start recording', err);
      }
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    if (!recording) {
      return;
    }
    try {
      await recording.stopAndUnloadAsync();
    } catch (error) {
      // On Android, calling stop before any data has been collected results in
      // an E_AUDIO_NODATA error. This means no audio data has been written to
      // the output file is invalid.
      if (error.code === "E_AUDIO_NODATA") {
        console.log(
          `Stop was called too quickly, no data has yet been received (${error.message})`
        );
      } else {
        console.log("STOP ERROR: ", error.code, error.name, error.message);
      }
      this.setState({
        isLoading: false,
      });
      return;
    }
    const info = await FileSystem.getInfoAsync(recording.getURI() || "");
    console.log(`FILE INFO: ${JSON.stringify(info)}`);
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });
    // const { sound, status } = await this.recording.createNewLoadedSoundAsync(
    //   {
    //     isLooping: true,
    //     isMuted: this.state.muted,
    //     volume: this.state.volume,
    //     rate: this.state.rate,
    //     shouldCorrectPitch: this.state.shouldCorrectPitch,
    //   },
    //   this._updateScreenForSoundStatus
    // );
    // this.sound = sound;
    // this.setState({
    //   isLoading: false,
    // });
  }

  function onRecordPressed() {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // const waveform = recording ?
  //   (<WaveForm
  //     source={require(recording.getURI())}
  //     waveFormStyle={{ waveColor: 'red', scrubColor: 'white' }}
  //   >
  //   </WaveForm>) : null

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.ButtonStyle}
        onPress={onRecordPressed}
        onRelease={onRecordPressed}
      >
        <Image
          source={require('./assets/round_mic_black_48pt_3x.png')}
          style={styles.ImageIconStyle}
        />
      </TouchableOpacity>
      <Text>Press to record a voice memo</Text>
      {/* {waveform} */}
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
