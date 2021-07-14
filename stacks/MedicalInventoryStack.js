import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from '../Screens/Profile';
import ProfileEdit from '../Screens/ProfileEdit';
import Inventory from '../MedicalScreens.js/Inventory';
import AddItem from '../MedicalScreens.js/AddItem';
import SearchMedicinesMedical from '../MedicalScreens.js/SearchMedicinesMedical';
import InventoryNew from '../MedicalScreens.js/InventoryNew';
import ViewCategory from '../MedicalScreens.js/ViewCategory';
import ViewItem from '../MedicalScreens.js/ViewItem';
import ViewOrders from '../MedicalScreens.js/ViewOrders';
import CreateOrders from '../MedicalScreens.js/CreateOrders';
import CreateBill from '../MedicalScreens.js/CreateBill';
import ViewSold from '../MedicalScreens.js/ViewSold';
import InventoryDefaultScreen from '../Screens/InventoryDefaultScreen';
import { TransitionSpecs, CardStyleInterpolators } from '@react-navigation/stack';
import TypeWiseView from '../MedicalScreens.js/TypeWiseView';
import SoldMedicinesView from '../MedicalScreens.js/SoldMedicinesView';
import AddRackItem from '../MedicalScreens.js/AddRackItem';
const Stack = createStackNavigator();
export default class MedicalInventoryStack extends Component {
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
                <Stack.Screen name="InventoryDefaultScreen" component={InventoryDefaultScreen} options={{ headerShown: false }} />
                <Stack.Screen name="InventoryNew" component={InventoryNew} options={{ headerShown: false }} />
                <Stack.Screen name="Inventory" component={Inventory} options={{ headerShown: false }} />
                <Stack.Screen name="AddItem" component={AddItem} options={{ headerShown: false }} />
                <Stack.Screen name="SearchMedicinesMedical" component={SearchMedicinesMedical} options={{ headerShown: false }} />
                <Stack.Screen name="ViewCategory" component={ViewCategory} options={{ headerShown: false }} />
                <Stack.Screen name="ViewItem" component={ViewItem} options={{ headerShown: false }} />
                <Stack.Screen name="ViewOrders" component={ViewOrders} options={{ headerShown: false }} />
                <Stack.Screen name="CreateOrders" component={CreateOrders} options={{ headerShown: false }} />
                <Stack.Screen name="CreateBill" component={CreateBill} options={{ headerShown: false }} />
                <Stack.Screen name="ViewSold" component={ViewSold} options={{ headerShown: false }} />
                <Stack.Screen name="TypeWiseView" component={TypeWiseView} options={{ headerShown: false }} />
                <Stack.Screen name="SoldMedicinesView" component={SoldMedicinesView} options={{ headerShown: false }} />
                <Stack.Screen name="AddRackItem" component={AddRackItem} options={{ headerShown: false }} />
            </Stack.Navigator>
        );
    }
}