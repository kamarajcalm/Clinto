import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, TouchableOpacity, StyleSheet, FlatList, Image, SafeAreaView,useWindowDimensions} from 'react-native';
import settings from '../AppSettings';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
const { height, width } = Dimensions.get("window");
import { Ionicons, MaterialIcons, MaterialCommunityIcons, AntDesign} from '@expo/vector-icons';
import HttpsClient from '../api/HttpsClient';
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const url =settings.url;
const initialLayout = { width: Dimensions.get('window').width };
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

 class Chat extends Component {
  constructor(props) {
    const routes = [
      { key: 'Clinics', title: 'Clinics' },
      { key: 'Doctors', title: 'Doctors' },
      { key: 'Medicals', title: 'Medicals'},
    ];
    super(props);
    this.state = {
      index: 0,
      routes: routes,
      chats:[],
      clinics:[],
      doctors:[],
      medicals:[],
      edit:false,
      selectedChats:[]
    };
  }
   getChats = async()=>{
     console.log(this.props.medical)
     let api =''
     if(this.props.user.profile.occupation =="Customer"){
       api = `${url}/api/prescription/getThreads/?type=customer&customer=${this.props.user.id}`
     }
     if (this.props.user.profile.occupation == "ClinicRecoptionist") {
       api = `${url}/api/prescription/getThreads/?type=clinic&clinic=${this.props.user.profile.recopinistclinics[0].clinicpk}`
     }
     if (this.props.user.profile.occupation == "Doctor") {
       api = `${url}/api/prescription/getThreads/?type=doctor&doctor=${this.props.user.id}`
     }
     if (this.props.user.profile.occupation == "MediacalRep") {
       api = `${url}/api/prescription/getThreads/?type=clinic&clinic=${this.props.medical.clinicpk}`
     }
     if (this.props.user.profile.occupation == "MedicalRecoptionist") {
       api = `${url}/api/prescription/getThreads/?type=clinic&clinic=${this.props.user.profile.recopinistclinics[0].clinicpk}`
     }
     let data =await HttpsClient.get(api)
      console.log(api,'ghj')
     if(data.type =="success"){
       this.setState({ 
         clinics: data.data.clinicchats, 
         doctors: data.data.doctorchats, 
         medicals: data.data.medicalchats,
         chats:data.data,
        })
     }
   }
componentDidMount(){
 this.getChats()
  this._unsubscribe = this.props.navigation.addListener('focus', () => {
     this.getChats()

  });
}
componentWillUnmount(){
  this._unsubscribe();
}
   selectChat =(item)=>{
     let duplicate =this.state.selectedChats
     let find = this.state.selectedChats.find((i) => {
       return i == item
     })
     if(find){
        let index = this.state.selectedChats.indexOf(find) 
        duplicate.splice(index,1)
       this.setState({ selectedChats: duplicate })
     }else{
       duplicate.push(item)
       this.setState({ selectedChats: duplicate })
     }

   }
   validateColor =(item)=>{
    let find = this.state.selectedChats.find((i)=>{
        return i == item
    })
    if(find){
      return "#D3D3D3"
    }else{
      return "#fafafa"
    }
   }
   validateCheckBox = (item)=>{
     let find = this.state.selectedChats.find((i) => {
       return i == item
     })
     if (find) {
       return (
         <AntDesign name="check" size={24} color="green" />
       )
     } else {
       return null
     }
   }
   addToDelete =(item)=>{
    
       this.setState({edit:true})
    
   }
   FirstRoute =()=>{
     return(
           <FlatList
           contentContainerStyle={{ paddingBottom: 90 }}

           data={this.state.clinics}

           keyExtractor={(item, index) => index.toString()}

           renderItem={({ item, index }) => {
             if(this.state.edit){
               return(
                 <TouchableOpacity style={{ height: height * 0.1, backgroundColor:this.validateColor(item), marginTop: 1, flexDirection: 'row' }}
                   onPress={() => {
                     this.selectChat(item)
                   }}
                 >
                    <View style={{flex:0.1,alignItems:"center",justifyContent:"center"}}>
                        <View style={{height:20,width:20,borderColor:"#000",borderWidth:1,alignItems:"center",justifyContent:'center'}}
                         
                        >
                          {
                            this.validateCheckBox(item)
                          }

                        </View>
                    </View>
                   
                   <View style={{ flex: 0.3, alignItems: "center", justifyContent: "center" }}>
                     <Image
                       source={{
                         uri: item.dp || "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
                       }}
                       style={{ height: 60, width: 60, borderRadius: 30, }}
                     />
                   </View>
                   <View style={{ flex: 0.6, }}>
                     <View style={{ flex: 0.4, justifyContent: "center" }}>
                       <Text style={[styles.text, { fontWeight: 'bold', fontSize: 16 }]}>{item.title}</Text>
                     </View>
                     <View style={{ flex: 0.6, }}>
                       <Text style={[styles.text]}>{item.lastmsg}</Text>
                     </View>
                   </View>
                 </TouchableOpacity>
               )
             }
             return (
               <TouchableOpacity style={{ height: height * 0.1, backgroundColor: "#fafafa", marginTop: 1, flexDirection: 'row' }}
                 onPress={() => { this.navigate(item,"clinic") }}
                 onLongPress ={()=>{this.addToDelete(item)}}
               >
                 <View style={{ flex: 0.3, alignItems: "center", justifyContent: "center" }}>
                   <Image
                     source={{
                       uri: item.dp || "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
                     }}
                     style={{ height: 60, width: 60, borderRadius: 30, }}
                   />
                 </View>
                 <View style={{ flex: 0.7, }}>
                   <View style={{ flex: 0.4, justifyContent: "center" }}>
                     <Text style={[styles.text, { fontWeight: 'bold', fontSize: 16 }]}>{item.title}</Text>
                   </View>
                   <View style={{ flex: 0.6, }}>
                     <Text style={[styles.text]}>{item.lastmsg}</Text>
                   </View>
                 </View>
               </TouchableOpacity>
             )
           }}
         />
     )
   }
   SecondRoute = () => {
     
     return (
       <FlatList
         contentContainerStyle={{ paddingBottom: 90 }}

         data={this.state.doctors}

         keyExtractor={(item, index) => index.toString()}

         renderItem={({ item, index }) => {
           if (this.state.edit) {
             return (
               <TouchableOpacity style={{ height: height * 0.1, backgroundColor: this.validateColor(item), marginTop: 1, flexDirection: 'row' }}
                 onPress={() => {
                   this.selectChat(item)
                 }}
               >
                 <View style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>
                   <View style={{ height: 20, width: 20, borderColor: "#000", borderWidth: 1, alignItems: "center", justifyContent: 'center' }}

                   >
                     {
                       this.validateCheckBox(item)
                     }

                   </View>
                 </View>

                 <View style={{ flex: 0.3, alignItems: "center", justifyContent: "center" }}>
                   <Image
                     source={{
                       uri: item.dp || "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
                     }}
                     style={{ height: 60, width: 60, borderRadius: 30, }}
                   />
                 </View>
                 <View style={{ flex: 0.6, }}>
                   <View style={{ flex: 0.4, justifyContent: "center" }}>
                     <Text style={[styles.text, { fontWeight: 'bold', fontSize: 16 }]}>{item.title}</Text>
                   </View>
                   <View style={{ flex: 0.6, }}>
                     <Text style={[styles.text]}>{item.lastmsg}</Text>
                   </View>
                 </View>
               </TouchableOpacity>
             )
           }
           return (
             <TouchableOpacity style={{ height: height * 0.1, backgroundColor: "#fafafa", marginTop: 1, flexDirection: 'row' }}
               onPress={() => { this.navigate(item, "doctor") }}
               onLongPress={() => { this.addToDelete(item) }}
             >
               <View style={{ flex: 0.3, alignItems: "center", justifyContent: "center" }}>
                 <Image
                   source={{
                     uri: item.dp || "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
                   }}
                   style={{ height: 60, width: 60, borderRadius: 30, }}
                 />
               </View>
               <View style={{ flex: 0.7, }}>
                 <View style={{ flex: 0.4, justifyContent: "center" }}>
                   <Text style={[styles.text, { fontWeight: 'bold', fontSize: 16 }]}>{item.title}</Text>
                 </View>
                 <View style={{ flex: 0.6, }}>
                   <Text style={[styles.text]}>{item.lastmsg}</Text>
                 </View>
               </View>
             </TouchableOpacity>
           )
         }}
       />
     )
   }
   ThirdRoute =()=>{
     return (
       <FlatList
         contentContainerStyle={{ paddingBottom: 90 }}

         data={this.state.medicals}

         keyExtractor={(item, index) => index.toString()}

         renderItem={({ item, index }) => {
           if (this.state.edit) {
             return (
               <TouchableOpacity style={{ height: height * 0.1, backgroundColor: this.validateColor(item), marginTop: 1, flexDirection: 'row' }}
                 onPress={() => {
                   this.selectChat(item)
                 }}
               >
                 <View style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>
                   <View style={{ height: 20, width: 20, borderColor: "#000", borderWidth: 1, alignItems: "center", justifyContent: 'center' }}

                   >
                     {
                       this.validateCheckBox(item)
                     }

                   </View>
                 </View>

                 <View style={{ flex: 0.3, alignItems: "center", justifyContent: "center" }}>
                   <Image
                     source={{
                       uri: item.dp || "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
                     }}
                     style={{ height: 60, width: 60, borderRadius: 30, }}
                   />
                 </View>
                 <View style={{ flex: 0.6, }}>
                   <View style={{ flex: 0.4, justifyContent: "center" }}>
                     <Text style={[styles.text, { fontWeight: 'bold', fontSize: 16 }]}>{item.title}</Text>
                   </View>
                   <View style={{ flex: 0.6, }}>
                     <Text style={[styles.text]}>{item.lastmsg}</Text>
                   </View>
                 </View>
               </TouchableOpacity>
             )
           }
           return (
             <TouchableOpacity style={{ height: height * 0.1, backgroundColor: "#fafafa", marginTop: 1, flexDirection: 'row' }}
               onPress={() => { this.navigate(item, "doctor") }}
               onLongPress={() => { this.addToDelete(item) }}
             >
               <View style={{ flex: 0.3, alignItems: "center", justifyContent: "center" }}>
                 <Image
                   source={{
                     uri: item.dp || "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
                   }}
                   style={{ height: 60, width: 60, borderRadius: 30, }}
                 />
               </View>
               <View style={{ flex: 0.7, }}>
                 <View style={{ flex: 0.4, justifyContent: "center" }}>
                   <Text style={[styles.text, { fontWeight: 'bold', fontSize: 16 }]}>{item.title}</Text>
                 </View>
                 <View style={{ flex: 0.6, }}>
                   <Text style={[styles.text]}>{item.lastmsg}</Text>
                 </View>
               </View>
             </TouchableOpacity>
           )
         }}
       />
     )
   }
navigate =(item,type)=>{
let itemArrange ={}
if(type=="clinic"){
    itemArrange = {
    groupPk: item.threadpk,
    uid: item.uid,
    clinictitle: item.title
  }
}
  if (type == "doctor") {
    itemArrange = {
      groupPk: item.threadpk,
      uid: item.uid,
      customertitle: item.title||"doctor"
    }
  }


  this.props.navigation.navigate('ChatScreen', { item: itemArrange })
}
   renderScene = SceneMap({
     Clinics: this.FirstRoute,
     Doctors:this.SecondRoute,
     Medicals:this.ThirdRoute,
   });
   indexChange = async (index,) => {
  
     this.setState({ index })

   }
   validateChats =()=>{
     const { index, routes } = this.state
     if (this.props.user.profile.occupation =="Customer"){
       return(
         <TabView
           style={{ backgroundColor: "#ffffff" }}
           navigationState={{ index, routes }}
           renderScene={this.renderScene}
           onIndexChange={(index) => { this.indexChange(index)}}
           initialLayout={initialLayout}
           renderTabBar={(props) =>
             <TabBar
               {...props}
               renderLabel={({ route, focused, color }) => (
                 <Text style={[styles.text,{ color: focused ? themeColor : 'gray', margin: 8, fontWeight: "bold" }]}>
                   {route.title}
                 </Text>
               )}
               style={{ backgroundColor: "#fff", height: 50, fontWeight: "bold", color: "red" }}
               labelStyle={{ fontWeight: "bold", color: "red" }}
               indicatorStyle={{ backgroundColor: themeColor, height: 5 }}
             />
           }

         />
    
    
       )
     }
     if (this.props.user.profile.occupation == "ClinicRecoptionist" || this.props.user.profile.occupation == "MedicalRecoptionist") {
        return(
          <FlatList
            contentContainerStyle={{ paddingBottom: 90 }}

            data={this.state.chats}

            keyExtractor={(item, index) => index.toString()}

            renderItem={({ item, index }) => {
              if (this.state.edit) {
                return (
                  <TouchableOpacity style={{ height: height * 0.1, backgroundColor: this.validateColor(item), marginTop: 1, flexDirection: 'row' }}
                    onPress={() => {
                      this.selectChat(item)
                    }}
                  >
                    <View style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>
                      <View style={{ height: 20, width: 20, borderColor: "#000", borderWidth: 1, alignItems: "center", justifyContent: 'center' }}

                      >
                        {
                          this.validateCheckBox(item)
                        }

                      </View>
                    </View>

                    <View style={{ flex: 0.3, alignItems: "center", justifyContent: "center" }}>
                      <Image
                        source={{
                          uri: item.dp || "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
                        }}
                        style={{ height: 60, width: 60, borderRadius: 30, }}
                      />
                    </View>
                    <View style={{ flex: 0.6, }}>
                      <View style={{ flex: 0.4, justifyContent: "center" }}>
                        <Text style={[styles.text, { fontWeight: 'bold', fontSize: 16 }]}>{item.title}</Text>
                      </View>
                      <View style={{ flex: 0.6, }}>
                        <Text style={[styles.text]}>{item.lastmsg}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              }
              return (
                <TouchableOpacity style={{ height: height * 0.1, backgroundColor: "#fafafa", marginTop: 1, flexDirection: 'row' }}
                  onPress={() => { this.navigate(item, "clinic") }}
                  onLongPress={() => { this.addToDelete(item) }}
                >
                  <View style={{ flex: 0.3, alignItems: "center", justifyContent: "center" }}>
                    <Image
                      source={{
                        uri: item.dp || "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
                      }}
                      style={{ height: 60, width: 60, borderRadius: 30, }}
                    />
                  </View>
                  <View style={{ flex: 0.7, }}>
                    <View style={{ flex: 0.4, justifyContent: "center" }}>
                      <Text style={[styles.text, { fontWeight: 'bold', fontSize: 16 }]}>{item.title}</Text>
                    </View>
                    <View style={{ flex: 0.6, }}>
                      <Text style={[styles.text]}>{item.lastmsg}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )
            }}
          />
        )
     }
     if (this.props.user.profile.occupation == "Doctor"){
       return(
         <FlatList
           contentContainerStyle={{ paddingBottom: 90 }}

           data={this.state.chats}

           keyExtractor={(item, index) => index.toString()}

           renderItem={({ item, index }) => {
             if (this.state.edit) {
               return (
                 <TouchableOpacity style={{ height: height * 0.1, backgroundColor: this.validateColor(item), marginTop: 1, flexDirection: 'row' }}
                   onPress={() => {
                     this.selectChat(item)
                   }}
                 >
                   <View style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>
                     <View style={{ height: 20, width: 20, borderColor: "#000", borderWidth: 1, alignItems: "center", justifyContent: 'center' }}

                     >
                       {
                         this.validateCheckBox(item)
                       }

                     </View>
                   </View>

                   <View style={{ flex: 0.3, alignItems: "center", justifyContent: "center" }}>
                     <Image
                       source={{
                         uri: item.dp || "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
                       }}
                       style={{ height: 60, width: 60, borderRadius: 30, }}
                     />
                   </View>
                   <View style={{ flex: 0.6, }}>
                     <View style={{ flex: 0.4, justifyContent: "center" }}>
                       <Text style={[styles.text, { fontWeight: 'bold', fontSize: 16 }]}>{item.title}</Text>
                     </View>
                     <View style={{ flex: 0.6, }}>
                       <Text style={[styles.text]}>{item.lastmsg}</Text>
                     </View>
                   </View>
                 </TouchableOpacity>
               )
             }
             return (
               <TouchableOpacity style={{ height: height * 0.1, backgroundColor: "#fafafa", marginTop: 1, flexDirection: 'row' }}
                 onPress={() => { this.navigate(item, "doctor") }}
                 onLongPress={() => { this.addToDelete(item) }}
               >
                 <View style={{ flex: 0.3, alignItems: "center", justifyContent: "center" }}>
                   <Image
                     source={{
                       uri: item.dp || "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
                     }}
                     style={{ height: 60, width: 60, borderRadius: 30, }}
                   />
                 </View>
                 <View style={{ flex: 0.7, }}>
                   <View style={{ flex: 0.4, justifyContent: "center" }}>
                     <Text style={[styles.text, { fontWeight: 'bold', fontSize: 16 }]}>{item.title}</Text>
                   </View>
                   <View style={{ flex: 0.6, }}>
                     <Text style={[styles.text]}>{item.lastmsg}</Text>
                   </View>
                 </View>
               </TouchableOpacity>
             )
           }}
         />
       )
     }
     if (this.props.user.profile.occupation == "MediacalRep") {
       return (
         <FlatList
           contentContainerStyle={{ paddingBottom: 90 }}

           data={this.state.chats}

           keyExtractor={(item, index) => index.toString()}

           renderItem={({ item, index }) => {
             if (this.state.edit) {
               return (
                 <TouchableOpacity style={{ height: height * 0.1, backgroundColor: this.validateColor(item), marginTop: 1, flexDirection: 'row' }}
                   onPress={() => {
                     this.selectChat(item)
                   }}
                 >
                   <View style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>
                     <View style={{ height: 20, width: 20, borderColor: "#000", borderWidth: 1, alignItems: "center", justifyContent: 'center' }}

                     >
                       {
                         this.validateCheckBox(item)
                       }

                     </View>
                   </View>

                   <View style={{ flex: 0.3, alignItems: "center", justifyContent: "center" }}>
                     <Image
                       source={{
                         uri: item.dp || "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
                       }}
                       style={{ height: 60, width: 60, borderRadius: 30, }}
                     />
                   </View>
                   <View style={{ flex: 0.6, }}>
                     <View style={{ flex: 0.4, justifyContent: "center" }}>
                       <Text style={[styles.text, { fontWeight: 'bold', fontSize: 16 }]}>{item.title}</Text>
                     </View>
                     <View style={{ flex: 0.6, }}>
                       <Text style={[styles.text]}>{item.lastmsg}</Text>
                     </View>
                   </View>
                 </TouchableOpacity>
               )
             }
             return (
               <TouchableOpacity style={{ height: height * 0.1, backgroundColor: "#fafafa", marginTop: 1, flexDirection: 'row' }}
                 onPress={() => { this.navigate(item, "clinic") }}
                 onLongPress={() => { this.addToDelete(item) }}
               >
                 <View style={{ flex: 0.3, alignItems: "center", justifyContent: "center" }}>
                   <Image
                     source={{
                       uri: item.dp || "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
                     }}
                     style={{ height: 60, width: 60, borderRadius: 30, }}
                   />
                 </View>
                 <View style={{ flex: 0.7, }}>
                   <View style={{ flex: 0.4, justifyContent: "center" }}>
                     <Text style={[styles.text, { fontWeight: 'bold', fontSize: 16 }]}>{item.title}</Text>
                   </View>
                   <View style={{ flex: 0.6, }}>
                     <Text style={[styles.text]}>{item.lastmsg}</Text>
                   </View>
                 </View>
               </TouchableOpacity>
             )
           }}
         />
       )
     }

   }
   removeEdit =()=>{
     this.setState({selectedChats:[]},()=>{
         this.setState({edit:false})
     })
   }
   validateEdit =()=>{
      if(this.state.edit){
         return(
           <View style={{flexDirection:"row"}}>
             <TouchableOpacity
              style={{marginRight:20}}
              onPress ={()=>{console.log(this.state.selectedChats,"ppppp")}}
             >
                <MaterialCommunityIcons name="delete" size={24} color="#fff" />
             </TouchableOpacity>
             <TouchableOpacity 
             
             onPress ={()=>{
               this.removeEdit()
             }}
             >
               <MaterialIcons name="cancel" size={24} color="#fff" />
             </TouchableOpacity>
           </View>
         )
      }
      return(
        <TouchableOpacity 
         onPress ={()=>{this.setState({edit:true})}}
        >
          <MaterialIcons name="edit" size={24} color="#fff" />
        </TouchableOpacity>
      )
   }
  render() {
 
    return (
      <>
        <SafeAreaView style={styles.topSafeArea} />
        <SafeAreaView style={styles.bottomSafeArea}>
        <View style={{flex:1,backgroundColor:"#fff"}}>
            <StatusBar backgroundColor={themeColor} />
                    {/* HEADERS */}
            <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
             
              <View style={{flex:0.7 }}>
                <Text style={[styles.text, { color: '#fff', marginLeft: 20 ,fontWeight:'bold',fontSize:25}]}>Chats</Text>
              </View>
             <View style={{flex:0.3,alignItems:"center",justifyContent:'center'}}>
                 {
                   this.validateEdit()
                 }
             </View>
            </View>
                         {/* CHATS */}


                        {
                          this.validateChats()
                        }
              
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
    user:state.selectedUser,
    medical: state.selectedMedical
  }
}
export default connect(mapStateToProps, { selectTheme })(Chat);