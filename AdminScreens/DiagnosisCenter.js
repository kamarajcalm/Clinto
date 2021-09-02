import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, TouchableOpacity, StyleSheet, FlatList, Image, SafeAreaView, TextInput, ActivityIndicator} from 'react-native';
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

const screenHeight = Dimensions.get("screen").height
class DiagnosisCenter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clinics:[],
            showModal:false,
            selectedClinic:null,
            selectedClinicIndex:null,
            refreshing:false,
            offset:0,
            next:true,
            first:true
        };
    }
    deleteClinic = async()=>{
        const api = `${url}/api/prescription/clinics/${this.state.selectedClinic.id}/`
        let delette =await HttpsClient.delete(api)
        if(delette.type=="success"){
            let duplicate = this.state.clinics
            duplicate.splice(this.state.selectedClinicIndex,1)
            this.setState({ clinics: duplicate,showModal:false})
        }else{
            this.setState({  showModal: false })
            SimpleToast.show("Try again")
        }
    }
    getClinics =async()=>{
        this.setState({refreshing:true}) 
        const api = `${url}/api/prescription/clinics/?storeType=Lab&limit=10&offset=${this.state.offset}`
        console.log(api)
        const data =await HttpsClient.get(api)
        
        if(data.type=="success"){
            this.setState({ clinics: this.state.clinics.concat(data.data.results),refreshing:false})
            if(data.data.next==null){
                this.setState({next:false})
            }
        }else{
            this.setState({ refreshing: false })
        }
    }
    searchClincs = async(query)=>{
      
        let api = `${url}/api/prescription/clinics/?storeType=Lab&search=${query}`
        console.log(api)
        const data = await HttpsClient.get(api)
        console.log(data,"jj")
        if (data.type == "success") {
            this.setState({ clinics: data.data })
        }
    }
    componentDidMount() {
      this.getClinics()
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
             if(!this.state.first) {
                 this.setState({ next: true, offset: 0, clinics: [] }, () => {
                     this.getClinics()
                 })
             }
          
        });
    }
    componentWillUnmount() {
        this._unsubscribe();
    }
    getFirstLetter = (clinic ) => {
      
        let clinicName = clinic.split("")
  
            return clinicName[0].toUpperCase();
      
    }
    refresh =()=>{
        this.setState({ next: true, offset: 0, clinics: [] }, () => {
            this.getClinics()
        })
    }
    renderFooter = ()=>{
        if(this.state.next){
            return(
                <ActivityIndicator size={"large"} color={themeColor}/>
            )
        }else{
            return null
        }
    }
    loadMore =()=>{
        if(this.state.next){
            this.setState({offset:this.state.offset+10},()=>{
                this.getClinics()
            })
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
                              onPress={()=>{this.props.navigation.goBack()}}
                            >
                                  <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                            </TouchableOpacity>
                            <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
                                <Text style={[styles.text, { color: '#fff', fontWeight: 'bold',fontSize:18 }]}>Diagnosis Center</Text>
                            </View>
                       <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                              onPress={()=>{this.setState({search:true})}}
                            >
                                <Ionicons name="ios-search" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View> : <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
                            <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}
                                onPress={() => { this.setState({ search: false }) ;}}
                            >
                                <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                            </TouchableOpacity>
                            <View style={{ flex: 0.8 }}>
                                <TextInput
                                    
                                     style={{ height: 35, width: width * 0.7, backgroundColor: "#fff", borderRadius: 10, paddingLeft: 20 }}
                                    placeholder="search"
                                    onChangeText={(text) => { this.searchClincs(text) }}
                                />
                            </View>
                        </View>}
                        {/* CHATS */}
                        <FlatList
                            onEndReached={()=>{this.loadMore()}}
                            onEndReachedThreshold={0.1}
                            ListFooterComponent ={this.renderFooter()}
                            onRefresh ={()=>{this.refresh()}}
                            refreshing ={this.state.refreshing}
                            data={this.state.clinics}

                            keyExtractor={(item, index) => index.toString()}

                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity style={{ height: height * 0.1, backgroundColor: "#fafafa", marginTop: 1, flexDirection: 'row' }}
                                        onPress={() => { this.props.navigation.navigate('ViewDiagnosticCenter',{item}) }}
                                    >
                                        <View style={{ flex: 0.3, alignItems: "center", justifyContent: "center" }}>
                                            <LinearGradient
                                                style={{ height: 50, width: 50, borderRadius: 25, alignItems: "center", justifyContent: "center" }}
                                                colors={["#333", themeColor, themeColor]}
                                            >
                                                <View >
                                                    <Text style={[styles.text, { color: "#ffff", fontWeight: "bold", fontSize: 22 }]}>{this.getFirstLetter(item.companyName)}</Text>
                                                </View>
                                            </LinearGradient>
                                        </View>
                                        <View style={{ flex: 0.5, }}>
                                            <View style={{ flex: 0.4, justifyContent: "center" }}>
                                                <Text style={[styles.text, { fontWeight: 'bold', fontSize: 16 }]}>{item.companyName}</Text>
                                            </View>
                                            <View style={{ flex: 0.6, }}>
                                                <Text style={[styles.text]}>{item.city}</Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity style={{flex:0.2,alignItems:"center",justifyContent:"center"}}
                                            onPress={() => { this.setState({ selectedClinic: item, showModal: true, selectedClinicIndex:index})}}
                                        
                                        >
                                            <MaterialCommunityIcons name="delete-empty" size={24} color="black" />
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                )
                            }}
                        />
                        <Modal
                            statusBarTranslucent={true}
                            deviceHeight={screenHeight}
                            animationIn="slideInUp"
                            animationOut="slideOutDown"
                            isVisible={this.state.showModal}
                            onBackdropPress={() => { this.setState({ showModal: false }) }}
                        >
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <View style={{ height: height * 0.3, width: width * 0.9, backgroundColor: "#fff", borderRadius: 20, alignItems: "center", justifyContent: "space-around" }}>
                                    <View>
                                        <Text style={[styles.text, { fontWeight: "bold", color: themeColor, fontSize: 20 }]}>Are you want to Delete?</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "space-around", width, }}>
                                        <TouchableOpacity style={{ backgroundColor: themeColor, height: height * 0.05, width: width * 0.2, alignItems: "center", justifyContent: 'center', borderRadius: 10 }}
                                            onPress={() => { this.deleteClinic() }}
                                        >
                                            <Text style={[styles.text, { color: "#fff" }]}>Yes</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ backgroundColor: themeColor, height: height * 0.05, width: width * 0.2, alignItems: "center", justifyContent: "center", borderRadius: 10 }}
                                            onPress={() => { this.setState({ showModal: false }) }}
                                        >
                                            <Text style={[styles.text, { color: "#fff" }]}>No</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </View>
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
                                onPress={() => { this.props.navigation.navigate('CreateDiagnosticCenter') }}
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