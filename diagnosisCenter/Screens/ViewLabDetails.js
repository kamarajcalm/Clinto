import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, TouchableOpacity, StyleSheet, FlatList, Image, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import settings from '../.././AppSettings';
import { connect } from 'react-redux';
import { selectTheme } from '../../actions';
const { height, width } = Dimensions.get("window");


const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const url =settings.url;
const date =new Date()
import { Linking } from 'react-native';
import { Ionicons ,AntDesign,FontAwesome,FontAwesome5,Entypo} from '@expo/vector-icons';


import { SliderBox } from "react-native-image-slider-box";
import HttpsClient from '../../api/HttpsClient';
   let weekdays =["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
class ViewLabDetails extends Component {
    constructor(props) {
      
        super(props);
        this.state = {
            item:null,
            receptionList:[],
            images:[]
        };
    }
              validateOpen = ()=>{
         if(this.state?.item?.clinicOpened=="opened"){
             return "green"
         }else{
             return "red"
         }
     }
      getImages = async()=>{
        let api = `${url}/api/prescription/clinicImages/?clinic=${this.props.clinic.clinicpk}`
        console.log(api,"jhjhj")
        let data =await HttpsClient.get(api)

        if(data.type=="success"){
            let images =[]
            data.data.forEach((item,index)=>{
                images.push(`${item.imageUrl}`)
            })
            this.setState({images},()=>{
                console.log(images)
            })

        }
      
    }
    getReceptionList = async () => {
        let api = `${url}/api/prescription/recopinists/?clinic=${this.props.clinic.clinicpk}`
        console.log(api)
        const data = await HttpsClient.get(api)
        // console.log(data,"kkk")
        if (data.type == "success") {
            this.setState({ receptionList: data.data })
        }
    }
    getClinicDetails = async()=>{
        let api = `${url}/api/prescription/clinics/${this.props.clinic.clinicpk}/`
        console.log(api)
        const data =await HttpsClient.get(api)
        if(data.type =="success"){
            this.setState({item:data.data})
        }
    }
    componentDidMount() {
        this.getClinicDetails()
        this.getReceptionList()
        this.getImages()
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.getImages()
            this.getReceptionList()
            this.getClinicDetails()
        });
    }
    getTodayTimings2 = (item)=>{
         let  days =["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
      let today =days[date.getDay()]
      console.log(today,"kkkkkk")
      return(
          item.clinicShifts[today][0].timings.map((i, index) => {
              return (
                 <View 
                key={index}
                style={{ flexDirection: "row",marginTop:5,paddingHorizontal:10}}>
              
              
                     <View style={{flex:1,alignItems:"center",justifyContent:"space-around",flexDirection:"row"}}>
                                <View style={{flex:0.1,alignItems:"center",justifyContent:"center"}}>
                            <Text style={[styles.text,{color:"#000"}]}>{index+1} .</Text>
                     </View>
                       <View style={{flex:0.4,alignItems:"center",justifyContent:"center"}}>
                              <Text style={[styles.text, { marginLeft: 5 }]}>{i[0]}</Text>
                       </View>
                        <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                            
                        </View> 
                        <View style={{flex:0.4,}}>
                            <Text style={[styles.text]}>{i[1]}</Text>
                        </View>
    
                   </View>
                
               </View>
              )
          })
      ) 
    }
     getTodayTimings3 = (today,color) => {
    
   return(
       this.state.item.clinicShifts[today][0].timings.map((i, index) => {
           console.log(i,"ppp")
           return (
               <View 
                key={index}
                style={{ flexDirection: "row",marginTop:5,paddingHorizontal:10}}>
              
              
                     <View style={{flex:1,alignItems:"center",justifyContent:"space-around",flexDirection:"row"}}>
                                <View style={{flex:0.1,alignItems:"center",justifyContent:"center"}}>
                            <Text style={[styles.text,{color}]}>{index+1} .</Text>
                     </View>
                       <View style={{flex:0.4,alignItems:"center",justifyContent:"center"}}>
                              <Text style={[styles.text, { marginLeft: 5,color }]}>{i[0]}</Text>
                       </View>
                        <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                             
                        </View> 
                        <View style={{flex:0.4,}}>
                            <Text style={[styles.text,{color}]}>{i[1]}</Text>
                        </View>
    
                   </View>
                
               </View>
           )
       })
   )
       
       



    }
    render() {
        if(this.state.item){

 
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                    <View style={{ flex: 1, backgroundColor: "#fff" }}>
                        <StatusBar backgroundColor={themeColor} />
                        {/* HEADERS */}
                        <View style={{ height: height * 0.1, backgroundColor: themeColor,flexDirection: 'row', alignItems: "center" }}>
                            <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                                onPress={() => { this.props.navigation.goBack() }}
                            >
                                <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                            </TouchableOpacity>
                            <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
                                <Text style={[styles.text, { color: '#fff', fontWeight: 'bold', fontSize: 18 }]}>{this.state.item.companyName}</Text>
                            </View>
                            <TouchableOpacity style={{ flex: 0.2, flexDirection: "row", alignItems: "center", justifyContent: 'center' }}
                                onPress={() => { this.props.navigation.navigate('EditClinicDetails', { clinic: this.state.item }) }}
                            >
                                <Entypo name="back-in-time" size={24} color="#fff" />
                                <Text style={[styles.text, { marginLeft: 10, color: "#fff" }]}>Edit </Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={{ flex: 1, }}>
                            {/* image */}
                            <View style={{ height: height * 0.25, width }}>
                                  <SliderBox
                                    images={this.state.images}
                                    dotColor={themeColor}
                                    imageLoadingColor={themeColor}
                                    ImageComponentStyle={{ height: "100%", width: "100%", resizeMode: "cover" }}
                                    autoplay={true}
                                    circleLoop={true}
                                />
                            </View>
                            {/* Details */}
                                   <View style={[styles.boxWithShadow, { height: height * 0.07, width, backgroundColor: "#eee", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20 }]}>
                                <View>
                                    <Text style={[styles.text]}>Clinic Details</Text>
                                </View>
                              
                            </View>
                                                 <View style={{ margin: 20 }}>

                                <View style={{flexDirection:"row"}}>
                                    <View>
                                            <Text style={{  fontSize: 18, color: "#000" }}>{this.state?.item?.companyName?.toUpperCase()}</Text>
                                    </View>
                                    <View style={{height:10,width:10,borderRadius:5,marginLeft:10,backgroundColor:this.validateOpen(),marginTop:8}}>
                                        
                                    </View>
                        
                                    <View style={{marginLeft:10,flexDirection:"row"}}>
                                        <View style={{alignItems:"center",justifyContent:"center"}}>
                                                 <Text style={[styles.text,{color:"black"}]}>{this.state?.item?.ratings}</Text>
                                        </View>
                                       <View style={{alignItems:"center",justifyContent:"center",marginLeft:5}}>
                                           <AntDesign name="star" size={24} color="#63BCD2" />
                                       </View>
                                    </View>
                                </View>



                                <View style={{ marginTop: 10 }}>
                                    <View style={{}}>
                                        <Text style={[styles.text]}>{ this.state?.item?.address }</Text>

                                    </View>
                                    <View style={{}}>
                                        <Text style={[styles.text]}>{this.state?.item?.city} - {this.state?.item?.pincode}</Text>

                                    </View>
                                </View>
                                <View style={{ marginTop: 10, flexDirection: "row" ,}}>
                                   <View style={{flex:0.5,flexDirection:"row",alignItems:"center",justifyContent:"space-around"}}>

                                
 
                                    <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center', marginLeft: 10 }]}
                                        onPress={() => {
                                            if (Platform.OS == "android") {
                                                Linking.openURL(`tel:${this.state?.item?.mobile}`)
                                            } else {

                                                Linking.canOpenURL(`telprompt:${this.state?.item?.mobile}`)
                                            }
                                         }}
                                    >
                                        <FontAwesome name="phone" size={20} color="#63BCD2" />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center', marginLeft: 10 }]}
                                        onPress={() => {
                                            Linking.openURL(
                                                `https://www.google.com/maps/dir/?api=1&destination=` +
                                                this.state.item.lat +
                                                `,` +
                                                this.state.item.long +
                                                `&travelmode=driving`
                                            );
                                        }}
                                    >
                                        <FontAwesome5 name="directions" size={20} color="#63BCD2" />
                                    </TouchableOpacity>
                                    </View>
                      
                                </View>
                            </View>
                       
 
                      
                                                        <View style={{ padding: 10, }}>
                                
              
                               <View style={{flexDirection:"row"}}>
                                   <View style={{flex:0.3}}>

                                   </View>
                                          <View style={{flex:0.7,flexDirection:"row"}}>

                                    <View style={{flex:0.5,alignItems:"center",justifyContent:"center"}}>
                                                <Text style={[styles.text,{color:"#000"}]}>Open</Text>
                                            </View>
                                            <View style={{flex:0.5,alignItems:"center",justifyContent:"center"}}>
                                                <Text style={[styles.text,{color:"#000"}]}>Close</Text>
                                            </View>  
                               </View>
                               </View>
                        
                                         {
                               weekdays.map((item)=>{
                                     let today =weekdays[date.getDay()]
                                     let color = item==today?"red":"#000"
                                 return (
                                     <View style={{marginTop:15}}>
                                         <View style={{flexDirection:"row"}}>
                                                <View style={{flex:0.3,alignItems:"center",justifyContent:"center",flexDirection:"row"}}>
                                                    <View style={{flex:0.8,alignItems:"center",justifyContent:"center"}}>
                                                                      <Text style={[styles.text, { color}]}>{item}  </Text>
                                                    </View>
                                                    <View style={{alignItems:"center",justifyContent:"center"}}>
                                                         <Text style={[styles.text, { }]}> : </Text> 
                                                    </View>
                                                </View>
                                                            <View style={{flex:0.7}}>
                                                  {this.state.item&&
                                            this.getTodayTimings3(item,color)
                                        }
                                         </View>
                                         </View>
                             
                                  
                                     </View>
                                 ) 
                               })
                           
                             }


                            </View> 
                            
                             
                               
                           
                         
                
                           
                            <View style={{}}>
                                   <View style={[styles.boxWithShadow,{ height: height * 0.07, width, backgroundColor: "#eee", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20 ,marginTop:10}]}>
                                <View>
                                    <Text style={[styles.text]}>Reception list:</Text>
                                </View>
                             
                            </View>
                                 <FlatList 
                                    data={this.state.receptionList}
                                    keyExtractor={(item,index)=>index.toString()}
                                    renderItem={({item,index})=>{
                                        return(
                                            <TouchableOpacity style={{flexDirection:"row",height:height*0.1,}}
                                                onPress={() => { this.props.navigation.navigate('ReceptionistProfile',{item:item})}}
                                            >
                                                <View style={{alignItems:"center",justifyContent:"center",flex:0.33}}>
                                                    <Image
                                                        source={{ uri: item.user.profile.displayPicture || "https://s3-ap-southeast-1.amazonaws.com/practo-fabric/practices/711061/lotus-multi-speciality-health-care-bangalore-5edf8fe3ef253.jpeg" }}
                                                        style={{ height: 60, width: 60, borderRadius: 30, }}
                                                    />
                                                </View>
                                             
                                                <View style={{alignItems:'center',justifyContent:"center",flex:0.33}}>
                                                    <Text>{item.user.first_name}</Text>
                                                </View>
                                                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 0.33}}
                                                    onPress={() => { this.setState({ showModal2: true,deleteReceptionist: item,deleteReceptionIndex:index }) }}
                                                >
                                                    <Entypo name="circle-with-cross" size={24} color={themeColor} />
                                                </TouchableOpacity>
                                            </TouchableOpacity>
                                        )
                                    }}
                                 />
                            </View>
                            
                            <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-around",marginVertical:20,flexWrap:"wrap"}}>
                                <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "center", marginTop: 20 }}>
                                  <TouchableOpacity style={{ height: height * 0.05, width: width * 0.4, backgroundColor: themeColor, borderRadius: 5, alignItems: 'center', justifyContent: "center" }}
                                        onPress={() => { this.props.navigation.navigate("CreateDiagnosisCenterUser", { item: this.state.item }) }}
                                    >
                                        <Text style={[styles.text, { color: "#fff" }]}>Create User</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "center", marginTop: 20,flexWrap:"wrap" }}>
                                    <TouchableOpacity style={{ height: height * 0.05, width: width * 0.4, backgroundColor: themeColor, borderRadius: 5, alignItems: 'center', justifyContent: "center" }}
                                        onPress={() => { this.props.navigation.navigate("MedicalOffers", { item: this.state.item }) }}
                                    >
                                        <Text style={[styles.text, { color: "#fff" }]}>Manage Offers</Text>
                                    </TouchableOpacity>
                                </View>
                                   <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "center", marginTop: 10 }}>
                                <TouchableOpacity style={{ height: height * 0.05, width: width * 0.4, backgroundColor: themeColor, borderRadius: 5, alignItems: 'center', justifyContent: "center" }}
                                    onPress={() => { this.props.navigation.navigate('UploadImages',{ clinic: this.state.item.id })}}
                                >
                                    <Text style={[styles.text, { color: "#fff" }]}>Add Images</Text>
                                </TouchableOpacity>
                            </View>
                            </View>
                        
                             
                        </ScrollView>

                    </View>
                </SafeAreaView>
            </>
        );
               }
               return (
                      <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                         <ActivityIndicator size={"large"} color={"#fff"}/>
                </View> 
               )    
              
              
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
            boxWithShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5
    }
})
const mapStateToProps = (state) => {

    return {
     theme: state.selectedTheme,
        user: state.selectedUser,
        clinic:state.selectedClinic
    }
}
export default connect(mapStateToProps, { selectTheme })(ViewLabDetails);