import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, TouchableOpacity, StyleSheet, FlatList, Image, SafeAreaView } from 'react-native';
import settings from '../AppSettings';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
const { height, width } = Dimensions.get("window");
import { Ionicons } from '@expo/vector-icons';
import HttpsClient from '../api/HttpsClient';
import { TextInput } from 'react-native-gesture-handler';
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const url= settings.url;
class DoctorsAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doctors :[],
      search:false,
    };
  }
  getDoctors = async()=>{
    let api = `${url}/api/profile/userss/?position=Doctor`
     const data = await HttpsClient.get(api)
    console.log(api)
     if(data.type=="success"){
       this.setState({ doctors:data.data})
     }else{
       return null
     }
  }
  componentDidMount() {
    this.getDoctors()
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
    
      this.getDoctors()
    });
  }
  componentWillUnmount() {
    this._unsubscribe();
  }
  searchDoctor =async(query)=>{
    let api  = `${url}/api/profile/userss/?search=${query}&role=Doctor`
    let data = await HttpsClient.get(api)
    if (data.type == "success") {
      this.setState({ doctors: data.data })
    } else {
      return null
    }
  }
  render() {
    return (
      <>
        <SafeAreaView style={styles.topSafeArea} />
        <SafeAreaView style={styles.bottomSafeArea}>
          <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar backgroundColor={themeColor} />
            {/* HEADERS */}
         {!this.state.search ?  <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
            
                <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                  onPress={() => { this.setState({ search: true })}}
                >
                  <Ionicons name="ios-search" size={20} color="#fff" />
                </TouchableOpacity>
                <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
                  <Text style={[styles.text, { color: '#fff', fontWeight: 'bold', fontSize: 18 }]}>Doctors</Text>
                </View>
                <TouchableOpacity style={{ flex: 0.2 }}
                  onPress={() => { this.props.navigation.navigate('CreateDoctors') }}
                >
                  <Ionicons name="add-circle" size={24} color="#fff" />
                </TouchableOpacity>
  
                
              
            </View> : <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
                 <TouchableOpacity style={{flex:0.2,alignItems:"center",justifyContent:"center"}} 
                   onPress={()=>{this.setState({search:false})}}
                 >
                  <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                 </TouchableOpacity>
                  <View style={{flex:0.8}}>
                       <TextInput 
                         style={{height:height*0.04,width:width*0.7,backgroundColor:"#fff",borderRadius:10,paddingLeft:20}}
                         placeholder="search"
                         onChangeText ={(text)=>{this.searchDoctor(text)}}
                       />
                  </View>
              </View>}
            {/* CHATS */}
            <FlatList


              data={this.state.doctors}

              keyExtractor={(item, index) => index.toString()}

              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity style={{ height: height * 0.1, backgroundColor: "#fafafa", marginTop: 1, flexDirection: 'row' }}
                    onPress={() => { this.props.navigation.navigate('ViewDoctorProfile',{item})}}
                  >
                    <View style={{ flex: 0.3, alignItems: "center", justifyContent: "center" }}>
                      <Image
                        source={{ uri: item.displayPicture||"https://s3-ap-southeast-1.amazonaws.com/practo-fabric/practices/711061/lotus-multi-speciality-health-care-bangalore-5edf8fe3ef253.jpeg" }}
                        style={{ height: 60, width: 60, borderRadius: 30, }}
                      />
                    </View>
                    <View style={{ flex: 0.7,justifyContent:"center" }}>
                      <View style={{ flex: 0.4, justifyContent: "center" }}>
                        <Text style={[styles.text, { fontWeight: 'bold', fontSize: 16 }]}>{item.name}</Text>
                      </View>
                      <View style={{ flex: 0.6, }}>
                        <Text style={[styles.text]}>{item.city}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              }}
            />
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
})
const mapStateToProps = (state) => {

  return {
    theme: state.selectedTheme,

  }
}
export default connect(mapStateToProps, { selectTheme })(DoctorsAdmin);
