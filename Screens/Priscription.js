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
    Image
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import settings from '../AppSettings';
import { Fontisto } from '@expo/vector-icons';
import moment from 'moment';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import authAxios from '../api/authAxios';
const fontFamily = settings.fontFamily;
const themeColor =settings.themeColor
const cardHeight = 250;
const MARGIN = 20
const CARD_HEIGHT =cardHeight+MARGIN*2
const cardTitle = 75;
const cardPadding = 20;

const { height } = Dimensions.get("window");
const cards = [
    {
        name: "Sri clinic",
        color: themeColor,
        doctor:"kamaraj",
        No:"7010117137"
    },
    {
        name: "Ram clinic",
        color: "#eba65c",
        doctor: "kamaraj",
        No: "7010117137"
    },
    {
        name: "take care hospital",
        color: "#ffff",
        doctor: "kamaraj",
        No: "7010117137"
    },
    {
        name: "Make well",
        color: "#eba",
        doctor: "kamaraj",
        No: "7010117137"
    },
    {
        name: "Sri clinic",
        color: themeColor,
        doctor: "kamaraj",
        No: "7010117137"
    },
    {
        name: "Ram clinic",
        color: "#eba65c",
        doctor: "kamaraj",
        No: "7010117137"
    },
    {
        name: "take care hospital",
        color: "#ffff",
        doctor: "kamaraj",
        No: "7010117137"
    },
    {
        name: "Make well",
        color: "#eba",
        doctor: "kamaraj",
        No: "7010117137"
    },
    {
        name: "Sri clinic",
        color: themeColor,
        doctor: "kamaraj",
        No: "7010117137"
    },
    {
        name: "Ram clinic",
        color: "#eba65c",
        doctor: "kamaraj",
        No: "7010117137"
    },
    {
        name: "take care hospital",
        color: "#ffff",
        doctor: "kamaraj",
        No: "7010117137"
    },
    {
        name: "Make well",
        color: "#eba",
        doctor: "kamaraj",
        No: "7010117137"
    },
    {
        name: "Sri clinic",
        color: themeColor,
        doctor: "kamaraj",
        No: "7010117137"
    },
    {
        name: "Ram clinic",
        color: "#eba65c",
        doctor: "kamaraj",
        No: "7010117137"
    },
    {
        name: "take care hospital",
        color: "#ffff",
        doctor: "kamaraj",
        No: "7010117137"
    },
    {
        name: "Make well",
        color: "#eba",
        doctor: "kamaraj",
        No: "7010117137"
    },
 
];

class Priscription extends React.Component {
    constructor(props) {
        const Date1 = new Date()
        const day = Date1.getDate()
        const month = Date1.getMonth() + 1
        const year = Date1.getFullYear()
        const today = `${year}-${month}-${day}`
     
        super(props);
        this.state = {
            fadeAnim: new Animated.Value(0),
            y: new Animated.Value(0),
            showList: true,
            today,
            mode: 'date',
            date: new Date(),
            show: false,
        };
    }
    onChange = (selectedDate) => {
        if (selectedDate.type == "set") {
            this.setState({ today: moment(new Date(selectedDate.nativeEvent.timestamp)).format('YYYY-MM-DD'), show: false, date: new Date(selectedDate.nativeEvent.timestamp) }, () => {
                console.log(this.state.today,  "jjjj")
                
            })

        } else {
            return null
        }

    }
    componentDidMount(){
         
    }
    render() {
        const y= new Animated.Value(0);
        const onScroll = Animated.event([{nativeEvent:{contentOffset:{y}}}],{
            useNativeDriver:true
        })
        return (
           
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                <StatusBar backgroundColor={themeColor} barStyle={'dark-content'} translucent={false} />
          
            <View style={{flex:1,backgroundColor:"#f3f3f3f3"}}>
           
                  {/* HEADERS */}
                        <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20,  flexDirection: "row"}}>
                      <View style={{flex: 0.5,alignItems:'center',justifyContent:"center"}}>
                          <Text style={{color:'#fff',fontFamily:"openSans",marginLeft:20}}>Welcome kamaraj,</Text>  
                      </View>
                      <View style={{flex:0.5,alignItems:"center",justifyContent:'center'}}>
                                <Text style={{ color: '#fff', fontFamily: "openSans", marginLeft: 20 }}>Take Care Clinc</Text>
                      </View>
                </View>
                <View style={{height: height * 0.07,alignItems:"center",justifyContent:"space-around",flexDirection:"row"}}>
                    <View style={{flexDirection:"row"}}>
                                <Text style={[styles.text, { color: "#000" }]}>{this.state.today}</Text>
                                <TouchableOpacity
                                    style={{ marginLeft: 20 }}
                                    onPress={() => { this.setState({ show: true }) }}
                                >
                                    <Fontisto name="date" size={24} color={themeColor} />
                                </TouchableOpacity>
                                {this.state.show && (
                                    <DateTimePicker
                                        testID="dateTimePicker1"
                                        value={this.state.date}
                                        mode={this.state.mode}
                                        is24Hour={true}
                                        display="default"
                                        onChange={(time) => { this.onChange(time) }}
                                    />
                                )}
                    </View>
                    <View>
                        <Text style={[styles.text,]}> Total:{cards.length}</Text>
                    </View>
                </View>
                        <FlatList
                          style={{marginBottom:90}} 
                          data={cards}
                          keyExtractor={(item,index)=>index.toString()}
                          renderItem={({item,index})=>{
                               return(
                                   <TouchableOpacity style={[styles.card,{flexDirection:"row",borderRadius:5}]}
                                     onPress={()=>{this.props.navigation.navigate('showCard',{item})}}
                                   >
                                        <View style={{flex:0.3,alignItems:'center',justifyContent:"center"}}>
                                            <Image 
                                               source={{ uri:"https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"}}
                                               style={{height:60,width:60,borderRadius:30}}
                                            />
                                        </View>
                                        <View style={{flex:0.4,justifyContent:'center',alignItems:'center'}}>
                                               <View >
                                                   <Text style={[styles.text,{fontSize:18,}]}>{item.doctor}</Text>
                                               </View>
                                               
                                        </View>
                                       <View style={{ flex: 0.3, justifyContent: 'center' ,alignItems:"center"}}>
                                          <View style={{flex:0.5,alignItems:'center',justifyContent:'center'}}>
                                              <Text>14/06/2021</Text>
                                               
                                          </View>
                                          <View style={{flex:0.5,alignItems:'center',justifyContent:'center'}}>
                                               <Text>11:00 am</Text>
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
                                onPress={() => { this.props.navigation.navigate('addPriscription') }}
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
    text:{
       fontFamily
    },
    root: {
         flex:1,
         marginHorizontal:20
    },
    container: {
        flex: 1
    },
    content: {
        height: height * 2
    },
    card: {
        
        backgroundColor:"#eeee",
        height:height*0.1,
        marginHorizontal:10,
        marginVertical:3
       
    },
    topSafeArea: {
        flex: 0,
        backgroundColor: themeColor
    },
    bottomSafeArea: {
        flex: 1,
        backgroundColor: "#fff"
    },
});
const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,

    }
}
export default connect(mapStateToProps, { selectTheme })(Priscription)