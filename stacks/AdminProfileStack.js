import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from '../Screens/Profile';
import ProfileEdit from '../Screens/ProfileEdit';
import Appointments from '../Screens/Appointments';
import ProfileView from '../Screens/ProfileView';
import ProfileScreen from '../AdminScreens/ProfileScreen';
import MedicalProfile from '../MedicalScreens.js/MedicalProfile';
const Stack = createStackNavigator();
export default class AdminProfileStack extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <Stack.Navigator>
                <Stack.Screen name="MedicalProfile" component={MedicalProfile} options={{ headerShown: false }} />
            </Stack.Navigator>
        );
    }
}
