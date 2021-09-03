import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { TransitionSpecs, CardStyleInterpolators } from '@react-navigation/stack';
import MedicinesHome from '../AdminScreens/MedicinesHome';
import AddMedicines from '../AdminScreens/AddMedicines';
import ViewMedicines from '../AdminScreens/ViewMedicines';
import ProfileScreen from '../AdminScreens/ProfileScreen';
import PriceVerification from '../AdminScreens/PriceVerification';
import DiagnosisCenter from '../AdminScreens/DiagnosisCenter';
import CreateDiagnosticCenter from '../AdminScreens/CreateDiagnosticCenter';
import CreateDiagnosticCenterOwner from '../AdminScreens/CreateDiagnosticCenterOwner';
import LabOwners from '../AdminScreens/LabOwners';
import MedicalOwners from '../AdminScreens/MedicalOwners';
import SearchLabOwner from '../AdminScreens/SearchLabOwner';
import UpdateTimings from '../AdminScreens/UpdateTimings';
import ViewDiagnosticCenter from '../AdminScreens/ViewDiagnosticCenter';
import DiagnosisCategories from '../AdminScreens/DiagnosisCategories';
import AddDiagnosisCategories from '../AdminScreens/AddDiagnosisCategories';
import CreateDiagnosisCenterUser from '../AdminScreens/CreateDiagnosisCenterUser';
const Stack = createStackNavigator();
export default class BackendProfile extends Component {
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
                <Stack.Screen name="MedicinesHome" component={MedicinesHome} options={{ headerShown: false }} />
                <Stack.Screen name="AddMedicines" component={AddMedicines} options={{ headerShown: false }} />
                <Stack.Screen name="ViewMedicines" component={ViewMedicines} options={{ headerShown: false }} />
                <Stack.Screen name="PriceVerification" component={PriceVerification} options={{ headerShown: false }} />
                <Stack.Screen name="DiagnosisCenter" component={DiagnosisCenter} options={{ headerShown: false }} />
                <Stack.Screen name="CreateDiagnosticCenter" component={CreateDiagnosticCenter} options={{ headerShown: false }} />
                <Stack.Screen name="CreateDiagnosticCenterOwner" component={CreateDiagnosticCenterOwner} options={{ headerShown: false }} />
                <Stack.Screen name="LabOwners" component={LabOwners} options={{ headerShown: false }} />
                <Stack.Screen name="MedicalOwners" component={MedicalOwners} options={{ headerShown: false }} />
                <Stack.Screen name="SearchLabOwner" component={SearchLabOwner} options={{ headerShown: false }} />
                <Stack.Screen name="UpdateTimings" component={UpdateTimings} options={{ headerShown: false }} />
                <Stack.Screen name="ViewDiagnosticCenter" component={ViewDiagnosticCenter} options={{ headerShown: false }} />
                <Stack.Screen name="DiagnosisCategories" component={DiagnosisCategories} options={{ headerShown: false }} />
                <Stack.Screen name="AddDiagnosisCategories" component={AddDiagnosisCategories} options={{ headerShown: false }} />
                <Stack.Screen name="CreateDiagnosisCenterUser" component={CreateDiagnosisCenterUser} options={{ headerShown: false }} />
            </Stack.Navigator>
        );
    }
}
