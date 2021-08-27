import React, { Component } from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import {
    NavigationContainer, DefaultTheme,
    DarkTheme,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome, MaterialCommunityIcons, MaterialIcons, SimpleLineIcons, Entypo, Fontisto, Feather, Ionicons, FontAwesome5 ,AntDesign} from '@expo/vector-icons';
import settings from '../AppSettings';
const themeColor = settings.themeColor
const fontFamily =settings.fontFamily

import { Appearance, useColorScheme } from 'react-native-appearance';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import ClincsStack from '../stacks/ClincsStack';
import DoctorsAdminStack from '../stacks/DoctorsAdminStack';
import MedicalStack from '../stacks/MedicalStack';

import BackendProfile from '../stacks/BackendProfile';

const Tab = createBottomTabNavigator();


class AdminTab extends Component {
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
 


    render() {
        return (

            <Tab.Navigator
                 tabBarOptions={{
                    activeBackgroundColor: themeColor,
                    inactiveBackgroundColor:themeColor,
                    keyboardHidesTabBar:true,
                    style: {
                   
                    },
                 }}
                screenOptions={({ route }) => ({
                
                })}

            >
              
                <Tab.Screen name="ClincsStack" component={ClincsStack}
                     options={{
                         tabBarIcon:({focused,color,size})=>{
                             return <FontAwesome5 name="clinic-medical" size={24} color={focused?"#fff":"gray"} />
                             
                         }
                         ,
                         tabBarLabel: ({ focused }) => {
                             return <Text style={{ color: focused ? "#fff" : "gray", fontFamily }}>Clincs</Text>
                         }
                     }}
          
                />
                <Tab.Screen name="DoctorsAdminStack" component={DoctorsAdminStack}
                    options={{
                        tabBarIcon: ({ focused, color, size }) => {
                            return <Fontisto name="doctor" size={24} color={focused ? "#fff" : "gray"} />

                        },
                        tabBarLabel: ({ focused }) => {
                            return <Text style={{ color: focused ? "#fff" : "gray", fontFamily }}>doctors</Text>
                        }
                        
                    }}
                    
                />
                <Tab.Screen name="MedicalStack" component={MedicalStack}
                    options={{
                         
                        tabBarIcon: ({ focused, color, size }) => {
                            return <FontAwesome5 name="hand-holding-medical" size={24} color={focused?"#fff":"gray"} />

                        },
                        tabBarLabel:({focused})=>{
                            return<Text style={{color:focused?"#fff":"gray",fontFamily}}>medicals</Text>
                        }
                        
                    }}

                />
                <Tab.Screen name="BackendProfile" component={BackendProfile}
                    options={{
                        tabBarIcon: ({ focused, color, size }) => {
                            return <Ionicons name="person-circle-sharp" size={24} color={focused?"#fff":"gray"} />
                            
                        },
                        tabBarLabel: ({ focused }) => {
                            return <Text style={{ color: focused ? "#fff" : "gray", fontFamily }}>Profile</Text>
                        }

                    }}

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
export default connect(mapStateToProps, { selectTheme })(AdminTab)