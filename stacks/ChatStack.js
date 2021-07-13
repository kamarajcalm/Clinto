import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Chat from '../Screens/Chat';
import ChatScreen from '../Screens/ChatScreen';
import { TransitionSpecs, CardStyleInterpolators } from '@react-navigation/stack';
const Stack = createStackNavigator();
export default class ChatStack extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
        <Stack.Navigator 
        screenOptions={{
          transitionSpec: {
            open: TransitionSpecs.TransitionIOSSpec,
            close: TransitionSpecs.TransitionIOSSpec,
          },
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS

        }}
        >
            <Stack.Screen name="Chat" component={Chat} options={{ headerShown: false }} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
  }
}
