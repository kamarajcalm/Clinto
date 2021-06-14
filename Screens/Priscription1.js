import React from "react";
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
    RefreshControl

} from "react-native";
import { AntDesign } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import settings from '../AppSettings';
import { Fontisto } from '@expo/vector-icons';
import moment from 'moment';
import { connect } from 'react-redux';
import axios from 'axios';
import { selectTheme,selectClinic } from '../actions';
import authAxios from '../api/authAxios';
import HttpsClient from "../api/HttpsClient";
import Modal from 'react-native-modal';
import { Ionicons, Entypo, Feather, MaterialCommunityIcons, FontAwesome, FontAwesome5, EvilIcons} from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
const url =settings.url
const fontFamily = settings.fontFamily;
const themeColor =settings.themeColor

const { height,width } = Dimensions.get("window");
const screenHeight =Dimensions.get('screen').height;
const { diffClamp } = Animated;
const headerHeight = height * 0.2;
class Priscription extends React.Component {
    constructor(props) {
        const Date1 = new Date()
        const day = Date1.getDate()
        const month = Date1.getMonth() + 1
        const year = Date1.getFullYear()
        const today = `${year}-${month}-${day}`
    
        super(props);
        this.state = {
            showList: true,
            today,
            mode: 'date',
            date: new Date(),
            show: false,
            user:this.props.user,
            isDoctor:false,
            loading:true,
            showModal:false,
            selectedClinic:null,
            clinics:[],
            prescriptions:[],
            isReceptionist:false,
            isFetching:false,
            search:false,
            textRef1:React.createRef(),
            textRef2:React.createRef(),
            cancelToken: undefined,
            offset:0,
            next:true
         
        };
        this.scrollY=new Animated.Value(0)
        this.translateYNumber= React.createRef()
    } 
    handleEndReached =()=>{
        if(this.state.next){
            this.setState({offset:this.state.offset+5},()=>{
               if(this.state.isDoctor){
                   this.getPrescription()
               }else if(this.state.isReceptionist){
                   this.getClinicPrescription()
               }else{
                   this.getPateintPrescription()
               }
             
            })
        }
    }
showDatePicker = () => {
       this.setState({show:true})
    };

hideDatePicker = () => {
    this.setState({ show: false })
    };

 handleConfirm = (date) => {
     this.setState({})
     this.setState({ today: moment(date).format('YYYY-MM-DD'), show: false, prescriptions: [], offset: 0, next: true  }, () => {
         if(this.state.isDoctor){
             this.getPrescription()
         }else if(this.state.isReceptionist){
             this.getClinicPrescription()
         }else{
             return null
         }

     })
        this.hideDatePicker();
    };

