import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen from '../login/OnboardingScreen';
import LoginScreen from '../login/LoginScreen';
import OTPScreen from '../login/OTPScreen';
import ForgotPassword from '../login/ForgotPassword';
import CreateAccount from '../login/CreateAccount';

const Stack = createStackNavigator();
export default class LoginStack extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <Stack.Navigator>
                <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} options={{ headerShown: false }} />
                <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="OTPScreen" component={OTPScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
                <Stack.Screen name="CreateAccount" component={CreateAccount} options={{ headerShown: false }} />
            </Stack.Navigator>
        );
    }
}
