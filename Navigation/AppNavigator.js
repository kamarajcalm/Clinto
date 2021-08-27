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
import { selectTheme, selectUser,setNoticationRecieved} from '../actions';
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
import PrescriptionViewOuter from '../Screens/PrescriptionView';
import UploadImages from '../AdminScreens/UploadImages';
import ViewReceptionProfile from '../Screens/ViewReceptionProfile';
import { TransitionSpecs, CardStyleInterpolators } from '@react-navigation/stack';
import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';
import EditHeathIssues from '../Screens/EditHeathIssues';
import SelectAddress from '../Screens/SelectAddress';
import ViewMedicalDetails from '../MedicalScreens.js/ViewMedicalDetails';
import CreateReceptionistMedical from '../AdminScreens/CreateReceptionistMedical';
import MedicalOffers from '../AdminScreens/MedicalOffers';

const prefix = Linking.makeUrl('/')
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


const Main = {
    MainTab: TabNavigator,

};

const authScreens = {
    Login: LoginStack,
};
 class AppNavigator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logged: false,
            isReady: false,
        };
    }

  
    componentDidMount() {
      if(this.props.response){
          this.props.setNoticationRecieved(this.props.response)
      }
    }
   
    render() {
         const linking = {
             prefixes:[prefix],
             config:{
                 PrescriptionView:"PrescriptionView"
             },
    
         }
        
        return (
            <NavigationContainer linking={linking} ref={ref=>this.navRef=ref}>
                <Stack.Navigator
                
                    screenOptions={{
                        transitionSpec: {
                            open: TransitionSpecs.TransitionIOSSpec,
                            close: TransitionSpecs.TransitionIOSSpec,
                        },
                        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS

                    }}
                >
                
                    <Stack.Screen name="DefaultScreen" component={DefaultScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="PrescriptionViewOuter" component={PrescriptionViewOuter} options={{ headerShown: false }} />
                    <Stack.Screen name="MainTab" component={TabNavigator} options={{ headerShown: false }} />
                    <Stack.Screen name="Login" component={LoginStack} options={{ headerShown: false }} />
                    <Stack.Screen name="ProfileEdit" component={ProfileEdit} options={{ headerShown: false }} />
                    <Stack.Screen name="AdminTab" component={AdminTab} options={{ headerShown: false }} />
                    <Stack.Screen name="MedicalTab" component={MediacalTab} options={{ headerShown: false }} />
                    <Stack.Screen name="ViewClinicDetails" component={ViewClinicDetails} options={{ headerShown: false }} />
                    <Stack.Screen name="PaymentPage" component={PaymentPage} options={{ headerShown: false }} />
                    <Stack.Screen name="ImageViewer" component={ImageViewer} options={{ headerShown: false }} />
                    <Stack.Screen name="UploadImages" component={UploadImages} options={{ headerShown: false }} />
                                      {/* DOCTOR EDIT */}
                    <Stack.Screen name="SearchDoctors" component={SearchDoctors} options={{ headerShown: false }} />
                    <Stack.Screen name="CreateReceptionist" component={CreateReceptionist} options={{ headerShown: false }} />
                    <Stack.Screen name="AddDoctor" component={AddDoctor} options={{ headerShown: false }} />
                    <Stack.Screen name="UpdateTimings" component={UpdateTimings} options={{ headerShown: false }} />
                    <Stack.Screen name="ViewDoctor" component={ViewDoctor} options={{ headerShown: false }} />
                    <Stack.Screen name="EditDoctorTimings" component={EditDoctorTimings} options={{ headerShown: false }} />
                    <Stack.Screen name="EditClinicDetails" component={EditClinicDetails} options={{ headerShown: false }} />
                    <Stack.Screen name="PrescriptionView" component={PrescriptionView} options={{ headerShown: false }} />
                    <Stack.Screen name="ViewReceptionProfile" component={ViewReceptionProfile} options={{ headerShown: false }} />
                    <Stack.Screen name="EditHealthIssues" component={EditHeathIssues} options={{ headerShown: false }} />
                    <Stack.Screen name="ViewMedicalDetails" component={ViewMedicalDetails} options={{ headerShown: false }} />
                    <Stack.Screen name="CreateReceptionistMedical" component={CreateReceptionistMedical} options={{ headerShown: false }} />
                    <Stack.Screen name="MedicalOffers" component={MedicalOffers} options={{ headerShown: false }} />
                  
                 </Stack.Navigator>
                
            </NavigationContainer>
        );
    }
}
const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,
        user: state.selectedUser,
        notification: state.notification
    }
}
export default connect(mapStateToProps, { selectTheme, selectUser, setNoticationRecieved})(AppNavigator);