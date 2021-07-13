import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Medicals from '../AdminScreens/Medicals';
import CreateMedicals from '../AdminScreens/CreateMedicals';
import CreateRep from '../AdminScreens/CreateRep';
import SearchRep from '../AdminScreens/SearchRep';
import ViewMedicals from '../AdminScreens/ViewMedicals';
import CreateReceptionistMedical from '../AdminScreens/CreateReceptionistMedical';
import UpdateTimings from '../AdminScreens/UpdateTimings';
import MedicalOffers from '../AdminScreens/MedicalOffers';
import { TransitionSpecs, CardStyleInterpolators } from '@react-navigation/stack';
const Stack = createStackNavigator();
export default class MedicalStack extends Component {
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
                <Stack.Screen name="Medicals" component={Medicals} options={{ headerShown: false }} />
                <Stack.Screen name="CreateMedicals" component={CreateMedicals} options={{ headerShown: false }} />
                <Stack.Screen name="CreateRep" component={CreateRep} options={{ headerShown: false }} />
                <Stack.Screen name="SearchRep" component={SearchRep} options={{ headerShown: false }} />
                <Stack.Screen name="ViewMedicals" component={ViewMedicals} options={{ headerShown: false }} />
                <Stack.Screen name="CreateReceptionistMedical" component={CreateReceptionistMedical} options={{ headerShown: false }} />
                <Stack.Screen name="UpdateTimings" component={UpdateTimings} options={{ headerShown: false }} />
                <Stack.Screen name="MedicalOffers" component={MedicalOffers} options={{ headerShown: false }} />
            </Stack.Navigator>
        );
    }
}