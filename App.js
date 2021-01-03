import { Block, Input, Text } from "galio-framework";
import React, { useState, useRef } from "react";
import {
  StyleSheet,
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
import VoiceMessage from "./components/VoiceMessage";

const PUBLIC_CONVERSATION_ID = "123456789";
const PUBLIC_RECIEVER_ID = "00000";
const { width, height } = Dimensions.get("window");


const Header = ({ title, enableGoBack }) => {
  return (
    <Block style={headerStyles.header}>
      <Block style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => { }}
          hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
        >
          <AntDesign
            name="arrowleft"
            color="white"
            size={15}
            style={{ paddingTop: 20, paddingBottom: 20, paddingRight: 20 }}
          />
        </TouchableOpacity>
        <Text style={headerStyles.headerTitle}>{title}</Text>
      </Block>

      <Block style={{ justifyContent: "flex-end" }}>
        <TouchableOpacity onPress={() => { }}>
          <AntDesign name="logout" size={20} color={"#FFFFFF"} />
        </TouchableOpacity>
      </Block>
    </Block>
  );
};

const SendBox = () => {
  const [message, setMessage] = useState("");
  const [isAttachmentPopUpVisible, setIsAttachmentPopUpVisible] = useState(
    false
  );
  return (
    <Block style={sendStyles.sendBox}>
      <Input
        value={message}
        onChangeText={(e) => {
          setMessage(e);
        }}
        color="#4A4A4A"
        placeholder="Type your message..."
        placeholderTextColor="#4A4A4A"
        style={sendStyles.messageInput}
      />
      <View
        style={{
          flexDirection: "row",
          width: width / 3 + 20,
        }}
      >
        <TouchableOpacity
          onPress={() => console.log("Send")}
          hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
        >
          <View style={sendStyles.controls}>
            <FontAwesome name="send" size={25} color="#4A4A4A" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsAttachmentPopUpVisible(true)}
          hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
        >
          <View style={sendStyles.controls}>
            <AntDesign name="paperclip" size={25} color="#4A4A4A" />
          </View>
        </TouchableOpacity>
        <Modal
          visible={isAttachmentPopUpVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setIsAttachmentPopUpVisible(false)}
        >
          <TouchableOpacity
            style={sendStyles.container}
            onPress={() => setIsAttachmentPopUpVisible(false)}
          >
            <Block style={sendStyles.attachment}>
              <TouchableOpacity
                onPress={() => { }}
                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
              >
                <View style={[sendStyles.buttons, COMMON_STYLES.shadow]}>
                  <MaterialCommunityIcons
                    name="image-area"
                    size={25}
                    color="#4A4A4A"
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { }}
                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
              >
                <View style={[sendStyles.buttons, COMMON_STYLES.shadow]}>
                  <MaterialCommunityIcons
                    name="video"
                    size={25}
                    color="#4A4A4A"
                  />
                </View>
              </TouchableOpacity>
            </Block>
          </TouchableOpacity>
        </Modal>
        <Microphone recordingUri={(uri) => { console.log(uri) }} />
      </View>
    </Block >
  );
};

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
          height: height - 80,
          width: width,
          justifyContent: "space-between",
        }}
        behavior="height"
        keyboardVerticalOffset={30}
      >
        <Block flex style={styles.container}>
          <Header title="#Public Conversations" enableGoBack={true} />
          {/* {publicConversations.length === 0 ? (
            <Text>Start a conversation...</Text>
          ) : ( */}
          <ScrollView
            ref={scrollViewRef}
            onContentSizeChange={(contentWidth, contentHeight) => {
              scrollViewRef.current.scrollToEnd({ animated: false });
            }}
            contentContainerStyle={[COMMON_STYLES.chatContainer]}
          >
            {renderMessages()}
          </ScrollView>
          {/* )} */}
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

export const COMMON_STYLES = StyleSheet.create({
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
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
});

const headerStyles = StyleSheet.create({
  header: {
    backgroundColor: '#F04E58',
    height: 75,
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: "row",
  },
  headerTitle: {
    fontSize: 21,
    color: '#FFFFFF',
  },
  optionsContainer: {
    zIndex: 10,
  },
});

const sendStyles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: width - width / 3 - 30,
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

export default PublicChat;
