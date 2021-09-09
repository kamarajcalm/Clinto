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
    Linking,
    Alert

} from "react-native";
import { Ionicons, Entypo, Feather, MaterialCommunityIcons, FontAwesome, FontAwesome5, EvilIcons,Fontisto,AntDesign} from '@expo/vector-icons';
import { Swipeable } from "react-native-gesture-handler";
import { connect } from 'react-redux';
import { selectTheme ,selectClinic} from '../../actions';
import settings from '../../AppSettings';
const { diffClamp } = Animated;
const { height, width } = Dimensions.get("window");
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
import axios from 'axios';
import moment from 'moment';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import HttpsClient from '../../api/HttpsClient';
const url = settings.url;
import { LinearGradient } from 'expo-linear-gradient';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";

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
            today:moment(new Date()).format("YYYY-MM-DD"),
            showDate,
            mode: 'date',
            date: new Date(),
            show: false,
            reports:[],
            offset:0
        };
        this.scrollY=new Animated.Value(0)
        this.translateYNumber= React.createRef()
        this.swipeRef=[]
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

     this.setState({ today: moment(date).format('YYYY-MM-DD'), show: false,}, () => {
        this.onRefresh();

     })
        this.hideDatePicker();
    };
    getPharmacy =  async()=>{
        let api = `${url}/api/prescription/getDoctorClinics/?labassistant=${this.props.user.id}`
        console.log(api)
        const data =await HttpsClient.get(api)
           if(data.type=="success"){
            this.setState({ clinics: data.data.workingclinics})
            this.props.selectClinic(data.data.ownedclinics[0])
            this.getReports();
        }
    }
    deleteItem = async(item,index)=>{
        this.swipeRef[index].close()
         let api =`${url}/api/prescription/getreports/${item.id}/`
         let del = await  HttpsClient.delete(api)
         if(del.type=="success"){
              let duplicate  = this.state.reports
              duplicate.splice(index,1)
              this.setState({reports:duplicate})
            
             return this.showSimpleMessage("Deleted SuccessFully","green","success")
         }else{
                return this.showSimpleMessage("Try Again","red","danger") 
         }
    }
    createAlert = (item,index) => {
                Alert.alert(
                "Do you want to delete?",
                ``,
                [
                    {
                    text: "No",
                    onPress: () => this.swipeRef[index].close(),
                    style: "cancel"
                    },
                    { text: "Yes", onPress: () => { this.deleteItem(item,index) } }
                ]
                );

  }

    
    getReports = async()=>{
      
       let api =`${url}/api/prescription/getreports/?diagonistic_clinic=${this.props.clinic.clinicpk}&date=${this.state.today}&limit=6&offset=${this.state.offset}`
       console.log(api)
       const data = await HttpsClient.get(api)
       if(data.type=="success"){
            this.setState({ reports: this.state.reports.concat(data.data.results)})
            this.setState({ loading: false ,isFetching:false})
            if (data.data.next != null) {
                this.setState({ next: true })
            } else {
                this.setState({ next: false })
            }
       }
    }
        rightSwipe =(progress,dragX,item,index)=>{
        const { height,width } = Dimensions.get("window");
      
        const scale = dragX.interpolate({
            inputRange:[0,100],
            outputRange:[0,1],
            extrapolate:"clamp"
        })
        return(
            <View style={{  backgroundColor: "gray", height: height * 0.15, }}>
              
                   <TouchableOpacity 
                    onPress={() => { this.createAlert(item,index)}}
                    style={{height:height*0.05,width:width*0.3,alignItems:"center",justifyContent:"center",backgroundColor:item.active?"green":"red",marginHorizontal:20,marginTop:20}}
                   >
                    <Text style={[styles.text, { color: "#fff",  }]}>Delete</Text>
                   </TouchableOpacity>
             
            </View>
        )
    }
        getFirstLetter =(item)=>{
        let name = item.user.first_name.split("")

        return name[0].toUpperCase()
    }
    closeRow =(index)=>{
       this.swipeRef.forEach((i)=>{
           if (i != this.swipeRef[index]){
              i?.close();
           }
       
       })

    }
        renderFooter =()=>{
       if(this.state.next){
           return(
               <ActivityIndicator size="large" color ={themeColor} />
           )
       }
       return null
    }
        handleEndReached =()=>{
        if(this.state.next){
            this.setState({offset:this.state.offset+6},()=>{
                this.getReports()
             
            })
        }
    }
    onRefresh =()=>{
        this.setState({offset:0,reports:[]},()=>{
            this.getReports()
        })
    }
  componentDidMount(){
       
        this.getPharmacy()

       
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            if(this.props?.clinic){
                  this.onRefresh()
               
        }
            
        });
        Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    getIndex = (index) => {
        let value = this.state.reports.length - index
        return value
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
                            <Text style={[styles.text, { color: "#fff" }]}>{this.state.today}</Text>
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
           
               <Animated.FlatList
                            keyExtractor={(item, index) => index.toString()}
                            refreshControl={
                                <RefreshControl
                                    onRefresh={() => this.onRefresh()}
                                    refreshing={this.state.isFetching}
                                    progressViewOffset={headerHeight}
                                />
                            }
                            data={this.state.reports}
                            scrollEventThrottle={16}
                            contentContainerStyle={{ paddingTop: headerHeight+height*0.01, paddingBottom: 150 }}
                            onScroll={handleScroll}
                            ref={ref=>this.ref=ref}
                             
                            onEndReached ={()=>{this.handleEndReached()}}
                            ListFooterComponent={this.renderFooter()}
                            onEndReachedThreshold={0.1}
                            renderItem={({item,index})=>{
                               return(
                                  
                            <Swipeable
                onSwipeableRightOpen={() => { this.closeRow(index)}}
            
                ref={ref=>this.swipeRef[index]=ref}
                renderRightActions={(progress, dragX) => this.rightSwipe(progress, dragX, item, index)}
            >
                <TouchableOpacity style={[styles.card, { flexDirection: "row",    height: height * 0.1,}]}
                    
                    onPress={() => { this.props.navigation.navigate('ViewReports',{item})}}
                >
                    <View style={{ flex: 0.3, alignItems: 'center', justifyContent: 'center' }}>
                        <LinearGradient 
                              style={{ height: 50, width: 50, borderRadius: 25,alignItems: "center", justifyContent: "center" }}
                              colors={["#333", themeColor, themeColor]}
                        >
                              <View >
                                  <Text style={[styles.text, { color: "#ffff", fontWeight: "bold", fontSize: 22 }]}>{this.getFirstLetter(item)}</Text>
                              </View>
                        </LinearGradient>
                       
                    </View>
                    <View style={{ flex: 0.7, marginHorizontal: 10, justifyContent: 'center' }}>
                        <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" ,}}>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                 <View style={{flexDirection:"row"}}>
                                      <Text style={[styles.text, { color: "#000", fontWeight: 'bold' }]}>{item?.user?.first_name} {item?.user?.last_name}</Text>
                                      <Text style={[styles.text, {}]}> ({item?.user?.profile?.age} - {item?.user?.profile?.sex})</Text>
                                 </View>
                                  
                            </View>
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <Text>#{this.getIndex(index)}</Text>
                            </View>
                        </View>
        
                                <View style={{ flexDirection: "row", marginVertical:10 }}>
                        <View style={{flex:0.5,alignItems:"center",justifyContent:"space-around",flexDirection:"row"}}>
                                            <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center', marginLeft: 10 }]}
                            onPress={() => { this.chatClinic(item) }}
                        >
                            <Ionicons name="chatbox" size={24} color="#63BCD2" />

                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center', marginLeft: 10 }]}
                            onPress={() => {
                       
                                    if (Platform.OS == "android") {
                                        Linking.openURL(`tel:${item?.user?.profile.mobile}`)
                                    } else {

                                        Linking.canOpenURL(`telprompt:${item?.user?.profile.mobile}`)
                                    }}}
    
                        >
                           <Ionicons name="call" size={24} color="#63BCD2" />
                        </TouchableOpacity>
                        </View>
                
                 
                         
                    </View>
                    </View>

                </TouchableOpacity>
            </Swipeable>
                                
                                 
                                  
                               )
                          }}
                        />
             
                          
            

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
export default connect(mapStateToProps, { selectTheme ,selectClinic})(ReportsScreen);