import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, TouchableOpacity, StyleSheet, FlatList, Image, SafeAreaView, ActivityIndicator } from 'react-native';
import settings from '../AppSettings';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
const { height, width } = Dimensions.get("window");
import { Ionicons } from '@expo/vector-icons';
import HttpsClient from '../api/HttpsClient';
import { TextInput } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const url= settings.url;
class DoctorsAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doctors :[],
      search:false,
      next:true,
      first:true,
      refreshing:false,
      offset:0
    };
  }
  getDoctors = async()=>{
    this.setState({refreshing:true,first:false})
    let api = `${url}/api/profile/userss/?position=Doctor&limit=10&offset=${this.state.offset}`
     const data = await HttpsClient.get(api)
    console.log(api)
     if(data.type=="success"){
       this.setState({ doctors: this.state.doctors.concat(data.data.results),refreshing:false})
       if(data.data.next == null){
         this.setState({next:false})
       }
     }else{
       this.setState({ refreshing: false})
       return null
     }
  }
  componentDidMount() {
    this.getDoctors()
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
    
      if(!this.state.first){
        this.setState({ next: true, offset: 0, doctors: [] }, () => {
          this.getDoctors()
        })
      }
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
  getFirstLetter = (name) => {

    let doctorName = name.split("")

    return doctorName[0].toUpperCase();

  }
  renderFooter =()=>{
    if(this.state.next){
        return (
          <ActivityIndicator size={"large"} color={themeColor}/>
        )
    }else{
      return null
    }
  }
  loadMore =()=>{
      if(this.state.next){
           this.setState({offset:this.state.offset+10},()=>{
                this.getDoctors();
           })
      }
  }
  refresh =()=>{
      this.setState({next:true,offset:0,doctors:[]},()=>{
           this.getDoctors()
      })
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
                         style={{height:35,width:width*0.7,backgroundColor:"#fff",borderRadius:10,paddingLeft:20}}
                         placeholder="search"
                         onChangeText ={(text)=>{this.searchDoctor(text)}}
                       />
                  </View>
              </View>}
            {/* CHATS */}
            <FlatList
            refreshing={this.state.refreshing}
               onRefresh ={()=>{this.refresh()}}
              ListFooterComponent ={this.renderFooter()}
              onEndReachedThreshold={0.1}
              onEndReached={()=>{this.loadMore()}}
              data={this.state.doctors}

              keyExtractor={(item, index) => index.toString()}

              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity style={{ height: height * 0.1, backgroundColor: "#fafafa", marginTop: 1, flexDirection: 'row' }}
                    onPress={() => { this.props.navigation.navigate('ViewDoctorProfile',{item})}}
                  >
                    <View style={{ flex: 0.3, alignItems: "center", justifyContent: "center" }}>
                      <LinearGradient
                        style={{ height: 50, width: 50, borderRadius: 25, alignItems: "center", justifyContent: "center" }}
                        colors={["#333", themeColor, themeColor]}
                      >
                        <View >
                          <Text style={[styles.text, { color: "#ffff", fontWeight: "bold", fontSize: 22 }]}>{this.getFirstLetter(item.name)}</Text>
                        </View>
                      </LinearGradient>
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
