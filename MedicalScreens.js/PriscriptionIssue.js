import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, TouchableOpacity, StyleSheet, FlatList, Image, SafeAreaView, Appearance,Animated,TextInput,RefreshControl,ActivityIndicator,Keyboard,Platform} from 'react-native';
import settings from '../AppSettings';
import { connect } from 'react-redux';
import { selectTheme,selectMedical} from '../actions';
const { height, width } = Dimensions.get("window");
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons, AntDesign, Fontisto, FontAwesome,EvilIcons} from '@expo/vector-icons';
import authAxios from '../api/authAxios';
import HttpsClient from '../api/HttpsClient';
import moment from 'moment';
import Modal from 'react-native-modal';
import Constants from 'expo-constants'; 
const {statusBarHeight} =Constants
const fontFamily = settings.fontFamily;
let themeColor = settings.themeColor;
const url = settings.url;
const { diffClamp } = Animated;
const headerHeight = height * 0.2;
import { LinearGradient } from 'expo-linear-gradient';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
class PriscriptionIssue extends Component {
    constructor(props) {
        const Date1 = new Date()
        const day = Date1.getDate()
        const month = Date1.getMonth() + 1
        const year = Date1.getFullYear()
        const today = `${year}-${month}-${day}`
        super(props);
        this.state = {
            today:moment(new Date()).format("YYYY-MM-DD"),
            mode: 'date',
            date: new Date(),
            show: false,
            priscriptions:[],
            showModal:false,
            medicals:[],
            showCalender:false,
            isFetching:false,
            offset:0,
            next:true,
            showTab:true
        };
        this.scrollY = new Animated.Value(0)
        this.translateYNumber = React.createRef()
    }

    showDatePicker = () => {
        this.setState({ showCalender: true })
    };

    hideDatePicker = () => {
        this.setState({ showCalender: false })
    };

