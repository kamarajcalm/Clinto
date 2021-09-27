import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons, Entypo, AntDesign } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import settings from '../AppSettings';
import medicine from '../components/Medicine';
import Medicine from '../components/Medicine';
import HttpsClient from '../api/HttpsClient';
import Modal from 'react-native-modal';
const { height, width } = Dimensions.get("window");
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const url = settings.url;
const screenHeight = Dimensions.get("screen").height;
import moment from 'moment';
import axios from 'axios';
class SearchPateint extends Component {
    constructor(props) {
        super(props);
        this.state = {
           priscriptions:[],
           loading:false,
           query:""
        };
    }
    SearchPriscription = async()=>{
       this.setState({loading:true})
      let api =`${url}/api/prescription/prescriptions/?search=${this.state.query}`
      console.log(api)
      let data = await axios.get(api)
     
     
          this.setState({priscriptions:data.data,loading:false})
       
      
        
    }
        showDifferentPriscription = (item, index) => {
      
            let dp = null
            if (item?.doctordetails?.dp) {
                dp = `${url}${item?.doctordetails?.dp}`
            }

            return (
                <TouchableOpacity style={[styles.card, { flexDirection: "row", borderRadius: 5 }]}
                    onPress={() => { this.props.navigation.navigate('PrescriptionView', {item,}) }}
                >
                    <View style={{ flex: 0.3, alignItems: 'center', justifyContent: "center" }}>
                        <Image
                            source={{ uri: dp || "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" }}
                            style={{ height: height*0.1, width: height*0.1, borderRadius: height*0.05 }}
                        />
                    </View>
                    <View style={{ flex: 0.4, alignItems:"center",justifyContent:"space-around" }}>
                        <View >
                            <Text style={[styles.text, { fontSize: 18, }]}>{item?.clinicname.name}</Text>
                        </View>
                        <View>
                            <Text style={[styles.text, { fontSize: 12, }]}>{item?.doctordetails?.name}</Text>
                        </View>
                        <View>
                                 <Text style={[styles.text, { fontSize:height*0.02, color:"#000"}]} numberOfLines={1}>Name : {item?.username?.name}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 0.3, justifyContent: 'center', alignItems: "center" }}>
                        <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center' }}>
                            <Text>{moment(item.created).format("DD/MM/YYYY")}</Text>

                        </View>
                        <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={[styles.text]}> Id : {item.id}</Text>
                        </View>

                    </View>
                </TouchableOpacity>
            )
        
    }
    handleCheck = ()=>{
       
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.SearchPriscription();
        }, 1000);
    }
    renderFooter =()=>{
        if (this.state.next){
            return (
                <ActivityIndicator  size ={"large"} color={themeColor}/>
            )
        }
        else{
            return null
        }
    }
      loadMore =()=>{
        if(this.state.next){
            this.setState({offset:this.state.offset+10},()=>{
                this.SearchPriscription()
            })
        }
    }
    componentDidUpdate(prevProps,prevState){
          if(prevState.query!==this.state.query){
              this.handleCheck()
          }
    }
    render() {
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                
                        <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
                            <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                                onPress={() => { this.props.navigation.goBack() }}
                            >
                                <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                            </TouchableOpacity>
                       
                                <TextInput
                                    value={this.state.query}
                                 
                               
                                    autoFocus={true}
                                    selectionColor={themeColor}
                                    style={{ height:35, backgroundColor: "#fafafa", borderRadius: 15, paddingLeft: 10,flex:0.7}}
                                    placeholder="Phone number , Prescription Id , Name"
                                    onChangeText ={(query)=>{this.setState({query})}}
                                />
                        

                        </View>
                      <FlatList
                            
                     
                            data={this.state.priscriptions}
                            keyExtractor={(item, index) =>  index.toString() }
                            renderItem={({ item, index }) => {
                                
                                return (
                                    <View >
                                        {
                                            this.showDifferentPriscription(item, index)
                                        }
                                    </View>
                                )

                            }}
                        />
                    

                        <Modal
                         isVisible ={this.state.loading}
                         deviceHeight = {screenHeight}
                        >
                            <View style ={{flex:1,alignItems:"center",justifyContent:"center",}}>
                                   <ActivityIndicator size ={"large"} color={themeColor}/>
                            </View>
                        </Modal>
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

        backgroundColor: "#eeee",
        height: height * 0.15,
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
})
const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,

    }
}
export default connect(mapStateToProps, { selectTheme })(SearchPateint);