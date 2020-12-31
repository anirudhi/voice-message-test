import { Block, Input } from "galio-framework";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Modal,
} from "react-native";
import {
  AntDesign,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import Microphone from "./components/Microphone";
const { width } = Dimensions.get("window");

const SendBox = () => {
  const [message, setMessage] = useState("");
  return (
    <Block style={styles.sendBox}>
      <Input
        value={message}
        onChangeText={(e) => {
          setMessage(e);
        }}
        color="#4A4A4A"
        placeholder="Type your message..."
        placeholderTextColor="#4A4A4A"
        style={styles.messageInput}
      />
      <View
        style={{
          flexDirection: "row",
          width: width / 4,
        }}
      >
        <TouchableOpacity
          onPress={() => console.log("Send")}
          hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
        >
          <View style={styles.controls}>
            <FontAwesome name="send" size={25} color="#4A4A4A" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => console.log("Attach")}
          hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
        >
          <View style={styles.controls}>
            <AntDesign name="paperclip" size={25} color="#4A4A4A" />
          </View>
        </TouchableOpacity>
        <Microphone recordingUri={(uri) => { console.log(uri) }} />
      </View>
    </Block>
  );
};

const styles = StyleSheet.create({
  sendBox: {
    padding: 10,
    marginTop: 800,
    borderTopWidth: 1,
    borderTopColor: "#EFEFEF",
    flexDirection: "row",
    alignItems: "center",
  },
  messageInput: {
    borderWidth: 0,
    borderColor: "#FFFFFF",
    height: 50,
    fontFamily: "SourceSansPro-Regular",
    backgroundColor: "#FFF",
    borderColor: "#DEDEDE",
    margin: 0,
    width: width - width / 3,
  },
  controls: {
    padding: 10,
  },
});

export default SendBox;
