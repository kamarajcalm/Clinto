import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, TouchableOpacity, StyleSheet, FlatList, Image, SafeAreaView, Appearance,Animated,TextInput,RefreshControl,ActivityIndicator} from 'react-native';
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
const fontFamily = settings.fontFamily;
let themeColor = settings.themeColor;
const url = settings.url;
const { diffClamp } = Animated;
const headerHeight = height * 0.2;
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
            today,
            mode: 'date',
            date: new Date(),
            show: false,
            priscriptions:[],
            showModal:false,
            medicals:[],
            showCalender:false,
            isFetching:false,
            offset:0,
            next:true
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
           this.showSimpleMessage("Something Went Wrong", "#dd7030",)
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

    componentDidMount() {
       
              this.getClinic();
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            
            this.getPriscriptions(this.props?.medical?.clinicpk)

        });
    }
    onRefresh = () => {
        this.setState({ isFetching: true, priscriptions:[],offset:0},()=>{
            this.getPriscriptions(this.props.medical.clinicpk)
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
    searchPriscriptions = ()=>{
        
    }
    validateHeaders = () => {

        return (
            <View>
                <View style={{ height: headerHeight / 2, flexDirection: "row", }}>
                    <View style={{ flex: 0.5, alignItems: "center", justifyContent: 'center' }}>
                        <Text style={{ color: '#fff', fontFamily: "openSans", marginLeft: 20, fontSize: 30, fontWeight: "bold" }}>Prescription</Text>
                    </View>
                    <View style={{ flex: 0.5, alignItems: "center", justifyContent: 'center' }}>
                        {
                            this.renderFilter()
                        }
                    </View>
                </View>

                <View style={{ marginHorizontal: 20, height: headerHeight / 3, alignItems: 'center', justifyContent: "center", marginBottom: 5 }}>
                    <View style={{ flexDirection: 'row', borderRadius: 10, backgroundColor: "#eee", width: "100%", height: height * 0.05, }}>
                        <View style={{ alignItems: 'center', justifyContent: "center", marginLeft: 5, flex: 0.1 }}>
                            <EvilIcons name="search" size={24} color="black" />
                        </View>
                        <TextInput
                            selectionColor={themeColor}
                            style={{ height: "90%", flex: 0.8, backgroundColor: "#eee", paddingLeft: 10, marginTop: 3 }}
                            placeholder={`search ${this.props?.medical?.name}`}
                            onChangeText={(text) => { this.searchPriscriptions(text) }}
                        />
                    </View>

                </View>
            </View>
        )
    }
    renderFilter = () => {

        return (

            <View style={{ alignItems: "center", justifyContent: "center", width: width * 0.32, }}>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <Text style={[styles.text, { color: "#fff" }]}>{this.state.today}</Text>
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
    getCloser = (value, checkOne, checkTwo) =>
        Math.abs(value - checkOne) < Math.abs(value - checkTwo) ? checkOne : checkTwo;
    render() {
        const { height, width } = Dimensions.get("window");
        const scrollYClamped = diffClamp(this.scrollY, 0, headerHeight);

        const translateY = scrollYClamped.interpolate({
            inputRange: [0, headerHeight],
            outputRange: [0, -(headerHeight / 2)],
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
                            contentContainerStyle={{ paddingTop: headerHeight - 20, paddingBottom: 90 }}
                            onScroll={handleScroll}
                            onMomentumScrollEnd={handleSnap}
                            onEndReached={() => { this.handleEndReached() }}
                            ListFooterComponent={this.renderFooter()}
                            onEndReachedThreshold={0.1}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity style={[styles.card, { flexDirection: "row", borderRadius: 5 ,marginTop:15}]}
                                        // onPress={() => { this.props.navigation.navigate('PrescriptionView', { item, }) }}
                                    >
                                        <View style={{ flex: 0.3, alignItems: 'center', justifyContent: "center" }}>
                                            <Image
                                                source={{ uri: `${url}${item.patientdetails.dp}`||"https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" }}
                                                style={{ height: 60, width: 60, borderRadius: 30 }}
                                            />
                                        </View>
                                        <View style={{ flex: 0.4, justifyContent: 'center', alignItems: 'center' }}>
                                            <View >
                                                <Text style={[styles.text,{ fontSize: 18, }]}>{item.patientdetails.name}</Text>
                                                <Text style={[styles.text,{ fontSize: 12, }]}>{item.patientdetails.clinicname}</Text>
                                            </View>

                                        </View>
                                        <View style={{ flex: 0.3, justifyContent: 'center', alignItems: "center" }}>
                                            <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center' }}>
                                                <Text>{moment(item.created).format("DD/MM/YYYY")}</Text>

                                            </View>
                                            <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center' }}>
                                                <Text>{moment(item.created).format("hh:mm a")}</Text>
                                            </View>

                                        </View>
                                    </TouchableOpacity>
                                )
                            }}
                        />
                        <View style={{
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
                        </View>
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
})
const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,
        user: state.selectedUser,
        medical:state.selectedMedical
    }
}
export default connect(mapStateToProps, { selectTheme, selectMedical})(PriscriptionIssue);
