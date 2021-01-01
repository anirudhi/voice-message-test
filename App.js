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
import { useSelector } from "react-redux";
import COMMON_STYLES from "../../../assets/styles";

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
  const publicConversations = useSelector(
    (state) => state.conversations.public
  );
  const myPhoneNumber = useSelector((state) => state.app.auth.phone);
  const scrollViewRef = useRef(null);

  const renderMessages = () => {
    return publicConversations.data.map((msg, index) => {
      const hasMatched = msg.sender === myPhoneNumber;
      return (
        <View
          style={{
            flexDirection: hasMatched ? "row-reverse" : "row",
          }}
          key={`msg-${index}`}
        >
          {msg.type === "image" ? (
            <ImageMessage fromMe={hasMatched} message={msg} />
          ) : msg.type === "text" ? (
            <TextMessage fromMe={hasMatched} message={msg} />
          ) : msg.type === "video" ? (
            <VideoMessage fromMe={hasMatched} message={msg} />
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
          {publicConversations.isLoading ? (
            <Text>Loading</Text>
          ) : publicConversations.hasError ? (
            <Text>{publicConversations.errMsg}</Text>
          ) : publicConversations.data.length === 0 ? (
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
});

export default PublicChat;


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
