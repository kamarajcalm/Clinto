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
import { Ionicons, Entypo, Feather, MaterialCommunityIcons, FontAwesome, FontAwesome5, EvilIcons,Fontisto,AntDesign,MaterialIcons} from '@expo/vector-icons';
import Modal from "react-native-modal";
import { connect } from 'react-redux';
import { selectTheme } from '../../actions';
import settings from '../../AppSettings';
const { diffClamp } = Animated;
const { height, width } = Dimensions.get("window");
const screenHeight = Dimensions.get("screen").height
const fontFamily = settings.fontFamily;
const inputColor =settings.TextInput
const themeColor = settings.themeColor;
import axios from 'axios';
import moment from 'moment';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import HttpsClient from '../../api/HttpsClient';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
const url = settings.url;

class ViewFeautures extends Component {
    constructor(props) {
        super(props);
        this.state = {
          reports:[],
          editModal:false,
          keyBoardHeight:0,
          selectedItem:null,
          selectedIndex:null,
          price:"",
          refreshing:false
        };
    }
getReports = async()=>{
    this.setState({refreshing:true})
   let api =`${url}/api/prescription/labreports/?clinic=${this.props.clinic.clinicpk}`
   const data = await HttpsClient.get(api)
   if(data.type=="success"){
       this.setState({reports:data.data,refreshing:false})
   }else{
         this.setState({refreshing:false})  
   }
}
   componentDidMount(){
                  Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
     this.getReports()
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
   this.getReports()
        });
   }
         _keyboardDidShow = (e) => {
            console.log()
        this.setState({keyBoardHeight:e.endCoordinates.height})
    };

    _keyboardDidHide = () => {
        this.setState({ keyBoardHeight: 0 })
    };
   componentWillUnmount(){
       this._unsubscribe();
        Keyboard.removeListener('keyboardDidShow', this._keyboardDidShow);
        Keyboard.removeListener('keyboardDidHide', this._keyboardDidHide);
   }

header =()=>{
  return(
    <View style={{flexDirection:"row",marginTop:10}}>
          <View style={{flex:0.1,alignItems:"center",justifyContent:"center"}}>
               <Text style={[styles.text,{color:"#000",fontSize:height*0.022}]}>#</Text>
          </View>
          <View style={{flex:0.5,alignItems:"center",justifyContent:"center"}}>
                 <Text style={[styles.text,{color:"#000",fontSize:height*0.022}]}>Name</Text>
          </View>
          <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                  <Text style={[styles.text,{color:"#000",fontSize:height*0.022}]}>Price</Text>
          </View>
            <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                                        
                                  </View>
    </View>
  )
}
       showSimpleMessage(content,color, type = "info", props = {}) {
        const message = {
            message: content,
            backgroundColor:color,
            icon: { icon: "auto", position: "left" },
            type,
            ...props,
        };

        showMessage(message);
    }
edit = async()=>{
   this.setState({loading:true})
   if(this.state.price==""){
          this.setState({loading:false})
      return this.showSimpleMessage("Please Enter Price","orange","info")
   }
   let api =`${url}/api/prescription/labreports/${this.state.selectedItem.id}/`
   let sendData ={
       price:this.state.price
   }
   let patch = await HttpsClient.patch(api,sendData)
   if(patch.type=="success"){
          this.setState({loading:false,editModal:false})
          this.getReports()
          return this.showSimpleMessage("Price updated Successfully","green","success")
   }else{
             return this.showSimpleMessage("Try again","red","danger")  
   }
}
delete = async(item,index)=>{
  let api =`${url}/api/prescription/labreports/${item.id}/`
  let del = await HttpsClient.delete(api)
  if(del.type=="success"){
        let duplicate =this.state.reports
        duplicate.splice(index,1)
        this.setState({reports:duplicate})
          return this.showSimpleMessage("Deleted Successfully","green","success")
  }else{
             return this.showSimpleMessage("Try again","red","danger")  
  }
}
      createAlert = (item, index) => {
    Alert.alert(
      `Do you want to Delete ?`,
      `${item.other_title}`,
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: () => { this.delete(item, index) } }
      ]
    );

  }
