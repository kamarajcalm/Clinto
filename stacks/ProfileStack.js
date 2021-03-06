import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from '../Screens/Profile';
import ProfileEdit from '../Screens/ProfileEdit';
import ViewClinicDetails from '../Screens/ViewClinicDetails';
import { TransitionSpecs, CardStyleInterpolators } from '@react-navigation/stack';
import ViewTemplates from '../Screens/ViewTemplates';
import ViewFullTemplates from '../Screens/ViewFullTemplates';
import SearchMedicines from '../Screens/SearchMedicines';
import SelectAddress from '../Screens/SelectAddress';
import CustomerOrders from '../Screens/CustomerOrders';
import ViewCustomerOrders from '../Screens/ViewCustomerOrders';
import ViewReports from '../Screens/ViewReports';
import AddReport from '../Screens/AddReport';
import CreateReport from '../Screens/CreateReport';
import PendingRequests from '../Screens/PendingRequests';
import ViewPendingRequest from '../Screens/ViewPendingRequest';
import AddAccount from '../Screens/AddAccount';
import LinkedAccounts from '../Screens/LinkedAccounts';
import AddPet from '../Screens/AddPet';
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
         <Stack.Screen name="ProfileHome" component={Profile} options={{ headerShown: false }} />    
          <Stack.Screen name="ViewTemplates" component={ViewTemplates} options={{ headerShown: false }} />
          <Stack.Screen name="ViewFullTemplates" component={ViewFullTemplates} options={{ headerShown: false }}/>
          <Stack.Screen name="ViewReports" component={ViewReports} options={{ headerShown: false }} />
          <Stack.Screen name="SearchMedicines" component={SearchMedicines} options={{ headerShown: false }} />
          <Stack.Screen name="SelectAddress" component={SelectAddress} options={{ headerShown: false }} />
          <Stack.Screen name="CustomerOrders" component={CustomerOrders} options={{ headerShown: false }} />
          <Stack.Screen name="ViewCustomerOrders" component={ViewCustomerOrders} options={{ headerShown: false }} />
          <Stack.Screen name="AddReport" component={AddReport} options={{ headerShown: false }} />
          <Stack.Screen name="CreateReport" component={CreateReport} options={{ headerShown: false }} />
          <Stack.Screen name="PendingRequests" component={PendingRequests} options={{ headerShown: false }} />
          <Stack.Screen name="ViewPendingRequest" component={ViewPendingRequest} options={{ headerShown: false }} />
          <Stack.Screen name="AddAccount" component={AddAccount} options={{ headerShown: false }} />
          <Stack.Screen name="LinkedAccounts" component={LinkedAccounts} options={{ headerShown: false }} />
          <Stack.Screen name="AddPet" component={AddPet} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
  }
}
