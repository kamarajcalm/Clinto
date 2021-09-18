import * as React from 'react';
import { Text, View, StyleSheet ,StatusBar } from 'react-native';
import * as Font from 'expo-font';
import AppNavigator from './Navigation/AppNavigator';
import { AppearanceProvider } from 'react-native-appearance';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './reducers';
import FlashMessage from "react-native-flash-message";
import * as Notifications from 'expo-notifications';

import notRef from './notificationRef';
Notifications.setNotificationCategoryAsync("welcome", [
  {
    identifier: "1",
    buttonTitle: "accept",

  },
  {
    identifier: "2",
    buttonTitle: "reject",
  },

],
)
Notifications.setNotificationChannelAsync('new-emails', {
  name: 'E-mail notifications',
  sound: 'starwar.wav', // Provide ONLY the base filename
});
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
export default class App extends React.Component {
  state = {
    fontsLoaded: false,
    response:null,
    first:true,
  };

  async loadFonts() {
    await Font.loadAsync({
      // Load a font `Montserrat` from a static resource
      openSans: require('./assets/fonts/OpenSans-Regular.ttf'),


    });
    this.setState({ fontsLoaded: true,});
  }

   componentDidMount() {
   
    this.loadFonts();
   
 const subscribe =  Notifications.addNotificationResponseReceivedListener(response => {
        
      
          if(this.state.first){
       
            this.setState({ first: false }, ()=>{
        
              this.setState({ response })
            })
    
          }
        
        });
     
  setTimeout(()=>{
    subscribe.remove()
  },2000)
  }

  
  render() {
    // Use the font with the fontFamily property after loading
    if (this.state.fontsLoaded) {
      return (
        <Provider store={createStore(reducers)}>
          <AppearanceProvider>
            <AppNavigator response ={this.state.response}/>
            <FlashMessage 
            position="top" 
            hideStatusBar={false}
            />
         
          </AppearanceProvider>
        </Provider>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
