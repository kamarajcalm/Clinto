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
import { Ionicons, Entypo, Feather, MaterialCommunityIcons, FontAwesome, FontAwesome5, EvilIcons,Fontisto,AntDesign,MaterialIcons} from '@expo/vector-icons';

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
const reports  = [
  {
    name:"kamaraj",
    date:"22/10/1998",
    prescriptionId:'2'
  },
    {
    name:"kamaraj",
    date:"22/10/1998",
    prescriptionId:'2'
  },
      {
    name:"kamaraj",
    date:"22/10/1998",
    prescriptionId:'2'
  }
]
class ViewFeautures extends Component {
    constructor(props) {
        super(props);
        this.state = {
          reports
        };
    }

   componentDidMount(){
  
   }

header =()=>{
  return(
    <View style={{flexDirection:"row",marginTop:10}}>
          <View style={{flex:0.1,alignItems:"center",justifyContent:"center"}}>
               <Text style={[styles.text,{color:"#000",fontSize:height*0.022}]}>#</Text>
          </View>
          <View style={{flex:0.3,alignItems:"center",justifyContent:"center"}}>
                 <Text style={[styles.text,{color:"#000",fontSize:height*0.022}]}>Name</Text>
          </View>
          <View style={{flex:0.3,alignItems:"center",justifyContent:"center"}}>
                  <Text style={[styles.text,{color:"#000",fontSize:height*0.022}]}>Prescription</Text>
          </View>
          <View style={{flex:0.3,alignItems:"center",justifyContent:"center"}}>
              <Text style={[styles.text,{color:"#000",fontSize:height*0.022}]}>Date</Text>
          </View>
    </View>
  )
}
    render() {
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                    <StatusBar backgroundColor={themeColor} barStyle={"default"} />

                    <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
                        <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                            onPress={() => { this.props.navigation.goBack() }}
                        >
                            <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                        </TouchableOpacity>
                        <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
                            <Text style={[styles.text,{color:"#fff",fontSize:18}]}>Reports</Text>
                        </View>
                        <View style={{flex:0.2}}>
                             
                        </View>
                    </View>
                     <FlatList 
                       ListHeaderComponent={this.header()}
                       data={this.state.reports}
                       keyExtractor={(item,index)=>index.toString()}
                       renderItem={({item,index})=>{
                          return(
                             <View style={{flexDirection:"row",marginTop:10}}>
                                  <View style={{flex:0.1,alignItems:"center",justifyContent:"center"}}>
                                      <Text style={[styles.text,{color:"#000"}]}>{index+1}</Text>
                                  </View>
                                  <View style={{flex:0.3,alignItems:"center",justifyContent:"center"}}>
                                        <Text style={[styles.text,{color:"#000"}]}>{item.name}</Text>
                                  </View>
                                  <View style={{flex:0.3,alignItems:"center",justifyContent:"center"}}>
                                          <Text style={[styles.text,{color:"#000"}]}>{item.prescriptionId}</Text>
                                  </View>
                                  <View style={{flex:0.3,alignItems:"center",justifyContent:"center"}}>
                                      <Text style={[styles.text,{color:"#000"}]}>{item.date}</Text>
                                  </View>
                            </View>
                          )
                       }}
                     />
                     
                   
                </SafeAreaView>
                    <View style={{
                            position: "absolute",
                            bottom: 100,
                            left: 20,
                            right: 20,
                            flexDirection:"row",
                            alignItems: "center",
                            justifyContent: "space-around",
                            borderRadius: 20
                        }}>
                  
                            <TouchableOpacity
                                onPress={() => { this.props.navigation.navigate('CreateReport')}}
                            >
                          <MaterialIcons name="playlist-add" size={40} color={themeColor} />
                            </TouchableOpacity>
                        </View>
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
    }

})
const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,
        user:state.selectedUser,
        clinic: state.selectedClinic
    }
}
export default connect(mapStateToProps, { selectTheme })(ViewFeautures);