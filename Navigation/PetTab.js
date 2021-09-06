import React, { Component } from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import {
    NavigationContainer, DefaultTheme,
    DarkTheme,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {selectTheme} from '../actions'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {connect} from "react-redux"
import { FontAwesome, MaterialCommunityIcons, MaterialIcons, SimpleLineIcons, Entypo, Fontisto, Feather, Ionicons } from '@expo/vector-icons';
import PetTabBar from '../components/PetTabBar';
import PrescriptionStack from '../PetScreens/stacks/PrescriptionStack';
import AppointmentStack from '../stacks/AppointmentStack';
import DoctorsStack from '../stacks/DoctorsStack';
import ChatStack from '../stacks/ChatStack';
import ProfileStack from '../PetScreens/stacks/ProfileStack';

const Tab = createBottomTabNavigator();
class PetTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    getTheme = async () => {

    }
    componentDidMount() {
       
        this.getTheme()
    }
    getTabBarVisibility = (route) => {
           const routeName = route.state ? route.state.routes[route.state.index].name : ''
              return true
    }
    getTabBarVisibility2 = (route) => {
          const routeName = route.state ? route.state.routes[route.state.index].name : ''
             return true
    }
    getTabBarVisibility3 = (route) => {
        const routeName = route.state ? route.state.routes[route.state.index].name : ''

     
        return true
    }
    getTabBarVisibility4 = (route) => {
        const routeName = route.state ? route.state.routes[route.state.index].name : ''

        return true
    }
   getTabBarVisibility5 = (route) => {
        const routeName = route.state ? route.state.routes[route.state.index].name : ''

        return true
    }

  
    render() {
        return (
            
                <Tab.Navigator
                    tabBar={props => <PetTabBar {...props} />}
             
                >
                    <Tab.Screen name="Prescription" component={PrescriptionStack}
                        options={({ route }) => ({

                            tabBarVisible: this.getTabBarVisibility(route),

                        })}
                    />
                {/* <Tab.Screen name="Appointments" component={AppointmentStack}
                    options={({ route }) => ({

                        tabBarVisible: this.getTabBarVisibility2(route),

                    })}
                />


                                  


                <Tab.Screen name="Search" component={DoctorsStack}
                        options={({ route }) => ({

                            tabBarVisible: this.getTabBarVisibility3(route),

                        })}

            />
                    
                    <Tab.Screen name="Chat" component={ChatStack}
                        options={({ route }) => ({

                            tabBarVisible: this.getTabBarVisibility4(route),

                        })}

                    /> */}
                    <Tab.Screen name="Profile" component={ProfileStack}
                    options={({ route }) => ({

                        tabBarVisible: this.getTabBarVisibility5(route),

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
export default connect(mapStateToProps, { selectTheme })(PetTab)