    getPateintPrescription = async()=>{
        let api = `${url}/api/prescription/prescriptions/?forUser=${this.props.user.id}&limit=5&offset=${this.state.offset}`
        let data =await HttpsClient.get(api)
        console.log(api)
        if(data.type =="success"){
            this.setState({ prescriptions: this.state.prescriptions.concat(data.data.results),isFetching:false,})
            if(data.data.next!=null){
                this.setState({next:true})
            }else{
                this.setState({ next:false})
            }
        }
    }
    getPrescription = async()=>{
      
        let api = `${url}/api/prescription/prescriptions/?doctor=${this.props.user.id}&date=${this.state.today}&limit=5&offset=${this.state.offset}`
        console.log(api)
        let data  =await HttpsClient.get(api)
    
      if(data.type == 'success'){
          this.setState({ prescriptions:this.state.prescriptions.concat(data.data.results)})
          this.setState({ loading: false ,isFetching:false})
          if (data.data.next != null) {
              this.setState({ next: true })
          } else {
              this.setState({ next: false })
          }
      }
    }
    getClinicPrescription = async()=>{
        let api = `${url}/api/prescription/prescriptions/?clinic=${this.props.user.profile.recopinistclinics[0].clinicpk}&date=${this.state.today}&limit=5&offset=${this.state.offset}`
        let data = await HttpsClient.get(api)
  console.log(api)
        if (data.type == 'success') {
            this.setState({ prescriptions: this.state.prescriptions.concat(data.data.results)})
            this.setState({ loading: false ,isFetching:false})
            if (data.data.next != null) {
                this.setState({ next: true })
            } else {
                this.setState({ next: false })
            }
        }
     
    }
    getClinics = async()=>{
        const api = `${url}/api/prescription/getDoctorClinics/?doctor=${this.props.user.id}`
        const data = await HttpsClient.get(api)
        console.log(api)
       console.log(data)
        if(data.type=="success"){
      
            this.setState({ clinics: data.data.workingclinics})
            let activeClinic = data.data.workingclinics.filter((i)=>{
                return i.active
            })
         console.log(activeClinic[0])
            this.props.selectClinic(activeClinic[0]||data.data.workingclinics[0])
      
        }
    }
    setActiveClinic = async(item) => {
        const api = `${url}/api/prescription/doctorActive/`
        let sendData ={
            deactiveClinic:this.props.clinic.pk,
            activeClinic:item.pk
        }
        let patch = await HttpsClient.post(api,sendData)
        if(patch.type =="success"){
        
            this.props.selectClinic(item)
            this.setState({showModal:false})
        }
    
    }
    findUser =()=>{
        if (this.props.user.profile.occupation =="Doctor"){
           
              this.getClinics()
              this.getPrescription()
              this.setState({isDoctor:true,})
        } else if (this.props.user.profile.occupation == "ClinicRecoptionist"){
            this.getClinicPrescription()
            this.setState({ isReceptionist: true, })
        }
        else{
            this.getPateintPrescription()
        }

        this.setState({ loading: false })
    }
    componentDidMount(){
     
       this.findUser()
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            if(this.state.isDoctor){
                this.setState({prescriptions:[],offset:0,next:true})
                this.getPrescription()
            }
            
        });

    }
    searchPriscriptions = async (text) => {
     
        if (typeof this.state.cancelToken != typeof undefined) {
            this.state.cancelToken.cancel('cancelling the previous request')
        }
        this.state.cancelToken = axios.CancelToken.source()
        let api = `${url}/api/prescription/prescriptions/?forUser=${this.props.user.id}&usersearch=${text}`
        const data = await axios.get(api, { cancelToken: this.state.cancelToken.token });
        this.setState({next:false})
        this.setState({prescriptions:data.data})
    }
    searchPriscriptions2 = (text) => {
        let filter = this.state.prescriptions.filter((i) => {
            let match = i.username.toUpperCase()
            console.log(match,"gjhgjh")
            return match.includes(text.toUpperCase())
        })
        console.log(filter)
        this.setState({ prescriptions: filter })
    }

    getIndex = (index) => {
        let value = this.state.prescriptions.length - index
        return value
    }
    showDifferentPriscription = (item, index) => {

        if (this.state.isDoctor){

            return (
                <TouchableOpacity style={[styles.card, { flexDirection: "row", borderRadius: 5 }]}
                    // onPress={() => { props.navigation.navigate('showCard', { item }) }}
                    onPress={() => { this.props.navigation.navigate('PrescriptionView', { item, }) }}
                >
                    <View style={{ flex: 0.3, alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            style={{ height: "90%", width: "95%", resizeMode: "cover", borderRadius: 10 }}
                            source={{ uri: "https://www.studentdoctor.net/wp-content/uploads/2018/08/20180815_prescription-1024x1024.png" }}
                        />
                    </View>
                    <View style={{ flex: 0.7, marginHorizontal: 10, justifyContent: 'center' }}>
                        <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={[styles.text, { color: "#000", fontWeight: 'bold' }]}>Patient : {item?.username?.name}</Text>

                            </View>
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <Text>#{this.getIndex(index)}</Text>
                            </View>
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <View>
                                <Text style={[styles.text]}>Reason : {item.ongoing_treatment}</Text>
                            </View>
                        </View>
                        <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
                            <View>
                                <Text style={[styles.text]}>Clinic :{item.clinicname.name}</Text>
                            </View>
                            <View>
                                <Text style={[styles.text]}>{moment(item.created).format("h:mm a")}</Text>
                            </View>
                        </View>
                    </View>

                </TouchableOpacity>
            )
        }
        if (this.state.isReceptionist) {

            let dp = null
            if (item?.doctordetails?.dp) {
                dp = `${url}${item?.doctordetails?.dp}`
            }

            return (
                <TouchableOpacity style={[styles.card, { flexDirection: "row", borderRadius: 5 }]}
                    onPress={() => { this.props.navigation.navigate('PrescriptionView', { item, }) }}
                >
                    <View style={{ flex: 0.3, alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            style={{ height: "90%", width: "95%", resizeMode: "cover", borderRadius: 10 }}
                            source={{ uri: "https://www.studentdoctor.net/wp-content/uploads/2018/08/20180815_prescription-1024x1024.png" }}
                        />
                    </View>
                    <View style={{ flex: 0.7, marginHorizontal: 10, justifyContent: 'center' }}>
                        <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={[styles.text, { color: "#000", fontWeight: 'bold' }]}>Patient : {item?.username.name}</Text>

                            </View>
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <Text>#{this.getIndex(index)}</Text>
                            </View>
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <View>
                                <Text style={[styles.text]}>Reason : {item.ongoing_treatment}</Text>
                            </View>
                        </View>
                        <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
                            <View>
                                <Text style={[styles.text]}>Clinic :{item.clinicname.name}</Text>
                            </View>
                            <View>
                                <Text style={[styles.text]}>{moment(item.created).format("h:mm a")}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }

        // if patient
        return (
            <TouchableOpacity style={[styles.card, { flexDirection: "row", borderRadius: 5 }]}
                onPress={() => { this.props.navigation.navigate('PrescriptionView', { item, }) }}
            >
                <View style={{ flex: 0.3, alignItems: 'center', justifyContent: 'center' }}>
                    <Image

                        style={{ height: "90%", width: "95%", resizeMode: "contain", borderRadius: 10 }}
                        source={{ uri: `https://www.studentdoctor.net/wp-content/uploads/2018/08/20180815_prescription-1024x1024.png` }}
                    />
                </View>
                <View style={{ flex: 0.7, marginHorizontal: 10, justifyContent: 'center' }}>
                    <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={[styles.text, { color: "#000", fontWeight: 'bold' }]}>Patient : {item?.username.name}</Text>

                        </View>
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <Text>#{this.getIndex(index)}</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <View>
                            <Text style={[styles.text]}>Reason : {item.ongoing_treatment}</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
                        <View>
                            <Text style={[styles.text]}>Clinic :{item.clinicname.name}</Text>
                        </View>
                        <View>
                            <View style={{ alignSelf: "flex-end" }}>
                                <Text style={[styles.text]}>{moment(item.created).format("h:mm a")}</Text>

                            </View>
                            <View>
                                <Text style={[styles.text]}>{moment(item.created).format('DD/MM/YYYY')}</Text>
                            </View>
                        </View>

                    </View>
                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                        <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center', marginLeft: 10 }]}
                            onPress={() => { chatClinic(item) }}
                        >
                            <Ionicons name="chatbox" size={24} color="#63BCD2" />

                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center', marginLeft: 10 }]}
                            onPress={() => {
                                Linking.openURL(
                                    `https://www.google.com/maps/dir/?api=1&destination=` +
                                    item.clinicname.lat +
                                    `,` +
                                    item.clinicname.long +
                                    `&travelmode=driving`
                                );
                            }}
                        >
                            <FontAwesome5 name="directions" size={20} color="#63BCD2" />
                        </TouchableOpacity>
                    </View>

                </View>
            </TouchableOpacity>
        )
    }
    onRefresh =()=>{
        this.setState({isFetching:true})
        if(this.state.isDoctor){
            this.setState({ prescriptions: [], offset: 0, next: true }, () => {
                this.getPrescription()
            })
         
        }else if(this.state.isReceptionist){
            this.setState({ prescriptions: [], offset: 0, next: true }, () => {
                this.getClinicPrescription()
            })
          
        }else{
            this.setState({prescriptions:[],offset:0,next:true},()=>{
                this.getPateintPrescription()
            })
         
        }
    }
    renderFilter = () => {
        if (this.state.isDoctor || this.state.isReceptionist) {
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
        } else {
            return null
        }
    }

  validateHeaders = () => {
        console.log(this.props?.clinic?.name)
        if (this.state.isDoctor||this.state.isReceptionist) {
            return (
                <View>
                    <View style={{ height: headerHeight / 2, flexDirection: "row", flex: 1 }}>
                        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", width: width * 0.68, justifyContent: "space-around" }}
                            onPress={() => { this.setState({showModal:true}) }}
                        >
                            <View>
                                {this.state.isDoctor ? <Text style={[styles.text, { fontSize: 25, color: "#fff", fontWeight: "bold", marginLeft: 5 }]} numberOfLines={1}>{this.props?.clinic?.name}</Text> :
                                    <Text style={[styles.text, { fontSize: 25, color: "#fff", fontWeight: "bold", marginLeft: 5 }]} numberOfLines={1}>{this.props?.user?.profile?.recopinistclinics[0]?.clinicname}</Text>
                                }

                            </View>

                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                {this.state.isDoctor && <Entypo name="chevron-small-down" size={30} color="#fff" />}
                            </View>


                        </TouchableOpacity>
                        {
                            this.renderFilter()
                        }
                    </View>

                    <View style={{ marginHorizontal: 20, height: headerHeight / 3, alignItems: 'center', justifyContent: "center", marginBottom: 5 }}>
                        <TouchableOpacity style={{ flexDirection: 'row', borderRadius: 10, backgroundColor: "#eee", width: "100%", height: height * 0.05, }}
                            onPress={() => { this.props.navigation.navigate('SearchPatient') }}
                        >
                            <View style={{ alignItems: 'center', justifyContent: "center", marginLeft: 5, flex: 0.1 }}>
                                <EvilIcons name="search" size={24} color="black" />
                            </View>
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <Text style={[styles.text]}>Search Patient</Text>
                            </View>

                        </TouchableOpacity>

                    </View>
                </View>

            )

        }
        return (
            <View>
                <View style={{ height: headerHeight / 2, justifyContent: "center" }}>
                    <Text style={{ color: '#fff', fontFamily: "openSans", marginLeft: 20, fontSize: 30, fontWeight: "bold" }}>Prescription</Text>
                </View>

                <View style={{ marginHorizontal: 20, height: headerHeight / 3, alignItems: 'center', justifyContent: "center", marginBottom: 5 }}>
                    <View style={{ flexDirection: 'row', borderRadius: 10, backgroundColor: "#eee", width: "100%", height: height * 0.05, }}>
                        <View style={{ alignItems: 'center', justifyContent: "center", marginLeft: 5, flex: 0.1 }}>
                            <EvilIcons name="search" size={24} color="black" />
                        </View>
                        <TextInput

                            selectionColor={themeColor}
                            style={{ height: "90%", flex: 0.8, backgroundColor: "#eee", paddingLeft: 10, marginTop: 3 }}
                            placeholder="search"
                            onChangeText={(text) => { this.searchPriscriptions(text) }}
                        />
                    </View>

                </View>
            </View>
        )
    }
    renderFooter =()=>{
       if(this.state.next){
           return(
               <ActivityIndicator size="large" color ={themeColor} />
           )
       }
       return null
    }
  

    
    getCloser = (value, checkOne, checkTwo) =>
        Math.abs(value - checkOne) < Math.abs(value - checkTwo) ? checkOne : checkTwo;
    render() { 
       
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
                <StatusBar backgroundColor={themeColor} barStyle={"default"}/>
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
                            data={this.state.prescriptions}
                            scrollEventThrottle={16}
                            contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: 90 }}
                            onScroll={handleScroll}
                            ref={ref=>this.ref=ref}
                            onMomentumScrollEnd={handleSnap}
                            onEndReached ={()=>{this.handleEndReached()}}
                            ListFooterComponent={this.renderFooter()}
                            onEndReachedThreshold={0.1}
                            renderItem={({item,index})=>{
                               return(
                                   <View>
                                       {
                                           this.showDifferentPriscription(item,index)
                                       }
                              
                                   </View>
                                  
                               )
                          }}
                        />
                          
            

                  { this.state.isDoctor&&<View style={{
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
                                onPress={() => { this.props.navigation.navigate('addPriscription') }}
                            >
                                <AntDesign name="pluscircle" size={40} color={themeColor} />
                            </TouchableOpacity>
                        </View>}
            </Animated.View>
                    <Modal
                        deviceHeight={screenHeight}
                        animationIn="slideInUp"
                        animationOut="slideOutDown"
                        isVisible={this.state.showModal}
                        onBackdropPress={() => { this.setState({showModal : false })}}
                    >
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            
                            <View style={{ height: height * 0.3, width: width * 0.9, backgroundColor: "#fff", borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
                                <View style={{ alignItems: "center", justifyContent: "center",marginTop:10 }}>
                                    <Text style={[styles.text, { color: "#000", fontWeight: "bold" ,fontSize:16}]}>Select Clinic</Text>
                                </View>
                                <FlatList
                                    data={this.state.clinics}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <TouchableOpacity style={{ flexDirection: "row", marginTop: 20, alignItems: 'center', justifyContent: "space-around", width }}
                                                onPress={() => { this.setActiveClinic(item) }}
                                            >
                                                <Text style={[styles.text]}>{item.name}</Text>
                                                <View >
                                                    <FontAwesome name="dot-circle-o" size={24} color={this.props.clinic == item ? themeColor : "gray"} />

                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }}
                                />

                            </View>
                        </View>
                    </Modal>
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
        height: headerHeight / 2,
        width: '100%',
        paddingHorizontal: 10,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    text: {
        fontFamily
    },
    root: {
        flex: 1,
        marginHorizontal: 20
    },
    container: {
        flex: 1
    },
    content: {
        height: height * 2
    },
    card: {
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
        height: height * 0.2,
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
        clinic:state.selectedClinic

    }
}
export default connect(mapStateToProps, { selectTheme, selectClinic })(Priscription)