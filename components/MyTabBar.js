import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Keyboard,Alert } from 'react-native';
import { FontAwesome, MaterialCommunityIcons, MaterialIcons, SimpleLineIcons, Entypo, Fontisto, Feather, Ionicons, AntDesign} from '@expo/vector-icons';
import settings from '../AppSettings';
const themeColor = settings.themeColor
export default class MyTabBar extends Component {
    constructor(props) {
 
        super(props);
        this.state = {
           show:true,
           user:"doctor",
           showTab:true
        };
    }
    componentDidMount(){
        Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }
    componentWillUnmount(){
        Keyboard.removeListener('keyboardDidShow', this._keyboardDidShow);
        Keyboard.removeListener('keyboardDidHide', this._keyboardDidHide);
    }
    _keyboardDidShow = () => {
        this.setState({showTab:false})
    };

    _keyboardDidHide = () => {
        this.setState({ showTab: true })
    };
UNSAFE_componentWillReceiveProps(){
    const { state, descriptors, navigation } = this.props
    {
        state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            console.log(options.tabBarVisible,"ttttt")
            if (options.tabBarVisible == false) {

               return this.setState({ show: false })
            }else{
                return  this.setState({ show: true })
            }
        })
    }
}
    icon = (label, isFocused) => {
        if (label == "Prescription") {
            return (
                <MaterialCommunityIcons name="cards" size={30} color={isFocused?"#fff":"gray"} />
            )
        }
        if (label == "Appointments") {
            return (
                <MaterialCommunityIcons name="timetable" size={30} color={isFocused ? "#fff" : "gray"} />
               
            )
        }
        if (label == "Search") {
            return (
                <AntDesign name="search1" size={30} color={isFocused ? "#fff" : "gray"} />
            )
        }
        if (label == "Chat") {
            return (
                <Ionicons name="chatbubble-ellipses" size={30} color={isFocused ? "#fff" : "gray"} />
            )
        }
        if (label == "Profile") {
            return (
                <Ionicons name="md-person-circle" size={30} color={isFocused ? "#fff" : "gray"}/>
            )
        }
       
    }
    render() {
        const { state, descriptors, navigation } = this.props
        if(this.state.showTab){

    
        if(this.state.show){

    
        return (
            <View style={{ 
                backgroundColor:themeColor,
                height: 60, 
                flexDirection: "row" ,
                position:"absolute",
                bottom:25,
                left:20,
                right:20,
                elevation:6,
                borderRadius:20
                }}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    if (options.tabBarVisible == false){
                        console.log(options,"kk")
                          this.setState({show:false})
                    }
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;

                    const isFocused = state.index === index;

                  

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };
                     if(label == 'Appointments'){
                         
                         if(this.state.user=="doctor"){
                            
                             return (
                                 <TouchableOpacity

                                     key={index}
                                     accessibilityRole="button"
                                     accessibilityStates={isFocused ? ['selected'] : []}
                                     accessibilityLabel={options.tabBarAccessibilityLabel}
                                     testID={options.tabBarTestID}
                                     onPress={onPress}
                                     onLongPress={onLongPress}
                                     style={{ flex: 0.2, alignItems: "center", justifyContent: "center", }}
                                 >
                                     {
                                         this.icon(label, isFocused)
                                     }
                                     {/* <Text style={[{ color: isFocused ? '#fff' : 'gray', fontFamily: "openSans", fontSize: 10 }, styles.text]}>
                                         {label}
                                     </Text> */}
                                 </TouchableOpacity>
                             );
                         }
                     
                     }
                    if (label != 'Appointments'){
                        return (
                            <TouchableOpacity

                                key={index}
                                accessibilityRole="button"
                                accessibilityStates={isFocused ? ['selected'] : []}
                                accessibilityLabel={options.tabBarAccessibilityLabel}
                                testID={options.tabBarTestID}
                                onPress={onPress}
                                onLongPress={onLongPress}
                                style={{ flex: 0.2, alignItems: "center", justifyContent: "center", }}
                            >
                                {
                                    this.icon(label, isFocused)
                                }
                                {/* <Text style={[{ color: isFocused ? '#fff' : 'gray', fontFamily: "openSans", fontSize: label == "QuestionPapers" ? 10 : 12 }, styles.text]}>
                                    {label}
                                </Text> */}
                            </TouchableOpacity>
                        );
                    }
                  
                   
                })}
            </View>
        );
        }

        return null
    }
       return null
    }
   
}

const styles = StyleSheet.create({
    text: {
        fontFamily: "openSans",
        lineHeight: 22,
        fontWeight: 'bold'
    },
})