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



    render() {
        return (

            <Tab.Navigator
                tabBarOptions={{
                    activeBackgroundColor: themeColor,
                    inactiveBackgroundColor: themeColor,
                    keyboardHidesTabBar: true,
                    style: {

                    },
                }}
                screenOptions={({ route }) => ({

                })}

            >

                <Tab.Screen name="ClincicPriscriptionStack" component={ClincicPriscriptionStack}
                    options={{
                        tabBarIcon: ({ focused, color, size }) => {
                            return <MaterialCommunityIcons name="cards" size={24} color={focused?"#fff":"gray"} />

                        }
                        ,
                        tabBarLabel: ({ focused }) => {
                            return <Text style={{ color: focused ? "#fff" : "gray", fontFamily }}>Prescription</Text>
                        }
                    }}

                />
                <Tab.Screen name="Inventory" component={MedicalInventoryStack}
                    options={{
                        tabBarIcon: ({ focused, color, size }) => {
                            return <MaterialIcons name="inventory" size={24} color={focused?"#fff":"gray"} />

                        },
                        tabBarLabel: ({ focused }) => {
                            return <Text style={{ color: focused ? "#fff" : "gray", fontFamily }}>Inventory</Text>
                        }

                    }}

                />
                <Tab.Screen name="Chats" component={ChatStack}
                    options={{
                        tabBarIcon: ({ focused, color, size }) => {
                            return <Ionicons name="chatbubble-ellipses" size={24} color={focused ? "#fff" : "gray"} />

                        },
                        tabBarLabel: ({ focused }) => {
                            return <Text style={{ color: focused ? "#fff" : "gray", fontFamily }}>Chats</Text>
                        }

                    }}

                />
                <Tab.Screen name="AdminProfileStack" component={AdminProfileStack}
                    options={{
                        tabBarIcon: ({ focused, color, size }) => {
                            return <Ionicons name="ios-person-circle-sharp" size={24} color={focused ? "#fff" : "gray"} />

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
export default connect(mapStateToProps, { selectTheme })(MediacalTab)