import { StyleSheet, Text, View } from "react-native";
import { ApolloClient, ApolloProvider, split, HttpLink } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

import { InMemoryCache } from "apollo-cache-inmemory";

import Messages from "./Messages";

const httpLink = new HttpLink({
  uri: "http://192.168.60.155:4000/graphql",
});

const wsLink = new WebSocketLink({
  uri: "ws://192.168.60.155:4000/graphql",
  options: {
    reconnect: true,
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <View style={styles.container}>
        <Messages />
      </View>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
