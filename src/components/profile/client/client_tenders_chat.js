import React, { Component } from 'react';
import Svg, {Path, Rect, Circle, Defs, Stop, ClipPath, G, Mask} from "react-native-svg";
import { StatusBar } from 'expo-status-bar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {AuthContext} from "../../AuthContext/context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {APP_URL} from '../../../../env'


import {
    Text,
    Alert,
    Button,
    View,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    Image,
    TextInput,
    ActivityIndicator,
    ImageBackground,
    ScrollView,
    Dimensions,
    FlatList, Keyboard
} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;



import {
    SafeAreaView,
    SafeAreaProvider,
    SafeAreaInsetsContext,
    useSafeAreaInsets,
    initialWindowMetrics,
} from 'react-native-safe-area-context';
import moment from "moment";




export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchInput: '',

            chatHistory: [
                {
                    id: 1,
                    img: require('../../../assets/images/chat_img1.png'),
                    chat_member_name: 'Техподдержка',
                    chat_member_message: 'Хорошо',
                    chat_notification: '1',
                    chat_send_hour: '01.08',

                },
                {
                    id: 2,
                    img: require('../../../assets/images/chat_img1.png'),
                    chat_member_name: 'Алексей Смирнов',
                    chat_member_message: 'Договорились!',
                    chat_notification: '2',
                    chat_send_hour: '01.08',

                },
                {
                    id: 3,
                    img: require('../../../assets/images/chat_img1.png'),
                    chat_member_name: 'Алексей Смирнов',
                    chat_member_message: 'Договорились!',
                    chat_notification: '4',
                    chat_send_hour: '02.00',

                },
                {
                    id: 4,
                    img: require('../../../assets/images/chat_img1.png'),
                    chat_member_name: 'Алексей Смирнов',
                    chat_member_message: 'Договорились!',
                    chat_notification: '3',
                    chat_send_hour: '03.00',

                },
                {
                    id: 5,
                    img: require('../../../assets/images/chat_img1.png'),
                    chat_member_name: 'Алексей Смирнов',
                    chat_member_message: 'Договорились!',
                    chat_notification: '2',
                    chat_send_hour: '04.00',

                },
                {
                    id: 6,
                    img: require('../../../assets/images/chat_img1.png'),
                    chat_member_name: 'Алексей Смирнов',
                    chat_member_message: 'Договорились!',
                    chat_notification: '3',
                    chat_send_hour: '04.00',

                },
                {
                    id: 7,
                    img: require('../../../assets/images/chat_img1.png'),
                    chat_member_name: 'Алексей Смирнов',
                    chat_member_message: 'Договорились!',
                    chat_notification: '2',
                    chat_send_hour: '06.00',

                },
                {
                    id: 8,
                    img: require('../../../assets/images/chat_img1.png'),
                    chat_member_name: 'Алексей Смирнов',
                    chat_member_message: 'Договорились!',
                    chat_notification: '2',
                    chat_send_hour: '07.00',

                },
            ],
            client_users_list_chat: false,
            client_tenders_chat: true,

            userschatdata: [],

            image_path: 'https://admin.stechapp.ru/uploads/',
            user_name: '',

            searchResult: [],

            keyboardOpen: false,
            loaded_chat: false,
            count_notification: '',
            count_message: '',

        };

    }

    static contextType = AuthContext;

    componentDidMount() {

        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide,
        );

        const { navigation } = this.props;
        // this.getTendersChat();
        //   this.updateMessages();
        this.focusListener = navigation.addListener("focus", () => {
            this.getTendersChat();
            this.getNotificationsCount()
            this.chat_tender_interval =  setInterval(() => {
                this.getTendersChat();

            }, 3000)
        });



        // AsyncStorage.clear();
    }
    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();

        // clearInterval(this.interval)
        if (this.focusListener) {
            this.focusListener();
        }
        clearInterval(this.chat_tender_interval)
    }


    updateMessages = async () => {
        this.interval =  setInterval(() => (
            this.getTendersChat()
        ), 3000);
    }



    loadPageFunction = async () => {
        await this.getTendersChat();
        await this.updateMessages();
    }


    _keyboardDidShow =(event) => {
        this.setState({
            keyboardOpen: true,
        })
    }

    _keyboardDidHide = (event) => {
        this.setState({
            keyboardOpen: false,
        })
    }


    redirectToSignUp = () => {
        this.props.navigation.navigate("SignUp");

    }


    redirectToClientPersonalArea = () => {
        this.props.navigation.navigate("PersonalArea");

    }
    redirectToClientCatalogueMainPage = () => {
        this.props.navigation.navigate("ClientCatalogueMainPage");

    }

    redirectToClientTenderChatSinglePage = (tenders_data) => {
        let receiver_id = tenders_data.receiver_id;
        let tender_id = tenders_data.tender_id;
        let user_name = tenders_data.user_name;
        let user_image = tenders_data.user_image;


        this.props.navigation.navigate("ClientTenderChatSinglePage", {
            params1: receiver_id,
            params2: tender_id,
            params3: user_name,
            params4: user_image,
        });

    }

    redirectToClientNotifications = () => {
        this.props.navigation.navigate("ClientNotifications");
    }

    redirectToClientUsersChat = async () => {
        clearInterval(this.chat_tender_interval)
        this.props.navigation.navigate("ClientChat");
    }


    getTendersChat = async () => {
        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;
       await this.setState({
            loaded_chat: true
        })
        try {
            fetch(`${APP_URL}/getTendersChat`, {
                method: 'POST',
                headers: {
                    'Authorization': AuthStr,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },

            }).then((response) => {
                return response.json()
            }).then(async (response) => {


                await this.setState({
                    loaded_chat: false
                })

                if (response.success === true) {
                    this.setState({
                        userschatdata: response.userschatdata,
                    })
                    let sortedData = this.state.userschatdata.sort((a, b) => a.tender_data > b.tender_data ? -1 : 1)
                    this.setState({
                        userschatdata: sortedData
                    })

                }








            })
        } catch (e) {
        }
    }

    changeSeachInput = async (val) => {
        await this.setState({searchInput: val});
        this.searchChat();
    }

    getTime =  (date) => {
        let date_info = moment(date).format("DD.MM.YY")
        return date_info;
    }


    searchChat = async () => {

        let {searchInput, userschatdata} = this.state;

        if (searchInput.length == 0) {
            return false;
        } else {
            let searchChat = [];
            for (const userChatDataItem of userschatdata) {
                if (userChatDataItem.user_name.search(searchInput) !== -1 || userChatDataItem.tender_name.search(searchInput) !== -1) {
                    searchChat.push(userChatDataItem);

                }
            }

            await this.setState({
                searchResult: searchChat,
            })
            let sortedData = this.state.searchResult.sort((a, b) => a.tender_data > b.tender_data ? -1 : 1)

            this.setState({
                searchResult: sortedData
            })

        }

    }


    getNotificationsCount = async () => {
        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;


        try {
            fetch(`${APP_URL}/GetNotificationCount`, {
                method: 'GET',
                headers: {
                    'Authorization': AuthStr,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },

            }).then((response) => {
                return response.json()
            }).then( async (response) => {

                console.log(response, 'notiCount')
                if (response?.status === true) {
                    this.setState({
                        count_notification: response.count_notification,
                        count_message: response.count_message,
                    })
                }

            })
        } catch (e) {
        }
    }


    render() {

        return (
            <SafeAreaView  edges={['right', 'left', 'top']} style={styles.container} >
                <StatusBar style="dark" />



                <View style={{ overflow: 'hidden', paddingBottom: 5, width: '100%' }}>
                    <View
                        style={{
                            backgroundColor: '#fff',
                            width: '100%',
                            // width: 300,
                            // height: 60,
                            shadowColor: '#000',
                            shadowOffset: { width: 1, height: 1 },
                            shadowOpacity:  0.4,
                            shadowRadius: 3,
                            elevation: 5,
                            borderBottomLeftRadius: 20,
                            borderBottomRightRadius: 20,
                            borderTopLeftRadius: 0,
                            borderTopRightRadius: 0,
                        }}
                    >
                        <View style={styles.client_chat_header}>

                            <Text style={styles.client_chat_title}>Сообщения</Text>

                            <View style={styles.client_chat_search_input_button_main_wrapper}>
                                <TextInput
                                    style={[styles.client_chat_search_input_field,]}
                                    onChangeText={(val) => this.changeSeachInput(val)}
                                    value={this.state.searchInput}
                                    placeholder='Поиск...'
                                />
                                {/*<TouchableOpacity style={styles.client_chat_search_input_btn} onPress={() => {this.searchChat()}}>*/}
                                {/*    <Svg*/}
                                {/*        width={40}*/}
                                {/*        height={40}*/}
                                {/*        viewBox="0 0 40 40"*/}
                                {/*        fill="none"*/}
                                {/*        xmlns="http://www.w3.org/2000/svg"*/}
                                {/*    >*/}
                                {/*        <Rect width={40} height={40} rx={10} fill="#fff" />*/}
                                {/*        <Path*/}
                                {/*            d="M19.417 26.75c1.849 0 3.644-.62 5.1-1.758l4.58 4.579 1.473-1.473-4.58-4.58a8.284 8.284 0 001.76-5.101c0-4.595-3.738-8.334-8.333-8.334-4.595 0-8.334 3.739-8.334 8.334s3.739 8.333 8.334 8.333zm0-14.583a6.256 6.256 0 016.25 6.25 6.256 6.256 0 01-6.25 6.25 6.256 6.256 0 01-6.25-6.25 6.256 6.256 0 016.25-6.25z"*/}
                                {/*            fill="#333"*/}
                                {/*        />*/}
                                {/*    </Svg>*/}
                                {/*</TouchableOpacity>*/}
                            </View>
                            <View style={styles.client_chat_buttons_wrapper}>
                                <TouchableOpacity style={[styles.client_chat_button,]} onPress={() => {this.redirectToClientUsersChat()}}>
                                    <Text style={styles.client_chat_button_text}>Список</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.client_chat_button, {backgroundColor: '#F0F0F0',}  ]}>
                                    <Text style={styles.client_chat_button_text}>Тендеры</Text>
                                </TouchableOpacity>
                            </View>


                        </View>

                    </View>
                </View>


                <ScrollView
                    style={styles.client_chat_items_main_wrapper}
                    // enableOnAndroid={true}
                    // enableAutomaticScroll={(Platform.OS === 'ios')}
                >


                    {this.state.searchInput.length > 0
                        ?
                        <View style={styles.chat_lists_main_wrapper}>

                            {this.state.searchResult.length > 0

                                ?

                                <View style={styles.search_items_main_wrapper}>
                                    {this.state.searchResult.map((search_item, index) => {

                                        return (

                                            <TouchableOpacity key={index}
                                                              style={styles.client_chat_item}
                                                              onPress={() => {
                                                                  this.redirectToClientTenderChatSinglePage(search_item)
                                                              }}
                                            >

                                                <View style={styles.client_chat_item_img_info_wrapper}>
                                                    <View style={styles.client_chat_item_img}>
                                                        <Image style={styles.client_chat_item_img_child}
                                                               source={{uri: this.state.image_path + search_item.user_image}}/>

                                                    </View>
                                                    <View style={styles.client_chat_item_info_box}>
                                                        <Text
                                                            style={styles.client_chat_item_info1}>{search_item.user_name}</Text>
                                                        <Text
                                                            style={styles.client_chat_item_info3}>{search_item.tender_name}</Text>
                                                        <Text
                                                            style={styles.client_chat_item_info2} numberOfLines={3}>{search_item.messages}</Text>
                                                    </View>
                                                </View>
                                                <View
                                                    style={styles.client_chat_item_notification_hour_info_wrapper}>
                                                    {search_item.review > 0 &&
                                                    <View style={styles.client_chat_item_notification_box}>
                                                        <Text
                                                            style={styles.client_chat_item_notification_info}>{search_item.review}</Text>
                                                    </View>
                                                    }

                                                    <Text
                                                        style={styles.client_chat_item_hour_info}>{this.getTime(search_item.tender_data)}</Text>
                                                </View>
                                            </TouchableOpacity>


                                        );
                                    })}
                                </View>

                                :

                                <Text style={styles.not_found_text}>Ничего не найдено</Text>
                            }

                        </View>
                        :
                        <View>
                            {this.state.userschatdata.length > 0 ?
                                <View style={styles.chat_lists_main_wrapper}>
                                    {this.state.userschatdata.map((chat_item, index) => {

                                        return (
                                            <TouchableOpacity key={index}
                                                              style={styles.client_chat_item}
                                                              onPress={() => {
                                                                  this.redirectToClientTenderChatSinglePage(chat_item)
                                                              }}
                                            >

                                                <View style={styles.client_chat_item_img_info_wrapper}>
                                                    <View style={styles.client_chat_item_img}>
                                                        <Image style={styles.client_chat_item_img_child}
                                                               source={{uri: this.state.image_path + chat_item.user_image}}/>

                                                    </View>
                                                    <View style={styles.client_chat_item_info_box}>
                                                        <Text
                                                            style={styles.client_chat_item_info1}>{chat_item.user_name}</Text>
                                                        <Text
                                                            style={styles.client_chat_item_info3}>{chat_item.tender_name}</Text>
                                                        <Text
                                                            style={styles.client_chat_item_info2} numberOfLines={3}>{chat_item.messages}</Text>
                                                    </View>
                                                </View>
                                                <View
                                                    style={styles.client_chat_item_notification_hour_info_wrapper}>
                                                    {chat_item.review > 0 &&
                                                    <View style={styles.client_chat_item_notification_box}>
                                                        <Text
                                                            style={styles.client_chat_item_notification_info}>{chat_item.review}</Text>
                                                    </View>
                                                    }


                                                    <Text
                                                        style={styles.client_chat_item_hour_info}>{this.getTime(chat_item.tender_data)}</Text>
                                                </View>
                                            </TouchableOpacity>


                                        );
                                    })}
                                </View>
                                :
                                <View style={{width: '100%', paddingTop: 50}}>
                                    <Text style={{
                                        textAlign: 'center',
                                        fontSize: 18,
                                        fontWeight: '500',
                                        color: '#333333',
                                    }}>Активных тендеров нет</Text>
                                </View>
                            }
                        </View>


                    }


                </ScrollView>

                {/*{this.state.userschatdata.length > 0 ?*/}


                {/*    :*/}
                {/*    <View style={{*/}
                {/*        width: '100%',*/}
                {/*        height: '100%'*/}
                {/*    }}>*/}
                {/*        {this.state.loaded_chat &&*/}
                {/*        <View style={{*/}
                {/*            backgroundColor: '#ffffff',*/}
                {/*            // justifyContent: 'center',*/}
                {/*            // alignItems: 'center',*/}
                {/*            alignSelf: 'center',*/}
                {/*            width: '100%',*/}
                {/*            flex: 1,*/}
                {/*            paddingTop: 300,*/}
                {/*        }}>*/}

                {/*            <ActivityIndicator size="large" color="#FF6600"/>*/}

                {/*        </View>*/}

                {/*        }*/}

                {/*    </View>*/}

                {/*}*/}
                {this.state.keyboardOpen === false &&
                 <View style={[styles.footer, {position: 'relative'}]}>
                    <TouchableOpacity style={styles.footer_btn} onPress={() => {
                        this.redirectToClientNotifications()
                    }}>
                        {this.state.count_notification != '' &&
                        <View style={styles.notification_count_box}>
                            <Text style={styles.notification_count_text}>{this.state.count_notification}</Text>
                        </View>
                        }
                        <Svg width={35} height={38} viewBox="0 0 35 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <G clipPath="url(#clip0_486_3554)" fill="#fff">
                                <Path
                                    d="M31.67 25.514a13.877 13.877 0 01-2.444-2.813 12 12 0 01-1.313-4.618v-4.742a10.298 10.298 0 00-2.615-6.874 10.564 10.564 0 00-6.572-3.447V1.782c0-.34-.137-.666-.38-.907a1.308 1.308 0 00-1.838 0c-.243.24-.38.567-.38.907v1.257A10.561 10.561 0 009.63 6.51a10.297 10.297 0 00-2.582 6.83v4.743a12.002 12.002 0 01-1.313 4.618 13.872 13.872 0 01-2.404 2.813.961.961 0 00-.331.72v1.306c0 .255.103.499.285.679a.98.98 0 00.688.281h27.054a.98.98 0 00.688-.281.953.953 0 00.285-.68v-1.305a.95.95 0 00-.33-.72zM5.023 26.58A15.568 15.568 0 007.4 23.7a13.532 13.532 0 001.605-5.617v-4.742a8.29 8.29 0 01.563-3.297 8.377 8.377 0 011.823-2.82 8.51 8.51 0 012.794-1.892 8.605 8.605 0 016.642 0c1.05.44 2 1.083 2.794 1.893a8.377 8.377 0 011.823 2.819c.41 1.05.601 2.172.562 3.297v4.742a13.53 13.53 0 001.606 5.617 15.562 15.562 0 002.375 2.88H5.024zM17.547 32.5c.6-.02 1.174-.331 1.623-.88.449-.549.743-1.3.83-2.12h-5c.09.842.398 1.611.866 2.163.469.552 1.066.849 1.681.837z"/>
                            </G>
                            <Defs>
                                <ClipPath id="clip0_486_3554">
                                    <Path fill="#fff" transform="translate(0 .5)" d="M0 0H35V35H0z"/>
                                </ClipPath>
                            </Defs>
                        </Svg>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.footer_btn, {position: 'relative'}]}>
                        {this.state.count_message != '' &&
                        <View style={styles.notification_count_box}>
                            <Text style={styles.notification_count_text}>{this.state.count_message}</Text>
                        </View>
                        }
                        <Svg width={35} height={38} viewBox="0 0 35 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <Path
                                d="M9.15 10.706h16.556M9.15 15.297h11.474M9.149 19.888h6.39M29.57 4.5H5.431c-.38.001-.743.155-1.011.429-.269.273-.42.644-.421 1.03V31.5l5.31-5.414h20.258c.38-.001.743-.155 1.011-.429.269-.273.42-.644.421-1.03V5.959a1.478 1.478 0 00-.42-1.03 1.423 1.423 0 00-1.012-.429v0z"
                                stroke="#FF6600" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                        </Svg>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.footer_btn, {position: 'relative', }]} onPress={() => {
                        this.redirectToClientCatalogueMainPage()
                    }}>
                        <Svg width={41} height={38} viewBox="0 0 41 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <Path
                                d="M35 28.535l-4.857-4.855a8.314 8.314 0 10-1.464 1.465L33.536 30 35 28.535zm-11.393-3.714a6.214 6.214 0 116.214-6.214 6.221 6.221 0 01-6.214 6.214zM6 11.357h8.286v2.072H6v-2.072zM6 1h16.571v2.071H6V1zm0 5.179h16.571V8.25H6V6.179z"
                                fill="#ffffff"/>
                        </Svg>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.footer_btn, {position: 'relative',}]}
                                      onPress={() => this.redirectToClientPersonalArea()}>
                        <Svg width={38} height={38} viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <Path
                                d="M19.1 36c-9.4 0-17-7.6-17-17s7.6-17 17-17 17 7.6 17 17-7.7 17-17 17zm0-32c-8.3 0-15 6.7-15 15s6.7 15 15 15 15-6.7 15-15-6.8-15-15-15z"
                                fill="#ffffff"/>
                            <Path
                                d="M9.3 31.3l-1.8-.8c.5-1.2 2.1-1.9 3.8-2.7 1.7-.8 3.8-1.7 3.8-2.8v-1.5c-.6-.5-1.6-1.6-1.8-3.2-.5-.5-1.3-1.4-1.3-2.6 0-.7.3-1.3.5-1.7-.2-.8-.4-2.3-.4-3.5 0-3.9 2.7-6.5 7-6.5 1.2 0 2.7.3 3.5 1.2 1.9.4 3.5 2.6 3.5 5.3 0 1.7-.3 3.1-.5 3.8.2.3.4.8.4 1.4 0 1.3-.7 2.2-1.3 2.6-.2 1.6-1.1 2.6-1.7 3.1V25c0 .9 1.8 1.6 3.4 2.2 1.9.7 3.9 1.5 4.6 3.1l-1.9.7c-.3-.8-1.9-1.4-3.4-1.9-2.2-.8-4.7-1.7-4.7-4v-2.6l.5-.3s1.2-.8 1.2-2.4v-.7l.6-.3c.1 0 .6-.3.6-1.1 0-.2-.2-.5-.3-.6l-.4-.4.2-.5s.5-1.6.5-3.6c0-1.9-1.1-3.3-2-3.3h-.6l-.3-.5c0-.4-.7-.8-1.9-.8-3.1 0-5 1.7-5 4.5 0 1.3.5 3.5.5 3.5l.1.5-.4.5c-.1 0-.3.3-.3.7 0 .5.6 1.1.9 1.3l.4.3v.5c0 1.5 1.3 2.3 1.3 2.4l.5.3v2.6c0 2.4-2.6 3.6-5 4.6-1.1.4-2.6 1.1-2.8 1.6z"
                                fill="#ffffff"/>
                        </Svg>
                    </TouchableOpacity>
                </View>
                }

            </SafeAreaView>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        width: "100%",
        height: "100%"
    },

    footer: {
        backgroundColor: '#535353',
        shadowColor: "#00000040",
        shadowOffset: {
            width: 0,
            height: -1,
        },
        shadowOpacity: 24,
        shadowRadius:1,

        elevation: 5,
        borderRadius: 20,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: 90,
        paddingHorizontal: 53,
        paddingVertical: 30,
    },
    client_chat_header: {
        width: '100%',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: '#ffffff',
        paddingTop: 25,
        paddingBottom: 13,
        paddingHorizontal: 20,

    },
    client_chat_items_main_wrapper: {
        width: '100%',
        flex: 1,
        height: '100%',
        paddingBottom: 20,
        marginBottom: 5,
        paddingTop: 10
    },
    client_chat_title: {
        fontWeight:'700',
        fontSize: 22,
        color: '#333333',
        textAlign: 'center',
        marginBottom: 11,
    },
    client_chat_search_input_button_main_wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 10,
        backgroundColor: '#F0F0F0',
        paddingLeft: 15,
        paddingRight: 5,
        marginBottom: 11,
    },
    client_chat_search_input_field: {
        width: '100%',
        fontWeight: '400',
        fontSize: 15,
        color: '#878787',
        paddingVertical: 5,
    },
    client_chat_item: {
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',

    },
    client_chat_item_img_info_wrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    client_chat_item_img: {
        width: 58,
        height: 58,
        marginRight: 11,
    },
    client_chat_item_img_child: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
        overflow: 'hidden',
        resizeMode: 'cover',
    },
    client_chat_item_info1: {
        fontWeight: '500',
        fontSize: 16,
        color: '#000000',
        marginBottom: 4

    },
    client_chat_item_info2: {
        color: '#8E8E93',
        fontWeight: '300',
        fontSize: 15,
        flex: 1,
        width: '100%',
        maxWidth: 250,
    },
    client_chat_item_info3: {
        color: '#000000',
        fontWeight: '400',
        fontSize: 14,
    },
    client_chat_item_hour_info: {
        color: '#8E8E93',
        fontWeight: '400',
        fontSize: 12,
    },
    client_chat_item_notification_hour_info_wrapper: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        position: 'absolute',
        right: 10,
        zIndex: 99,
    },
    client_chat_item_notification_box: {
        backgroundColor: '#FF6600',
        borderRadius: 10,
        width: 28,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    client_chat_item_notification_info: {
        color: '#ffffff',
        fontWeight: '400',
        fontSize: 14,
    },

    client_chat_buttons_wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    client_chat_button: {
        borderWidth: 2,
        borderColor: '#F0F0F0',
        borderRadius: 10,
        backgroundColor: '#ffffff',
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        width: '48.5%',
    },
    activeBackground: {
        backgroundColor: '#F0F0F0',
    },

    client_chat_button_text: {
        fontSize: 15,
        fontWeight: '500',
        color: '#333333',
    },
    not_found_text: {
        fontWeight: '500',
        color: '#333333',
        fontSize: 20,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 50
    },
    notification_count_box: {
        backgroundColor: '#FF6600',
        width: 14,
        height: 14,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        position:'absolute',
        right: -1,
        zIndex: 999

    },
    notification_count_text: {
        fontWeight: '700',
        fontSize: 9,
        color: '#ffffff',
        // position: 'absolute',
        // zIndex: 9,
        // top: -1
    },
    footer_btn: {
        height: 38,
    }
});
