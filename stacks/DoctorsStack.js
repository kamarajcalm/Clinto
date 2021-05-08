import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Doctors from '../Screens/Doctors';
import SearchDoctors from '../Screens/SearchDoctors';
import ProfileView from '../Screens/ProfileView';
import MakeAppointment from '../Screens/MakeAppointment';
import ChatScreen from '../Screens/ChatScreen';
import ViewClinic from '../Screens/ViewClinic';
import makeAppointmentClinic from '../Screens/makeAppointmentClinic';
const Stack = createStackNavigator();
export default class DoctorsStack extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Doctors" component={Doctors} options={{ headerShown: false }} />
            <Stack.Screen name="SearchDoctors" component={SearchDoctors} options={{ headerShown: false }} />
            <Stack.Screen name="ProfileView" component={ProfileView} options={{ headerShown: false }} />
            <Stack.Screen name="MakeAppointment" component={MakeAppointment} options={{ headerShown: false }} />
            <Stack.Screen name="ViewClinic" component={ViewClinic} options={{ headerShown: false }} />
            <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: false }} />
            <Stack.Screen name="makeAppointmentClinic" component={makeAppointmentClinic} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
  }
}
