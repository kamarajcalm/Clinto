import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons, Entypo, AntDesign } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import settings from '../AppSettings';
import medicine from '../components/Medicine';
import Medicine from '../components/Medicine';
import HttpsClient from '../api/HttpsClient';
const { height, width } = Dimensions.get("window");
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const url = settings.url;

class Editclinic extends Component {
    constructor(props) {
        let item =this.props.route.params.item
        super(props);
        this.state = {
            item
        };
    }
componentDidMount(){
    console.log(item,"hjhhg")
}

    render() {
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                    <StatusBar backgroundColor={themeColor} barStyle={"default"} />

                        {/* HEADERS */}
                    
                    <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
                        <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                            onPress={() => { this.props.navigation.goBack() }}
                        >
                            <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                        </TouchableOpacity>
                        <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
                            <Text style={[styles.text, { color: '#fff', fontWeight: 'bold', fontSize: 18 }]}>Edit Detail</Text>
                        </View>
                        <TouchableOpacity style={{ flex: 0.2, flexDirection: "row", alignItems: "center", justifyContent: 'center' }}

                        >

                        </TouchableOpacity>
                    </View>
                            {/* CONTENTS */}
                    <View style={{ flex: 1, backgroundColor: "red" }}>
                        <Text style={[styles.text, { color: "#0000" }]}>displayPicture</Text>
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
export default connect(mapStateToProps, { selectTheme })(Editclinic);