editModal =()=>{
    return(
          <Modal
              onBackdropPress={()=>{this.setState({editModal:false})}}
              onBackButtonPress={()=>{this.setState({editModal:false})}}
              statusBarTranslucent={true}
              isVisible={this.state.editModal}
              deviceHeight={screenHeight}
              style={{marginBottom:this.state.keyBoardHeight}}
            >
              <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                 <View style={{height:height*0.4,backgroundColor:"#fff",borderRadius:5,width:width*0.9}}>
                      <View style={{alignItems:"center",justifyContent:"center",marginVertical:20}}>
                          <Text style={[styles.text,{color:"#000",fontSize:height*0.024}]}>Edit Report:</Text>
                      </View>
                     <View style={{marginLeft:20}}>
                         <View>
                                <Text style={[styles.text,{color:'#000',fontSize:height*0.02}]}>Price :</Text>
                         </View>
                            <TextInput
                              keyboardType={"numeric"}
                              value ={this.state.price}
                              selectionColor={themeColor}
                               onChangeText={(price) => { this.setState({ price }) }}
                            style={{ width: width * 0.7, height: 35, backgroundColor: inputColor, borderRadius: 5, padding: 10, marginTop: 10 }}
                    />
                     </View>
                        
                     <View style={{alignItems:"center",justifyContent:"center",marginTop:20}}>
                         {!this.state.loading? <TouchableOpacity style={{height:height*0.04,width:width*0.3,alignItems:"center",justifyContent:"center",backgroundColor:themeColor}}
                           onPress={()=>{this.edit()}}
                          >
                                <Text style={[styles.text,{color:"#fff"}]}>Edit</Text>
                          </TouchableOpacity>:
                          <View style={{height:height*0.04,width:width*0.3,alignItems:"center",justifyContent:"center",backgroundColor:themeColor}}>
                             <ActivityIndicator size={"large"} color={"#fff"}/>
                          </View>
                          }
                     </View>
                 </View>
              </View>
            </Modal>
    )
}
    render() {
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                    <StatusBar backgroundColor={themeColor} barStyle={"default"} />
                    <View style={{flex:1,backgroundColor:"#fff"}}>

            
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
                        
                        refreshing={this.state.refreshing} 
                        onRefresh={()=>{this.getReports()}}
                       ListHeaderComponent={this.header()}
                       data={this.state.reports}
                       keyExtractor={(item,index)=>index.toString()}
                       renderItem={({item,index})=>{
                          return(
                             <View style={{flexDirection:"row",marginTop:10}}>
                                  <View style={{flex:0.1,alignItems:"center",justifyContent:"center"}}>
                                      <Text style={[styles.text,{color:"#000"}]}>{index+1}</Text>
                                  </View>
                                  <View style={{flex:0.5,alignItems:"center",justifyContent:"center"}}>
                                        <Text style={[styles.text,{color:"#000"}]}>{item.other_title}</Text>
                                  </View>
                                  <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                                          <Text style={[styles.text,{color:"#000"}]}>{item.price}</Text>
                                  </View>
                                     <View style={{flex:0.2,alignItems:"center",justifyContent:"space-around",flexDirection:"row"}}>
                                         <TouchableOpacity
                                          onPress={()=>{this.setState({editModal:true,selectedItem:item,selectedIndex:index,price:item.price.toString()})}}
                                         >
                                                         <Entypo name="edit" size={24} color={themeColor}/>
                                         </TouchableOpacity>
                                        <TouchableOpacity 
                                         onPress={()=>{this.createAlert(item,index)}}
                                        >
                                                       <AntDesign name="delete" size={24} color="red" />
                                        </TouchableOpacity>
                                
                                  </View>
                            </View>
                          )
                       }}
                     />
                     {
                         this.editModal()
                     }
                           </View>
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
export default connect(mapStateToProps, { selectTheme })(ViewFeautures);