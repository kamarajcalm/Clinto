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
import ReportsStack from '../diagnosisCenter/Stacks/ReportsStack';
import DiagnosisTabBar from '../components/DiagnosisTabBar';
import AppoinmentsStack from '../diagnosisCenter/Stacks/AppoinmentsStack';
import ProfileStack from '../diagnosisCenter/Stacks/ProfileStack';
const Tab = createBottomTabNavigator();


class DiagnosisTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
     
    }

    getTabBarVisibility = (route) => {
        const routeName = route.state ? route.state.routes[route.state.index].name : ''
        if (routeName == "CreateReport") {
            return false
        }
  
   
     
        return true
    }
   
    render() {
        return (

            <Tab.Navigator
                tabBar={props => <DiagnosisTabBar {...props} />}
              

            >

                <Tab.Screen name="ReportsStack" component={ReportsStack}
                    options={({ route }) => ({

                        tabBarVisible: this.getTabBarVisibility(route),

                    })}

                />
                <Tab.Screen name="AppoinmentsStack" component={AppoinmentsStack}
                    options={({ route }) => ({

                        tabBarVisible: this.getTabBarVisibility(route),

                    })}

                />
                   <Tab.Screen name="ProfileStack" component={ProfileStack}
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
export default connect(mapStateToProps, { selectTheme })(DiagnosisTab)