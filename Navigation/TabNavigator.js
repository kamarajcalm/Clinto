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
import AppointmentStack from '../stacks/AppointmentStack';
import MedicalInventoryStack from '../stacks/MedicalInventoryStack';
const Tab = createBottomTabNavigator();
class TabNavigator extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    getTheme = async () => {
        // let theme = await AsyncStorage.getItem("theme")
        // this.props.selectTheme(theme)
    }
    componentDidMount() {
       
        this.getTheme()
    }
    getTabBarVisibility = (route) => {
        const routeName = route.state ? route.state.routes[route.state.index].name : ''
        if (routeName == "addPriscription") {
            return false
        }
        if (routeName == "SearchMedicines") {
            return false
        }
    
        if (routeName == "PrescriptionView") {
            return false
        }
        if (routeName == "PrescriptionViewDoctor") {
            return false
        }
        if (routeName == "showCard") {
            return false
        }
        if (routeName == "Chat") {
            return false
        }
        if (routeName == "SelectAddress") {
            return false
        }
        return true
    }
    getTabBarVisibility2 = (route) => {
        const routeName = route.state ? route.state.routes[route.state.index].name : ''
        if (routeName == "ChatScreen") {
            return false
        }

        return true
    }
    getTabBarVisibility9 = (route) => {
        const routeName = route.state ? route.state.routes[route.state.index].name : ''
        if (routeName == "ViewTemplates") {
            return false
        }
        if (routeName == "ViewFullTemplates") {
            return false
        }
      if (routeName == "SelectAddress") {
            return false
        }
          if (routeName == "CustomerOrders") {
            return false
        }
        return true
    }
    getTabBarVisibility4 = (route) => {
        const routeName = route.state ? route.state.routes[route.state.index].name : ''
        if (routeName == "ViewAppointment") {
            return false
        }
      
        if (routeName == "ViewAppointmentDoctors") {
            return false
        }
        if (routeName == "ViewPriscription") {
            
            return false
        }
        if (routeName == "addPriscription") {
            
            return false
        }
        if (routeName == "SearchMedicines") {
            return false
        }
        if (routeName == "Chat") {
            return false
        }
        return true
    }
    getTabBarVisibility3 = (route) => {
        const routeName = route.state ? route.state.routes[route.state.index].name : ''
        if (routeName == "SearchDoctors") {
            return false
        }
        if (routeName == "ProfileView"){
            return false
        }
        if (routeName == "MakeAppointment") {
            return false
        }
        if (routeName == "makeAppointmentClinic") {
            return false
        }
        if (routeName == "ViewClinic") {
            return false
        }
        if (routeName == "Chat") {
            return false
        }
     
        return true
    }
    getTabBarVisibility8 = (route) => {
        const routeName = route.state ? route.state.routes[route.state.index].name : ''
        if (routeName == "ViewCategory") {
            return false
        }
        if (routeName == "ViewItem") {
            return false
        }
        if (routeName == "CreateOrders") {
            return false
        }
     
        if (routeName == "InventoryNew"){
            return false
        }
        if (routeName == "CreateBill"){
            return false
        }
        if (routeName == "ViewOrders"){
            return false
        }
        if (routeName == "ViewSold"){
            return false
        }
        if (routeName == "TypeWiseView"){
            return false
        }
        if (routeName == "AddRackItem"){
            return false
        }
        if (routeName == "SoldMedicinesView"){
            return false
        }
        return true
    }
  
    render() {
        return (
            
                <Tab.Navigator
                    tabBar={props => <MyTabBar {...props} />}
             
                >
                    <Tab.Screen name="Prescription" component={PriscriptionStack}
                        options={({ route }) => ({

                            tabBarVisible: this.getTabBarVisibility(route),

                        })}
                    />
                <Tab.Screen name="Appointments" component={AppointmentStack}
                    options={({ route }) => ({

                        tabBarVisible: this.getTabBarVisibility4(route),

                    })}
                />


                                      {/* validating inventory and search  */}


                {this.props?.user.profile?.occupation =="Customer" ?<Tab.Screen name="Search" component={DoctorsStack}
                        options={({ route }) => ({

                            tabBarVisible: this.getTabBarVisibility3(route),

                        })}

                    />:
                    <Tab.Screen name="Inventory" component={MedicalInventoryStack}
                        options={({ route }) => ({

                            tabBarVisible: this.getTabBarVisibility8(route),

                        })}

                    />
                    }
                    <Tab.Screen name="Chat" component={ChatStack}
                        options={({ route }) => ({

                            tabBarVisible: this.getTabBarVisibility2(route),

                        })}

                    />
                    <Tab.Screen name="Profile" component={ProfileStack}
                    options={({ route }) => ({

                        tabBarVisible: this.getTabBarVisibility9(route),

                    })}

                    />

                </Tab.Navigator>
       
        );
    }
}
const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,
        user: state.selectedUser
    }
}
export default connect(mapStateToProps, { selectTheme })(TabNavigator)