import React, { Component } from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import {
    NavigationContainer, DefaultTheme,
    DarkTheme,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome, MaterialCommunityIcons, MaterialIcons, SimpleLineIcons, Entypo, Fontisto, Feather, Ionicons } from '@expo/vector-icons';

import MyTabBar from '../components/MyTabBar';

import { Appearance, useColorScheme } from 'react-native-appearance';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import PriscriptionStack from '../stacks/PriscriptionStack';
import DoctorsStack from '../stacks/DoctorsStack';
import ChatStack from '../stacks/ChatStack';
import ProfileStack from '../stacks/ProfileStack';
import LoginStack from '../stacks/LoginStack';
import TabNavigator from './TabNavigator';
import AppLoading from 'expo-app-loading';
import ProfileEdit from '../Screens/ProfileEdit';
import AdminTab from './AdminTab';
import DefaultScreen from '../Screens/DefaultScreen';
import MediacalTab from './MediacalTab';
import ViewClinicDetails from '../Screens/ViewClinicDetails';
import PaymentPage from '../Screens/PaymentPage';
import ImageViewer from '../Screens/ImageViewer';
import Editclinic from '../Screens/Editclinic';
import CreateReceptionist from '../AdminScreens/CreateReceptionist';
import AddDoctor from '../AdminScreens/AddDoctor';
import UpdateTimings from '../Screens/UpdateTimings';
import ViewDoctor from '../AdminScreens/ViewDoctor';
import EditDoctorTimings from '../AdminScreens/EditDoctorTimings';
import EditClinicDetails from '../AdminScreens/EditClinicDetails';
import SearchDoctors from '../AdminScreens/SearchDoctors';
import PrescriptionView from '../MedicalScreens.js/PrescriptionView';
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


const Main = {
    MainTab: TabNavigator,

};

const authScreens = {
    Login: LoginStack,
};
export default class AppNavigator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logged: false,
            isReady: false,
        };
    }
    getUserDetails = async () => {
        const login = await AsyncStorage.getItem("login")

        console.log(login, "lllllll")
        if (login) {
            this.setState({ logged: true })
        }
    }
    getTheme = async () => {
        let theme = await AsyncStorage.getItem("theme")
        this.props.selectTheme(theme)
    }
  
    componentDidMount() {
        this.getUserDetails()
    }
   
    render() {
      
        return (
            <NavigationContainer >
                <Stack.Navigator>
                    {/* {Object.entries({
                        ...(this.state.logged ? Main : authScreens),
                        ...(!this.state.logged && Main),
                      
                    }).map(([name, component]) => (
                        <Stack.Screen name={name} component={component} options={{ headerShown: false }} />
                    ))} */}
                    <Stack.Screen name="DefaultScreen" component={DefaultScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="MainTab" component={TabNavigator} options={{ headerShown: false }} />
                    <Stack.Screen name="Login" component={LoginStack} options={{ headerShown: false }} />
                    <Stack.Screen name="ProfileEdit" component={ProfileEdit} options={{ headerShown: false }} />
                    <Stack.Screen name="AdminTab" component={AdminTab} options={{ headerShown: false }} />
                    <Stack.Screen name="MedicalTab" component={MediacalTab} options={{ headerShown: false }} />
                    <Stack.Screen name="ViewClinicDetails" component={ViewClinicDetails} options={{ headerShown: false }} />
                    <Stack.Screen name="PaymentPage" component={PaymentPage} options={{ headerShown: false }} />
                    <Stack.Screen name="ImageViewer" component={ImageViewer} options={{ headerShown: false }} />
                                 {/* DOCTOR EDIT */}
                    <Stack.Screen name="SearchDoctors" component={SearchDoctors} options={{ headerShown: false }} />
                    <Stack.Screen name="CreateReceptionist" component={CreateReceptionist} options={{ headerShown: false }} />
                    <Stack.Screen name="AddDoctor" component={AddDoctor} options={{ headerShown: false }} />
                    <Stack.Screen name="UpdateTimings" component={UpdateTimings} options={{ headerShown: false }} />
                    <Stack.Screen name="ViewDoctor" component={ViewDoctor} options={{ headerShown: false }} />
                    <Stack.Screen name="EditDoctorTimings" component={EditDoctorTimings} options={{ headerShown: false }} />
                    <Stack.Screen name="EditClinicDetails" component={EditClinicDetails} options={{ headerShown: false }} />
                    <Stack.Screen name="PrescriptionView" component={PrescriptionView} options={{ headerShown: false }} />
                 </Stack.Navigator>
                
            </NavigationContainer>
        );
    }
}
