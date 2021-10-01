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
import { Ionicons, Entypo, AntDesign,Fontisto } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { selectTheme } from '../../actions';
import settings from '../../AppSettings';
const { diffClamp } = Animated;
const initialLayout = { width: Dimensions.get('window').width };
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
const { height, width } = Dimensions.get("window");
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
import axios from 'axios';
import moment from 'moment';
import PendingAppoinments from './PendingAppoinments';
import InProgressAppoinment from './InProgressAppoinment';
import AllAppointments from './AllAppointments';
import DateTimePickerModal from "react-native-modal-datetime-picker";
const url = settings.url;
const Date1 = new Date()
const today = moment(Date1).format("YYYY-MM-DD")
class Appoinments extends Component {
    constructor(props) {
          const routes = [
            { key: 'Pending', title: 'Pending' },
            { key: 'InProgress', title: 'Progress' },
            { key: 'AllAppointments', title: 'All '}

        ];
        super(props);
        this.state = {
           index: 0,
           routes: routes,
           date: new Date(),
           mode: 'time',
           show: false,
           today
        };
    }

   componentDidMount(){
       
   }
    showDatePicker = () => {
        this.setState({ show: true })
    };

    hideDatePicker = () => {
        this.setState({ show: false})
    };

    hideDatePicker2 = () => {
        this.setState({ show2: false,modal: true})
    };
    handleConfirm = (date) => {
        this.setState({ today: moment(date).format('YYYY-MM-DD'), show: false, date: new Date(date),Appointments2:[],offset2:0,next2:true}, () => {
          

        })
        this.hideDatePicker();
    };

     renderScene = ({ route, }) => {
         switch (route.key) {
             case 'Pending':
                 return <PendingAppoinments navigation={this.props.navigation} />
             case 'InProgress':
                 return <InProgressAppoinment navigation={this.props.navigation} />
             case 'AllAppointments':
                 return <AllAppointments navigation={this.props.navigation}  date={this.state.date}/>
             default:
                 return null;
         }
     };
         renderFilter =()=>{
 
        if (this.state.index == 2){
                   return(
            <View style={{ flex: 0.4, alignItems: "center", justifyContent: "center" }}>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <Text style={[styles.text, { color: "#fff" }]}>{this.state.today}</Text>
                        </View>

                        <TouchableOpacity
                            style={{ marginLeft: 20 }}
                            onPress={() => { this.setState({ show: true}) }}
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
        return null
 
    }
    render() {
            const { index, routes } = this.state
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                 <StatusBar backgroundColor={themeColor} barStyle={"default"} />
                                     {/* HEADERS */}
                      {!this.state.search?<View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
                    
                            <View style={{ flex: 0.6,  }}>
                                <View>
                                    <Text style={[styles.text, { color: '#fff', marginLeft: 20, fontWeight: 'bold', fontSize: 25 }]}>Appointments</Text>

                                </View>
                            </View>
                            {
                                this.renderFilter()
                            }
                        </View>:
                            <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
                                <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                                    onPress={() => {
                                      this.setState({search:false})
                                    }}
                                >
                                    <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                                </TouchableOpacity>
                                <View style={{ flex: 0.7, alignItems: "center", justifyContent: "center" }}>
                                    <TextInput
                                        autoFocus={true}
                                        selectionColor={themeColor}
                                        style={{ height: "45%", backgroundColor: "#fafafa", borderRadius: 15, padding: 10, marginTop: 10, width: "100%" }}
                                        placeholder="search by reason or clinic name"
                                        onChangeText={(text) => { this.SearchOppoinments(text)}}
                                    />
                               </View>
                        </View>
                        }
                  <View style={{flex:1,}}>

                        <TabView
                        style={{ backgroundColor: "#ffffff", }}
                        navigationState={{ index, routes }}
                        renderScene={this.renderScene}
                        onIndexChange={(index) => { this.setState({ index }) }}
                        initialLayout={{ width }}
                        renderTabBar={(props) =>
                            <TabBar
                                {...props}
                                renderLabel={({ route, focused, color }) => (
                                    <Text style={{ color: focused ? themeColor : 'gray',  }}>
                                        {route.title}
                                    </Text>
                                )}
                                style={{ backgroundColor: "#fff", height: 50, fontWeight: "bold", color: "red" }}
                                labelStyle={{ fontWeight: "bold", color: "red" }}
                                indicatorStyle={{ backgroundColor: themeColor, height: 2}}
                            />
                        }

                />
                  </View>  
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
                            onPress={() => { this.props.navigation.navigate("CreateAppoinment",{diagnosisCenter:true})}}
                        >
                            <AntDesign name="pluscircle" size={40} color={themeColor} />
                        </TouchableOpacity>
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
    card: {
        backgroundColor: "#fff",
        elevation: 6,
        margin: 20,
        height: height * 0.3
    },
       topSafeArea: {
        flex: 0,
        backgroundColor: themeColor
    },
    bottomSafeArea: {
        flex: 1,
        backgroundColor: "#fff"
    },

})
const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,
        user:state.selectedUser,
        clinic: state.selectedClinic
    }
}
export default connect(mapStateToProps, { selectTheme })(Appoinments);