import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { TransitionSpecs, CardStyleInterpolators } from '@react-navigation/stack';
import ProfileScreen from '../Screens/ProfileScreen';
import CreateReport from '../../Screens/CreateReport';
import ViewFeautures from '../Screens/ViewFeautures';
import ViewProfile from '../Screens/ViewProfile';

const Stack = createStackNavigator();
export default class ProfileStack extends Component {
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
                <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ViewProfile" component={ViewProfile} options={{ headerShown: false }} />
          
            </Stack.Navigator>
        );
    }
}