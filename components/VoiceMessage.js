import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ActivityIndicator,
    Button,
} from "react-native";
import COMMON_STYLES from "../assets/styles";
import moment from "moment";
import { MaterialIcons } from "@expo/vector-icons";
import Slider from '@react-native-community/slider';
import { Audio, FileSystem } from 'expo-av';



function onSeekSliderValueChange(value) {
    if (sound != null && !isSeeking) {
        isSeeking = true;
        sound.pauseAsync();
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

async function onSeekSliderSlidingComplete(value) {
    if (sound != null) {
        isSeeking = false;
        const seekPosition = value * (soundStatus.soundDuration || 0);
        sound.playFromPositionAsync(seekPosition);
    }
};


const VoiceMessage = ({ fromMe, message }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [sound, setSound] = useState(null)
    const [soundStatus, setSoundStatus] = useState({
        soundPosition: null,
        soundDuration: null,
        isPlaying: false,
        isPlaybackAllowed: false,
    });
    let isSeeking = false
    let { type, msg } = message
    let { time, file } = msg
    let url = file.split(':')
    console.log(url[0])

    // if (url[0] == "file") {
    //     file = FileSystem.documentDirectory + 
    // }


    async function playSound() {
        console.log('Loading Sound ' + file);
        const { sound } = await Audio.Sound.createAsync({ uri: file });
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    }

    let renderPlayback = (
        <View style={styles.container}>
            <Button title="Play Sound" onPress={playSound} />
        </View>
    );

    return (
        <View>
            <View style={styles.placeholders}>
                {isLoading ? (
                    <ActivityIndicator size="large" color={"#ccc"} />
                ) : hasError ? (
                    <MaterialIcons name="volume-off" color={"#ccc"} size={30} />
                ) : null}
            </View>
            <View
                style={[
                    COMMON_STYLES.message,
                    fromMe ? COMMON_STYLES.sentMessage : COMMON_STYLES.recievedMessage,
                ]}
            >
                {renderPlayback}
                <Text
                    style={
                        fromMe
                            ? COMMON_STYLES.sentMessageTimestamp
                            : COMMON_STYLES.recievedMessageTimestamp
                    }
                >
                    {moment(time).format("lll").toString()}
                </Text>
            </View>
        </View>
    );
};

export default VoiceMessage;

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
