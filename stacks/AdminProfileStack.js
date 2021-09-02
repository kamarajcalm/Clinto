import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from '../Screens/Profile';
import ProfileEdit from '../Screens/ProfileEdit';
import Appointments from '../Screens/Appointments';
import ProfileView from '../Screens/ProfileView';
import ProfileScreen from '../AdminScreens/ProfileScreen';
import MedicalProfile from '../MedicalScreens.js/MedicalProfile';
import ViewMedicalDetails from '../MedicalScreens.js/ViewMedicalDetails';
import CreateReceptionistMedical from '../AdminScreens/CreateReceptionistMedical';
import ReceptionistProfile from '../AdminScreens/ReceptionistProfile';
import UploadImages from '../AdminScreens/UploadImages';
import { TransitionSpecs, CardStyleInterpolators } from '@react-navigation/stack';
import DiagnosisCenter from '../AdminScreens/DiagnosisCenter';
const Stack = createStackNavigator();
export default class AdminProfileStack extends Component {
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
                <Stack.Screen name="MedicalProfile" component={MedicalProfile} options={{ headerShown: false }} />
              
          
                <Stack.Screen name="ReceptionistProfile" component={ReceptionistProfile} options={{ headerShown: false }} />
                <Stack.Screen name="UploadImages" component={UploadImages} options={{ headerShown: false }} />
            </Stack.Navigator>
        );
    }
}
