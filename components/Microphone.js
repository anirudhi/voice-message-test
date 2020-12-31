import { Block } from "galio-framework";
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    Modal
} from 'react-native';
import { Audio } from 'expo-av';
import {
    MaterialCommunityIcons,
} from "@expo/vector-icons";
import IconFour from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');


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


export default function Microphone(props) {
    const [recording, setRecording] = useState(null);
    const [recordingArr, setRecordingArr] = useState([]);
    const [recordingStatus, setRecordingStatus] = useState({
        isRecording: false,
        recordingDuration: null,
    });
    let [isMicrophonePopUpVisible, setIsMicrophonePopUpVisible] = useState(false)

    recordingSettings = Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY;

    const renderModal = isMicrophonePopUpVisible ?
        (
            <View
                style={{
                    width: width,
                    backgroundColor: '#e8eaed',
                    height: height * 0.11,
                    paddingHorizontal: width * 0.02,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center'
                }}
            >
                <Modal
                    visible={isMicrophonePopUpVisible}
                    animationType="fade"
                    transparent={true}
                    onRequestClose={() => setIsMicrophonePopUpVisible(false)}
                >
                    <TouchableOpacity
                        style={styles.container}
                        onPress={() => setIsMicrophonePopUpVisible(false)}
                    >
                        <Block style={styles.attachment}>
                            <TouchableOpacity
                                style={{ alignItems: 'center', justifyContent: 'center' }}
                                onPress={() => saveRecording()}
                            >
                                <IconFour
                                    name="send"
                                    color="green"
                                    size={width * 0.06}
                                />
                            </TouchableOpacity>
                            <Text>{getMMSSFromMillis(recordingStatus.recordingDuration)}</Text>
                            <TouchableOpacity
                                style={{ alignItems: 'center', justifyContent: 'center' }}
                                onPress={() => stopRecording()}
                            >
                                <IconFour
                                    name="close"
                                    color="red"
                                    size={width * 0.06}
                                />
                            </TouchableOpacity>
                        </Block>
                    </TouchableOpacity>
                </Modal>
            </View>
        ) : null


    function updateRecordingStatus(status) {
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

    async function startRecording() {
        setRecording(null)
        try {
            console.log('Requesting permissions..');
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            console.log('Starting recording..');
            const new_recording = new Audio.Recording();
            await new_recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
            new_recording.setOnRecordingStatusUpdate(updateRecordingStatus);
            status = await new_recording.startAsync();
            setRecording(new_recording);
            setIsMicrophonePopUpVisible(true)
            console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    async function stopRecording() {
        console.log('Stopping recording..');
        status = await recording.stopAndUnloadAsync();
        updateRecordingStatus(status)
        const uri = recording.getURI();
        setRecordingArr(recordingArr.concat(uri))
        setRecording(null);
        console.log('Recording stopped and stored at', uri);
        return uri
    }

    async function saveRecording() {
        uri = await stopRecording()
        props.recordingUri(uri)
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => startRecording()}
                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
            >
                <View style={styles.controls}>
                    <MaterialCommunityIcons
                        name="microphone-settings"
                        size={25}
                        color="#4A4A4A"
                    />
                </View>
            </TouchableOpacity>
            { renderModal}
        </View >
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
    attachment: {
        position: "absolute",
        bottom: 50,
        backgroundColor: "#eee",
        paddingTop: 20,
        paddingBottom: 20,
        width: width,
        borderRadius: 10,
        flexDirection: "row",
        margin: 10,
    },
});
