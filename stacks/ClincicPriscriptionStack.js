import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from '../Screens/Profile';
import ProfileEdit from '../Screens/ProfileEdit';
import Appointments from '../Screens/Appointments';
import ProfileView from '../Screens/ProfileView';
import PriscriptionIssue from '../MedicalScreens.js/PriscriptionIssue';
import SearchPateint from '../MedicalScreens.js/SearchPateint';
import ListPriscriptions from '../MedicalScreens.js/ListPriscriptions';
import ShowCard2 from '../MedicalScreens.js/ShowCard2';
import PrescriptionView from '../MedicalScreens.js/PrescriptionView';
import BillPrescription from '../MedicalScreens.js/BillPrescription';
const Stack = createStackNavigator();
export default class ClincicPriscriptionStack extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <Stack.Navigator>
                <Stack.Screen name="PriscriptionIssue" component={PriscriptionIssue} options={{ headerShown: false }} />
                <Stack.Screen name="SearchPateint" component={SearchPateint} options={{ headerShown: false }} />
                <Stack.Screen name="ListPriscriptions" component={ListPriscriptions} options={{ headerShown: false }} />
                <Stack.Screen name="showCard2" component={ShowCard2} options={{ headerShown: false }} />
                <Stack.Screen name="BillPrescription" component={BillPrescription} options={{ headerShown: false }} />
            </Stack.Navigator>
        );
    }
}