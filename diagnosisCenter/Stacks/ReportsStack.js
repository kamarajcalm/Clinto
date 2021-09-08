import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { TransitionSpecs, CardStyleInterpolators } from '@react-navigation/stack';
import ReportsScreen from '../Screens/ReportsScreen';
import CreateReport from '../Screens/CreateReport';
import ViewReports from '../Screens/ViewReports';
const Stack = createStackNavigator();
export default class ReportsStack extends Component {
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
                <Stack.Screen name="ReportScreen" component={ReportsScreen} options={{ headerShown: false }} />
                <Stack.Screen name="CreateReport" component={CreateReport} options={{ headerShown: false }} />
                <Stack.Screen name="ViewReports" component={ViewReports} options={{ headerShown: false }} />
            </Stack.Navigator>
        );
    }
}