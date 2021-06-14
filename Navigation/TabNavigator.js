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
        console.log(routeName, "rrrrrrrrrrrr")
        if (routeName == "addPriscription") {
            return false
        }
        if (routeName == "SearchMedicines") {
            return false
        }
    
        if (routeName == "PrescriptionView") {
            return false
        }

        if (routeName == "showCard") {
            return false
        }
        if (routeName == "Chat") {
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
                    <Tab.Screen name="Search" component={DoctorsStack}
                        options={({ route }) => ({

                            tabBarVisible: this.getTabBarVisibility3(route),

                        })}

                    />
                    <Tab.Screen name="Chat" component={ChatStack}
                        options={({ route }) => ({

                            tabBarVisible: this.getTabBarVisibility2(route),

                        })}

                    />
                    <Tab.Screen name="Profile" component={ProfileStack}
                   

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
export default connect(mapStateToProps, { selectTheme })(TabNavigator)