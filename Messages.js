import { gql, useMutation, useSubscription } from "@apollo/client";
import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const MESSAGE_SUBSCRIPTION = gql`
  subscription MessageCreated {
    messageCreated {
      text
      createdBy
    }
  }
`;
const MESSAGE_MUTATION = gql`
  mutation Mutation($messageInput: MessageInput) {
    createMessage(messageInput: $messageInput) {
      text
      createdBy
    }
  }
`;
const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data, loading } = useSubscription(MESSAGE_SUBSCRIPTION, {
    onSubscriptionData: (data) => {
      // !!! this function will be called when new message arrives
      const message = data.subscriptionData.data.messageCreated;
      setMessages([...messages, message]); // * state is changed
    },
  });

  const [createMessage, { error }] = useMutation(MESSAGE_MUTATION);

  const onPress = async () => {
    // !!! Send Message
    await createMessage({
      variables: {
        messageInput: {
          text: `Merhaba Mervecim seni ${Math.round(
            Math.random() * 100000000
          )} kez seviyorum`,
          username: "Emre Yoleri",
        },
      },
    });
  };

  return (
    <View>
      <Text>Hey</Text>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text>Press Here</Text>
      </TouchableOpacity>
      {messages.map((msg, i) => (
        <View
          key={i}
          style={{
            borderWidth: 1,
            marginTop: 20,
            marginBottom: 20,
            padding: 10,
          }}
        >
          <Text>Message - {i + 1}</Text>
          <Text>Text: {msg.text}</Text>
          <Text>Created By: {msg.createdBy}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
  },
});

export default Messages;
