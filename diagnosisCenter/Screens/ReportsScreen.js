import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Animated,
    SafeAreaView,
    Dimensions,
    StatusBar,
    TouchableWithoutFeedback,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    TextInput,
    BackHandler,
    RefreshControl,
    Keyboard,
    Platform,
    Linking

} from "react-native";
import { Ionicons, Entypo, Feather, MaterialCommunityIcons, FontAwesome, FontAwesome5, EvilIcons,Fontisto,AntDesign} from '@expo/vector-icons';

import { connect } from 'react-redux';
import { selectTheme } from '../../actions';
import settings from '../../AppSettings';
const { diffClamp } = Animated;
const { height, width } = Dimensions.get("window");
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
import axios from 'axios';
import moment from 'moment';
import DateTimePickerModal from "react-native-modal-datetime-picker";
const url = settings.url;

class ReportsScreen extends Component {
    constructor(props) {
        const Date1 = new Date()
        const day = Date1.getDate()
        const month = Date1.getMonth() + 1
        const year = Date1.getFullYear()
        const today = `${year}-${month}-${day}`
        const showDate = `${day}-${month}-${year}`
        super(props);
        this.state = {
            today,
            showDate,
            mode: 'date',
            date: new Date(),
            show: false,
        };
        this.scrollY=new Animated.Value(0)
        this.translateYNumber= React.createRef()
    }
showDatePicker = () => {
       this.setState({show:true})
    };

hideDatePicker = () => {
    this.setState({ show: false })
    };
    showSimpleMessage(content, color, type = "info", props = {}) {
        const message = {
            message: content,
            backgroundColor: color,
            icon: { icon: "auto", position: "left" },
            type,
            ...props,
        };

        showMessage(message);
    }
 handleConfirm = (date) => {
     this.setState({})
     this.setState({ today: moment(date).format('YYYY-MM-DD'), show: false, prescriptions: [], offset: 0, next: true, showDate: moment(date).format('DD-MM-YYYY')  }, () => {
        

     })
        this.hideDatePicker();
    };
  componentDidMount(){
       

        this._unsubscribe = this.props.navigation.addListener('focus', () => {
        
            
        });
        Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount() {
         this._unsubscribe();
        Keyboard.removeListener('keyboardDidShow', this._keyboardDidShow);
        Keyboard.removeListener('keyboardDidHide', this._keyboardDidHide);
    }
    _keyboardDidShow = () => {
        this.setState({ keyBoard:true })
    };

    _keyboardDidHide = () => {
        this.setState({ keyBoard:false })
    };
    renderFilter = () => {
        const { height,width } = Dimensions.get("window");
        const headerHeight = height*0.2   
      
            return (

                <View style={{ alignItems: "center", justifyContent: "center", width: width * 0.32, }}>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <Text style={[styles.text, { color: "#fff" }]}>{this.state.showDate}</Text>
                        </View>

                        <TouchableOpacity
                            style={{ marginLeft: 20 }}
                            onPress={() => {this.setState({show:true}) }}
                        >
                            <Fontisto name="date" size={24} color={"#fff"} />
                        </TouchableOpacity>


                        <DateTimePickerModal
                            isVisible={this.state.show}
                            mode="date"
                            onConfirm={this.handleConfirm}
                            onCancel={this.hideDatePicker}
                        />
                    </View>

                </View>

            )
      
    }
      validateHeaders = () => {
    const { height,width } = Dimensions.get("window");
    const headerHeight = height*0.2
        return (
            <View>
                <View style={{ height: headerHeight / 2,flexDirection:"row",}}>
                     <View style={{flex:0.6,justifyContent:"center"}}>
                        <Text style={{ color: '#fff', fontFamily: "openSans", marginLeft: 20, fontSize: height*0.04, fontWeight: "bold" }}>Reports</Text>
                     </View>
                    <View style={{flex:0.4,alignItems: "center", justifyContent: 'center'}}>
                        {
                            this.renderFilter()
                        }
                    </View>
                </View>

                <View style={{ marginHorizontal: 20, height: headerHeight/2, alignItems: 'center', justifyContent: "center", }}>
                    <View style={{ flexDirection: 'row', borderRadius: 10, backgroundColor: "#eee", width: "100%", height:height*0.065,alignItems:"center",justifyContent:"center"}}>
                        <View style={{ alignItems: 'center', justifyContent: "center", marginLeft: 5, flex: 0.1 }}>
                            <EvilIcons name="search" size={24} color="black" />
                        </View>
                        <TextInput
                            placeholderStyle={[styles.text]}
                            selectionColor={themeColor}
                            style={{ height: "99%", flex: 0.8, backgroundColor: "#eee", paddingLeft: 10,justifyContent:"center" }}
                            placeholder={`search ${this.props?.clinic?.name ||""}`}
                            onChangeText={(text) => { this.searchPriscriptions(text) }}
                        />
                    </View>

                </View>
            </View>
        )
    }

    
getCloser = (value, checkOne, checkTwo) =>
        Math.abs(value - checkOne) < Math.abs(value - checkTwo) ? checkOne : checkTwo;

    render() {
              const { height,width } = Dimensions.get("window");
        const headerHeight = height * 0.2;
const screenHeight =Dimensions.get('screen').height;
        const scrollYClamped = diffClamp(this.scrollY, 0, headerHeight);

        const translateY = scrollYClamped.interpolate({
            inputRange: [0, headerHeight],
            outputRange: Platform.OS=="android"?[0, -(headerHeight / 2)-10]:[0, -(headerHeight / 2+statusBarHeight-30)],
        });


        translateY.addListener(({ value }) => {
           this.translateYNumber.current = value;
        });

        const handleScroll = Animated.event(
            [
                {
                    nativeEvent: {
                        contentOffset: { y: this.scrollY },
                    },
                },
            ],
            {
                useNativeDriver: true,
            },
        );

        const handleSnap = ({ nativeEvent }) => {
            
            const offsetY = nativeEvent.contentOffset.y;
            if (
                !(
                    this.translateYNumber.current === 0 ||
                    this.translateYNumber.current === -headerHeight / 2
                )
            ) {
                if (this.ref) {
               
                    this.ref.scrollToOffset({
                        offset:
                            this.getCloser(this.translateYNumber.current, -headerHeight / 2, 0) ===
                                -headerHeight / 2
                                ? offsetY + headerHeight / 2
                                : offsetY - headerHeight / 2,
                    });
                }
            }
        };
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                 <StatusBar backgroundColor={themeColor} barStyle={"default"} />

                          {/* HEADERS */}
                    <Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
                        {
                          this.validateHeaders()
                        }

                    </Animated.View>
   <Animated.View style={{flex:1,backgroundColor:"#f3f3f3f3"}}>
           
              
             
                          
            

                  {!this.state.keyBoard&&<View style={{
                            position: "absolute",
                            bottom: 100,
                            left: 20,
                            right: 20,
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",

                            borderRadius: 20
                        }}>
                            <TouchableOpacity
                                onPress={() => { this.props.navigation.navigate('CreateReport') }}
                            >
                                <AntDesign name="pluscircle" size={40} color={themeColor} />
                            </TouchableOpacity>
                        </View>}
            </Animated.View> 

                </SafeAreaView>
            </>
        );
    }
}
const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 1,
        backgroundColor: themeColor,
        elevation: 6
    },
    subHeader: {
     
        width: '100%',
        paddingHorizontal: 10,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    text: {
        fontFamily,
         fontSize:height*0.02
    },
    root: {
        flex: 1, 
        marginHorizontal: 20
    },
    container: {
        flex: 1
    },
    card: {
        backgroundColor: "#fff",
    
        borderColor:"gray",
        borderBottomWidth:0.5
       

    },
    card2:{
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0,
        shadowRadius: 4.65,
        elevation: 5,
        borderRadius: 10,
        backgroundColor: "#fff",
     
        marginHorizontal: 10,
        marginVertical: 3
    },
    topSafeArea: {
        flex: 0,
        backgroundColor: themeColor
    },
    bottomSafeArea: {
        flex: 1,
        backgroundColor: "#fff"
    },
    boxWithShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5
    }
});
const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,
        user:state.selectedUser,
        clinic: state.selectedClinic
    }
}
export default connect(mapStateToProps, { selectTheme })(ReportsScreen);