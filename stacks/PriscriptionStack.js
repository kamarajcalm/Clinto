import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Priscription from '../Screens/Priscription';
import ShowCard from '../Screens/ShowCard';
import AddPrescription from '../Screens/AddPrescription';
import SearchMedicines from '../Screens/SearchMedicines';
import LoginScreen from '../login/OnboardingScreen';
import ProfileView from '../Screens/ProfileView';
import PrescriptionView from '../Screens/PrescriptionView';
import SearchPatient from '../Screens/SearchPatient';
import ListPatientPriscription from '../Screens/ListPatientPriscription';
import ChatScreen from '../Screens/ChatScreen';
import Priscription1 from '../Screens/Priscription1';


const Stack = createStackNavigator();
export default class PriscriptionStack extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    render() {
        return (
            <Stack.Navigator>
                {/* <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} /> */}
                <Stack.Screen name="Priscription" component={Priscription1} options={{ headerShown: false }} />
                <Stack.Screen name="showCard" component={ShowCard} options={{ headerShown: false }} />
                <Stack.Screen name="addPriscription" component={AddPrescription} options={{ headerShown: false }} />
                <Stack.Screen name="SearchMedicines" component={SearchMedicines} options={{ headerShown: false }} />
                <Stack.Screen name="ProfileView" component={ProfileView} options={{ headerShown: false }} />
                <Stack.Screen name="PrescriptionView" component={PrescriptionView} options={{ headerShown: false }} />
                <Stack.Screen name="SearchPatient" component={SearchPatient} options={{ headerShown: false }} />
                <Stack.Screen name="ListPatientPriscription" component={ListPatientPriscription} options={{ headerShown: false }} />
                <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
        );
    }
}