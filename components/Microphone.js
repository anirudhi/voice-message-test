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
    AntDesign,
    MaterialCommunityIcons,
    FontAwesome,
} from "@expo/vector-icons";
import COMMON_STYLES from '../App'
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

function Microphone(props) {
    const [recording, setRecording] = useState(null);
    const [recordingArr, setRecordingArr] = useState([]);
    const [recordingStatus, setRecordingStatus] = useState({
        isRecording: false,
        recordingDuration: null,
    });
    let [isMicrophonePopUpVisible, setIsMicrophonePopUpVisible] = useState(false)

    recordingSettings = Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY;


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

    const renderModal = isMicrophonePopUpVisible ?
        (
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
                            onPress={() => saveRecording()}
                            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                        >
                            <View style={[styles.buttons, COMMON_STYLES.shadow]}>
                                <MaterialCommunityIcons
                                    name="send"
                                    size={25}
                                    color="green"
                                />
                            </View>
                        </TouchableOpacity>
                        <Text>{getMMSSFromMillis(recordingStatus.recordingDuration)}</Text>
                        <TouchableOpacity
                            onPress={() => stopRecording()}
                            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}

                        >
                            <View style={[styles.buttons, COMMON_STYLES.shadow]}>
                                <MaterialCommunityIcons
                                    name="close"
                                    color="red"
                                    size={25}
                                />
                            </View>
                        </TouchableOpacity>
                    </Block>
                </TouchableOpacity>
            </Modal>
        ) : null

    return (
        <View>
            <TouchableOpacity
                style={styles.container}
                onPress={() => {
                    startRecording();
                    setIsMicrophonePopUpVisible(true)
                }}
                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
            >
                <View style={{ padding: 12 }}>
                    <FontAwesome name="microphone" size={25} color="#4A4A4A" />
                </View>
            </TouchableOpacity>
            {renderModal}
        </View>
    );
}

export default Microphone;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    ButtonStyle: {
        backgroundColor: '#9DEBD9',
        padding: 10
    },
    attachment: {
        position: "absolute",
        bottom: 90,
        backgroundColor: "#eee",
        paddingTop: 20,
        paddingBottom: 20,
        width: width - 20,
        borderRadius: 10,
        flexDirection: "row",
        margin: 10,
    },
    sendBox: {
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: "#EFEFEF",
        flexDirection: "row",
        alignItems: "center",
    },
    messageInput: {
        borderWidth: 0,
        borderColor: '#ffffff',
        height: 50,
        fontFamily: "SourceSansPro-Regular",
        backgroundColor: "#FFF",
        borderColor: "#DEDEDE",
        margin: 0,
        width: width - width / 3,
    },
    controls: {
        padding: 12,
    },
    buttons: {
        padding: 20,
        marginLeft: 10,
        backgroundColor: "#fff",
        borderRadius: 50,
    },
});
