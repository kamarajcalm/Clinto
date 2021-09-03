import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, TouchableOpacity, StyleSheet, FlatList, Image, SafeAreaView, TextInput, ActivityIndicator,Alert} from 'react-native';
import settings from '../AppSettings';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
const { height, width } = Dimensions.get("window");
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons,AntDesign } from '@expo/vector-icons';
import authAxios from '../api/authAxios';
import HttpsClient from '../api/HttpsClient';
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const url = settings.url
import Modal from 'react-native-modal';
import SimpleToast from 'react-native-simple-toast';
import { LinearGradient } from 'expo-linear-gradient';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
const screenHeight = Dimensions.get("screen").height
class DiagnosisCenter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories:[]
        };
    }
getCategories = async()=>{
   let api =`${url}/api/prescription/reportcategory/`
   const data =await  HttpsClient.get(api)
   console.log(api)
   if(data.type=="success"){
     this.setState({categories:data.data})
   }
}
delete = async(item,index)=>{
     let api =`${url}/api/prescription/reportcategory/${item.id}/`
     let del= await HttpsClient.delete(api)
     if(del.type=="success"){
         let duplicate = this.state.categories
         duplicate.splice(index,1)
         this.setState({categories:duplicate})
         return this.showSimpleMessage("Deleted SuccessFully","green","success")
     }else{
                 return this.showSimpleMessage("Try Again","red","danger")
     }
}
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
    componentDidMount() {
      
      this.getCategories()
          this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.getCategories();
          
        });
    }
    componentWillUnmount() {
 
    }
      createAlert = (item, index) => {
    Alert.alert(
      "Do you want to Delete?",
      `${item.title}`,
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
  verify = async(item,index)=>{
           let api =`${url}/api/prescription/reportcategory/${item.id}/` 
           let sendData ={
             is_verified:!item.is_verified
           }
           let patch =  await HttpsClient.patch(api,sendData)
           if(patch.type=="success"){
             let duplicate = this.state.categories
             duplicate[index].is_verified= !duplicate[index].is_verified
             this.setState({categories:duplicate})
             this.showSimpleMessage("Updated Successfully","green","success")
           }else{
                  this.showSimpleMessage("Try Again","red","danger")
           }
  }
  header =()=>{
    return(
      <View style={{flexDirection:"row",marginTop:10}}>
            <View style={{flex:0.1,alignItems:"center",justifyContent:"center"}}>
                <Text style={[styles.text,{color:'#000',fontSize:height*0.02}]}>#</Text>
            </View>
            <View style={{flex:0.5,alignItems:"center",justifyContent:"center"}}>
                   <Text style={[styles.text,{color:'#000',fontSize:height*0.02}]}>Name</Text>
            </View>
            <View style={{flex:0.3,alignItems:"center",justifyContent:"center"}}>
              <Text style={[styles.text,{color:'#000',fontSize:height*0.02}]}>Is Verified</Text>
            </View>
            <View style={{flex:0.1,alignItems:"center",justifyContent:"center"}}>

            </View>
      </View>
    )
  }
  createAlert2 =(item,index)=>{
          Alert.alert(
      `Do you want to ${item.is_verified?"Unverify":"verify"}`,
      `${item.title}`,
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: () => { this.verify(item, index) } }
      ]
    );
  }
    render() {
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                     <View style={{ height: height * 0.1, backgroundColor: themeColor, flexDirection: 'row', alignItems: "center" }}>
                            <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                                onPress={() => { this.props.navigation.goBack() }}
                            >
                                <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                            </TouchableOpacity>
                            <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
                                <Text style={[styles.text, { color: '#fff',  fontSize: height*0.02}]}>Diagnosis Categories</Text>
                            </View>
                            <TouchableOpacity style={{ flex: 0.2 }}

                            >

                            </TouchableOpacity>
                        </View>
                        <FlatList 
                           ListHeaderComponent={this.header()}
                          data={this.state.categories}
                          keyExtractor={(item,index)=>index.toString()}
                          renderItem={({item,index})=>{
                              return(
                                <View style={{flexDirection:"row",marginTop:10}}>
                                  <View style={{flex:0.1,alignItems:"center",justifyContent:"center"}}>
                                      <Text style={[styles.text,{color:'#000',fontSize:height*0.02}]}>{index+1}</Text>
                                  </View>
                                  <View style={{flex:0.5,alignItems:"center",justifyContent:"center"}}>
                                        <Text style={[styles.text,{color:'#000',fontSize:height*0.02}]}>{item.title}</Text>
                                  </View>
                                  <TouchableOpacity style={{flex:0.3,alignItems:"center",justifyContent:"center"}}
                                   onPress={()=>{this.createAlert2(item,index)}}
                                  >
                                    <Text style={[styles.text,{color:item.is_verified?"green":"red",fontSize:height*0.02,textDecorationLine:"underline"}]}>{item.is_verified.toString()}</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity style={{flex:0.1,alignItems:"center",justifyContent:"center"}}
                                   onPress={()=>{this.createAlert(item,index)}}
                                  >
                                      <AntDesign name="delete" size={24} color="red" />
                                  </TouchableOpacity>
                            </View>
                              )
                          }}
                        />
                </SafeAreaView>

                  { <View style={{
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
                                onPress={() => { this.props.navigation.navigate('AddDiagnosisCategories') }}
                            >
                                <AntDesign name="pluscircle" size={40} color={themeColor} />
                            </TouchableOpacity>
                        </View>}
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
})
const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,
        user:state.selectedUser
    }
}
export default connect(mapStateToProps, { selectTheme })(DiagnosisCenter);