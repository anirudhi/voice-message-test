import { Block, Input, Text } from "galio-framework";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
} from "react-native";
import {
  AntDesign,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import Microphone from "./components/Microphone";
import React, { useRef } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
} from "react-native";
import Header from "../AppHome/Header";
import VoiceMessage from "./components/VoiceMessage";

const { width } = Dimensions.get("window");
const PUBLIC_CONVERSATION_ID = "123456789";
const PUBLIC_RECIEVER_ID = "00000";

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

const { width, height } = Dimensions.get("window");

const PublicChat = () => {
  const [publicConversations, setPublicConversations] = useState([])
  const scrollViewRef = useRef(null);

  const renderMessages = () => {
    return publicConversations.map((msg, index) => {
      return (
        <View
          style={{
            flexDirection: "row",
          }}
          key={`msg-${index}`}
        >
          {msg.type === "voice" ? (
            <VoiceMessage fromMe={true} message={msg} />
          ) : null}
        </View>
      );
    });
  };

  return (
    <SafeAreaView>
      <KeyboardAvoidingView
        style={{
          backgroundColor: "white",
          height: height,
          width: width,
          justifyContent: "space-between",
        }}
        behavior="height"
        keyboardVerticalOffset={30}
      >
        <Block flex style={styles.container}>
          <Header title="#Public Conversations" enableGoBack={true} />
          {publicConversations.length === 0 ? (
            <Text>Start a conversation...</Text>
          ) : (
              <ScrollView
                ref={scrollViewRef}
                onContentSizeChange={(contentWidth, contentHeight) => {
                  scrollViewRef.current.scrollToEnd({ animated: false });
                }}
                contentContainerStyle={[COMMON_STYLES.chatContainer]}
              >
                {renderMessages()}
              </ScrollView>
            )}
          <SendBox
            target="public"
            conversationId={PUBLIC_CONVERSATION_ID}
            recieverId={PUBLIC_RECIEVER_ID}
          />
        </Block>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const COMMON_STYLES = StyleSheet.create({
  chatContainer: {
    padding: 20,
  },
  message: {
    padding: 20,
    marginBottom: 5,
  },
  messageText: {
    fontFamily: "SourceSansPro-Regular",
    fontSize: 18,
  },
  sentMessage: {
    backgroundColor: "#F04E58",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 0,
    paddingRight: 150,
  },
  sentMessageText: {
    color: "#FFFFFF",
  },
  sentMessageTimestamp: {
    position: "absolute",
    fontSize: 12,
    fontFamily: "SourceSansPro-Regular",
    width: 130,
    bottom: 0,
    right: 2,
    padding: 2,
    textAlign: "right",
    color: "#fff",
    opacity: 0.8,
  },
  recievedMessage: {
    backgroundColor: "#EFF3F7",
    borderWidth: 1,
    borderColor: "#E9F1F9",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: 30,
    paddingLeft: 120,
  },
  recievedMessageText: {
    color: "#2D2343",
  },
  recievedMessageTimestamp: {
    position: "absolute",
    fontSize: 12,
    fontFamily: "SourceSansPro-Regular",
    width: 130,
    bottom: 0,
    right: 5,
    padding: 2,
    textAlign: "right",
    color: "#1F212B",
    opacity: 0.8,
  },
  shadow: {
    shadowColor: Theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
});

const styles = StyleSheet.create({
  sendBox: {
    padding: 10,
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
  container: {
    backgroundColor: "#fff",
  },
});

export default PublicChat;
