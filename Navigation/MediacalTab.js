import React, { Component } from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import {
    NavigationContainer, DefaultTheme,
    DarkTheme,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome, MaterialCommunityIcons, MaterialIcons, SimpleLineIcons, Entypo, Fontisto, Feather, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import settings from '../AppSettings';
const themeColor = settings.themeColor
const fontFamily = settings.fontFamily

import { Appearance, useColorScheme } from 'react-native-appearance';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import ClincsStack from '../stacks/ClincsStack';
import DoctorsAdminStack from '../stacks/DoctorsAdminStack';
import MedicalStack from '../stacks/MedicalStack';
import AdminProfileStack from '../stacks/AdminProfileStack';
import ClincicPriscriptionStack from '../stacks/ClincicPriscriptionStack';
import MedicalInventoryStack from '../stacks/MedicalInventoryStack';
import ChatStack from '../stacks/ChatStack';
import MedicalTabBar from '../components/MedicalTabBar';
const Tab = createBottomTabNavigator();


class MediacalTab extends Component {
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
        if (routeName == "ListPriscriptions") {
            return false
        }
        if (routeName == "BillPrescription") {
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

        if (routeName == "InventoryNew") {
            return false
        }
        if (routeName == "CreateBill") {
            return false
        }
        if (routeName == "ViewOrders") {
            return false
        }
        if (routeName == "ViewSold") {
            return false
        }
        if (routeName == "TypeWiseView") {
            return false
        }
        if (routeName == "SoldMedicinesView"){
            return false
        }
        if (routeName == "AddRackItem") {
            return false
        }
        
        return true
    }
    render() {
        return (

            <Tab.Navigator
                tabBar={props => <MedicalTabBar {...props} />}
              

            >

                <Tab.Screen name="ClincicPriscriptionStack" component={ClincicPriscriptionStack}
                    options={({ route }) => ({

                        tabBarVisible: this.getTabBarVisibility(route),

                    })}

                />
                <Tab.Screen name="Inventory" component={MedicalInventoryStack}
                    options={({ route }) => ({

                        tabBarVisible: this.getTabBarVisibility8(route),

                    })}

                />
                <Tab.Screen name="Chats" component={ChatStack}
                    options={({ route }) => ({

                        tabBarVisible: this.getTabBarVisibility(route),

                    })}

                />
                <Tab.Screen name="AdminProfileStack" component={AdminProfileStack}
                    options={({ route }) => ({

                        tabBarVisible: this.getTabBarVisibility(route),

                    })}

                />
            </Tab.Navigator>

        );
    }
}
const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,
         
    }
}
export default connect(mapStateToProps, { selectTheme })(MediacalTab)