    handleConfirm = (date) => {
        this.setState({ today: moment(date).format('YYYY-MM-DD'), showCalender: false, date: new Date(date) }, () => {
            this.getPriscriptions(this.props.medical.id)
       

        })
        this.hideDatePicker();
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
    getPriscriptions =async(pk)=>{
        let api = `${url}/api/prescription/issued/?clinic=${pk}&date=${moment(this.state.date).format("YYYY-MM-DD")}&limit=10&offset=${this.state.offset}`
       
        const data = await HttpsClient.get(api)
        console.log(api)
        if(data.type =="success"){
            this.setState({ priscriptions: this.state.priscriptions.concat(data.data.results),isFetching:false})
            if(data.data.next==null){
                this.setState({next:false})
            }
        }else{
            this.setState({  isFetching: false })
           this.showSimpleMessage("Oops! Something's wrong! ", "#dd7030",)
        }

    }
    getClinic = async()=>{
   
        if (this.props.user.profile.occupation == "MedicalRecoptionist") {
  
           let api = `${url}/api/prescription/recopinists/?user=${this.props.user.id}`
            let data = await HttpsClient.get(api)
            console.log(api)
            if (data.type == "success") {
                 let medical ={
                     clinicpk: data.data[0].clinic.id,
                     inventory: data.data[0].clinic.inventory,
                 }
                this.props.selectMedical(medical)
                this.getPriscriptions(data.data[0].clinic.id)
            }
          
        }else{
            
            let api = `${url}/api/prescription/getDoctorClinics/?medicalRep=${this.props.user.id}`
            let data = await HttpsClient.get(api)
            console.log(api)
            if(data.type =="success"){
                this.setState({ medicals: data.data.ownedclinics})
                this.props.selectMedical(data.data.ownedclinics[0])
                this.getPriscriptions(data.data.ownedclinics[0].clinicpk)
            }
            console.log(api)

        }

    
        
       
    }

    componentWillUnmount() {
        Keyboard.removeListener('keyboardDidShow', this._keyboardDidShow);
        Keyboard.removeListener('keyboardDidHide', this._keyboardDidHide);
    }
    _keyboardDidShow = () => {
       
        this.setState({ showTab: false })
    };

    _keyboardDidHide = () => {
        this.setState({ showTab: true })
    };
    componentDidMount() {
       
              this.getClinic();
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.setState({ isFetching: true, priscriptions: [], offset: 0 }, () => {
                this.getPriscriptions(this?.props?.medical?.clinicpk)
            })
            Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
            Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
        });
    }
    onRefresh = () => {
        this.setState({ isFetching: true, priscriptions:[],offset:0},()=>{
            this.getPriscriptions(this?.props?.medical?.clinicpk)
        })
     
      
    }
    handleEndReached =()=>{
         if(this.state.next){
               this.setState({offset:this.state.offset+10},()=>{
                   this.getPriscriptions(this.props.medical.clinicpk)
               })
         }
    }
    componentWillUnmount(){
        this._unsubscribe();
    }
    renderFooter = () => {
        if (this.state.next) {
            return (
                <ActivityIndicator size="large" color={themeColor} />
            )
        }
        return null
    }
    searchPriscriptions = (text)=>{
          let filter = this.state.priscriptions.filter((i) => {
            let match = i.patientdetails.name.toUpperCase()
            console.log(match,"gjhgjh")
            return match.includes(text.toUpperCase())
        })
        this.setState({ priscriptions: filter })
    }
  validateHeaders = () => {
    const { height,width } = Dimensions.get("window");
    const headerHeight = height*0.2
        return (
            <View>
                <View style={{ height: headerHeight / 2,flexDirection:"row",}}>
                     <View style={{flex:0.6,justifyContent:"center"}}>
                        <Text style={{ color: '#fff', fontFamily: "openSans", marginLeft: 20, fontSize: height*0.028, fontWeight: "bold" }}>Prescription</Text>
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
                            placeholder={`Search ${this.props?.clinic?.name ||"prescription"}`}
                            onChangeText={(text) => { this.searchPriscriptions(text) }}
                        />
                    </View>

                </View>
            </View>
        )
    }
    separotor =()=>{
        return (
            <View style={{height:0.5,backgroundColor:"gray",}}>

            </View>
        )
    }
    renderFilter = () => {

        return (

            <View style={{ alignItems: "center", justifyContent: "center", width: width * 0.32, }}>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <Text style={[styles.text, { color: "#fff" }]}>{moment(this.state.today).format("DD-MM-YYYY")}</Text>
                    </View>

                    <TouchableOpacity
                        style={{ marginLeft: 20 }}
                        onPress={() => { this.setState({ showCalender: true }) }}
                    >
                        <Fontisto name="date" size={24} color={"#fff"} />
                    </TouchableOpacity>


                    <DateTimePickerModal
                        isVisible={this.state.showCalender}
                        mode="date"
                        onConfirm={this.handleConfirm}
                        onCancel={this.hideDatePicker}
                    />
                </View>

            </View>

        )

    }
        getFirstLetter =(item ,clinic=null)=>{
        let name = item.patientdetails.name.split("")
     
        return name[0].toUpperCase()
    }
    getCloser = (value, checkOne, checkTwo) =>
        Math.abs(value - checkOne) < Math.abs(value - checkTwo) ? checkOne : checkTwo;
    render() {
        const { height, width } = Dimensions.get("window");
        const scrollYClamped = diffClamp(this.scrollY, 0, headerHeight);

        const translateY = scrollYClamped.interpolate({
            inputRange: [0, headerHeight],
            outputRange: Platform.OS=="android"?[0, -(headerHeight / 2)]:[0, -(headerHeight / 2+statusBarHeight-30)],
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
                    <View style={{ flex: 1, backgroundColor: "#fff" }}>
                        <StatusBar backgroundColor={themeColor} />
                        {/* HEADERS */}
                        <Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
                            {
                                this.validateHeaders()
                            }

                        </Animated.View>
                    
            
                        {/* PRISCRIPTIONS */}
                        <Animated.FlatList
                            style={{  }}
                            refreshControl={
                                <RefreshControl
                                    onRefresh={() => this.onRefresh()}
                                    refreshing={this.state.isFetching}
                                    progressViewOffset={headerHeight}
                                />
                            }
                         
                            data={this.state.priscriptions}
                            keyExtractor={(item, index) => index.toString()}
                            scrollEventThrottle={16}
                            contentContainerStyle={{ paddingTop: headerHeight -10, paddingBottom: 150 }}
                            onScroll={handleScroll}
                            onMomentumScrollEnd={handleSnap}
                            onEndReached={() => { this.handleEndReached() }}
                            ListFooterComponent={this.renderFooter()}
                            onEndReachedThreshold={0.1}
                            renderItem={({ item, index }) => {
                                return (
                             <TouchableOpacity style={[styles.card,styles.boxWithShadow, { flexDirection: "row",    height: height * 0.18,backgroundColor:"#fff",borderRadius:10,margin:10,marginTop:20}]}
                                     onPress={() => { this.props.navigation.navigate('PrescriptionView', { pk:item.prescription,show:false})}}
                    
                >
                    <View style={{ flex: 0.3, alignItems: 'center', justifyContent: 'center' }}>
                        <LinearGradient 
                              style={{ height: height*0.084, width: height*0.084, borderRadius: height*0.042,alignItems: "center", justifyContent: "center" }}
                              colors={["#333", themeColor, themeColor]}
                        >
                              <View >
                                  <Text style={[styles.text, { color: "#ffff", fontWeight: "bold", fontSize: height*0.02}]}>{this.getFirstLetter(item)}</Text>
                              </View>
                        </LinearGradient>
                       
                    </View>
                    <View style={{ flex: 0.7, marginHorizontal: 10, justifyContent: 'center' }}>
                        <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                 <View style={{flexDirection:"row"}}>
                                      <Text style={[styles.text, { color: "#000", fontWeight: 'bold',fontSize:height*0.021 }]}>{item?.patientdetails?.name}</Text>
                                      <Text style={[styles.text, {fontSize:height*0.021 }]}> ({item?.patientdetails.age} - {item?.patientdetails.sex})</Text>
                                 </View>
                                  
                            </View>
                            <View style={{ alignItems: "center", justifyContent: "center" ,marginRight:10}}>
                                <Text style={[styles.text]}>#{item.prescription}</Text>
                            </View>
                        </View>
                   <View style={{ marginTop: 10,flexDirection:"row" }}>
                         <View style={{flexDirection:"row"}}>
                                <Text style={[styles.text,{fontSize:height*0.021 }]}>Clinic : </Text>
                            </View>
                            <View style={{flexDirection:"row",flexWrap:"wrap",flex:1}}>
                               <Text style={[styles.text,{fontSize:height*0.021 }]}>{item.patientdetails.clinic}</Text>
                            </View>
                  
                        </View>
                         <View style={{marginTop:10,flexDirection:"row",alignItems:"center",justifyContent:"space-between",}}>
                                   <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: height*0.04, width:height*0.04, borderRadius: height*0.02, alignItems: "center", justifyContent: 'center',}]}
                                        onPress={() => { this.chatWithDoctor(item.forUser) }}
                                    >
                                        <Ionicons name="chatbox" size={height*0.02} color="#63BCD2" />

                                    </TouchableOpacity>
                         
                           <View style={{paddingRight:15}}>
                                <Text style={[styles.text]}>{moment(item.created).format("h:mm a")}</Text>
                            </View>
                         </View>
                    </View>

                </TouchableOpacity>
                                )
                            }}
                        />
                       {this.state.showTab&& <View style={{
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
                                onPress={() => { this.props.navigation.navigate('SearchPateint') }}
                            >
                                <AntDesign name="pluscircle" size={40} color={themeColor} />
                            </TouchableOpacity>
                        </View>}
                    </View>
                
                </SafeAreaView>
            </>
        );
    }
}
const styles = StyleSheet.create({
    text: {
        fontFamily
    },
    topSafeArea: {
        flex: 0,
        backgroundColor: themeColor
    },
    bottomSafeArea: {
        flex: 1,
        backgroundColor: "#fff"
    },
    header: {
        position: 'absolute',
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 1,
        backgroundColor: themeColor,
        elevation: 6
    },
        boxWithShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5
    }
})
const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,
        user: state.selectedUser,
        medical:state.selectedMedical
    }
}
export default connect(mapStateToProps, { selectTheme, selectMedical})(PriscriptionIssue);
