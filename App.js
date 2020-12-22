import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { AppLoading, Permissions } from 'expo';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Audio } from 'expo-av';



export default function App() {
  const [recording, setRecording] = useState();

  const onPress = () => startRecording()
  const onRelease = () => stopRecording()

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
      await recording.startAsync();
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);
  }


  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.ButtonStyle}
        onPress={onPress}
        onRelease={onRelease}
      >
        <Image
          source={require('./assets/round_mic_black_48pt_3x.png')}
          style={styles.ImageIconStyle}
        />
      </TouchableOpacity>
      <Text>Press to record a voice memo</Text>

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
