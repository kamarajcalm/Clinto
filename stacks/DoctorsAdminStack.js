import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import DoctorsAdmin from '../AdminScreens/DoctorsAdmin';
import DoctorsStack from './DoctorsStack';
import CreateDoctor from '../Screens/CreateDoctor';
import CreateDoctors from '../AdminScreens/CreateDoctors';
import ViewDoctorProfile from '../AdminScreens/ViewDoctorProfile';
const Stack = createStackNavigator();
export default class DoctorsAdminStack extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <Stack.Navigator>
                <Stack.Screen name="DoctorsAdmin" component={DoctorsAdmin} options={{ headerShown: false }} />
                <Stack.Screen name="CreateDoctors" component={CreateDoctors} options={{ headerShown: false }} />
                <Stack.Screen name="ViewDoctorProfile" component={ViewDoctorProfile} options={{ headerShown: false }}/>
            </Stack.Navigator>
        );
    }
}