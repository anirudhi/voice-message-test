import React, { useEffect, useState } from "react";
import { Block } from "galio-framework";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ActivityIndicator,
    Button,
    Fragment,
    Dimensions,
} from "react-native";
import COMMON_STYLES from "../assets/styles";
import moment from "moment";
import { FontAwesome } from "@expo/vector-icons";
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system'

const { width } = Dimensions.get('window');

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
    let { uri, fileName } = file
    let url = uri.split(':')
    console.log(url[0])

    function updateScreenForSoundStatus(status) {
        if (status.isLoaded) {
            setSoundStatus({
                soundDuration: status.durationMillis,
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

    const getSeekSliderPosition = () => {
        if (
            sound != null &&
            soundStatus.soundPosition != null &&
            soundStatus.soundDuration != null
        ) {
            return soundStatus.soundPosition / soundStatus.soundDuration;
        }
        return 0;
    }

    const onPlayPausePressed = () => {
        console.log("pressed");
        if (sound != null) {
            if (soundStatus.isPlaying) {
                sound.pauseAsync();
            } else {
                if (soundStatus.soundPosition == soundStatus.soundDuration) {
                    sound.playFromPositionAsync(0)
                } else {
                    sound.playAsync();
                }
            }
        }
    };

    const getPlaybackTimestamp = () => {
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

    async function loadSound() {
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
        });
        console.log('Loading Sound ' + uri);
        const { sound } = await Audio.Sound.createAsync({ uri }, {}, updateScreenForSoundStatus, false);
        setSound(sound);
        // sound.setIsLoopingAsync(true)
    }

    useEffect(() => {
        loadSound();
    }, [])

    const renderPlayback = () => (
        <Block style={styles.container}>
            <TouchableOpacity
                onPress={() => onPlayPausePressed()}
                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                style={styles.ButtonStyle}
            >
                {soundStatus.isPlaying ?
                    <FontAwesome
                        name="pause"
                        size={15}
                        color="white"
                    />
                    :
                    <FontAwesome
                        name="play"
                        size={15}
                        color="white"
                    />}
            </TouchableOpacity>
            <Text style={styles.playbackTimestamp}>{getPlaybackTimestamp()}</Text>
            <Block style={{ flex: 1 }}>
                <Slider
                    minimumTrackTintColor={'#fff'}
                    value={getSeekSliderPosition()}
                    onSlidingComplete={onSeekSliderSlidingComplete}>

                </Slider>
            </Block>
        </Block>
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
                {renderPlayback()}
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
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: "row",
    },
    ButtonStyle: {
        paddingRight: 10
    },
    playbackContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "stretch",
    },
    playbackSlider: {
        alignSelf: "stretch",
    },
    playbackTimestamp: {
        paddingRight: 10,
        paddingLeft: 10,
        color: "#fff",
        width: width / 3 - 30
    },
});
