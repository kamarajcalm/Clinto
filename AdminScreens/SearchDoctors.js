import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, SafeAreaView } from 'react-native';
import { Ionicons, Entypo, AntDesign } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import settings from '../AppSettings';
import medicine from '../components/Medicine';
import Medicine from '../components/Medicine';
const { height, width } = Dimensions.get("window");
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const url = settings.url;
import HttpsClient from '../api/HttpsClient';
class SearchDoctors extends Component {
    constructor(props) {
        let clinic = props?.route?.params?.addDoctor
        console.log(clinic)
        super(props);
        this.state = {
            doctors:[],
            clinic
        };
    }
    searchDoctor = async (query) => {
        let api = `${url}/api/profile/userss/?search=${query}&role=Doctor`
        let data = await HttpsClient.get(api)
     
        if (data.type == "success"){
            this.setState({ doctors: data.data })
        } 
    }
    componentDidMount(){
       
    }
    handleDoctor =async(item)=>{
        console.log(this.state.clinic)
        if(this.state.clinic){
          

        }else{
            this.props.route.params.backFunction(item)
            this.props.navigation.goBack()
        }
       
    }
    render() {
        return (
              <>
            <View style={{ flex: 1 ,}}>
                <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
                    <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                        onPress={() => { this.props.navigation.goBack() }}
                    >
                        <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                    </TouchableOpacity>
                    <View style={{ flex: 0.7, alignItems: "center", justifyContent: "center" }}>
                        <TextInput
                            autoFocus={true}
                            selectionColor={themeColor}
                            style={{ height: "45%", backgroundColor: "#fafafa", borderRadius: 15, padding: 10, marginTop: 10, width: "100%" }}
                            placeholder="search Doctors"
                          onChangeText={(text) => { this.searchDoctor(text) }}
                        />
                    </View>

                </View>
                    <FlatList


                        data={this.state.doctors}

                        keyExtractor={(item, index) => index.toString()}

                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity style={{ height: height * 0.1, backgroundColor: "#fafafa", marginTop: 1, flexDirection: 'row' }}
                                    onPress={() => {

                                        this.handleDoctor(item)
                                      }}
                                >
                                    <View style={{ flex: 0.3, alignItems: "center", justifyContent: "center" }}>
                                        <Image
                                            source={{ uri: item.displayPicture || "https://s3-ap-southeast-1.amazonaws.com/practo-fabric/practices/711061/lotus-multi-speciality-health-care-bangalore-5edf8fe3ef253.jpeg" }}
                                            style={{ height: 60, width: 60, borderRadius: 30, }}
                                        />
                                    </View>
                                    <View style={{ flex: 0.7, justifyContent: "center" }}>
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

    }
}
export default connect(mapStateToProps, { selectTheme })(SearchDoctors);