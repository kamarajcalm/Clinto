import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { TransitionSpecs, CardStyleInterpolators } from '@react-navigation/stack';
import MedicinesHome from '../AdminScreens/MedicinesHome';
import AddMedicines from '../AdminScreens/AddMedicines';
const Stack = createStackNavigator();
export default class AdminMedicineStack extends Component {
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
                <Stack.Screen name="MedicinesHome" component={MedicinesHome} options={{ headerShown: false }} />
                <Stack.Screen name="AddMedicines" component={AddMedicines} options={{ headerShown: false }} />
              
            </Stack.Navigator>
        );
    }
}
