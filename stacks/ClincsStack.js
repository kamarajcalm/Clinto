import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Clinics from '../AdminScreens/Clinics';
import CreateClinics from '../AdminScreens/CreateClinics';
import ClinicDetails from '../AdminScreens/ClinicDetails';
import SearchDoctors from '../AdminScreens/SearchDoctors';
import CreateReceptionist from '../AdminScreens/CreateReceptionist';
import AddDoctor from '../AdminScreens/AddDoctor';
import UpdateTimings from '../AdminScreens/UpdateTimings';
import ViewDoctor from '../AdminScreens/ViewDoctor';
import EditDoctorTimings from '../AdminScreens/EditDoctorTimings';
import EditClinicDetails from '../AdminScreens/EditClinicDetails';
import ReceptionistProfile from '../AdminScreens/ReceptionistProfile';
const Stack = createStackNavigator();
export default class ClincsStack extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <Stack.Navigator>
                <Stack.Screen name="Clinics" component={Clinics} options={{ headerShown: false }} />
                <Stack.Screen name="CreateClincs" component={CreateClinics} options={{ headerShown: false }} />
                <Stack.Screen name="ClinicDetails" component={ClinicDetails} options={{ headerShown: false }} />
                <Stack.Screen name="SearchDoctors" component={SearchDoctors} options={{ headerShown: false }} />
                <Stack.Screen name="CreateReceptionist" component={CreateReceptionist} options={{ headerShown: false }} />
                <Stack.Screen name="AddDoctor" component={AddDoctor} options={{ headerShown: false }} />
                <Stack.Screen name="UpdateTimings" component={UpdateTimings} options={{ headerShown: false }} />
                <Stack.Screen name="ViewDoctor" component={ViewDoctor} options={{ headerShown: false }} />
                <Stack.Screen name="EditDoctorTimings" component={EditDoctorTimings} options={{ headerShown: false }} />
                <Stack.Screen name="EditClinicDetails" component={EditClinicDetails} options={{ headerShown: false }} />
                <Stack.Screen name="ReceptionistProfile" component={ReceptionistProfile} options={{ headerShown: false }} />
            </Stack.Navigator>
        );
    }
}