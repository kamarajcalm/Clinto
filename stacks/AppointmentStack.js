import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from '../Screens/Profile';
import ProfileEdit from '../Screens/ProfileEdit';
import Appointments from '../Screens/Appointments';
import ProfileView from '../Screens/ProfileView';
import ViewAppointments from '../Screens/ViewAppointments';
import ChatScreen from '../Screens/ChatScreen';
import ViewAppointmentDoctors from '../Screens/ViewAppointmentDoctors';
import ViewPriscriptions from '../Screens/ViewPriscriptions';
import AddPrescription from '../Screens/AddPrescription';
import SearchMedicines from '../Screens/SearchMedicines';
const Stack = createStackNavigator();
export default class AppointmentStack extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <Stack.Navigator>
                <Stack.Screen name="Appointments" component={Appointments} options={{ headerShown: false }} />
                <Stack.Screen name="ProfileView" component={ProfileView} options={{ headerShown: false }} />
                <Stack.Screen name="ViewAppointment" component={ViewAppointments} options={{ headerShown: false }} />
                <Stack.Screen name="ViewAppointmentDoctors" component={ViewAppointmentDoctors} options={{ headerShown: false }} />
                <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ViewPriscription" component={ViewPriscriptions} options={{ headerShown: false }} />
                <Stack.Screen name="addPriscription" component={AddPrescription} options={{ headerShown: false }} />
                <Stack.Screen name="SearchMedicines" component={SearchMedicines} options={{ headerShown: false }} />
            </Stack.Navigator>
        );
    }
}
