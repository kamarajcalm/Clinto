import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from '../Screens/Profile';
import ProfileEdit from '../Screens/ProfileEdit';
import ViewClinicDetails from '../Screens/ViewClinicDetails';
import { TransitionSpecs, CardStyleInterpolators } from '@react-navigation/stack';
const Stack = createStackNavigator();
export default class ProfileStack extends Component {
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
         <Stack.Screen name="ProfileHome" component={Profile} options={{ headerShown: false }} />    
        </Stack.Navigator>
    );
  }
}
