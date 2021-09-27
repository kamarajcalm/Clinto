import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { TransitionSpecs, CardStyleInterpolators } from '@react-navigation/stack';
import ReportsScreen from '../Screens/ReportsScreen';
import Appoinments from '../Screens/Appoinments';
import CreateReport from '../Screens/CreateReport';
import ViewAppointmentDoctors from '../../Screens/ViewAppointmentDoctors';
import ChatScreen from '../../Screens/ChatScreen';
const Stack = createStackNavigator();
export default class AppoinmentsStack extends Component {
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
                <Stack.Screen name="Appoinments" component={Appoinments} options={{ headerShown: false }} />
                 <Stack.Screen name="CreateReport" component={CreateReport} options={{ headerShown: false }} />
                  <Stack.Screen name="ViewAppointmentDoctors" component={ViewAppointmentDoctors} options={{ headerShown: false }} />
                   <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
        );
    }
}