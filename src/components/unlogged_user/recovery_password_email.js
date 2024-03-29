import React, { Component } from 'react';
import Svg, {Path, Rect, Circle, Defs, Stop, ClipPath, G, Mask} from "react-native-svg";
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {APP_URL} from '../../../env'
import { StatusBar } from 'expo-status-bar';


import {
    Text,
    Alert,
    Button,
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    ActivityIndicator,
    ImageBackground,
    ScrollView, Dimensions,
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
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";



export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            phone: '',
            phone_error: false,
            phone_error_text: '',


            code1: '',
            code1_field_error: false,
            code1_field_valid: false,

            code2: '',
            code2_field_error: false,
            code2_field_valid: false,

            code3: '',
            code3_field_error: false,
            code3_field_valid: false,

            code4: '',
            code4_field_error: false,
            code4_field_valid: false,

            code_main_error:false,
            code_main_error_text: '',
            new_code_sent: false,

            recovery_password_phone_code_popup: false,

            newPassword: "",
            newPassword_error: false,
            newPassword_error_text: '',
            repeatPassword: "",
            repeatPassword_error: false,
            repeatPassword_error_text: '',
            successPasswordPopup: false,

            new_password_popup: false,

            phone_code_error: false,
            phone_code_error_text: '',

            code_send_text: '',
            code_send: false,

            confirm_password_security: true,
            password_security: true,

        };


    }

    openSuccessPopup = () => {
        this.setState({
            successPasswordPopup: true,
        })
    }

    redirectCloseFunction = () => {
        this.setState({
            successPasswordPopup: false,
        })
        this.props.navigation.navigate("SignIn");
    }

    redirectToSignIn = () => {
        this.props.navigation.navigate("SignIn");


    }

    sendCode =  () => {
        let {phone} = this.state;

        if (phone.length == 0) {
            this.setState({
                phone_error: true,
                phone_error_text: 'Поле является обязатFельным.',
            })
            return false;
        } else {
            this.setState({
                phone_error: false,
                phone_error_text: '',
            })

            try {
                fetch(`${APP_URL}/sendcodeforgotpassword`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        phone: phone
                    })

                }).then((response) => {
                    return response.json()
                }).then((response) => {


                    if (response.status === true) {
                        this.setState({
                            recovery_password_phone_code_popup: true,
                        })
                    } else {
                        if (response.hasOwnProperty('message')) {
                            if (response.message == 'wrong phone') {
                                this.setState({
                                    phone_error: true,
                                    phone_error_text: 'Неверный номер телефона',
                                })
                            } else {
                                this.setState({
                                    phone_error: false,
                                    phone_error_text: '',
                                })
                            }
                        }

                    }





                })
            } catch (e) {
            }
        }
    }
    sendCodeAgain =  () => {
        let {phone} = this.state;


            try {
                fetch(`${APP_URL}/sendcodeforgotpassword`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        phone: phone
                    })

                }).then((response) => {
                    return response.json()
                }).then((response) => {


                    if (response.status === true) {
                        if (response.message.hasOwnProperty('code')) {
                            if (response.message.code == 'code sending yor phone') {
                                 this.setState({
                                     phone_error: false,
                                     phone_error_text: '',
                                     code_send: true,
                                     code_send_text: 'Код отправлен на ваш номер телефона',
                                     phone_code_error: false,
                                     phone_code_error_text: '',
                                 })
                            } else {
                                this.setState({
                                    code_send: false,
                                    code_send_text: '',
                                })
                            }
                        }
                    } else {
                        if (response.hasOwnProperty('message')) {
                            if (response.message.message == 'send 1 minute ago') {
                                this.setState({
                                    code_send: true,
                                    code_send_text: 'Код был отправлен минуту назад',
                                    phone_code_error: false,
                                    phone_code_error_text: '',

                                })
                            } else {
                                this.setState({
                                    code_send: false,
                                    code_send_text: ''
                                })
                            }
                        }

                    }





                })
            } catch (e) {
            }

    }

    getCode = () => {
        let codes = this.state.code1 + this.state.code2 + this.state.code3 + this.state.code4;
        return codes;
    }
    confirmCode =  () => {
        let {code1, code2, code3, code4, phone} = this.state;

        if (code1.length == 0 || code2.length == 0 || code3.length == 0 || code4.length == 0) {
            this.setState({
                phone_code_error: true,
                phone_code_error_text: 'Поле с кодом телефона обязательно.',
            })
        } else {
            this.setState({
                phone_code_error: false,
                phone_code_error_text: '',
            })


            try {
                fetch(`${APP_URL}/comparecoderesetpassword`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        phone: phone,
                        reset_password_code: this.getCode(),
                    })

                }).then((response) => {
                    return response.json()
                }).then((response) => {


                    if (response.status === true) {
                        this.setState({
                            recovery_password_phone_code_popup: false,
                            new_password_popup: true,
                        })
                    } else {
                        if (response.message.hasOwnProperty('message')) {
                            if (response.message.message == 'not exist veryfi code') {
                                this.setState({
                                    phone_code_error: true,
                                    phone_code_error_text: 'Неверный код',
                                    code_send: false,
                                    code_send_text: '',
                                })
                            } else {
                                this.setState({
                                    phone_code_error: false,
                                    phone_code_error_text: '',
                                })
                            }
                        }
                    }





                })
            } catch (e) {
            }
        }
    }
    setNewPassword =  () => {
        let {newPassword, repeatPassword, phone} = this.state;


        if (newPassword.length == 0 || repeatPassword.length == 0) {
            this.setState({
                newPassword_error: true,
                newPassword_error_text: 'Поле является обязательным.',
                repeatPassword_error: true,
                repeatPassword_error_text: 'Поле является обязательным.',
            })
        } else {
            this.setState({
                newPassword_error: false,
                newPassword_error_text: '',
                repeatPassword_error: false,
                repeatPassword_error_text: '',
            })


            try {
                fetch(`${APP_URL}/updatePasswordResetPassword`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        phone: phone,
                        reset_password_code: this.getCode(),
                        password: newPassword,
                        password_confirmation: repeatPassword,
                    })

                }).then((response) => {
                    return response.json()
                }).then((response) => {


                    if (response.status === true) {
                        this.setState({
                            new_password_popup: false,
                            successPasswordPopup: true,
                        })
                    } else {
                        if (response.hasOwnProperty('password')) {
                            let newPassword_error_text = '';

                            if (response.password[0] == 'The password confirmation does not match.') {
                                    newPassword_error_text = 'Пароли не совпадают.';

                            }
                            if (response.password[0] == 'The password must be at least 6 characters.') {
                                newPassword_error_text = 'Пароль должен быть не менее 6 символов.';

                            }


                            this.setState({
                                newPassword_error: true,
                                newPassword_error_text: newPassword_error_text,
                            })
                        } else {
                            this.setState({
                                newPassword_error: false,
                                newPassword_error_text: '',
                            })
                        }
                    }





                })
            } catch (e) {
            }
        }
    }

    changeFirstCodeInput =  (value) => {
        if (value.length < 2) {

            this.setState({
                code1:  value
            })

            if (value.length == 1) {
                this.setState({
                    code1_field_error: false,
                    code1_field_valid: true,
                })
                this.refs.secondInput.focus();
            } else {
                this.setState({
                    code1_field_error: false,
                    code1_field_valid: false,
                })
            }
        }
    }

    changeSecondCodeInput =  (value) => {
        if (value.length < 2) {

            this.setState({
                code2:  value
            })

            if (value.length == 1) {
                this.setState({
                    code2_field_error: false,
                    code2_field_valid: true,
                })
                this.refs.thirdInput.focus();
            }

            if (value.length == 0) {
                this.setState({
                    code2_field_error: false,
                    code2_field_valid: false,
                })
                this.refs.firstInput.focus();
            }
        }
    }

    changeThirdCodeInput =  (value) => {
        if (value.length < 2) {

            this.setState({
                code3:  value
            })

            if (value.length == 1) {
                this.setState({
                    code3_field_error: false,
                    code3_field_valid: true,
                })
                this.refs.fourthInput.focus();
            }

            if (value.length == 0) {
                this.setState({
                    code3_field_error: false,
                    code3_field_valid: false,
                })
                this.refs.secondInput.focus();
            }
        }
    }

    changeFourthCodeInput =  (value) => {
        if (value.length < 2) {

            this.setState({
                code4:  value
            })

            if (value.length == 1) {
                this.setState({
                    code4_field_error: false,
                    code4_field_valid: true,
                })
                // this.refs.fifthInput.focus();
            }

            if (value.length == 0) {
                this.setState({
                    code4_field_error: false,
                    code4_field_valid: false,
                })
                this.refs.thirdInput.focus();
            }
        }
    }



    render() {



        return (
            <SafeAreaView style={styles.container} >

                <StatusBar style="dark" />

                <View style={styles.recovery_account_header}>
                    <View style={styles.back_to_sign_in_btn_wrapper}>
                        <TouchableOpacity style={styles.back_sign_in_btn}  onPress={() => this.redirectToSignIn()}>
                            <Svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={35}
                                height={35}
                                viewBox="0 0 35 35"
                                fill="none"
                            >
                                <Path
                                    d="M20.169 27.708a1.458 1.458 0 01-1.138-.54l-7.043-8.75a1.458 1.458 0 010-1.851l7.291-8.75a1.46 1.46 0 112.246 1.866L15.006 17.5l6.3 7.817a1.458 1.458 0 01-1.137 2.391z"
                                    fill="#333"
                                />
                            </Svg>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.recovery_account_img_parent}>
                        <Svg
                            width={114}
                            height={28}
                            viewBox="0 0 114 28"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <G clipPath="url(#clip0_125_5568)">
                                <Path
                                    d="M.313 8.43c0-1.112.21-2.155.628-3.128a8.2 8.2 0 011.7-2.547 8.146 8.146 0 012.531-1.742A7.548 7.548 0 018.258.376h12.156v5.375H8.258a2.598 2.598 0 00-1.885.787 2.626 2.626 0 00-.554.842 2.695 2.695 0 00-.203 1.05c0 .374.067.73.203 1.067.135.324.32.611.554.861.246.237.53.425.85.562.32.137.665.206 1.035.206h5.302c1.096 0 2.125.212 3.085.637a7.627 7.627 0 012.531 1.723 7.743 7.743 0 011.7 2.566c.419.974.628 2.016.628 3.127 0 1.112-.21 2.154-.628 3.128a8.007 8.007 0 01-1.7 2.566 8.019 8.019 0 01-2.53 1.723c-.961.424-1.99.636-3.086.636H1.791v-5.375H13.56a2.598 2.598 0 001.866-.767c.246-.25.437-.537.573-.862.135-.325.203-.674.203-1.049 0-.374-.068-.724-.203-1.048a2.484 2.484 0 00-.573-.843 2.45 2.45 0 00-.831-.58 2.598 2.598 0 00-1.035-.207H8.258a7.547 7.547 0 01-3.086-.637 8.305 8.305 0 01-2.53-1.723 8.434 8.434 0 01-1.7-2.565 7.967 7.967 0 01-.629-3.147zM35.75 27.231h-5.284V5.752h-7.963V.375h21.191v5.375H35.75v21.481zm28.913 0h-18.16V.376h18.16v5.375H51.804v5.375h8.701v5.375h-8.701v5.356h12.858v5.375zm24.203-2.753a13.457 13.457 0 01-4.138 2.473c-1.528.574-3.11.861-4.749.861-1.256 0-2.47-.169-3.64-.506a13.808 13.808 0 01-3.27-1.386 14.4 14.4 0 01-4.933-5 14.822 14.822 0 01-1.385-3.315 14.098 14.098 0 01-.48-3.69c0-1.273.16-2.503.48-3.689a14.349 14.349 0 011.386-3.315 14.156 14.156 0 012.161-2.828 13.708 13.708 0 012.772-2.172 13.365 13.365 0 013.27-1.405 13.08 13.08 0 013.64-.506c1.637 0 3.22.288 4.748.862a12.985 12.985 0 014.138 2.472l-2.809 4.682a7.826 7.826 0 00-2.752-1.948 8.231 8.231 0 00-3.326-.692c-1.17 0-2.266.224-3.288.674a8.565 8.565 0 00-2.679 1.835 8.414 8.414 0 00-1.81 2.716 8.336 8.336 0 00-.666 3.315c0 1.173.222 2.278.665 3.315a8.753 8.753 0 001.811 2.696 8.565 8.565 0 002.679 1.836 8.077 8.077 0 003.288.674 8.427 8.427 0 003.326-.674 8.04 8.04 0 002.752-1.967l2.809 4.682zm8.388 2.753H91.95V.376h5.302v10.75h10.587V.376h5.302v26.856h-5.302v-10.73H97.252v10.73z"
                                    fill="#F60"
                                />
                            </G>
                            <Defs>
                                <ClipPath id="clip0_125_5568">
                                    <Path fill="#fff" d="M0 0H113.512V27.9995H0z" />
                                </ClipPath>
                            </Defs>
                        </Svg>
                    </View>
                    <Text style={styles.recovery_account_email_main_title}>Восстановление
                        пароля</Text>
                </View>

                <ScrollView style={styles.recovery_account_email_main_wrapper}>


                    <Text style={styles.recovery_account_email_second_title}>
                        Мы отправим 4-х значный код на ваш номер телефона
                        для подтверждения личности</Text>

                    <View style={styles.recovery_account_email_input_wrapper}>
                        <Text style={styles.recovery_account_email_input_title}>Номер телефона</Text>
                        <TextInput
                            style={styles.recovery_account_email_input_field}
                            onChangeText={(val) => this.setState({phone: val})}
                            value={this.state.phone}
                        />
                        {this.state.phone_error &&
                            <Text style={styles.error_text}>{this.state.phone_error_text}</Text>
                        }

                    </View>
                        <TouchableOpacity style={styles.recovery_account_email_send_code_btn} onPress={() => this.sendCode()}>
                            <Text style={styles.recovery_account_email_send_code_btn_text}>Отправить код</Text>
                        </TouchableOpacity>
                </ScrollView>





                {this.state.recovery_password_phone_code_popup &&
                  <View style={styles.recovery_password_phone_code_popup}>
                      <View style={styles.recovery_password_phone_code_popup_wrapper}>
                          <View style={styles.recovery_account_code_header}>
                              <View style={styles.back_to_recovery_email_btn_wrapper}>
                                  <TouchableOpacity style={styles.back_recovery_email_btn}  onPress={() => this.setState({recovery_password_phone_code_popup: false})}>
                                      <Svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width={35}
                                          height={35}
                                          viewBox="0 0 35 35"
                                          fill="none"

                                      >
                                          <Path
                                              d="M20.169 27.708a1.458 1.458 0 01-1.138-.54l-7.043-8.75a1.458 1.458 0 010-1.851l7.291-8.75a1.46 1.46 0 112.246 1.866L15.006 17.5l6.3 7.817a1.458 1.458 0 01-1.137 2.391z"
                                              fill="#000"
                                          />
                                      </Svg>
                                  </TouchableOpacity>
                              </View>
                              <Text style={styles.recovery_account_code_main_title}>Восстановление
                                  пароля</Text>
                          </View>
                          <ScrollView style={styles.recovery_account_code_main_wrapper}>


                              <Text style={styles.recovery_account_code_second_title}>
                                  Мы отправим  4-х значный код
                                  для подтверждения личности
                              </Text>




                              <View style={styles.recovery_account_code_inputs_wrapper}>
                                  <TextInput
                                      ref='firstInput'
                                      style={[styles.code_input_field,  {borderWidth: 1, borderColor:this.state.code1_field_error ? "#A4223C" :  "#F1F1F1"} ]}
                                      onChangeText={(value) => {this.changeFirstCodeInput(value)}}
                                      value={this.state.code1}
                                      placeholderTextColor="#000000"
                                      keyboardType="numeric"

                                  />
                                  <TextInput
                                      ref='secondInput'
                                      style={[styles.code_input_field,  {borderWidth: 1, borderColor:this.state.code2_field_error ? "#A4223C" :  "#F1F1F1"} ]}
                                      onChangeText={(value) => {this.changeSecondCodeInput(value)}}

                                      value={this.state.code2}
                                      keyboardType="numeric"
                                  />
                                  <TextInput
                                      ref='thirdInput'
                                      style={[styles.code_input_field,  {borderWidth: 1, borderColor:this.state.code3_field_error ? "#A4223C" :  "#F1F1F1"} ]}
                                      onChangeText={(value) => {this.changeThirdCodeInput(value)}}
                                      value={this.state.code3}
                                      keyboardType="numeric"
                                  />
                                  <TextInput
                                      ref='fourthInput'
                                      style={[styles.code_input_field,  {borderWidth: 1, borderColor:this.state.code4_field_error ? "#A4223C" :  "#F1F1F1"} ]}
                                      onChangeText={(value) => {this.changeFourthCodeInput(value)}}
                                      value={this.state.code4}
                                      keyboardType="numeric"
                                  />

                              </View>
                              <View style={styles.send_code_again_btn_wrapper}>
                                  <TouchableOpacity style={styles.send_code_again_btn} onPress={() => this.sendCodeAgain()}>
                                      <Text style={styles.send_code_again_btn_text}>Отправить код повторно</Text>
                                  </TouchableOpacity>

                                  {this.state.code_send &&
                                  <Text style={[styles.error_text, {textAlign: 'center'}]}>{this.state.code_send_text}</Text>
                                  }

                                  {this.state.phone_code_error &&

                                  <Text style={[styles.error_text, {textAlign: 'center'}]}>
                                      {this.state.phone_code_error_text}
                                  </Text>

                                  }
                              </View>



                              <View style={styles.recovery_account_confirm_code_btn_wrapper}>
                                  <TouchableOpacity style={styles.recovery_account_confirm_code_btn} onPress={() => this.confirmCode()}>
                                      <Text style={styles.recovery_account_confirm_code_btn_text}>Подтвердить</Text>
                                  </TouchableOpacity>
                              </View>
                          </ScrollView>
                      </View>
                  </View>
                }


                {this.state.new_password_popup &&
                    <View style={styles.new_password_popup}>
                        <View style={styles.new_password_popup_wrapper}>
                            <View style={styles.new_password_header}>
                                <View style={styles.new_password_img_parent}>
                                    <Svg
                                        width={114}
                                        height={28}
                                        viewBox="0 0 114 28"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <G clipPath="url(#clip0_125_5568)">
                                            <Path
                                                d="M.313 8.43c0-1.112.21-2.155.628-3.128a8.2 8.2 0 011.7-2.547 8.146 8.146 0 012.531-1.742A7.548 7.548 0 018.258.376h12.156v5.375H8.258a2.598 2.598 0 00-1.885.787 2.626 2.626 0 00-.554.842 2.695 2.695 0 00-.203 1.05c0 .374.067.73.203 1.067.135.324.32.611.554.861.246.237.53.425.85.562.32.137.665.206 1.035.206h5.302c1.096 0 2.125.212 3.085.637a7.627 7.627 0 012.531 1.723 7.743 7.743 0 011.7 2.566c.419.974.628 2.016.628 3.127 0 1.112-.21 2.154-.628 3.128a8.007 8.007 0 01-1.7 2.566 8.019 8.019 0 01-2.53 1.723c-.961.424-1.99.636-3.086.636H1.791v-5.375H13.56a2.598 2.598 0 001.866-.767c.246-.25.437-.537.573-.862.135-.325.203-.674.203-1.049 0-.374-.068-.724-.203-1.048a2.484 2.484 0 00-.573-.843 2.45 2.45 0 00-.831-.58 2.598 2.598 0 00-1.035-.207H8.258a7.547 7.547 0 01-3.086-.637 8.305 8.305 0 01-2.53-1.723 8.434 8.434 0 01-1.7-2.565 7.967 7.967 0 01-.629-3.147zM35.75 27.231h-5.284V5.752h-7.963V.375h21.191v5.375H35.75v21.481zm28.913 0h-18.16V.376h18.16v5.375H51.804v5.375h8.701v5.375h-8.701v5.356h12.858v5.375zm24.203-2.753a13.457 13.457 0 01-4.138 2.473c-1.528.574-3.11.861-4.749.861-1.256 0-2.47-.169-3.64-.506a13.808 13.808 0 01-3.27-1.386 14.4 14.4 0 01-4.933-5 14.822 14.822 0 01-1.385-3.315 14.098 14.098 0 01-.48-3.69c0-1.273.16-2.503.48-3.689a14.349 14.349 0 011.386-3.315 14.156 14.156 0 012.161-2.828 13.708 13.708 0 012.772-2.172 13.365 13.365 0 013.27-1.405 13.08 13.08 0 013.64-.506c1.637 0 3.22.288 4.748.862a12.985 12.985 0 014.138 2.472l-2.809 4.682a7.826 7.826 0 00-2.752-1.948 8.231 8.231 0 00-3.326-.692c-1.17 0-2.266.224-3.288.674a8.565 8.565 0 00-2.679 1.835 8.414 8.414 0 00-1.81 2.716 8.336 8.336 0 00-.666 3.315c0 1.173.222 2.278.665 3.315a8.753 8.753 0 001.811 2.696 8.565 8.565 0 002.679 1.836 8.077 8.077 0 003.288.674 8.427 8.427 0 003.326-.674 8.04 8.04 0 002.752-1.967l2.809 4.682zm8.388 2.753H91.95V.376h5.302v10.75h10.587V.376h5.302v26.856h-5.302v-10.73H97.252v10.73z"
                                                fill="#F60"
                                            />
                                        </G>
                                        <Defs>
                                            <ClipPath id="clip0_125_5568">
                                                <Path fill="#fff" d="M0 0H113.512V27.9995H0z" />
                                            </ClipPath>
                                        </Defs>
                                    </Svg>
                                </View>
                                <Text style={styles.new_password_main_title}>
                                    Задайте
                                    новый пароль
                                </Text>
                            </View>

                            <KeyboardAwareScrollView style={styles.new_password_main_wrapper}
                                                     enableOnAndroid={true}
                                                     enableAutomaticScroll={(Platform.OS === 'ios')}
                            >


                                <Text style={styles.new_password_second_title}>
                                    Придумайте сложный пароль,содержащий
                                    строчные и прописные буквы,а так же цифры
                                    и символы
                                </Text>

                                <View style={styles.new_password_input_title_wrapper}>
                                    <Text style={styles.new_password_input_title}>Новый пароль</Text>
                                    <TextInput
                                        style={styles.new_password_input_field}
                                        onChangeText={(val) => this.setState({newPassword: val})}
                                        value={this.state.newPassword}
                                        secureTextEntry={this.state.password_security}
                                    />

                                    {this.state.password_security &&
                                    <TouchableOpacity style={{position: 'absolute', zIndex: 9, right: 15, top: 45}} onPress={() => {this.setState({password_security: false})}}>
                                        <Svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <Path
                                                d="M4.912 3.375a.558.558 0 00-.825.75l1.95 2.156C2.55 8.334 1.05 11.625.984 11.775a.534.534 0 000 .45c.038.075.816 1.81 2.56 3.544C5.287 17.503 7.93 19.312 12 19.312c1.701.01 3.384-.351 4.931-1.059l2.156 2.372a.552.552 0 00.413.187c.14.001.274-.053.375-.15a.545.545 0 00.037-.787l-15-16.5zm4.566 6.684l4.219 4.64a3.188 3.188 0 01-4.219-4.64zM12 18.187c-2.944 0-5.513-1.068-7.631-3.178A12.552 12.552 0 012.128 12c.403-.768 1.884-3.3 4.688-4.865l1.893 2.081a4.312 4.312 0 005.747 6.329l1.669 1.837c-1.308.541-2.71.815-4.125.806zm11.015-5.962c-.037.094-.974 2.156-3.084 4.05a.563.563 0 01-.605.09.563.563 0 01-.145-.934c1.09-.978 2-2.14 2.69-3.431a12.553 12.553 0 00-2.24-3.01C17.512 6.881 14.944 5.812 12 5.812a10.913 10.913 0 00-1.847.15.562.562 0 01-.188-1.106c.673-.113 1.353-.17 2.035-.169 4.069 0 6.844 1.922 8.456 3.544 1.613 1.622 2.522 3.469 2.56 3.544a.535.535 0 010 .45zM12.6 8.869a.562.562 0 11.206-1.107 4.331 4.331 0 013.488 3.835.563.563 0 01-.507.61h-.056a.553.553 0 01-.553-.507A3.197 3.197 0 0012.6 8.869z"
                                                fill="#000"
                                            />
                                        </Svg>
                                    </TouchableOpacity>

                                    }

                                    {!this.state.password_security &&
                                    <TouchableOpacity style={{position: 'absolute', zIndex: 9, right: 15, top: 45}}  onPress={() => {this.setState({password_security: true})}}>
                                        <Svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <Path
                                                d="M23.015 11.775c-.037-.075-.815-1.81-2.559-3.544C18.712 6.497 16.07 4.688 12 4.688S5.156 6.609 3.544 8.23C1.93 9.853 1.022 11.7.984 11.775a.534.534 0 000 .45c.038.075.816 1.81 2.56 3.544C5.287 17.503 7.93 19.312 12 19.312s6.844-1.921 8.456-3.543c1.613-1.622 2.522-3.469 2.56-3.544a.535.535 0 000-.45zM12 18.187c-2.944 0-5.513-1.068-7.631-3.178A12.553 12.553 0 012.128 12a12.553 12.553 0 012.24-3.01C6.489 6.882 9.057 5.813 12 5.813s5.512 1.07 7.631 3.179c.893.885 1.649 1.9 2.24 3.009-.6 1.144-3.59 6.188-9.871 6.188zm0-10.5a4.312 4.312 0 100 8.625 4.312 4.312 0 000-8.625zm0 7.5A3.187 3.187 0 1115.187 12 3.197 3.197 0 0112 15.188z"
                                                fill="#000"
                                            />
                                        </Svg>
                                    </TouchableOpacity>

                                    }

                                    {this.state.newPassword_error &&
                                    <Text style={styles.error_text}>{this.state.newPassword_error_text}</Text>
                                    }

                                </View>



                                <View style={styles.new_password_input_title_wrapper}>
                                    <Text style={styles.new_password_input_title}>Повторите пароль</Text>
                                    <TextInput
                                        style={styles.new_password_input_field}
                                        onChangeText={(val) => this.setState({repeatPassword: val})}
                                        value={this.state.repeatPassword}
                                        secureTextEntry={this.state.confirm_password_security}
                                    />

                                    {this.state.confirm_password_security &&
                                    <TouchableOpacity style={{position: 'absolute', zIndex: 9, right: 15, top: 45}} onPress={() => {this.setState({confirm_password_security: false})}}>
                                        <Svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <Path
                                                d="M4.912 3.375a.558.558 0 00-.825.75l1.95 2.156C2.55 8.334 1.05 11.625.984 11.775a.534.534 0 000 .45c.038.075.816 1.81 2.56 3.544C5.287 17.503 7.93 19.312 12 19.312c1.701.01 3.384-.351 4.931-1.059l2.156 2.372a.552.552 0 00.413.187c.14.001.274-.053.375-.15a.545.545 0 00.037-.787l-15-16.5zm4.566 6.684l4.219 4.64a3.188 3.188 0 01-4.219-4.64zM12 18.187c-2.944 0-5.513-1.068-7.631-3.178A12.552 12.552 0 012.128 12c.403-.768 1.884-3.3 4.688-4.865l1.893 2.081a4.312 4.312 0 005.747 6.329l1.669 1.837c-1.308.541-2.71.815-4.125.806zm11.015-5.962c-.037.094-.974 2.156-3.084 4.05a.563.563 0 01-.605.09.563.563 0 01-.145-.934c1.09-.978 2-2.14 2.69-3.431a12.553 12.553 0 00-2.24-3.01C17.512 6.881 14.944 5.812 12 5.812a10.913 10.913 0 00-1.847.15.562.562 0 01-.188-1.106c.673-.113 1.353-.17 2.035-.169 4.069 0 6.844 1.922 8.456 3.544 1.613 1.622 2.522 3.469 2.56 3.544a.535.535 0 010 .45zM12.6 8.869a.562.562 0 11.206-1.107 4.331 4.331 0 013.488 3.835.563.563 0 01-.507.61h-.056a.553.553 0 01-.553-.507A3.197 3.197 0 0012.6 8.869z"
                                                fill="#000"
                                            />
                                        </Svg>
                                    </TouchableOpacity>

                                    }

                                    {!this.state.confirm_password_security &&
                                    <TouchableOpacity style={{position: 'absolute', zIndex: 9, right: 15, top: 45}}  onPress={() => {this.setState({confirm_password_security: true})}}>
                                        <Svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <Path
                                                d="M23.015 11.775c-.037-.075-.815-1.81-2.559-3.544C18.712 6.497 16.07 4.688 12 4.688S5.156 6.609 3.544 8.23C1.93 9.853 1.022 11.7.984 11.775a.534.534 0 000 .45c.038.075.816 1.81 2.56 3.544C5.287 17.503 7.93 19.312 12 19.312s6.844-1.921 8.456-3.543c1.613-1.622 2.522-3.469 2.56-3.544a.535.535 0 000-.45zM12 18.187c-2.944 0-5.513-1.068-7.631-3.178A12.553 12.553 0 012.128 12a12.553 12.553 0 012.24-3.01C6.489 6.882 9.057 5.813 12 5.813s5.512 1.07 7.631 3.179c.893.885 1.649 1.9 2.24 3.009-.6 1.144-3.59 6.188-9.871 6.188zm0-10.5a4.312 4.312 0 100 8.625 4.312 4.312 0 000-8.625zm0 7.5A3.187 3.187 0 1115.187 12 3.197 3.197 0 0112 15.188z"
                                                fill="#000"
                                            />
                                        </Svg>
                                    </TouchableOpacity>

                                    }

                                    {this.state.repeatPassword_error &&
                                      <Text style={styles.error_text}>{this.state.repeatPassword_error_text}</Text>
                                    }

                                </View>


                            </KeyboardAwareScrollView>

                            <View style={{maxWidth: 265,width: '100%', height: 100}}>
                                <TouchableOpacity style={styles.new_password_send_code_btn} onPress={() => this.setNewPassword()}>
                                    <Text style={styles.new_password_send_code_btn_text}>Подтвердить</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                }

                {this.state.successPasswordPopup &&
                  <View style={styles.successPasswordPopup}>
                      <View style={styles.successPasswordPopup_wrapper}>

                          <TouchableOpacity style={styles.successPasswordPopup_close_btn} onPress={() => this.redirectCloseFunction()}>

                              <Svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={35}
                                  height={35}
                                  viewBox="0 0 35 35"
                                  fill="none"
                              >
                                  <Path
                                      d="M17.499 17.78L9.141 9.36m-.063 16.779l8.421-8.358-8.421 8.358zm8.421-8.358l8.421-8.359L17.5 17.78zm0 0l8.358 8.42-8.358-8.42z"
                                      stroke="#000"
                                      strokeWidth={2}
                                      strokeLinecap="round"
                                  />
                              </Svg>

                          </TouchableOpacity>
                          <ScrollView style={styles.successPasswordPopup_scroll}>
                              <View style={styles.successPasswordPopup_img_parent}>
                                  <Svg
                                      width={230}
                                      height={185}
                                      viewBox="0 0 230 185"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                  >
                                      <Mask id="a" fill="#fff">
                                          <Path d="M82.4.558c2.148-.195 4.381-.403 4.962-.462 3.814-.39 16.89.47 22.092 1.454 2.559.483 3.072.98 2.838 2.744-.088.664-.191 3.903-.228 7.2l-.068 5.992 3.152.982c7.154 2.231 12.765 4.773 18.473 8.37l1.438.905 2.788-2.588c1.534-1.424 3.943-3.673 5.354-4.999 1.574-1.479 2.824-2.416 3.236-2.424 1.509-.03 11.507 8.896 16.375 14.62 2.551 2.998 6.094 7.703 6.828 9.064.544 1.01.542 1.036-.125 1.938-.38.513-.522.915-.324.915.194 0 5.597.742 12.007 1.65 16.91 2.393 34.623 4.853 41.384 5.746 3.238.428 6.276.874 6.753.99.476.117-20.043.175-45.598.13l-46.463-.082-2.394-2.288c-8.749-8.363-19.261-13.57-31.673-15.687-4.19-.715-13.662-.72-17.807-.009-8.495 1.457-16.096 4.365-22.881 8.755-6.635 4.292-13.178 10.854-17.498 17.55-4.342 6.729-7.557 15.473-8.703 23.672-.568 4.058-.504 12.368.126 16.443 1.57 10.15 5.56 19.412 11.831 27.459 2.126 2.728 7.235 7.846 9.96 9.979 7.508 5.874 16.493 9.837 26.41 11.648 4.587.837 14.017.905 18.563.134 12.735-2.162 23.144-7.422 32.252-16.296l2.671-2.604 46.225.038c41.043.034 45.887.086 43.207.463-1.66.233-15.922 2.248-31.693 4.478-15.77 2.23-29.44 4.144-30.377 4.252-2.691.311-2.716.433-.539 2.67 2.542 2.612 2.73 3.123 1.693 4.6-1.656 2.362-5.172 6.39-8.594 9.846-5.201 5.252-14.081 12.27-15.526 12.27-.328 0-1.861-1.365-3.644-3.243a1975.103 1975.103 0 00-5.073-5.328l-1.996-2.085-2.265 1.221c-5.064 2.731-12.047 5.516-16.742 6.679-2.093.519-3.352.785-4.015.833a2.772 2.772 0 01-.263.007l-.69.018v1.446c.049 1.118.047 3.018.003 6.023-.091 6.354-.175 7.45-.603 7.877-1.418 1.417-18.04 1.999-26.064.912-5.47-.741-7.76-1.256-8.188-1.841-.276-.378-.324-2.326-.193-7.868.168-7.102.153-7.366-.401-7.37-1.03-.007-8.416-2.626-12.1-4.291-1.979-.894-5.132-2.533-7.007-3.642-2.053-1.214-3.561-1.927-3.79-1.791-.21.123-2.508 2.261-5.106 4.75s-5.053 4.651-5.457 4.804c-.898.341-1.944-.302-5.8-3.567-3.143-2.661-5.516-4.895-6.288-5.885l-.905-.846c-1.981-1.388-11.017-12.888-11.017-14.215 0-.573.996-1.601 8.407-8.678l2.22-2.12-1.814-3.452c-2.863-5.446-6.38-15.061-6.902-18.865l-.171-1.252-1.82-.19c-1-.105-4.25-.19-7.222-.19-6.86 0-6.583.191-7.205-4.983-.656-5.469-.52-15.942.292-22.32.758-5.96 1.064-7.281 1.775-7.654.295-.154 3.618-.19 7.725-.08 4.715.125 7.231.086 7.276-.111.037-.166.51-1.727 1.051-3.47a77.705 77.705 0 017.85-17.372l1.218-2.003-.958-1.098c-.527-.604-2.769-2.986-4.982-5.294-2.925-3.05-4.024-4.397-4.024-4.934 0-1.15 4.301-6.467 9.351-11.56 4.985-5.027 13.903-12.009 15.4-12.056.248-.008 2.77 2.386 5.604 5.319l5.151 5.333 2.847-1.524c5.44-2.913 12.695-5.648 18.274-6.888l2.448-.544.193-3.152c.106-1.733.193-4.97.193-7.191 0-5.378-.07-5.302 5.3-5.787z" />
                                          <Path d="M61.707 48.123c7.537-5.325 17.296-8.997 26.189-9.854 7.838-.756 15.099.051 22.878 2.543 3.858 1.236 4.473 1.703 1.001.76-2.947-.8-8.69-1.527-12.065-1.527-10.652 0-21.96 3.56-30.447 9.587-3.357 2.383-9.197 8.018-11.64 11.23-14.151 18.611-14.134 44.757.041 63.409 2.405 3.164 8.263 8.809 11.599 11.178 9.103 6.463 21.252 10.028 32.285 9.475 4.129-.208 8.307-.81 10.821-1.56.887-.265 1.675-.421 1.75-.346.228.228-6.642 2.326-9.597 2.932-12.2 2.498-24.716.796-35.868-4.878-5.6-2.849-9.105-5.415-13.74-10.056-5.382-5.388-8.919-10.558-11.668-17.055-7.504-17.733-5.388-37.198 5.78-53.167 2.52-3.605 8.972-10.052 12.68-12.671z" />
                                      </Mask>
                                      <Path
                                          d="M82.4.558c2.148-.195 4.381-.403 4.962-.462 3.814-.39 16.89.47 22.092 1.454 2.559.483 3.072.98 2.838 2.744-.088.664-.191 3.903-.228 7.2l-.068 5.992 3.152.982c7.154 2.231 12.765 4.773 18.473 8.37l1.438.905 2.788-2.588c1.534-1.424 3.943-3.673 5.354-4.999 1.574-1.479 2.824-2.416 3.236-2.424 1.509-.03 11.507 8.896 16.375 14.62 2.551 2.998 6.094 7.703 6.828 9.064.544 1.01.542 1.036-.125 1.938-.38.513-.522.915-.324.915.194 0 5.597.742 12.007 1.65 16.91 2.393 34.623 4.853 41.384 5.746 3.238.428 6.276.874 6.753.99.476.117-20.043.175-45.598.13l-46.463-.082-2.394-2.288c-8.749-8.363-19.261-13.57-31.673-15.687-4.19-.715-13.662-.72-17.807-.009-8.495 1.457-16.096 4.365-22.881 8.755-6.635 4.292-13.178 10.854-17.498 17.55-4.342 6.729-7.557 15.473-8.703 23.672-.568 4.058-.504 12.368.126 16.443 1.57 10.15 5.56 19.412 11.831 27.459 2.126 2.728 7.235 7.846 9.96 9.979 7.508 5.874 16.493 9.837 26.41 11.648 4.587.837 14.017.905 18.563.134 12.735-2.162 23.144-7.422 32.252-16.296l2.671-2.604 46.225.038c41.043.034 45.887.086 43.207.463-1.66.233-15.922 2.248-31.693 4.478-15.77 2.23-29.44 4.144-30.377 4.252-2.691.311-2.716.433-.539 2.67 2.542 2.612 2.73 3.123 1.693 4.6-1.656 2.362-5.172 6.39-8.594 9.846-5.201 5.252-14.081 12.27-15.526 12.27-.328 0-1.861-1.365-3.644-3.243a1975.103 1975.103 0 00-5.073-5.328l-1.996-2.085-2.265 1.221c-5.064 2.731-12.047 5.516-16.742 6.679-2.093.519-3.352.785-4.015.833a2.772 2.772 0 01-.263.007l-.69.018v1.446c.049 1.118.047 3.018.003 6.023-.091 6.354-.175 7.45-.603 7.877-1.418 1.417-18.04 1.999-26.064.912-5.47-.741-7.76-1.256-8.188-1.841-.276-.378-.324-2.326-.193-7.868.168-7.102.153-7.366-.401-7.37-1.03-.007-8.416-2.626-12.1-4.291-1.979-.894-5.132-2.533-7.007-3.642-2.053-1.214-3.561-1.927-3.79-1.791-.21.123-2.508 2.261-5.106 4.75s-5.053 4.651-5.457 4.804c-.898.341-1.944-.302-5.8-3.567-3.143-2.661-5.516-4.895-6.288-5.885l-.905-.846c-1.981-1.388-11.017-12.888-11.017-14.215 0-.573.996-1.601 8.407-8.678l2.22-2.12-1.814-3.452c-2.863-5.446-6.38-15.061-6.902-18.865l-.171-1.252-1.82-.19c-1-.105-4.25-.19-7.222-.19-6.86 0-6.583.191-7.205-4.983-.656-5.469-.52-15.942.292-22.32.758-5.96 1.064-7.281 1.775-7.654.295-.154 3.618-.19 7.725-.08 4.715.125 7.231.086 7.276-.111.037-.166.51-1.727 1.051-3.47a77.705 77.705 0 017.85-17.372l1.218-2.003-.958-1.098c-.527-.604-2.769-2.986-4.982-5.294-2.925-3.05-4.024-4.397-4.024-4.934 0-1.15 4.301-6.467 9.351-11.56 4.985-5.027 13.903-12.009 15.4-12.056.248-.008 2.77 2.386 5.604 5.319l5.151 5.333 2.847-1.524c5.44-2.913 12.695-5.648 18.274-6.888l2.448-.544.193-3.152c.106-1.733.193-4.97.193-7.191 0-5.378-.07-5.302 5.3-5.787z"
                                          fill="#F60"
                                      />
                                      <Path
                                          d="M61.707 48.123c7.537-5.325 17.296-8.997 26.189-9.854 7.838-.756 15.099.051 22.878 2.543 3.858 1.236 4.473 1.703 1.001.76-2.947-.8-8.69-1.527-12.065-1.527-10.652 0-21.96 3.56-30.447 9.587-3.357 2.383-9.197 8.018-11.64 11.23-14.151 18.611-14.134 44.757.041 63.409 2.405 3.164 8.263 8.809 11.599 11.178 9.103 6.463 21.252 10.028 32.285 9.475 4.129-.208 8.307-.81 10.821-1.56.887-.265 1.675-.421 1.75-.346.228.228-6.642 2.326-9.597 2.932-12.2 2.498-24.716.796-35.868-4.878-5.6-2.849-9.105-5.415-13.74-10.056-5.382-5.388-8.919-10.558-11.668-17.055-7.504-17.733-5.388-37.198 5.78-53.167 2.52-3.605 8.972-10.052 12.68-12.671z"
                                          fill="#F60"
                                      />
                                      <Path
                                          d="M25.277 155.379l.18-.466h-.001l-.18.466zm1.014 1.625h.5v-1.207l-.854.853.354.354zm.328.191l-.176-.468v.001l.176.467zm80.796 11.582l-.467.179.467-.179zm-.401-.028l-.335.37v.001l.335-.371zm-.409-1.039l.469.175-.469-.175zm-.298-.106l-.315-.388.315.388zm-.336-.301l.489.105-.489-.105zm2.503-.063l-.492-.086-.001.002.493.084zm.368.493l.291-.407-.291.407zm-.125.119l-.153.475v.001l.153-.476zM93.754 1.024l-.336.37.336-.37zm.77.285l.353.353-.353-.353zm-.228-.49l-.264.425.264-.425zm1.95-.263l.004-.5-.003.5zm1.963.287l.267.422-.267-.422zm.07.278l-.005.5.005-.5zm.603-.26l.468.177v-.001L98.882.86zm2.063.035l.076-.494h-.001l-.075.494zm2.502.33l.027-.5-.027.5zm-.15.561l-.305-.396.305.396zm-1.127.54l.007.5v-.001l-.007-.5zm.151-.437l.301.399-.301-.4zm-1.057.47l.032-.5h-.001l-.031.5zm-.587.32l-.138-.48.138.48zm-1.329-.012l.354-.354-.354.354zm-.84-.022l-.235-.441.236.44zm-1.538.074l-.102.49.102-.49zm-1.006-.21l-.11-.489.008.978.102-.49zm.906-.204l.11.488-.11-.488zm2.037-.24l-.016-.5.016.5zm1.962-.673l-.021-.5.021.5zm.262-.181l.125-.484h-.001l-.124.484zm-1.207.162l.217.45-.217-.45zm-2.073.476l.059.497-.059-.497zm-2.113.282l.082.493-.082-.493zm-.302-.016l.162.473-.162-.473zm-.453-.564l-.101-.49.102.49zM93.4 1.13l.31-.393-.31.393zm-.477-.6l-.011-.5.011.5zm3.722.796l.187-.464-.187.464zm.754 0l-.186-.464h-.001l.187.464zM10.396 74.183l-.105-.489.104.49zm.756.102l-.034-.498.034.498zm2.264.185l.283-.412-.283.412zm-.153.164l.117-.486-.117.486zm-2.717.102l-.057-.497.057.496zm1.208.211l-.005-.5.005.5zm3.878.859l-.467-.18.467.18zm.98.413l-.082-.493.081.493zm2.386 2.745l-.32.385.32-.385zm.448.715l.5.008v-.001l-.5-.007zM18.28 79l-.397.304.397-.305zm-.744-.414l.426.263-.425-.263zm1.852 1.815l.085.492-.085-.492zm.725 2.29l.45.217-.45-.218zm-.482 3.435l-.354-.354.354.354zm.413-1.787l-.495-.07.495.07zm.232-1.603l.5.001-.995-.072.495.071zm-1.044 4.173l-.5.033v.001l.5-.034zm-.11-1.684l-.5.031.5-.031zm.104-1.735l-.495-.07v.001l.495.07zm.007-.468l.486.117-.486-.117zm-.71-1.025l.472-.166-.472.166zm-1.028-2.12l-.37.336.37-.335zm-.915-1.322l.179.467-.18-.467zm-.27-.311l.467.18v-.001l-.467-.179zm-2.13-1.409l.425.263-.426-.263zm-1.111-1.011l.262.425-.262-.425zm.224.663l.307-.395-.307.395zm.02.256l-.163.472.164-.472zm-2.079-.192l-.32-.384-1.062.884h1.382v-.5zm.713-.593l-.32-.384.32.384zm.166-.604l.01-.5-.01.5zm-.383.254l-.425.263.425-.263zm-3.716.409l.072-.495-.072.495zm-.41-.696l-.023-.5.023.5zm.101-.193l.184-.465-.184.465zm-.823.375l-.404-.295.404.295zm-1.083.213l-.217.45.217-.45zm.127-.351l.012.5-.012-.5zm.998-.322l-.425-.263.425.263zm.848-.337l-.026-.5.026.5zm.129-.174l-.127.484.127-.484zm-2.813 1.587l.108.489h.001l-.109-.489zm.1.054l-.242-.437h-.001l.244.437zm.935.418l-.287-.409.287.409zm1.405-.323l-.185.465.185-.465zm.604.24l.019.5.166-.964-.185.465zm-.604.024l.02.5-.02-.5zm-1.51.495l-.23-.443.23.443zM4.813 77l.428-.259-.428.259zm-.913.044l-.498.036.498-.035zm.11 1.55l-.222.447.784.39-.062-.873-.5.035zm-.94-.47l-.224.447.223-.447zm-.28-.766l-.203-.457.204.457zm-.075-.457l-.207-.456.207.456zm-.597 1.275l-.495.075.495-.075zm-.146.336l-.452.214.452-.214zm-.297-.15l.5.01-.5-.01zm.453 1.206l.426-.261-.426.261zm.3.226l-.478.147.478-.147zm.828-.996l.467-.179-.467.18zm-.304.257l.179-.467-.18.467zm-.294.392l-.477.149.477-.149zm-.08.987l.423.266-.424-.266zm-.588-.15l-.433.25.433-.25zM1.6 81.527l-.5.012.5-.012zm.022.905l-.477.151.977-.163-.5.012zm-.287-.905l.477-.15-.477.15zm.048-2.826l.492.086-.492-.086zm1.842-2.866l.266.424-.266-.424zm7.17-2.022l.067-.495-.066.495zm1.057.143l.105.489-.038-.985-.067.496zM8.83 75.55l.186-.465-.186.465zm.578-.024l-.353-.354.353.354zm-.396-.159l-.02-.5.02.5zm7.249 1.777l.353.353-.353-.353zm-8.97 5.23l-.41-.288.41.287zm-.052-.355l.481.136-.481-.136zm-.131-.51l.262.425-.262-.426zm-.826 1.217l-.295-.404.295.404zm-.168 1.39l.477-.148-.477.148zm.566 2.541l.494-.08-.494.08zm1.3 1.594l-.04.498.04-.498zm.65-.188l.277-.416-.278.416zm.52-.409l-.072-.495.072.495zm.597.263l-.384-.32.384.32zm.668.173l.498.042-.498-.042zm.115-1.203l.498.05-.498-.05zm-.17-.811l.263.425-.263-.425zm1.07-1.097l.32-.385h-.001l-.32.385zm.011 1.144l-.443-.23.443.23zm-.246 1.06l.425-.264-.425.263zm-.32.803l-.371-.336.37.336zm-5.047-1.687l-.464.187.464-.187zm-.326-2.206l.5.005-.5-.005zm.016-1.358l.5.006-.994-.082.494.076zm-.252 1.645l-.494-.076.494.076zm.175 2.254l.41-.287-.41.287zm.426.92l.5.002-.5-.002zm-.54-.595l.43-.256-.43.256zm-.478-2.565l-.5-.018.5.018zm.94-2.925l.487-.115-.486.115zm.557.19l.319.384-.319-.385zm1.786-1.457l-.122-.485.122.485zm.738-.626l.235.441-.235-.44zm-.981.196l.176-.468-.176.468zm.308-.4l-.184-.465.184.466zm3.859.497l-.426.263.425-.263zm-3.604.732l-.148-.477.148.477zm-.891.552l.263-.425h-.001l-.262.425zm8.871 2.789l.263-.426-.263.426zm-.773-.564l-.458.2.458-.2zm-.41-.945l.458-.2-.959.194.5.006zm.127 4.073l-.493-.083.493.083zm-.555 1.212l-.006-.5h-.001l.007.5zm.102.295l.27-.42-.27.42zm-.085 1.243l.435.246-.435-.245zm-.412 1.078l.354-.353v-.001l-.354.354zm1.375-2.218l-.492.087.492-.087zm-.008-1.401l.5.015-.5-.015zm.374-.94l-.263.425.263-.425zm-1.007 4.508l-.398-.304.398.304zm-1.092 1.023l.47-.172-.47.172zm-.579.431l-.187.464.187-.464zm.034.176l.034.499-.034-.5zm-1.057-.596l.328-.377-.328.377zm-.712-.619l.133-.482-.461.86.328-.378zm.679.187l-.133.482.133-.482zm1.68-1.752l-.178-.466.178.466zm.489-.882l-.5.01v.001l.5-.01zm.268-1.994l.489.105-.49-.105zm-.102-1.454l.18-.466h-.001l-.18.466zm-.293-1.134l-.498-.046.498.046zm-.212-1.413l-.407.29.407-.29zm-.136.092l-.476.153.476-.153zm-.803.054l-.4.3.4-.3zm-.542-.723v-.5h-1l.6.8.4-.3zm1.849-.377l.5.013-.5-.013zM1.074 85.847l.5.025-.5-.025zm.302 1.328l.44-.236-.44.236zm-.076.473l.177-.467-.177.467zM.826 88.82l-.5-.023.5.023zm.226 1.149l.263.425-.263-.425zm1.277-2.524l-.434.249.434-.25zm.635 1.984l-.178-.467h-.001l.18.467zm1.434.71l-.325.38.325-.38zm1.373.881l.018-.5h-.001l-.017.5zm.83.487l.354-.354-.354.354zm1.229.13l.425.262-.425-.263zm2.173-.031l-.353-.354.353.354zm2.732.644l-.01.5.01-.5zM9.943 93.44l-.006-.5.006.5zm-2.105.11l.041.498-.04-.498zM4.51 92.84l-.425-.263.425.263zm-2.114-2.488l-.48-.136h-.001l.481.136zm-.126-.226l.41.287-.41-.287zm-.321-.377l-.5.002.5-.002zm.401-1.296l-.467.18.467-.18zm-.698.876l.488.11-.488-.11zm.423 1.683l.342-.365-.342.365zm1.766 1.22l-.484.127.484-.127zM1.77 91.228l.326-.379-.326.38zm-1.231-1.06l-.5-.01-.005.235.179.154.326-.379zm.045-2.208l-.5-.01.5.01zm.536-5.678l.455-.207-.455.207zm18.408 6.333l-.465-.182.465.182zm.2.088l.5-.022-.5.022zm-.429.711l-.178-.467.178.467zm-.689 1.125l-.262-.426.262.426zM5.138 91.71l-.353.354.353-.353zm.329.592l-.094-.49.094.49zm22.884 65.631l-.491-.094.49.094zm-.124.621l.484.123.001-.003-.485-.12zm-.34-.102l-.263.425.263-.425zm.037-.621l-.385-.32.385.32zm79.598 9.131l-.186.464.186-.464zm-.273.73l-.327-.378.327.378zm.514.003l.309.393-.309-.393zm.25-.754l-.18.467h.001l.179-.467zm-.679-.16l-.058-.496.058.496zm.221 8.987l-.5-.011.5.011zm-.272.644l.476-.153-.476.153zm-8.66 7.735l-.354.353.353-.353zm-.11-.485l.236.441-.236-.441zm-1.565.027l-.139.481.139-.481zm-.984-.284l-.026-.499-.112.98.138-.481zm11.168-9.105l.425-.263-.425.263zm.357 3.677l-.464-.186.464.186zm-.182-.182l-.5.02.5-.02zm.158-.396l-.353.353.353-.353zm1.064-9.239l-.019.499.016.001.016-.001-.013-.499zm-83.088-12.859c-.033-.053-.024-.051-.015-.012a.391.391 0 010 .172.449.449 0 01-.18.273.403.403 0 01-.205.076c-.02.002-.034.001-.043.001l-.013-.002.008.002.023.007c.02.006.048.015.082.028l.358-.933a1.57 1.57 0 00-.302-.089.753.753 0 00-.192-.01.576.576 0 00-.292.103c-.278.195-.242.5-.215.609.029.118.088.224.135.301l.85-.526zm-.343.545c.213.082.444.108.657.075.198-.031.464-.13.621-.383l-.85-.526a.212.212 0 01.076-.077c.013-.007.014-.005 0-.002a.257.257 0 01-.063 0 .36.36 0 01-.083-.02l-.358.933zm.693 1.158a.658.658 0 00.33.59c.167.096.34.101.425.099.098-.003.18-.019.202-.023.022-.004-.01.002-.041.005a.357.357 0 01-.041.002c-.013 0-.056 0-.11-.013a.495.495 0 01-.354-.672.513.513 0 01.097-.154c.043-.047.086-.074.097-.082.017-.011.032-.018.04-.022l.03-.015-.023.008.352.936a1.058 1.058 0 00.102-.042.498.498 0 00.235-.259.501.501 0 00-.355-.673c-.054-.012-.097-.012-.11-.012l-.043.001-.048.007-.014.002a.242.242 0 01-.042.006c-.023.001.029-.007.102.035a.347.347 0 01.128.132c.035.061.04.116.04.144h-1zm81.793 10.762a.73.73 0 00-.416.123.694.694 0 00-.27.361c-.082.249-.026.508.05.706l.934-.358a.35.35 0 01-.024-.084c-.002-.012.003.009-.01.05a.314.314 0 01-.119.153.272.272 0 01-.145.049v-1zm-.636 1.19l.049.134.013.04.004.014-.001-.008a.437.437 0 01.007-.149.476.476 0 01.635-.336c.02.009.032.016.032.017l-.011-.008-.035-.027a8.071 8.071 0 01-.291-.255l-.671.742c.133.12.247.221.336.293.045.035.094.073.145.104.03.019.14.089.287.099a.523.523 0 00.548-.406.64.64 0 00-.005-.284 2.516 2.516 0 00-.109-.328l-.933.358zm.402-.578c-.297-.269-.282-.476-.276-.493l-.937-.351c-.219.586.12 1.204.542 1.585l.671-.741zm-.276-.493c.039-.105.079-.218.1-.315a.717.717 0 00.012-.234.53.53 0 00-.747-.422.882.882 0 00-.162.087 3.614 3.614 0 00-.285.215l.63.777c.104-.084.166-.132.202-.155.02-.013.012-.006-.013.004a.442.442 0 01-.306.001.477.477 0 01-.311-.377.395.395 0 01-.002-.082l.002-.016.001-.003v-.002.001l-.001.003-.003.011a2.226 2.226 0 01-.054.156l.937.351zm-1.082-.669a1.913 1.913 0 01-.184.139c-.013.007.019-.014.08-.026a.449.449 0 01.515.359c.004.029.001.039.004.013.004-.051.02-.14.053-.293l-.978-.21c-.032.151-.06.294-.071.411a.982.982 0 00.002.216c.009.07.042.23.184.358a.55.55 0 00.474.129.756.756 0 00.235-.09c.101-.058.212-.145.316-.229l-.63-.777zm.468.192c.034-.158.063-.299.077-.406a.988.988 0 00.01-.198.588.588 0 00-.036-.172.523.523 0 00-.613-.327.609.609 0 00-.181.079.94.94 0 00-.155.132 4.741 4.741 0 00-.263.305l.773.634c.104-.127.167-.201.206-.241.023-.023.014-.011-.016.008a.4.4 0 01-.132.056.477.477 0 01-.555-.294.424.424 0 01-.026-.115c-.002-.027.002-.034-.003 0a4.741 4.741 0 01-.064.329l.978.21zm.806-.764c.24.202.449.403.592.56.072.08.118.139.141.174.013.018.01.017.003.001-.003-.009-.012-.03-.019-.062a.444.444 0 01-.001-.163l.985.173a.61.61 0 00-.044-.339 1.104 1.104 0 00-.092-.166 2.77 2.77 0 00-.232-.289 7.314 7.314 0 00-.689-.654l-.644.765zm.715.512c-.028.162.017.3.05.379.036.087.086.167.136.233.1.135.235.265.384.372l.582-.814a.762.762 0 01-.165-.156c-.016-.022-.018-.03-.014-.02.002.006.009.022.013.048.005.025.01.07 0 .127l-.986-.169zm.57.984a1.753 1.753 0 01.113.086l-.003-.003-.009-.01a.466.466 0 01-.106-.264.489.489 0 01.39-.514c.047-.009.082-.008.095-.008.027.001.038.005.021.001a2.093 2.093 0 01-.182-.053l-.306.953c.102.032.197.06.275.078a.868.868 0 00.15.02.53.53 0 00.396-.142.513.513 0 00.085-.64c-.044-.074-.099-.126-.123-.149a2.388 2.388 0 00-.214-.169l-.582.814zm.319-.764a1.188 1.188 0 00-.651-.039.737.737 0 00-.349.199.645.645 0 00-.181.452h1a.35.35 0 01-.098.24.282.282 0 01-.122.078c-.025.006.007-.007.095.021l.306-.951zM93.419 1.395c.189.17.405.31.616.388.105.039.23.07.365.07a.674.674 0 00.477-.19L94.17.954a.33.33 0 01.223-.102c.026 0 .025.005-.01-.008a.996.996 0 01-.294-.192l-.67.742zm1.458.267c.258-.258.218-.591.122-.797a1.14 1.14 0 00-.44-.472l-.526.85c.064.04.07.067.06.044a.25.25 0 01-.019-.124.336.336 0 01.096-.208l.707.707zM94.56.393a.427.427 0 01.152.216.463.463 0 01-.028.339.429.429 0 01-.135.161c-.052.037-.084.04-.046.03.026-.007.072-.017.143-.026.291-.04.821-.06 1.6-.057l.004-1c-.78-.004-1.37.016-1.737.066a2.227 2.227 0 00-.264.05.857.857 0 00-.277.12.573.573 0 00-.185.214.537.537 0 00-.032.395c.064.209.23.313.278.343l.527-.85zm1.685.663c.778.004 1.308.031 1.602.074.071.01.118.02.145.028.037.01.009.008-.04-.026a.45.45 0 01-.062-.667.287.287 0 01.052-.045l.535.845a.617.617 0 00.277-.36c.082-.313-.124-.52-.224-.59a.875.875 0 00-.274-.122 2.252 2.252 0 00-.265-.052c-.368-.054-.96-.081-1.74-.085l-.006 1zM97.942.42a2.38 2.38 0 00-.257.18.755.755 0 00-.135.147.543.543 0 00-.084.44.54.54 0 00.299.357.73.73 0 00.198.058c.094.015.206.018.31.02l.01-1a1.481 1.481 0 01-.165-.008c-.01-.001.023.002.072.025a.46.46 0 01.246.306.457.457 0 01-.062.368c-.027.04-.05.058-.042.05a1.57 1.57 0 01.144-.098L97.942.42zm.332 1.201c.206.002.412-.04.588-.116.15-.065.387-.203.488-.467l-.935-.355a.25.25 0 01.067-.103c.007-.006.004-.001-.017.008a.475.475 0 01-.182.033l-.009 1zm1.076-.584c-.067.178-.21.233-.212.234-.022.01-.025.007.011.001a2.29 2.29 0 01.36-.015c.339.006.817.05 1.36.133l.151-.988a11.677 11.677 0 00-1.495-.145 3.214 3.214 0 00-.53.027c-.074.012-.164.03-.25.068a.595.595 0 00-.33.331l.935.354zm1.519.353c1.071.165 2.224.318 2.552.335l.053-.998c-.268-.014-1.366-.158-2.453-.325l-.152.988zm2.551.335c.054.003.092.006.119.01.03.003.029.005.013 0-.006-.002-.096-.029-.175-.125a.444.444 0 01-.087-.397c.012-.044.029-.075.037-.09l.017-.025a.072.072 0 01-.01.01l-.032.032a5.23 5.23 0 01-.31.25l.609.794a5.79 5.79 0 00.376-.307c.048-.044.099-.094.143-.148a.696.696 0 00.136-.256.553.553 0 00-.105-.496.614.614 0 00-.291-.193 1.578 1.578 0 00-.386-.057l-.054.998zm-.428-.334c-.161.124-.353.24-.528.323a1.786 1.786 0 01-.223.091c-.067.022-.09.021-.079.021l.015 1c.236-.004.507-.108.719-.21.234-.112.486-.264.705-.432l-.609-.793zm-.83.435h-.025a.3.3 0 01.091.03.446.446 0 01.219.535c-.01.028-.021.049-.027.06a.116.116 0 01-.014.02l.021-.021c.037-.036.099-.088.195-.161l-.603-.798c-.11.084-.209.164-.288.241a.878.878 0 00-.229.331.561.561 0 00.007.397c.065.16.185.248.274.292a.862.862 0 00.394.074l-.015-1zm.46.463c.116-.088.219-.17.299-.248.041-.038.084-.083.122-.133a.687.687 0 00.117-.221.55.55 0 00-.048-.437.572.572 0 00-.285-.245 1.013 1.013 0 00-.373-.058v1c.031 0 .047.001.052.002.009 0-.015 0-.054-.016a.427.427 0 01-.207-.185.44.44 0 01-.042-.349c.019-.066.049-.102.049-.102l-.021.02a2.526 2.526 0 01-.212.174l.603.798zm-.168-1.342c-.258 0-.522.085-.737.18-.224.1-.442.23-.619.366a2.066 2.066 0 00-.247.221c-.067.072-.15.176-.201.303a.6.6 0 00.092.618.688.688 0 00.491.224l.062-.998c-.036-.002.094-.008.207.124.147.173.094.36.077.402-.016.04-.028.043.004.009.026-.028.067-.066.124-.11.115-.087.264-.178.415-.244a.937.937 0 01.332-.095v-1zm-1.221 1.912c.013 0-.026 0-.085-.022a.476.476 0 01-.147-.787c.027-.023.043-.03.03-.023-.054.03-.215.094-.492.173l.276.961c.286-.082.538-.17.696-.257a.859.859 0 00.151-.103.568.568 0 00.104-.12.521.521 0 00-.253-.775.717.717 0 00-.217-.045l-.063.998zm-.694-.659c-.317.091-.546.126-.7.124-.16-.001-.167-.04-.137-.01l-.707.708c.234.234.551.3.835.302.29.003.623-.058.985-.163l-.276-.96zm-.837.114c-.418-.418-.988-.345-1.43-.109l.472.882a.49.49 0 01.24-.071h.005v.001l.006.005.707-.708zm-1.43-.109c-.045.025-.2.068-.46.08-.24.012-.509-.006-.74-.054l-.204.978c.322.068.676.091.993.076.299-.015.636-.066.883-.198l-.471-.882zm-1.2.026l-1.005-.211-.205.979 1.006.21.205-.978zm-.998.766l.906-.203-.22-.976-.905.203.219.976zm.906-.203c.46-.104 1.346-.209 1.943-.228l-.032-1c-.647.021-1.596.132-2.13.252l.219.976zm1.943-.228c.342-.01.67-.057.927-.134.124-.037.26-.09.375-.165.088-.058.314-.23.314-.538h-1a.4.4 0 01.078-.24c.03-.04.057-.057.058-.057 0 0-.03.018-.111.042a2.804 2.804 0 01-.672.093l.031 1zm1.616-.837a.344.344 0 01-.1.252c-.017.015-.013.006.032-.012.086-.034.234-.069.419-.077l-.042-.999a2.317 2.317 0 00-.753.15 1.11 1.11 0 00-.324.194.663.663 0 00-.232.492h1zm.351.163c.15-.006.279-.015.382-.027a1.42 1.42 0 00.156-.027.652.652 0 00.223-.095.523.523 0 00.194-.246.51.51 0 00-.028-.425.541.541 0 00-.253-.24 1.607 1.607 0 00-.308-.104l-.249.968c.1.026.122.037.109.03a.45.45 0 01-.18-.183.486.486 0 01.148-.623.374.374 0 01.107-.053l.006-.002-.011.002-.035.005a4.16 4.16 0 01-.303.021l.042 1zm.365-1.164a2.125 2.125 0 00-.779-.024 2.623 2.623 0 00-.769.22l.434.9c.118-.056.288-.105.468-.129a1.18 1.18 0 01.399.001l.247-.968zm-1.547.195c-.122.059-.396.145-.769.23-.36.083-.772.157-1.146.2l.117.994c.413-.049.862-.129 1.253-.219.38-.087.748-.193.978-.303l-.434-.902zm-1.915.43c-.79.094-1.75.222-2.136.286l.163.986c.362-.06 1.303-.185 2.09-.278l-.117-.993zm-2.136.286c-.198.032-.27.035-.26.035.006 0 .025.002.05.007a.495.495 0 01.389.534c-.019.188-.135.293-.155.311a.432.432 0 01-.079.058l-.024.012.02-.007-.323-.946a1.24 1.24 0 00-.104.04c-.018.008-.095.04-.165.105a.505.505 0 00.25.875c.036.007.067.009.087.01.118.006.3-.018.477-.048l-.163-.986zm-.059.95c.227-.078.458-.2.603-.4a.67.67 0 00-.014-.828c-.16-.198-.397-.285-.595-.32a1.89 1.89 0 00-.71.021l.203.98a.906.906 0 01.331-.017c.033.006.047.012.047.012s-.007-.003-.016-.01a.231.231 0 01-.04-.04.331.331 0 01-.016-.384c.02-.027.03-.03.01-.016a.628.628 0 01-.126.056l.323.946zm-.716-1.527c-.405.084-.755.005-1.174-.325l-.619.786c.617.485 1.262.671 1.996.519l-.203-.98zM93.708.737a2.468 2.468 0 01-.368-.34c-.012-.014-.013-.017-.009-.01 0 .002.025.042.036.11a.46.46 0 01-.433.532l-.024-1a.54.54 0 00-.53.63c.017.1.056.178.082.223.029.05.062.097.094.137.121.153.313.33.534.504l.618-.786zm-.774.292c-.065.002-.09-.016-.046.001.03.012.077.035.138.071.12.072.264.177.392.293l.672-.741a3.56 3.56 0 00-.553-.411 2.048 2.048 0 00-.277-.14.899.899 0 00-.35-.073l.024 1zm3.522.76c.181.073.386.1.565.1.179 0 .384-.027.565-.1L97.21.862a.574.574 0 01-.19.027.576.576 0 01-.19-.027l-.375.927zm1.129 0a.814.814 0 00.156-.081.563.563 0 00.213-.266.524.524 0 00-.099-.531.592.592 0 00-.225-.156c-.1-.04-.208-.057-.292-.066a2.984 2.984 0 00-.317-.015v1c.091 0 .16.003.209.009.058.006.057.011.026 0-.01-.005-.083-.033-.152-.112a.471.471 0 01-.087-.48c.05-.135.144-.198.16-.208.026-.019.042-.024.034-.021l.374.928zM97.02.675c-.116 0-.224.004-.317.015-.084.009-.193.026-.292.066a.592.592 0 00-.225.156.524.524 0 00-.099.53.563.563 0 00.213.267.812.812 0 00.156.081l.374-.927c-.008-.003.008.002.035.02.015.011.109.074.16.21a.477.477 0 01-.088.479c-.07.079-.142.107-.152.111-.03.012-.032.007.026 0 .048-.005.118-.008.209-.008v-1zm-86.73 73.02c-.184.04-.346.078-.45.116a.73.73 0 00-.118.055.512.512 0 00-.254.357.506.506 0 00.308.56c.07.029.135.038.16.042.112.015.281.012.463.005.198-.007.46-.022.786-.045l-.068-.998c-.322.023-.573.037-.756.044a5.345 5.345 0 01-.216.005c-.058 0-.078-.003-.074-.002l.024.004a.48.48 0 01.236.14.494.494 0 01-.104.751c-.03.017-.05.023-.043.021a3.3 3.3 0 01.315-.077l-.21-.978zm.895 1.09a9.313 9.313 0 011.338.003c.193.016.352.037.471.063.139.029.164.05.138.033l.566-.825a1.416 1.416 0 00-.498-.187 4.935 4.935 0 00-.595-.08c-.437-.037-.966-.04-1.488-.004l.068.997zm1.947.099c.09.062.134.095.149.108.013.012-.018-.012-.05-.064a.486.486 0 01.286-.714.403.403 0 01.09-.013c.024 0 .031.002.008-.002a3.028 3.028 0 01-.236-.05l-.234.972c.123.03.235.055.325.068a.965.965 0 00.164.011.527.527 0 00.39-.168.514.514 0 00.055-.633.716.716 0 00-.134-.154 2.627 2.627 0 00-.247-.186l-.566.825zm.247-.735a2.642 2.642 0 00-.505-.05 10.912 10.912 0 00-.678.007 22.58 22.58 0 00-1.708.134l.115.993c.569-.066 1.152-.11 1.63-.128.24-.01.449-.011.614-.007.178.005.27.017.298.023l.233-.972zm-2.892.09c-.499.06-.88.105-1.116.14-.108.015-.22.034-.299.057a.521.521 0 00-.234.132.505.505 0 00.163.832.605.605 0 00.125.035c.083.015.201.02.316.023.129.003.298.004.509.004.42 0 1.019-.005 1.807-.014l-.01-1c-.79.009-1.383.014-1.797.014-.208 0-.368-.001-.484-.004-.13-.003-.171-.008-.168-.008l.024.005c.01.003.03.009.057.02a.496.496 0 01-.007.914l-.019.006s.042-.01.162-.027a44.84 44.84 0 011.087-.135l-.116-.993zm1.27 1.21c1.751-.019 2.728.014 3.232.126.265.058.264.112.229.06-.06-.088-.002-.144-.054-.008l.934.359c.09-.234.167-.586-.052-.91-.194-.288-.534-.41-.84-.478-.64-.141-1.745-.167-3.459-.15l.01 1zm3.407.178a.846.846 0 00-.021.599c.085.231.265.369.438.442.307.13.713.11 1.11.045l-.162-.986a2.354 2.354 0 01-.41.037.775.775 0 01-.114-.01c-.026-.004-.037-.008-.035-.008a.239.239 0 01.112.135c.032.087.004.137.016.105l-.934-.359zm1.527 1.086c-.096.016-.161-.007-.166-.008-.012-.005-.01-.005.012.007.04.023.106.068.194.138.174.14.39.34.603.562.212.22.41.449.551.638.071.095.12.17.15.224.043.078.009.047.009-.044h1a.937.937 0 00-.132-.437c-.06-.11-.14-.227-.226-.342a8.131 8.131 0 00-.632-.733 7.703 7.703 0 00-.698-.649 2.585 2.585 0 00-.327-.228 1.082 1.082 0 00-.188-.086.655.655 0 00-.312-.029l.162.987zm1.353 1.517c0 .239.11.467.207.626.108.176.257.353.426.493l.639-.769a1.057 1.057 0 01-.213-.248.636.636 0 01-.055-.107c-.01-.029-.004-.025-.004.005h-1zm.633 1.12c.081.067.16.158.214.245a.59.59 0 01.052.1c.01.026.001.017.002-.021l1 .013c.003-.24-.11-.47-.206-.623a2.076 2.076 0 00-.423-.484l-.639.77zm.268.323c0-.004 0-.027.01-.06a.41.41 0 01.088-.165.454.454 0 01.49-.128c.076.029.106.068.09.052a.552.552 0 01-.055-.075l-.84.543c.052.08.11.157.172.223a.771.771 0 00.279.193.546.546 0 00.618-.15.643.643 0 00.148-.418l-1-.015zm.622-.376a1.653 1.653 0 00-.165-.219.847.847 0 00-.242-.189.557.557 0 00-.603.058.6.6 0 00-.213.451l1 .038c-.001.011-.003.046-.02.093a.437.437 0 01-.139.196.444.444 0 01-.47.06c-.052-.026-.068-.05-.05-.03.011.012.033.04.063.085l.84-.543zm-1.223.101a.427.427 0 01.1-.251.459.459 0 01.36-.17c.087.002.144.03.155.035.017.008.021.012.011.005a1.87 1.87 0 01-.295-.323l-.793.61c.163.212.336.4.493.517.042.03.093.064.15.092a.63.63 0 00.262.065.541.541 0 00.43-.198.573.573 0 00.126-.344l-.999-.038zm.33-.704c-.178-.233-.386-.439-.602-.559a.847.847 0 00-.436-.117.636.636 0 00-.526.305l.85.525a.36.36 0 01-.29.17c-.078.002-.112-.024-.084-.01.049.028.158.117.296.296l.793-.61zm-1.564-.371a.757.757 0 00-.078.576c.034.15.103.29.175.413.146.246.364.503.594.73.233.227.5.445.76.603.13.078.27.15.412.197.135.046.312.084.5.052l-.172-.986c.044-.007.049.006-.009-.014a1.131 1.131 0 01-.212-.105 3.363 3.363 0 01-.579-.462 2.81 2.81 0 01-.434-.526.554.554 0 01-.062-.13c-.004-.017.023.07-.044.177l-.85-.525zm2.362 2.57c-.077.014-.088-.04-.02.035.067.074.147.214.21.413.13.411.127.869 0 1.132l.9.434c.278-.574.228-1.316.054-1.868a2.144 2.144 0 00-.42-.779c-.19-.212-.5-.42-.895-.352l.171.986zm.19 1.58c-.115.239-.217.613-.3.991-.088.394-.167.84-.225 1.254-.057.409-.097.803-.102 1.085-.003.126 0 .287.036.42.01.037.029.093.063.151.032.056.1.152.225.215.323.163.574-.06.624-.11l-.707-.707a.463.463 0 01.533-.076c.113.057.169.14.191.179a.365.365 0 01.036.084c.005.02-.004-.011-.001-.138.004-.222.037-.57.092-.964.055-.391.13-.812.21-1.176.084-.378.166-.65.226-.773l-.901-.435zm.321 4.007a.73.73 0 00.144-.219c.025-.056.047-.117.067-.178.04-.122.08-.275.12-.444.078-.34.16-.776.224-1.228l-.99-.143c-.061.43-.137.837-.209 1.145a4.596 4.596 0 01-.096.36.871.871 0 01-.028.079c-.012.026.004-.023.061-.08l.707.707zm.555-2.07l.231-1.603-.99-.142-.23 1.603.99.143zm-.763-1.675l-.006 2.206 1 .003.006-2.207-1-.002zm-.442 4.479a.94.94 0 01.002.348c-.007.03-.008.009.023-.029a.35.35 0 01.266-.118v1a.65.65 0 00.501-.24.922.922 0 00.178-.361c.059-.227.06-.495.018-.757l-.988.157zm.291.201c.087 0 .154.028.194.053a.24.24 0 01.06.049c.004.005-.013-.015-.038-.08a1.999 1.999 0 01-.11-.561l-.998.067c.021.315.083.619.177.859.046.118.11.245.199.353.08.097.252.26.516.26v-1zm-.393-.506l.498-.033v-.004-.01l-.003-.043-.01-.153-.033-.492-.064-.98-.998.063a508.437 508.437 0 00.107 1.628l.003.043v.014l.5-.033zm.388-1.715c-.02-.327.023-1.07.102-1.635l-.99-.138c-.084.598-.136 1.415-.11 1.835l.998-.062zm.102-1.634a6.29 6.29 0 00.067-.636.87.87 0 00-.001-.068.51.51 0 00-.135-.324.502.502 0 00-.812.098c-.036.063-.055.13-.062.151l-.032.124.972.234c.008-.036.014-.058.018-.07.008-.026 0 .008-.026.055a.495.495 0 01-.9-.094c-.019-.058-.02-.103-.021-.105v-.015c-.001.048-.017.215-.059.51l.99.14zm-.975-.656c-.008.034-.01.028.003.004.007-.015.07-.13.227-.182a.43.43 0 01.383.05c.045.032.058.058.043.036-.07-.1-.201-.392-.408-.98l-.944.331c.198.56.37.988.53 1.219.042.06.107.144.2.21.1.07.289.157.514.082a.601.601 0 00.335-.292c.045-.084.072-.171.089-.243l-.972-.235zm.248-1.073a13.35 13.35 0 00-.558-1.34c-.185-.38-.39-.75-.571-.95l-.741.672c.072.08.224.328.412.715.178.367.365.81.515 1.235l.943-.332zm-1.129-2.289a1.546 1.546 0 01-.24-.377.873.873 0 01-.09-.29h-1c0 .24.084.497.18.707.1.22.242.447.409.631l.741-.67zm-.33-.667c0-.217-.053-.535-.332-.73-.281-.198-.6-.135-.803-.056l.358.933c.035-.013.038-.009.016-.009a.26.26 0 01-.144-.05.256.256 0 01-.094-.114c-.007-.018-.001-.014-.001.026h1zm-1.135-.786c-.066.025-.079.023-.058.02a.385.385 0 01.307.14c.06.07.083.141.092.188.008.044.005.074.005.078-.001.006.002-.02.03-.092l-.934-.358a1.413 1.413 0 00-.09.334.646.646 0 00.141.505.62.62 0 00.525.203c.123-.01.242-.047.34-.085l-.358-.933zm.376.334c.073-.191.19-.591-.111-.903a.83.83 0 00-.418-.223c-.13-.03-.27-.039-.407-.039v1c.102 0 .157.007.182.013.027.007-.02.002-.076-.056a.31.31 0 01-.069-.108.257.257 0 01-.016-.087c0-.016.002-.02 0-.01a.449.449 0 01-.019.055l.934.358zm-.936-1.165c-.344 0-.732-.115-1-.263a.756.756 0 01-.218-.162c-.015-.02.078.109-.018.265l-.851-.526c-.208.337-.073.671.067.859.136.183.338.329.535.438.4.223.955.389 1.485.389v-1zm-1.236-.16c.187-.304.115-.628.024-.833a1.72 1.72 0 00-.416-.556 1.788 1.788 0 00-.592-.366c-.21-.074-.526-.123-.815.055l.525.851c-.08.05-.12.01-.042.037a.8.8 0 01.25.162c.093.084.152.167.175.222.029.064-.021.001.04-.097l.85.525zm-1.8-1.7a.81.81 0 00-.31.332.688.688 0 00-.03.525c.05.145.137.263.219.354.085.094.189.185.302.273l.614-.79a1.411 1.411 0 01-.175-.154c-.035-.04-.025-.04-.012-.003a.324.324 0 01-.018.23c-.035.072-.08.094-.064.084l-.525-.85zm.18 1.483c.135.105.226.177.283.226.03.025.038.034.036.032 0 0-.015-.016-.032-.04-.008-.013-.065-.095-.075-.222a.49.49 0 01.255-.47c.113-.062.215-.058.23-.058.05.001.076.011.047.003a4.326 4.326 0 01-.252-.082l-.327.945c.124.043.239.082.325.105a.818.818 0 00.189.03c.03 0 .144.001.264-.064a.51.51 0 00.176-.743.686.686 0 00-.07-.088 1.464 1.464 0 00-.116-.108 9.737 9.737 0 00-.318-.255l-.615.79zm.492-.61c-.37-.129-1.02-.22-1.48-.22v1c.38 0 .915.082 1.153.164l.327-.945zm-1.48-.22h-.763v1h.763v-1zm-.443.884l.713-.593-.64-.768-.713.593.64.768zm.712-.593c.155-.129.286-.241.384-.337.048-.048.098-.1.141-.156a.73.73 0 00.13-.25.557.557 0 00-.094-.49.608.608 0 00-.306-.207 1.5 1.5 0 00-.399-.047l-.018 1c.053 0 .09.002.117.005.029.002.025.004.005-.002-.01-.003-.11-.032-.192-.14a.449.449 0 01-.078-.384c.02-.071.051-.107.043-.096a.594.594 0 01-.05.053 5.762 5.762 0 01-.322.282l.64.77zm-.144-1.487c-.195-.004-.432.026-.623.153a.644.644 0 00-.272.37.627.627 0 00.078.493l.85-.525a.375.375 0 01.038.29.357.357 0 01-.141.206c-.033.021-.05.022-.033.018a.389.389 0 01.085-.006l.018-1zm-.817 1.017a.44.44 0 01-.027-.406c.045-.103.114-.15.119-.153.015-.01-.01.009-.118.04-.196.056-.51.112-.893.154-.768.085-1.7.103-2.3.015l-.145.99c.719.105 1.744.078 2.554-.01a6.735 6.735 0 001.062-.189c.128-.037.284-.09.408-.177a.643.643 0 00.228-.268.56.56 0 00-.038-.523l-.85.527zm-3.219-.35a1.869 1.869 0 01-.478-.127.535.535 0 01-.098-.053c-.018-.013 0-.005.022.033a.357.357 0 01.035.261.341.341 0 01-.131.202c-.027.018-.032.013.007.004.036-.009.095-.018.183-.022l-.045-.999c-.246.011-.511.055-.711.193a.661.661 0 00-.276.39.644.644 0 00.077.479c.124.211.345.343.53.426.204.091.456.16.74.203l.145-.99zm-.46.298c.102-.005.203-.012.288-.027.04-.007.1-.02.161-.044a.55.55 0 00.285-.25.522.522 0 00-.045-.558.631.631 0 00-.171-.155 1.574 1.574 0 00-.255-.123l-.368.93c.075.03.095.042.088.038a.416.416 0 01-.097-.094.482.482 0 01-.036-.506c.083-.158.219-.207.228-.21.031-.013.049-.015.038-.013-.02.004-.069.009-.16.013l.044 1zm.263-1.157c-.292-.115-.593-.048-.809.05a1.559 1.559 0 00-.602.495l.807.59a.56.56 0 01.21-.174.232.232 0 01.065-.021c.01-.001-.007.003-.038-.01l.367-.93zm-1.411.545c-.155.211-.187.186-.146.178.017-.004.01.003-.045-.01a1.653 1.653 0 01-.271-.111l-.434.901c.276.133.603.268.943.2.362-.07.591-.337.76-.568l-.807-.59zm-.462.057a7.813 7.813 0 01-.353-.176c-.037-.02-.03-.02-.008 0 .01.008.052.045.09.111a.479.479 0 01-.181.646c-.047.026-.084.036-.09.037-.015.004-.01.001.036-.003.086-.006.22-.01.428-.015l-.025-1c-.195.005-.363.01-.483.019-.057.004-.13.012-.2.03a.63.63 0 00-.155.06.521.521 0 00-.204.712c.044.08.1.132.128.157.06.052.128.092.174.118.1.056.245.126.409.205l.434-.9zm-.078.6c.27-.007.54-.054.77-.127.114-.037.229-.085.332-.145a.879.879 0 00.31-.287l-.85-.526c.036-.06.069-.07.036-.05a.714.714 0 01-.135.056 1.81 1.81 0 01-.488.08l.025.999zm1.412-.56c-.026.041-.045.048-.02.032a.575.575 0 01.105-.053c.104-.041.237-.072.364-.079l-.053-.998a2.202 2.202 0 00-.68.148c-.177.07-.427.199-.567.425l.85.526zm.449-.1a4.62 4.62 0 00.336-.027c.043-.005.097-.014.15-.029a.533.533 0 00.305-.203.51.51 0 00-.091-.703.69.69 0 00-.184-.106 2.563 2.563 0 00-.289-.089l-.251.968c.104.027.153.043.169.05.017.007-.028-.008-.083-.053a.489.489 0 01.093-.803.357.357 0 01.063-.024c.013-.004.013-.003-.013 0-.048.007-.13.014-.258.02l.053 1zm.228-1.157c-.308-.08-.697-.03-1.034.041a7.169 7.169 0 00-1.126.352c-.365.146-.721.32-.995.501-.135.09-.269.192-.374.307-.091.099-.237.287-.237.541h1c0 .132-.07.183-.027.136.028-.031.088-.082.189-.149.199-.131.489-.277.816-.408.325-.13.667-.238.963-.302.32-.069.51-.067.572-.05l.253-.969zM4.26 75.79c0 .218.073.446.242.615.176.178.431.26.693.203l-.216-.977a.254.254 0 01.232.069.187.187 0 01.043.065.104.104 0 01.006.025h-1zm.936.817c.033-.007.045-.008.041-.007h-.043c-.015-.002-.09-.007-.178-.054a.487.487 0 01-.257-.462c.011-.172.107-.275.122-.292.048-.052.088-.07.064-.056l.486.874a.746.746 0 00.188-.143.509.509 0 00-.131-.803.553.553 0 00-.22-.062.723.723 0 00-.113 0c-.059.006-.12.017-.177.03l.218.975zm-.252-.87c-.221.123-.329.338-.38.477a1.613 1.613 0 00-.097.482c-.007.151.005.331.063.495.05.138.217.464.611.464v-1a.389.389 0 01.268.108c.048.047.062.089.063.09.002.006-.002-.001-.004-.025a.62.62 0 01.031-.262c.008-.02.012-.025.008-.02a.228.228 0 01-.075.064l-.488-.873zm.197 1.918a.67.67 0 00.212-.038c.046-.015.09-.034.13-.053.081-.037.174-.086.27-.141.193-.111.426-.26.657-.423l-.575-.818c-.21.148-.418.28-.58.374-.082.047-.146.08-.19.1l-.03.013.021-.006a.395.395 0 01.085-.008v1zm1.269-.655c.482-.339.747-.341.932-.267l.37-.93c-.637-.253-1.268-.05-1.877.379l.575.818zm.932-.267l.604.24.37-.929-.604-.24-.37.929zm.77-.724l-.604.023.038 1 .604-.024-.038-.999zm-.604.023c-.238.01-.545.087-.83.18a6.129 6.129 0 00-.891.372l.462.887c.222-.116.49-.227.742-.309.262-.086.461-.127.555-.13l-.038-1zm-1.721.552c-.209.109-.352.18-.459.224-.113.046-.134.04-.11.04a.212.212 0 01.125.047s-.009-.008-.029-.036a1.878 1.878 0 01-.075-.118l-.857.517c.069.113.158.254.274.364.139.13.318.22.54.226a1.29 1.29 0 00.512-.115c.154-.064.335-.155.541-.262l-.462-.887zm-.548.157a14.815 14.815 0 00-.574-.902 2.122 2.122 0 00-.235-.283.847.847 0 00-.165-.127.598.598 0 00-.327-.082c-.367.018-.493.334-.523.424a1.365 1.365 0 00-.053.36c-.008.232.01.556.038.949l.997-.071a18.941 18.941 0 01-.03-.507 4.367 4.367 0 01-.005-.334.981.981 0 01.006-.085c.002-.02.004-.019 0-.005a.35.35 0 01-.076.124.435.435 0 01-.305.144.404.404 0 01-.22-.05c-.03-.017-.04-.03-.032-.021.016.016.054.059.117.147.125.174.296.447.53.836l.857-.517zm-1.84.339l.111 1.549.998-.071-.11-1.55-.998.072zm.833 1.066l-.942-.47-.446.895.942.47.446-.895zm-.942-.47a9.26 9.26 0 01-.492-.255 1.082 1.082 0 01-.073-.048l.007.007a.368.368 0 01.078.127.426.426 0 01-.042.373.327.327 0 01-.056.066c-.01.01-.016.012-.01.009a.98.98 0 01.093-.05 7.81 7.81 0 01.198-.09l-.408-.913c-.148.066-.311.138-.428.214a.757.757 0 00-.227.218.575.575 0 00-.06.514.694.694 0 00.212.29c.065.056.139.103.208.144.139.081.33.177.554.29l.446-.895zm-.298.139c.218-.097.423-.221.583-.352.079-.065.16-.142.225-.23a.707.707 0 00.152-.42h-1a.362.362 0 01.048-.18l-.015.017a.607.607 0 01-.045.04 1.623 1.623 0 01-.355.212l.407.913zm.96-1.002a.565.565 0 00-.397-.543.87.87 0 00-.378-.03c-.204.024-.44.1-.67.206l.413.91c.177-.08.31-.116.374-.123.04-.005.007.007-.06-.016a.435.435 0 01-.281-.403h1zm-1.446-.367c-.319.145-.647.333-.816.694-.159.338-.126.727-.069 1.11l.989-.148c-.059-.39-.032-.5-.015-.538.007-.014.036-.076.326-.208l-.415-.91zm-.885 1.805a8.1 8.1 0 01.054.412c.005.046.006.07.005.079l.002-.018a.481.481 0 01.314-.373.484.484 0 01.412.042c.06.036.093.075.1.084.012.013.017.022.016.02a2.164 2.164 0 01-.102-.2l-.904.43c.057.12.116.237.171.32.015.022.082.129.199.2a.516.516 0 00.743-.237c.05-.116.05-.232.05-.263 0-.056-.004-.117-.01-.176a8.976 8.976 0 00-.061-.469l-.989.149zm.8.047a2.724 2.724 0 00-.156-.292 1.066 1.066 0 00-.096-.13.644.644 0 00-.19-.15.534.534 0 00-.745.283.962.962 0 00-.06.341l1 .023c0-.071.009-.043-.016.018a.466.466 0 01-.632.226c-.07-.035-.106-.078-.108-.08-.007-.009-.006-.009.004.007.02.032.052.09.096.182l.904-.428zm-1.248.052c-.005.226.076.5.16.728.093.246.221.515.367.752l.852-.523a3.5 3.5 0 01-.282-.58 2.178 2.178 0 01-.078-.247.872.872 0 01-.016-.081l-.003-.026-1-.023zm.527 1.48c.068.111.133.209.191.288.05.066.124.16.213.227a.528.528 0 00.39.111.514.514 0 00.452-.435.664.664 0 00-.005-.225 1.296 1.296 0 00-.037-.149l-.956.295.01.032a.399.399 0 01.002-.115.486.486 0 01.662-.36c.043.018.071.038.084.047.035.027.033.036-.012-.025a3.03 3.03 0 01-.142-.214l-.852.523zm1.204-.182a1.128 1.128 0 01-.04-.502.606.606 0 01.103-.277c.035-.042-.028.056-.173.016-.114-.03-.08-.097-.007.093l.934-.359c-.113-.292-.314-.604-.667-.7-.385-.103-.69.111-.856.31-.328.395-.448 1.069-.25 1.712l.956-.293zm-.117-.67c.022.056.016.061.015.032a.387.387 0 01.144-.305.397.397 0 01.178-.087.274.274 0 01.08-.005c.01.001-.01 0-.075-.025l-.359.933c.1.038.213.074.33.087.104.01.31.013.49-.138a.616.616 0 00.21-.512 1.125 1.125 0 00-.08-.339l-.933.359zm.342-.39a1.256 1.256 0 00-.363-.09.62.62 0 00-.548.24.701.701 0 00-.12.495c.011.119.044.244.08.363l.955-.298a.982.982 0 01-.04-.163c-.001-.007.001.01-.004.04a.407.407 0 01-.263.302.324.324 0 01-.123.02c-.023-.002-.009-.005.068.025l.358-.934zm-.95 1.008a.938.938 0 01-.027.572L3 80.7c.13-.207.187-.463.205-.686a1.93 1.93 0 00-.07-.716l-.955.298zm-.027.572a.796.796 0 01-.045.066c-.01.013-.009.009.004-.002a.316.316 0 01.11-.057.383.383 0 01.206-.005c.061.016.1.043.114.054.015.011.016.015.005.002a1.558 1.558 0 01-.126-.194l-.865.503c.07.12.144.236.222.33.07.083.2.222.4.273a.64.64 0 00.576-.14c.107-.09.188-.206.246-.298l-.847-.532zm.268-.136a2.876 2.876 0 00-.149-.234.975.975 0 00-.206-.218.565.565 0 00-.607-.051.63.63 0 00-.292.375c-.052.167-.067.396-.073.633-.007.256-.004.59.006 1.004l1-.024c-.01-.412-.013-.724-.007-.954.003-.115.008-.203.015-.268.007-.07.014-.094.013-.093a.269.269 0 01-.028.06.422.422 0 01-.158.146.437.437 0 01-.46-.022c-.038-.027-.042-.043-.014-.003.023.031.054.08.095.151l.865-.502zm-1.32 1.51l.021.904 1-.024-.022-.905-1 .024zm.998.741l-.287-.905-.953.302.286.905.954-.302zm-.287-.905c-.15-.47-.153-1.344.063-2.59l-.985-.17c-.22 1.27-.258 2.347-.031 3.062l.953-.302zm.063-2.59c.168-.963.253-1.335.424-1.602.165-.257.435-.451 1.192-.925l-.53-.848c-.702.44-1.193.75-1.503 1.232-.305.474-.413 1.08-.568 1.972l.985.171zm1.616-2.528c.84-.525 2.21-1.065 3.572-1.449.676-.19 1.337-.34 1.915-.428.587-.09 1.052-.112 1.35-.072l.134-.991c-.442-.06-1.02-.02-1.636.075-.626.096-1.328.254-2.035.454-1.403.395-2.876.966-3.83 1.564l.53.847zm6.838-1.95l1.056.143.134-.99-1.057-.143-.133.99zm1.018-.841l-1.056.226.21.978 1.056-.226-.21-.978zm4.14 1.594a1.048 1.048 0 00-.831-.51.963.963 0 00-.874.465l.85.527.003-.004a.046.046 0 01-.03.011c-.006 0-.005-.002 0 .002a.104.104 0 01.032.035l.85-.526zm-6.843.952c.175.07.365.1.54.093.152-.006.396-.046.578-.228l-.707-.707a.294.294 0 01.095-.063c.01-.004.009-.001-.008 0a.33.33 0 01-.127-.023l-.371.928zm1.118-.135a.563.563 0 00.14-.595.601.601 0 00-.35-.344 1.41 1.41 0 00-.56-.072l.04.999c.138-.006.177.012.15.001a.33.33 0 01-.082-.048.434.434 0 01-.136-.19.438.438 0 01.09-.458l.708.707zm-.77-1.011c-.101.004-.2.013-.286.03a.895.895 0 00-.15.041.604.604 0 00-.21.135.529.529 0 00.018.772c.095.09.211.14.28.168l.371-.929c-.05-.02-.016-.014.036.034a.471.471 0 01.002.662c-.064.063-.125.087-.137.092l-.019.006c.018-.003.06-.01.136-.012l-.041-1zm5.05 1.781c.145.55.644.907 1.083 1.065.424.151 1.064.209 1.49-.217l-.707-.707c-.013.012-.154.087-.446-.018-.275-.098-.424-.27-.452-.376l-.967.253zm2.572.848a.92.92 0 00.2-.281.593.593 0 00-.037-.556.647.647 0 00-.384-.271 1.215 1.215 0 00-.317-.037v1c.055 0 .067.005.053.001-.002 0-.115-.028-.197-.159a.408.408 0 01-.037-.372c.02-.049.04-.06.013-.032l.706.707zm-.297-.058a2.863 2.863 0 00-.003.49c.007.065.02.15.05.233a.548.548 0 00.856.262.787.787 0 00.182-.2c.075-.114.143-.265.206-.43l-.934-.357a1.48 1.48 0 01-.11.24c-.01.016.007-.015.056-.052a.452.452 0 01.447-.048c.18.076.231.225.235.235.011.03.01.04.006.013a1.95 1.95 0 01.006-.311l-.997-.075zm-3.232 3.374c-.157-.253-.417-.372-.628-.431a2.743 2.743 0 00-.734-.085c-.519.001-1.145.095-1.762.244-.619.15-1.253.361-1.79.61-.514.24-1.02.55-1.29.935l.818.575c.11-.156.405-.375.894-.603a8.862 8.862 0 011.603-.545c.57-.138 1.114-.215 1.528-.216.21 0 .362.02.461.047.11.031.085.052.049-.005l.85-.526zM6.88 82.086c-.01.015-.011.014-.003.005 0 0 .043-.048.124-.083a.482.482 0 01.509.083c.13.116.147.256.148.269.008.054-.002.07.01.007.008-.047.024-.118.051-.212l-.962-.273a3.264 3.264 0 00-.074.31 1.003 1.003 0 00-.014.311.55.55 0 00.175.334c.2.179.437.14.56.086a.62.62 0 00.198-.143c.038-.04.07-.081.096-.12l-.818-.574zm.839.069c.038-.133.067-.258.083-.37a.983.983 0 00-.009-.382.603.603 0 00-.153-.275.565.565 0 00-.351-.166.726.726 0 00-.445.121l.526.85c.009-.005.002 0-.02.008a.364.364 0 01-.154.017.435.435 0 01-.267-.127.399.399 0 01-.104-.179c-.015-.056-.003-.076-.012-.01-.008.05-.025.13-.056.24l.962.273zm-.875-1.072a1.265 1.265 0 00-.397.401c-.09.144-.175.341-.175.557h1c0 .022-.004.03 0 .019a.333.333 0 01.097-.126l-.525-.851zm-.572.958c0-.05.014-.068.003-.045a.522.522 0 01-.053.09c-.059.081-.144.17-.236.236l.59.807a2.1 2.1 0 00.459-.461c.102-.144.237-.374.237-.627h-1zm-.286.281c-.254.186-.49.428-.538.83-.04.325.058.698.187 1.114l.955-.299c-.138-.44-.16-.614-.15-.695.001-.006-.016-.031.137-.143l-.59-.807zm-.35 1.943c.167.539.418 1.657.55 2.472l.987-.16c-.137-.844-.397-2.012-.583-2.61l-.955.298zm.55 2.472c.058.358.108.657.168.893.059.233.14.465.295.654.17.208.383.313.604.37.202.054.44.075.687.095l.08-.997a3.294 3.294 0 01-.513-.064.303.303 0 01-.072-.027.034.034 0 01-.012-.01c-.014-.017-.052-.077-.1-.266-.047-.186-.09-.44-.15-.808l-.987.16zm1.754 2.012c.184.015.346.023.48.022.124 0 .267-.008.39-.044a.63.63 0 00.271-.154.54.54 0 00.147-.51.613.613 0 00-.165-.29 1.014 1.014 0 00-.157-.126l-.556.831c.02.014.016.013.003 0-.006-.006-.07-.069-.098-.186a.46.46 0 01.123-.43c.076-.075.151-.095.155-.096.016-.004-.011.004-.118.005-.095 0-.226-.005-.395-.019l-.08.997zm.966-1.102l-.023-.016c.003.002.035.033.063.094a.423.423 0 01-.113.49c-.044.034-.057.025.036 0 .077-.02.192-.043.353-.066l-.146-.99a4.286 4.286 0 00-.463.09c-.114.03-.271.08-.398.18a.577.577 0 00-.182.706c.081.18.237.29.318.344l.555-.832zm.316.502a4.43 4.43 0 01.397-.045.62.62 0 01.073 0c.013 0-.018 0-.067-.022a.424.424 0 01-.215-.224.414.414 0 01-.018-.278c.012-.04.025-.057.017-.043a.71.71 0 01-.047.06l.769.64c.065-.079.17-.21.217-.366a.588.588 0 00-.016-.4.577.577 0 00-.304-.304 1.03 1.03 0 00-.458-.062 5.401 5.401 0 00-.493.054l.145.99zm.14-.551c-.07.084-.144.182-.196.284a.647.647 0 00-.039.533c.1.254.329.337.433.365.116.03.24.036.345.036v-1c-.081 0-.101-.006-.09-.003.001 0 .165.04.241.233.036.09.033.168.024.216-.007.044-.02.07-.02.07a1.265 1.265 0 01.072-.096l-.77-.638zm.543 1.218c.191 0 .387-.035.554-.11a.869.869 0 00.261-.174.641.641 0 00.192-.4l-.996-.084a.36.36 0 01.099-.224c.028-.029.047-.035.038-.03a.409.409 0 01-.148.022v1zm1.007-.684c.01-.12.062-.657.115-1.196l-.995-.098c-.053.536-.106 1.081-.116 1.21l.996.084zm.115-1.196a2.75 2.75 0 00-.019-.793.834.834 0 00-.182-.39.573.573 0 00-.343-.185.575.575 0 00-.387.083l.527.85a.426.426 0 01-.285.056.426.426 0 01-.254-.133c-.066-.073-.066-.129-.054-.075.016.076.026.245.002.49l.995.097zm-.93-1.286c.071-.044.2-.08.34-.026a.33.33 0 01.168.135c.013.023-.012-.017-.012-.15h-1c0 .215.034.454.144.646.055.096.159.232.338.3a.612.612 0 00.547-.054l-.525-.85zm.496-.04c0-.207.093-.298.162-.33.068-.033.197-.047.355.084l.638-.77c-.427-.353-.966-.433-1.42-.219-.453.214-.735.68-.735 1.235h1zm.517-.246c.077.064.1.093.103.1 0 0-.004-.006-.008-.02a.111.111 0 01-.005-.028c0-.005.001.023-.032.11a3.597 3.597 0 01-.171.366l.887.461c.09-.172.166-.33.22-.475.054-.143.098-.303.096-.472-.004-.398-.249-.643-.452-.812l-.638.77zm-.114.529c-.13.25-.23.518-.285.755a1.747 1.747 0 00-.049.36c-.001.1.007.277.107.438l.85-.527c.054.088.043.149.043.105 0-.025.006-.075.023-.15.034-.147.103-.336.2-.521l-.889-.46zm-.227 1.552a.323.323 0 01-.044-.113c-.005-.026-.004-.042-.004-.045 0-.005 0 .014-.017.056a1.095 1.095 0 01-.201.307l.74.672c.17-.186.306-.4.39-.608a1.21 1.21 0 00.085-.344.735.735 0 00-.099-.45l-.85.525zm-.266.206c-.114.125-.386.263-.837.346a5.36 5.36 0 01-1.436.045c-.498-.048-.94-.155-1.243-.295-.348-.161-.318-.266-.318-.216h-1c0 .592.504.94.898 1.123.438.203 1.002.329 1.567.384.57.055 1.176.041 1.713-.057.516-.095 1.058-.285 1.397-.66l-.741-.67zm-3.834-.12c0-.18-.057-.432-.119-.653a7.456 7.456 0 00-.259-.765l-.928.373c.087.216.167.453.224.66a3.633 3.633 0 01.079.353l.003.032h1zm-.378-1.418c-.072-.179-.149-.498-.206-.885a7.497 7.497 0 01-.084-1.13l-1-.011a8.49 8.49 0 00.095 1.287c.061.413.151.824.267 1.112l.928-.373zm-.29-2.015l.016-1.357-1-.012-.015 1.358 1 .011zm-.978-1.439l-.252 1.645.988.152.252-1.645-.988-.152zm-.252 1.645c-.193 1.254-.191 1.974.26 2.617l.818-.574c-.201-.287-.282-.636-.09-1.891l-.988-.152zm.26 2.617c.1.143.192.305.256.445.033.07.055.128.069.17.016.052.01.051.01.016l1 .004c0-.12-.03-.237-.057-.322a2.493 2.493 0 00-.114-.288 4.033 4.033 0 00-.345-.599l-.82.574zm.335.631c0-.006-.005-.155.118-.29a.473.473 0 01.58-.095.26.26 0 01.028.02l-.015-.016a3.28 3.28 0 01-.322-.468l-.859.511c.155.26.31.484.44.629.034.037.074.078.118.114a.66.66 0 00.214.122.527.527 0 00.557-.145.561.561 0 00.14-.378l-1-.004zm.39-.85c-.302-.505-.449-1.192-.409-2.29l-.999-.036c-.044 1.188.107 2.097.548 2.839l.86-.512zm-.409-2.29c.033-.88.205-1.801.39-2.373a2.73 2.73 0 01.125-.33c.044-.09.06-.096.034-.072a.368.368 0 01-.187.087.425.425 0 01-.333-.085.353.353 0 01-.087-.102c-.002-.004.004.008.013.047l.973-.23a1.243 1.243 0 00-.08-.24.707.707 0 00-.196-.257.576.576 0 00-.458-.12.636.636 0 00-.322.164 1.24 1.24 0 00-.259.377 3.693 3.693 0 00-.176.455c-.214.665-.4 1.678-.436 2.643l1 .037zm-.045-2.828c.028.118.065.248.123.362.056.111.17.283.392.358a.694.694 0 00.53-.046c.116-.056.224-.137.317-.215l-.638-.77a1.344 1.344 0 01-.115.085l.015-.006a.359.359 0 01.39.142l-.012-.035a1.372 1.372 0 01-.029-.105l-.973.23zm1.362.459c.169-.14.312-.318.415-.495.096-.166.193-.392.193-.624h-1c0-.02.004-.017-.006.013a.895.895 0 01-.24.336l.638.77zm.608-1.12c0 .175-.108.243-.056.196.026-.024.086-.067.19-.122.204-.109.504-.224.847-.31l-.244-.97a4.923 4.923 0 00-1.072.397 1.956 1.956 0 00-.394.265c-.086.079-.27.266-.27.545h1zm.98-.236c.399-.1.771-.23 1.054-.366.139-.066.275-.143.385-.23a.923.923 0 00.172-.173.617.617 0 00.126-.366h-1c0-.128.055-.208.07-.228.018-.025.028-.03.014-.018a1.163 1.163 0 01-.199.113c-.21.1-.516.21-.865.298l.244.97zm1.737-1.135a.642.642 0 00-.202-.48.656.656 0 00-.475-.165c-.228.01-.47.116-.68.228l.473.882c.088-.047.155-.077.204-.095.052-.02.062-.016.042-.015a.348.348 0 01-.24-.098.361.361 0 01-.122-.257h1zm-1.356-.417a1.535 1.535 0 01-.406.145.848.848 0 01-.154.019c-.042 0-.039-.006-.009.005l-.353.936c.236.089.512.06.711.021a2.54 2.54 0 00.682-.244l-.471-.882zm-.569.17s.14.049.203.226a.4.4 0 01-.049.374c-.024.032-.036.032.002.008a1.05 1.05 0 01.16-.075l-.368-.93c-.202.08-.442.2-.585.386a.602.602 0 00-.102.57.635.635 0 00.386.376l.353-.936zm.315.533c.142-.056.443-.111.877-.143.418-.03.91-.036 1.4-.02.491.017.97.057 1.364.114.42.062.667.135.75.182l.496-.868c-.266-.152-.688-.242-1.1-.303-.44-.064-.958-.106-1.476-.124a14.535 14.535 0 00-1.506.022c-.443.032-.876.093-1.172.21l.367.93zm1.662.42c.2.053.438.074.655.074.218 0 .455-.02.655-.073l-.253-.968c-.09.024-.236.041-.402.041-.165 0-.31-.017-.401-.04l-.254.967zm1.588-.126c.119.191.304.32.467.4.169.082.373.139.58.139v-1a.361.361 0 01-.2-.073c-.011-.01-.007-.009.004.008l-.85.526zm1.047.539c.03 0 .036.009.022-.001a.242.242 0 01-.087-.198h1a.763.763 0 00-.343-.624 1.042 1.042 0 00-.592-.177v1zm.477-1.209a10.164 10.164 0 00-.601-.256 1.666 1.666 0 00-.468-.12.615.615 0 00-.385.1.555.555 0 00-.24.48c.004.12.043.22.069.278.029.065.065.13.101.188l.85-.526a.633.633 0 01-.037-.067c-.007-.016.015.025.017.098a.445.445 0 01-.195.375c-.12.082-.231.073-.235.073-.017-.001.023.001.17.057.13.049.307.125.54.23l.414-.91zm-4.85.662a3.95 3.95 0 00-.868.366.972.972 0 00-.325.303.576.576 0 00-.076.416c.04.194.167.31.264.37l.524-.852c.055.034.159.121.192.281a.424.424 0 01-.05.305c-.04.066-.073.07-.002.027.11-.068.329-.166.637-.261l-.296-.955zm-1.006 1.454c.22.137.478.144.664.12.203-.025.416-.097.603-.215l-.535-.845a.494.494 0 01-.193.068.245.245 0 01-.058.002c-.01-.002.01-.001.045.02l-.526.85zm3.296-1.106c0-.05-.002-.123-.014-.2a.673.673 0 00-.131-.306c-.199-.253-.494-.252-.635-.241-.16.013-.358.06-.585.122-.235.065-.539.157-.925.277l.295.955c.389-.12.678-.208.896-.268.226-.062.342-.085.398-.09.076-.005-.1.031-.232-.138a.33.33 0 01-.067-.144c-.002-.01 0-.006 0 .033h1zm8.378.648c-.007.27.027.545.092.777.032.116.076.233.135.34.053.097.144.23.29.32l.526-.85c.063.039.076.076.06.047a.638.638 0 01-.048-.128 1.688 1.688 0 01-.056-.48l-1-.026zm-7.18-.308a.574.574 0 01-.19.026.576.576 0 01-.19-.026l-.374.927c.181.073.386.1.565.1.179 0 .384-.027.565-.1l-.375-.927zm3.838 2.375c0 .223.048.45.125.642.07.174.196.403.414.538l.526-.85c.033.02.04.035.029.02a.404.404 0 01-.04-.08.765.765 0 01-.054-.27h-1zm.54 1.18l.005.004a.193.193 0 01.045.054.17.17 0 01.016.033c.002.006-.002-.004-.002-.028h1a1.03 1.03 0 00-.164-.53 1.185 1.185 0 00-.375-.384l-.526.851zm.064.063c0 .033-.008-.018.036-.094a.41.41 0 01.34-.203.343.343 0 01.145.026l.008.005-.017-.013a.632.632 0 01-.043-.039c-.157-.153-.393-.493-.585-.934l-.917.4c.226.517.526.978.802 1.249.071.07.153.138.242.192.08.05.22.118.395.113a.59.59 0 00.5-.304.804.804 0 00.094-.398h-1zm-.116-1.252l-.411-.944-.917.399.41.944.918-.399zm-1.37-.751l-.011.88 1 .014.011-.881-1-.013zm1.154 2.372c-.29 0-.468.204-.532.284a1.68 1.68 0 00-.214.371 4.302 4.302 0 00-.273.969l.986.167c.05-.302.128-.563.204-.736a.744.744 0 01.079-.148c.005-.006-.006.01-.037.031a.38.38 0 01-.213.062v-1zm-1.02 1.624c-.05.299-.13.557-.208.729a.713.713 0 01-.083.146c-.03.035.045-.078.224-.08l.012 1c.276-.004.453-.186.528-.275.093-.11.168-.243.228-.375a4.05 4.05 0 00.286-.978l-.986-.167zm-.068.795a.669.669 0 00-.4.126.548.548 0 00-.185.624c.048.14.14.239.198.292.066.064.144.122.225.174l.542-.841a.576.576 0 01-.078-.057c-.018-.017.028.019.058.106a.452.452 0 01-.154.498.397.397 0 01-.192.078l-.014-1zm-.162 1.216c.09.058.101.076.093.065a.194.194 0 01-.037-.115c0-.003-.004.037-.057.156a6.25 6.25 0 01-.248.47l.87.492c.12-.21.218-.393.29-.55.068-.153.13-.324.143-.5a.809.809 0 00-.163-.555 1.323 1.323 0 00-.35-.304l-.54.84zm-.25.576a6.034 6.034 0 00-.374.777 2.04 2.04 0 00-.1.328.843.843 0 00-.015.198.563.563 0 00.16.376l.706-.71c.127.127.132.272.133.287.001.035-.004.052-.001.039.004-.022.019-.075.051-.16a5.04 5.04 0 01.311-.642l-.87-.493zm-.33 1.678a.538.538 0 00.557.126.719.719 0 00.222-.128c.091-.074.18-.174.256-.269.16-.197.344-.467.515-.743.172-.277.34-.576.463-.832.06-.127.116-.255.154-.37.02-.056.038-.12.05-.184a.73.73 0 00.005-.259l-.985.174a.335.335 0 01-.004-.092v-.004.003a8.318 8.318 0 01-.533 1.037c-.16.258-.32.49-.443.641a1.704 1.704 0 01-.111.124l.004-.003.013-.009a.36.36 0 01.075-.034.462.462 0 01.47.115l-.707.707zm2.222-2.659c0 .004-.004-.03-.008-.121a9.555 9.555 0 01-.006-.31c-.001-.248.003-.557.012-.868l-.999-.031c-.01.322-.014.644-.013.904.002.238.008.48.029.6l.985-.174zm-.001-1.299c.005-.18.017-.325.032-.437a.964.964 0 01.044-.203c.015-.04-.008.052-.13.113a.356.356 0 01-.335-.003l.526-.85a.648.648 0 00-.634-.043.758.758 0 00-.356.413c-.098.245-.135.593-.147.98l1 .03zm-.388-.53c-.04-.024-.033-.043-.013.01a.96.96 0 01.049.276c.016.27-.022.64-.117 1.063-.19.852-.584 1.804-1.062 2.43l.795.607c.589-.77 1.03-1.868 1.243-2.818.107-.477.162-.947.139-1.342a1.932 1.932 0 00-.115-.578.993.993 0 00-.394-.498l-.525.85zm-1.143 3.78a6.703 6.703 0 01-.674.774c-.042.04-.076.069-.102.09-.029.021-.04.027-.035.025a.397.397 0 01.17-.034.456.456 0 01.416.3l-.939.343a.543.543 0 00.499.357.66.66 0 00.322-.083c.124-.065.247-.169.353-.268.225-.212.503-.528.785-.898l-.795-.607zm-.225 1.154a.872.872 0 00-.463-.482 1.274 1.274 0 00-.535-.114c-.168 0-.367.033-.543.133a.729.729 0 00-.384.637h1a.294.294 0 01-.05.162.226.226 0 01-.072.07c-.012.007-.014.006-.001.003a.281.281 0 01.163.015c.021.01-.026-.005-.054-.08l.94-.344zm-1.925.174c0 .248.128.448.236.57.117.135.275.25.454.323l.375-.927a.212.212 0 01-.079-.056c-.009-.01-.008-.012-.004-.003.004.007.018.04.018.093h-1zm.69.893c.05.02.066.03.062.027a.453.453 0 01-.175-.279.478.478 0 01.124-.419.43.43 0 01.162-.107c.042-.015.058-.012.013-.009l.07.998a.965.965 0 00.258-.05.57.57 0 00.219-.14.522.522 0 00.137-.46.547.547 0 00-.152-.283.71.71 0 00-.127-.1 1.42 1.42 0 00-.217-.106l-.374.928zm.187-.787c.06-.004.077.012.018-.01a1.386 1.386 0 01-.191-.092c-.16-.09-.35-.223-.522-.372l-.656.755c.22.191.464.363.687.488.11.063.225.119.334.16.096.034.242.08.398.069l-.069-.998zm-.695-.474l-.712-.62-.656.755.712.62.656-.755zm-1.173.24l.679.187.266-.964-.68-.187-.265.964zm.68.187c.236.066.49.098.718.053a.783.783 0 00.381-.186.652.652 0 00.212-.484h-1a.342.342 0 01.185-.302.184.184 0 01.02-.007l.007-.002-.02.002c-.013 0-.03 0-.054-.002a1.061 1.061 0 01-.184-.036l-.266.964zm1.31-.617c0-.422-.329-.822-.8-.822v1a.188.188 0 01-.2-.178h1zm-.8-.822c.022 0 .097.003.184.051a.447.447 0 01.213.273.398.398 0 01.005.2c-.008.029-.016.044-.014.04a1.45 1.45 0 01.224-.264c.274-.272.64-.54.87-.628l-.359-.933c-.417.16-.9.539-1.216.852a2.27 2.27 0 00-.406.511.822.822 0 00-.07.179.605.605 0 00.001.305c.04.145.135.267.267.34a.617.617 0 00.3.074v-1zm1.481-.328c.284-.108.486-.34.61-.563.127-.23.206-.511.2-.796l-1 .021a.598.598 0 01-.075.29c-.053.097-.1.117-.092.114l.357.934zm.81-1.359c-.007-.319.103-1.17.256-1.879l-.977-.211c-.157.728-.289 1.672-.28 2.11l1-.02zm.256-1.879c.107-.492.17-.891.149-1.196a1.06 1.06 0 00-.146-.492.827.827 0 00-.414-.337l-.359.933a.175.175 0 01-.076-.067c-.018-.03-.007-.033-.003.033.01.146-.02.417-.128.915l.977.211zm-.411-2.025c.064.024.088.062.086.058a.348.348 0 01-.035-.094 1.8 1.8 0 01-.025-.586l-.996-.092c-.031.335-.017.658.053.928.061.239.207.584.559.72l.358-.934zm.026-.621a4.03 4.03 0 00-.028-.943c-.04-.27-.119-.588-.274-.807l-.815.58c-.001-.002.017.026.04.103.023.07.044.163.06.272.033.219.042.473.02.701l.996.094zm-.302-1.75a3.11 3.11 0 00-.172-.225.784.784 0 00-.121-.115.511.511 0 00-.83.442.874.874 0 00.022.153c.018.078.047.175.08.28l.953-.305a2.689 2.689 0 01-.057-.195c-.005-.019 0-.005.001.026 0 .014.002.06-.012.117a.486.486 0 01-.614.353.453.453 0 01-.141-.07c-.033-.025-.048-.044-.036-.03.017.02.052.064.112.149l.815-.58zm-1.02.535c.026.082.04.144.046.188.006.045.003.058.005.047a.28.28 0 01.072-.138.36.36 0 01.24-.117c.065-.005.1.013.094.01a.36.36 0 01-.064-.042 1.864 1.864 0 01-.32-.347l-.8.6c.167.222.338.405.507.537.147.114.38.257.65.24a.64.64 0 00.435-.21.726.726 0 00.174-.379c.034-.22-.013-.464-.087-.695l-.952.306zm.073-.399l-.542-.723-.8.6.542.723.8-.6zm-.942.077h.92v-1h-.92v1zm.92 0c.307 0 .606-.046.848-.144.195-.079.57-.287.58-.72l-1-.026a.286.286 0 01.076-.192c.016-.016.013-.007-.031.012-.09.036-.252.07-.474.07v1zm1.429-.865c0 .004-.001.074-.052.16a.435.435 0 01-.31.204.358.358 0 01-.184-.019c-.017-.007-.019-.01-.001.002.08.057.232.207.41.432.173.216.342.465.466.69.062.113.108.212.137.291.033.088.033.12.033.113h1c0-.165-.046-.327-.095-.46a3.232 3.232 0 00-.199-.425 6.14 6.14 0 00-.559-.832c-.193-.243-.416-.485-.618-.627a1 1 0 00-.195-.109.646.646 0 00-.334-.046.566.566 0 00-.409.271.671.671 0 00-.09.33l1 .025zm3.14.326c.072.117.16.227.252.314a1 1 0 00.168.13c.052.03.17.095.324.095v-1a.409.409 0 01.192.048c.015.009.015.011.003 0a.599.599 0 01-.089-.113l-.85.526zm.744.54a.574.574 0 00.399-.165.701.701 0 00.153-.223 1.04 1.04 0 00.081-.415h-1c0 .03-.006.034.004.012a.303.303 0 01.068-.094.427.427 0 01.295-.116v1zM1.011 84.262c.027.687.156 1.617.304 2.09l.954-.297c-.11-.357-.234-1.191-.258-1.832l-1 .039zm.729 1.372a5.164 5.164 0 00-.088-.331.895.895 0 00-.066-.16.511.511 0 00-.692-.216c-.157.082-.218.218-.23.246a.636.636 0 00-.04.118c-.013.053-.02.108-.024.154-.01.094-.018.223-.026.376l1 .05c.007-.155.013-.258.02-.322.004-.034.006-.04.003-.03 0 .004-.007.031-.023.068-.008.016-.063.144-.213.224a.493.493 0 01-.533-.048c-.076-.06-.11-.125-.116-.135-.018-.032-.021-.049-.012-.02.014.043.035.125.068.26l.972-.234zm-1.166.187c-.012.253.026.547.086.814.061.268.154.55.275.775l.881-.472a2.232 2.232 0 01-.18-.524 2.163 2.163 0 01-.063-.543l-.999-.05zm.36 1.589c.066.122.105.203.126.255l.01.026c0-.001-.013-.05-.001-.123a.446.446 0 01.43-.37c.034 0 .051.006.039.002a.685.685 0 01-.06-.02l-.355.935c.083.031.218.08.357.082a.554.554 0 00.577-.472.679.679 0 00-.013-.26 1.188 1.188 0 00-.056-.174 3.789 3.789 0 00-.172-.353l-.881.472zm.543-.23a.734.734 0 00-.598.017.812.812 0 00-.377.437c-.11.275-.153.679-.176 1.16l1 .047c.01-.237.026-.423.046-.567.02-.148.042-.228.057-.264.017-.042 0 .03-.1.08a.312.312 0 01-.19.03l-.016-.005.354-.935zm-1.15 1.615c-.02.405-.008.765.044 1.026.023.116.066.286.172.424a.577.577 0 00.771.147l-.525-.85a.423.423 0 01.548.095c.041.054.032.078.015-.01-.028-.144-.044-.41-.027-.786l-.999-.046zm.988 1.597a.844.844 0 00.29-.326c.056-.106.1-.224.132-.34.066-.234.104-.512.104-.788h-1c0 .192-.028.379-.067.518a.727.727 0 01-.05.138c-.02.035-.006-.009.065-.053l.526.851zm.526-1.454c0-.219.136-.59.329-.882a1.4 1.4 0 01.166-.207l.018-.014-.01.005a.333.333 0 01-.16.027.37.37 0 01-.289-.175l.867-.499a.63.63 0 00-.5-.323.731.731 0 00-.452.126c-.19.123-.352.323-.475.509-.246.373-.494.939-.494 1.433h1zm.054-1.246c.348.604.519.931.579 1.1.013.038.014.049.012.04 0-.004-.01-.064.02-.147a.416.416 0 01.207-.23c.075-.037.134-.036.14-.036v1c.07 0 .183-.009.3-.066a.584.584 0 00.294-.328.687.687 0 00.03-.329 1.217 1.217 0 00-.06-.238c-.098-.272-.32-.683-.655-1.265l-.867.499zm.957.727c-.486 0-.804.419-.804.834h1a.15.15 0 01-.041.1.21.21 0 01-.155.066v-1zm-.804.834c0 .293.167.54.43.65.23.096.473.065.666-.01l-.36-.933c-.035.014 0-.013.08.02a.306.306 0 01.184.273h-1zm1.095.64c-.09.035-.13.007-.056.026.054.013.139.044.249.099.218.108.485.283.737.499l.65-.76a4.754 4.754 0 00-.944-.635 2.277 2.277 0 00-.453-.174.91.91 0 00-.54.012l.357.934zm.93.624c.295.252.608.485.878.658.134.086.265.163.384.22.095.046.255.117.42.123l.033-1c.066.003.075.022-.018-.023a2.837 2.837 0 01-.279-.161 7.35 7.35 0 01-.768-.577l-.65.76zm1.68 1.001c-.028-.001-.027-.007.014.01a.997.997 0 01.142.07c.116.068.24.162.339.26l.706-.707a2.756 2.756 0 00-.54-.416c-.164-.096-.397-.208-.625-.216l-.036.999zm.494.34c.148.148.336.299.537.363a.62.62 0 00.513-.05.592.592 0 00.278-.516h-1a.41.41 0 01.204-.339c.16-.097.3-.05.309-.048.024.008.02.011-.013-.012a.983.983 0 01-.12-.105l-.708.707zm1.328-.203c0 .125-.074.181-.078.184-.008.006.008-.007.049-.007v-1c-.218 0-.437.06-.615.183a.781.781 0 00-.356.64h1zm-.03.177c.024 0 .026.004.013 0a.247.247 0 01-.099-.068.353.353 0 01-.093-.225.298.298 0 01.039-.168l.85.526a.705.705 0 00.11-.402.647.647 0 00-.178-.417c-.186-.198-.447-.246-.641-.246v1zm-.14-.461a.603.603 0 00.04.714.842.842 0 00.408.257c.234.072.536.094.817.09.29-.004.608-.037.89-.1.254-.058.584-.162.797-.375l-.707-.707c.003-.004-.076.053-.31.106a3.458 3.458 0 01-.684.076 1.871 1.871 0 01-.506-.046c-.055-.017.005-.012.07.068a.398.398 0 01.035.443l-.85-.526zm2.952.586c-.031.031-.045.027 0 .012a.913.913 0 01.19-.032c.176-.015.398-.003.62.032.223.037.414.093.535.15.062.029.08.046.077.042a.289.289 0 01-.073-.201h1a.72.72 0 00-.23-.516 1.281 1.281 0 00-.348-.23 3.11 3.11 0 00-.802-.232 3.67 3.67 0 00-.86-.042 1.897 1.897 0 00-.41.076.992.992 0 00-.406.234l.707.707zm1.35.003c0 .352.262.554.415.638.179.097.393.145.603.15l.02-1a.35.35 0 01-.144-.028c-.006-.004.013.005.038.037a.327.327 0 01.067.203h-1zm1.018.788c.037 0 .021.004-.019-.009a.438.438 0 01-.276-.301c-.06-.214.052-.361.061-.373.023-.03.036-.038.015-.021-.09.069-.324.195-.667.342-.328.14-.712.28-1.069.385-.37.109-.665.166-.833.168l.012 1c.313-.004.719-.096 1.103-.209.397-.116.819-.27 1.18-.424.347-.148.686-.317.885-.47a.914.914 0 00.176-.174.568.568 0 00.1-.493.564.564 0 00-.376-.38.944.944 0 00-.273-.041l-.019 1zm-2.788.191c-.513.006-1.472.056-2.14.112l.083.996a36.3 36.3 0 012.069-.108l-.012-1zm-2.14.112c-.612.05-1.448-.031-2.107-.171a3.721 3.721 0 01-.73-.218c-.082-.037-.08-.05-.054-.02a.356.356 0 01.081.17.41.41 0 01-.052.291l-.85-.525a.59.59 0 00-.08.426c.028.141.1.244.16.308.11.122.257.203.372.257.247.115.586.212.945.289.723.154 1.66.25 2.397.19l-.082-.997zm-2.862.053c.12-.195.116-.401.091-.544a1.417 1.417 0 00-.146-.404 3.402 3.402 0 00-.529-.714 4.14 4.14 0 00-.702-.602c-.225-.15-.53-.31-.842-.31v1c-.01 0 .013 0 .074.024.058.024.13.063.216.12.17.113.358.275.526.453.17.181.3.358.371.493a.479.479 0 01.047.114c.002.012-.014-.063.044-.157l.85.527zm-2.128-2.573c-.048 0-.085-.002-.111-.005-.027-.002-.037-.005-.036-.005.002 0 .022.006.05.025a.292.292 0 01.116.174c.002.015 0 .017.002 0a.665.665 0 01.013-.084c.008-.04.02-.089.037-.149l-.963-.27a2.207 2.207 0 00-.085.435c-.01.138 0 .325.107.501a.749.749 0 00.442.328c.142.041.293.05.428.05v-1zm.07-.043c.039-.136.07-.254.088-.348.01-.046.019-.101.022-.157a.546.546 0 00-.067-.32.514.514 0 00-.67-.216c-.104.048-.174.121-.196.145-.064.067-.131.158-.193.247l.819.573a2.768 2.768 0 01.091-.122l.007-.008-.02.018a.477.477 0 01-.391.088.486.486 0 01-.377-.409.333.333 0 01-.001-.055c0-.01 0-.006-.005.022-.01.053-.032.14-.069.27l.963.272zm-1.016-.65c-.064.092-.08.102-.062.087.008-.006.081-.068.207-.08a.456.456 0 01.39.154.385.385 0 01.071.125c.002.005-.001-.005-.005-.04a3.61 3.61 0 01-.013-.338l-1 .005c0 .17.005.321.019.443.007.061.017.129.035.195.016.057.05.162.132.258a.547.547 0 00.474.192.608.608 0 00.318-.136c.103-.083.19-.2.253-.29l-.819-.574zm.588-.092a1.345 1.345 0 01.055-.42c.015-.044.022-.044.005-.024a.356.356 0 01-.272.117v-1a.648.648 0 00-.5.247A1.077 1.077 0 001.56 89a2.322 2.322 0 00-.11.753l1-.005zm-.212-.327a.643.643 0 00.436-.168.694.694 0 00.203-.35 1.068 1.068 0 00-.06-.627l-.933.359c.027.07.01.078.022.03a.308.308 0 01.094-.15.358.358 0 01.238-.094v1zm.58-1.145a2.065 2.065 0 00-.115-.255.9.9 0 00-.193-.248.594.594 0 00-.88.097c-.117.147-.196.356-.256.547-.067.21-.136.48-.209.804l.976.22c.07-.315.132-.552.186-.722.06-.19.094-.237.085-.226-.006.008-.075.096-.22.122a.408.408 0 01-.337-.086c-.038-.032-.044-.054-.028-.025.013.024.032.065.057.13l.934-.358zm-1.653.945c-.1.445-.161.84-.068 1.21.098.39.344.673.637.947l.684-.728c-.26-.246-.326-.362-.351-.462-.03-.119-.026-.305.074-.747l-.976-.22zm.569 2.157c.214.202.468.382.709.514.219.12.506.244.77.244v-1c.002 0-.097-.016-.29-.121a2.571 2.571 0 01-.505-.365l-.684.728zm1.478.758c-.037 0-.018-.014.036.038a.41.41 0 01.11.187l.968-.253a1.41 1.41 0 00-.389-.659c-.174-.165-.427-.313-.725-.313v1zm.147.225a1.011 1.011 0 01.022.11v.008l.001-.011a.363.363 0 01.08-.178.381.381 0 01.316-.144c.038.004.037.012-.023-.017-.114-.055-.303-.178-.59-.398-.281-.216-.634-.507-1.068-.88l-.653.757c.44.38.81.684 1.112.916.296.227.552.403.762.505.102.05.232.101.373.113.156.014.38-.02.543-.218a.701.701 0 00.147-.465 1.536 1.536 0 00-.055-.351l-.968.253zm-1.262-1.51l-1.23-1.06-.653.757 1.23 1.06.653-.758zm-1.057-.671l.045-2.209-1-.02-.045 2.208 1 .02zm.045-2.209c.063-3.012.105-4.607.175-5.353a2.84 2.84 0 01.05-.356c.007-.03.008-.026-.003-.004-.004.009-.057.121-.202.187a.455.455 0 01-.436-.033.362.362 0 01-.076-.068l-.004-.005.006.01.018.032c.015.028.032.065.053.11l.91-.415a2.024 2.024 0 00-.17-.313.706.706 0 00-.183-.184.545.545 0 00-.527-.047.59.59 0 00-.285.282c-.036.074-.059.15-.074.214-.031.13-.054.298-.073.496-.074.793-.117 2.437-.178 5.427l1 .02zm-.419-5.48c.153.335.322 1.147.346 1.773l1-.039c-.027-.701-.21-1.655-.436-2.15l-.91.416zm13.456-.51c0 .443.36.802.802.802v-1c.11 0 .198.088.198.199h-1zm.802-.8a.803.803 0 00-.802.8h1c0 .111-.088.2-.198.2v-1zm-13.22 1.745a.812.812 0 00-.083-.156.563.563 0 00-.266-.212.524.524 0 00-.53.098.591.591 0 00-.157.225c-.04.1-.057.208-.066.292-.01.094-.015.201-.015.317h1c0-.091.004-.16.01-.209.006-.058.011-.056-.001-.026-.004.01-.033.084-.112.153a.472.472 0 01-.478.087c-.136-.05-.2-.144-.21-.16-.018-.026-.023-.043-.02-.035l.927-.374zm4.51.435c-.02.051-.014.016.035-.035a.471.471 0 01.662-.001c.063.062.086.123.09.135.008.02.009.028.007.019a1.002 1.002 0 01-.012-.135l-1 .041c.005.1.014.199.03.286a.888.888 0 00.043.149.604.604 0 00.134.211.529.529 0 00.772-.018.886.886 0 00.168-.28l-.928-.372zm5.913 3.302c-.005-.138.013-.177.002-.149a.328.328 0 01-.049.082c-.03.037-.09.099-.19.135a.438.438 0 01-.457-.09l.707-.707a.563.563 0 00-.595-.141.602.602 0 00-.345.35c-.068.17-.08.38-.072.56l1-.04zm7.867 2.136a2.194 2.194 0 01.055-.127l-.012.018a.477.477 0 01-.81-.115c-.012-.031-.014-.049-.011-.034.004.026.01.082.014.185l.999-.044a2.773 2.773 0 00-.026-.298.825.825 0 00-.041-.164c-.012-.03-.08-.218-.288-.309a.523.523 0 00-.562.096.678.678 0 00-.129.165 2.028 2.028 0 00-.12.262l.931.365zm-.764-.073a.289.289 0 01-.045.15c-.036.06-.068.074-.063.072l.357.934c.254-.097.443-.29.562-.49.122-.2.2-.45.188-.71l-1 .044zm-.109.222a1.268 1.268 0 00-.533.399 1.06 1.06 0 00-.24.644h1c0 .02-.005.026 0 .017a.273.273 0 01.133-.127l-.36-.933zm-.773 1.043a.368.368 0 01-.045.161c-.003.004.01-.016.046-.038l.525.851a.977.977 0 00.363-.448c.067-.156.11-.34.11-.526h-1zm0 .123a.435.435 0 01.578.13.226.226 0 01.024.046s-.007-.023-.015-.085a2.666 2.666 0 01-.017-.238c-.015-.41.015-1.089.097-2.06l-.997-.084c-.081.976-.117 1.705-.1 2.18.008.224.029.447.088.617.026.073.092.24.26.347.231.146.47.084.608-.002l-.526-.85zm.154-1.931c.068.188.134.351.199.486.061.127.137.263.234.368.08.087.327.308.664.185a.619.619 0 00.283-.215.888.888 0 00.113-.208l-.932-.365c-.005.014-.002 0 .017-.025a.383.383 0 01.177-.127.422.422 0 01.309.007c.067.03.1.066.104.07.005.005-.02-.023-.068-.124a4.326 4.326 0 01-.16-.392l-.94.34zM2.65 89.976c0 .12.04.216.06.259.023.053.052.102.079.142.052.082.12.168.19.252.142.168.328.363.516.545.189.182.39.361.564.499.086.068.175.133.258.183.041.025.09.052.144.075a.648.648 0 00.25.053v-1a.402.402 0 01.137.025c.008.003.005.003-.012-.008a1.732 1.732 0 01-.158-.114 6.836 6.836 0 01-.487-.432 6.731 6.731 0 01-.447-.47 1.678 1.678 0 01-.117-.152c-.01-.016-.01-.018-.005-.008l.014.04a.41.41 0 01.015.11h-1zm2.06 2.008a.259.259 0 01-.047-.004l-.01-.002a.468.468 0 01.131.086l.707-.707a1.44 1.44 0 00-.339-.248.978.978 0 00-.442-.125v1zm.074.08a.274.274 0 01-.06-.105.414.414 0 01.231-.508c.042-.016.066-.014.057-.014v1a.838.838 0 00.294-.05.613.613 0 00.325-.274c.198-.355-.044-.66-.14-.756l-.707.707zm.228-.627a.921.921 0 00-.546.174.73.73 0 00-.306.585h1c0 .127-.071.198-.1.22a.125.125 0 01-.035.018.047.047 0 01-.013.003v-1zm-.852.76c0 .287.193.453.316.523a.98.98 0 00.355.11c.215.029.472.013.728-.037l-.187-.982a1.41 1.41 0 01-.41.028c-.044-.006-.03-.01.008.012a.357.357 0 01.11.1c.047.065.08.15.08.246h-1zm1.4.596l.805-.153-.187-.983-.806.154.187.982zm7.277-2.93a.704.704 0 00-.11.403.647.647 0 00.177.416c.187.198.448.246.642.246v-1c-.023 0-.025-.003-.012.001.011.004.053.02.098.068.05.053.09.132.094.224a.299.299 0 01-.039.169l-.85-.526zm.709 1.065c.03 0 .041.01.033.004a.193.193 0 01-.063-.152h1a.813.813 0 00-.338-.649 1.057 1.057 0 00-.632-.203v1zm-.03-.148c0 .077.007.159.026.24a.69.69 0 00.133.278.56.56 0 00.464.21.596.596 0 00.39-.18l-.708-.707a.406.406 0 01.266-.112.44.44 0 01.364.158.314.314 0 01.065.123c.002.012 0 .01 0-.01h-1zm4.226.37a.447.447 0 01.113-.297c.01-.01.008-.005-.02.012a1.436 1.436 0 01-.24.117l.358.933c.153-.059.302-.131.42-.207.058-.036.124-.083.182-.14a.677.677 0 00.102-.127.552.552 0 00.085-.29h-1zm-7.136 1.567c.24.008.483-.028.685-.111a.937.937 0 00.312-.203c.099-.1.197-.26.197-.466h-1c0-.124.06-.205.09-.236.028-.027.042-.029.02-.02a.717.717 0 01-.274.037l-.03 1zm1.194-.78c0-.111-.01-.23-.04-.337a.685.685 0 00-.097-.216c-.05-.07-.249-.3-.572-.21l.267.964a.48.48 0 01-.513-.178.367.367 0 01-.05-.1c-.001-.005.005.022.005.077h1zm-.298 1.4c.205.003.4-.062.554-.146.153-.083.315-.212.424-.388l-.85-.526c.004-.007.004-.005-.007.005a.25.25 0 01-.096.052c-.015.004-.02.003-.012.003l-.013 1zm-.81.234c.103-.022.237-.054.346-.11.037-.02.19-.1.267-.28a.524.524 0 00-.117-.584.689.689 0 00-.212-.14 1.436 1.436 0 00-.167-.06 5.037 5.037 0 00-.413-.098l-.2.98a4.129 4.129 0 01.366.089l.013.005-.005-.003-.016-.008a.458.458 0 01-.187-.25.477.477 0 01.14-.492.371.371 0 01.07-.047c.025-.013.013-.003-.092.02l.207.978zm-3.69-1.225a4.854 4.854 0 00-.657.037c-.087.012-.183.029-.268.057a.69.69 0 00-.174.085.53.53 0 00-.234.435h1a.47.47 0 01-.257.421.206.206 0 01-.02.008c-.001 0 .025-.007.089-.016.12-.016.303-.028.515-.027l.006-1zM27.86 157.84a52.46 52.46 0 01-.078.396c-.01.056-.02.103-.028.14l-.01.044a.353.353 0 01-.003.015l.971.24c.017-.068.076-.365.13-.647l-.982-.188zm-.118.593a.473.473 0 01.419-.356.331.331 0 01.08.003l.02.005-.008-.003-.026-.012a.676.676 0 01-.078-.043l-.525.851c.11.068.232.129.349.164.051.016.144.04.252.033.094-.006.402-.063.486-.397l-.969-.245zm.408-.405c-.008-.005.018.009.044.052.03.049.042.105.039.151-.003.039-.013.051-.003.031a.665.665 0 01.079-.111l-.77-.639c-.137.166-.289.392-.304.66-.02.337.173.573.389.706l.526-.85zm.159.123c.114-.137.189-.219.235-.263.025-.023.023-.018.002-.005a.392.392 0 01-.088.036.441.441 0 01-.217.001.45.45 0 01-.326-.294c-.018-.057-.013-.091-.014-.068 0 .038-.011.124-.041.282l.982.188a2.87 2.87 0 00.059-.447.798.798 0 00-.033-.259.549.549 0 00-.824-.304.994.994 0 00-.182.139c-.096.09-.205.214-.323.355l.77.639zm77.794 8.569c.072.116.161.226.253.314.046.043.102.09.167.129a.64.64 0 00.325.096v-1c.065 0 .114.014.14.023a.28.28 0 01.052.025c.014.008.015.011.003-.001a.557.557 0 01-.089-.112l-.851.526zm.745.539a.574.574 0 00.399-.164.707.707 0 00.153-.223c.058-.132.081-.279.081-.415h-1c0 .03-.006.034.004.011a.292.292 0 01.068-.093.426.426 0 01.295-.116v1zm.633-.802c0-.469-.395-.802-.819-.802v1a.189.189 0 01-.181-.198h1zm-.819-.802c-.212 0-.498.092-.629.387-.117.266-.026.523.07.678l.851-.526a.16.16 0 01.02.063.338.338 0 01-.026.189.335.335 0 01-.286.209v-1zm.674 1.772c.027.01-.045-.01-.102-.106a.356.356 0 01-.05-.171.285.285 0 01.016-.109c.009-.026.01-.012-.044.049-.049.056-.124.13-.234.225l.655.756c.127-.111.239-.217.33-.319.085-.098.177-.219.23-.362a.665.665 0 00-.043-.579.778.778 0 00-.386-.313l-.372.929zm-.414-.112a3.173 3.173 0 00-.496.509.75.75 0 00-.082.139.597.597 0 00-.06.248.534.534 0 00.542.542.843.843 0 00.322-.072 2.21 2.21 0 00.266-.134c.185-.108.409-.262.658-.458l-.618-.786a4.867 4.867 0 01-.543.379.99.99 0 01-.144.074c-.044.019-.01-.003.065-.003a.468.468 0 01.452.472.387.387 0 01-.034.16c-.008.018-.014.025-.008.016.03-.042.126-.149.335-.33l-.655-.756zm1.15.774c.155-.121.289-.232.392-.333.09-.088.217-.224.276-.402a.63.63 0 00-.168-.66 1.164 1.164 0 00-.38-.219l-.358.934a.936.936 0 01.074.031c.013.008-.001.002-.025-.02a.366.366 0 01-.096-.165.372.372 0 01.003-.215c.014-.042.031-.061.025-.053a.46.46 0 01-.05.054 4.23 4.23 0 01-.311.262l.618.786zm.12-1.614a3.603 3.603 0 00-.461-.142 2.247 2.247 0 00-.215-.041.967.967 0 00-.24-.006l.116.993c-.035.004-.045-.001-.008.004a2.542 2.542 0 01.449.126l.359-.934zm-.916-.189a.608.608 0 00-.184.05.525.525 0 00-.132.87c.109.104.263.175.376.221l.372-.928a.667.667 0 01-.081-.038c-.021-.011-.004-.005.025.023a.444.444 0 01.087.122.48.48 0 01-.228.638c-.059.027-.106.033-.119.035l-.116-.993zm-16.353 3.977c-.02-.051-.023-.072-.023-.07 0 .002.003.019.001.048a.387.387 0 01-.043.147.441.441 0 01-.417.237c-.09-.006-.133-.041-.11-.026l.526-.851a.77.77 0 00-.344-.12.572.572 0 00-.3.06.553.553 0 00-.244.242.673.673 0 00-.058.408c.014.097.044.194.078.283l.934-.358zm15.795 3.522c.081.157.173.459.241.844.067.375.103.783.096 1.129l1 .021a7.007 7.007 0 00-.111-1.325c-.074-.418-.187-.838-.338-1.129l-.888.46zm.337 1.973a15.33 15.33 0 01-.024.65 2.172 2.172 0 01-.016.162c-.006.044-.008.029.008-.01.007-.016.038-.088.115-.156a.48.48 0 01.665.034c.026.029.038.052.039.053.002.004-.006-.01-.023-.057a3.184 3.184 0 01-.06-.174l-.952.305c.047.148.101.306.163.415a.67.67 0 00.085.122.543.543 0 00.27.167.517.517 0 00.473-.114.557.557 0 00.147-.206.959.959 0 00.06-.236c.01-.07.018-.15.024-.237.012-.175.019-.408.026-.697l-1-.021zm.704.502a1.993 1.993 0 00-.174-.424.643.643 0 00-.114-.137.523.523 0 00-.751.042.602.602 0 00-.107.18 1.863 1.863 0 00-.086.486c-.015.188-.026.436-.037.743l1 .034c.01-.304.021-.533.034-.697.007-.082.013-.141.02-.182.007-.048.01-.047.001-.022a.394.394 0 01-.073.118.477.477 0 01-.669.041c-.042-.037-.063-.071-.067-.076-.005-.009.019.036.071.199l.952-.305zm-7.632 7.209a7.471 7.471 0 01-1.005.204 1.985 1.985 0 01-.294.019c-.031-.001-.037-.003-.026-.001.006.002.026.006.052.018a.424.424 0 01.121.085l-.706.707c.114.115.25.151.31.165.074.017.15.023.215.026a3.14 3.14 0 00.447-.026c.325-.039.73-.119 1.146-.231l-.26-.966zm-1.151.325c.026.027.129.143.108.334a.418.418 0 01-.187.309c-.042.026-.067.028-.05.024a.52.52 0 01.085-.006v-1c-.163 0-.383.021-.562.132a.586.586 0 00-.28.432.59.59 0 00.179.482l.706-.707zm-.044.661c.215 0 .432-.051.613-.159.17-.102.39-.313.39-.642h-1c0-.078.028-.137.053-.172a.146.146 0 01.043-.044c0-.001-.007.004-.027.009a.285.285 0 01-.072.008v1zm1.004-.801a.9.9 0 00-.119-.48.654.654 0 00-.575-.305 1.326 1.326 0 00-.466.111 5.494 5.494 0 00-.5.242l.473.882c.176-.095.307-.158.403-.197.106-.043.127-.038.1-.038a.355.355 0 01-.282-.165.24.24 0 01-.036-.083c0-.004.002.004.002.033h1zm-1.659-.432c-.215.115-.606.156-1.19-.012l-.278.961c.7.202 1.395.224 1.94-.067l-.472-.882zm-1.19-.012l-.984-.284-.277.961.983.284.278-.961zm-1.096.696l.906-.049-.054-.998-.905.048.053.999zM107 175.102c.212 0 .498-.092.628-.387.118-.266.026-.523-.07-.678l-.85.526a.17.17 0 01-.021-.063.331.331 0 01.027-.189.335.335 0 01.286-.209v1zm.558-1.065a1.637 1.637 0 00-.252-.314 1.015 1.015 0 00-.168-.129.625.625 0 00-.324-.096v1a.417.417 0 01-.14-.023.25.25 0 01-.052-.025c-.015-.008-.015-.011-.003.001a.594.594 0 01.089.112l.85-.526zm-.532 3.754c-.02.051-.014.016.034-.035a.448.448 0 01.26-.133.475.475 0 01.402.131.385.385 0 01.091.137c.007.018.008.027.007.018a.898.898 0 01-.012-.135l-1 .041c.005.101.013.199.03.286a.98.98 0 00.042.149.609.609 0 00.135.211.527.527 0 00.453.151.549.549 0 00.318-.169.858.858 0 00.168-.28l-.928-.372zm.782-.017c-.006-.138.012-.176.001-.148-.005.011-.019.043-.049.081a.432.432 0 01-.19.136.436.436 0 01-.457-.091l.707-.707a.565.565 0 00-.595-.141.599.599 0 00-.344.35c-.069.171-.08.381-.073.561l1-.041zm-.695-.022a.29.29 0 01-.063-.095c-.004-.011-.002-.009-.001.007a.277.277 0 01-.023.127l.928.372c.07-.175.101-.365.094-.54-.006-.153-.047-.396-.228-.578l-.707.707zm-81.46-20.454c.103.072.224.146.351.189.1.033.402.11.641-.13l-.707-.707a.42.42 0 01.269-.123.29.29 0 01.115.012c.01.003-.019-.007-.094-.06l-.574.819zm.79-.57a.558.558 0 00-.363.477.731.731 0 00.063.353c.066.154.182.322.309.484l.788-.615a1.53 1.53 0 01-.177-.261c-.009-.021.022.035.013.132a.427.427 0 01-.083.215.432.432 0 01-.197.15l-.353-.935zm81.897 12.874c-.022-.492-.054-.863-.104-1.119a1.383 1.383 0 00-.12-.374c-.052-.099-.21-.343-.531-.343v1a.429.429 0 01-.274-.098c-.053-.044-.076-.087-.081-.095-.007-.014.006.007.024.101.035.179.065.487.087.972l.999-.044zm-.65-1.614a.621.621 0 00.351.565c.155.081.33.101.47.106l.037-.999a.645.645 0 01-.076-.007c-.012-.002.002-.001.03.013a.377.377 0 01.188.322h-1zm.853.671l.263-.006-.026-1-.264.007.027.999zM87.362.096l-.101-.995.101.995zM82.4.558l.09.996-.09-.996zm-5.493 12.978l.998.061-.998-.06zm-.193 3.152l.217.976.735-.164.046-.751-.998-.061zm-2.448.544l-.217-.976.217.976zM55.992 24.12l-.472-.881.472.881zm-2.847 1.525l-.719.695.525.543.666-.357-.472-.881zm-5.151-5.333l-.72.695.72-.695zm-5.605-5.319l-.031-1 .032 1zM26.99 27.048l-.71-.704.71.704zm-5.327 16.494l-.722.692.722-.692zm4.982 5.294l.754-.658-.754.658zm.958 1.098l.855.519.38-.626-.481-.55-.754.657zm-1.218 2.003l.855.52-.854-.52zm-7.85 17.373l.956.296-.956-.296zm-1.051 3.469l-.976-.222v.001l.976.221zm-7.276.11l-.027 1 .027-1zm-7.725.081l-.465-.885.465.885zM.708 80.623l-.992-.126.992.126zm-.292 22.321l-.993.119.993-.119zm14.427 5.173l.104-.995-.104.995zm1.82.19l.99-.136-.106-.777-.78-.082-.104.995zm.171 1.252l-.99.135.99-.135zm6.902 18.865l-.885.466.885-.466zm1.814 3.452l.691.723.546-.521-.351-.667-.886.465zm-2.22 2.12l-.69-.724v.001l.69.723zm9.803 29.624l.646-.764-.646.764zm5.8 3.567l-.355-.935.355.935zm5.457-4.804l-.692-.722.692.722zm5.105-4.75l.508.861-.508-.861zm3.79 1.791l-.508.861.509-.861zm7.008 3.642l-.412.911.412-.911zm12.1 4.291l.007-1-.007 1zm.4 7.37l1 .024-1-.024zm.194 7.868l-.808.59v.001l.808-.591zm8.188 1.841l.134-.991-.134.991zm26.064-.912l.707.707-.707-.707zm.603-7.877l1 .015-1-.015zm4.965-8.327l.24.971-.24-.971zm16.742-6.679l-.475-.88.475.88zm2.265-1.221l.722-.692-.527-.55-.67.362.475.88zm1.996 2.085l.722-.692-.722.692zm5.073 5.328l-.725.688.725-.688zm19.17-9.027l.711.703-.711-.703zm8.594-9.846l-.818-.574.818.574zm-1.693-4.6l.717-.697-.717.697zm.539-2.67l-.115-.993.115.993zm30.377-4.252l.14.99-.14-.99zm31.693-4.478l.139.99-.139-.99zm-43.207-.463l-.001 1 .001-1zm-46.225-.038l.001-1h-.407l-.292.284.698.716zm-2.671 2.604l.697.716-.697-.716zm-32.252 16.296l-.167-.986.167.986zm-18.562-.134l.18-.984-.18.984zm-26.41-11.648l-.617.788.617-.788zm-9.96-9.979l-.79.615.79-.615zm-11.832-27.459l.989-.153-.989.153zm-.126-16.443l-.99-.138.99.138zm8.703-23.673l-.84-.542.84.542zm17.498-17.55l.543.84-.543-.84zM85.4 34.72l.17.986-.17-.986zm17.807.009l-.169.986.169-.986zm31.673 15.687l-.691.723.691-.723zm2.394 2.288l-.691.723.289.276.4.001.002-1zm46.463.082l-.001 1 .001-1zm38.845-1.12l.131-.991-.131.991zm-41.384-5.747l.14-.99-.14.99zm-11.683-2.564l.804.595-.804-.595zm.125-1.938l.88-.474-.88.474zm-6.828-9.064l.762-.648-.762.648zm-16.375-14.62l-.02-1 .02 1zm-3.236 2.424l.685.729-.685-.729zm-5.354 4.999l-.68-.733.68.733zm-2.788 2.588l-.533.846.65.41.563-.523-.68-.733zm-1.438-.905l-.533.846.533-.847zm-18.473-8.37l.298-.954-.298.954zm-3.152-.982l-1-.012-.008.745.711.221.297-.954zm.068-5.993l1 .011-1-.01zm.228-7.2l.991.132-.991-.131zm-2.838-2.743l.185-.983-.185.983zM87.896 38.269l-.096-.996.096.995zm-26.19 9.854l.578.816-.577-.816zm-12.68 12.67l.82.574-.82-.573zm-5.78 53.168l-.92.389.92-.389zm11.667 17.055l.708-.707-.708.707zm13.741 10.056l-.453.891.453-.891zm35.868 4.878l.201.979-.201-.979zm9.597-2.932l.707-.707-.707.707zm-1.75.346l-.286-.958.286.958zm-10.821 1.56l.05.998h.001l-.051-.998zm-32.285-9.475l-.58.815.58-.815zm-11.599-11.178l-.796.605.796-.605zm-.04-63.409l.796.605-.796-.605zm11.639-11.23l-.58-.816.58.816zm42.512-8.06l.262-.965-.262.965zm-1.001-.76l-.305.952.305-.952zM25.94 156.89l.682-.731-.05-.048-.058-.04-.574.819zm.905.846l.789-.615-.049-.062-.057-.054-.683.731zm80.994 11.889h-1v.022l.001.022.999-.044zm0-1.446l-.026-1-.974.026v.974h1zm.69-.018l.036-1-.031-.001-.032.001.027 1zm.263-.007l.073.997-.073-.997zM87.26-.899c-.574.059-2.8.266-4.95.46l.18 1.993c2.147-.195 4.386-.403 4.974-.463L87.26-.9zm-4.95.46c-1.315.12-2.382.21-3.194.368C78.307.086 77.548.342 77 .94c-.55.6-.737 1.379-.82 2.198-.085.82-.079 1.889-.079 3.206h2c0-1.371-.003-2.31.068-3.003.07-.695.201-.936.306-1.05.105-.114.335-.266 1.023-.4.686-.133 1.624-.215 2.993-.338l-.18-1.992zM76.1 6.346c0 2.207-.087 5.422-.191 7.13l1.996.122c.108-1.758.195-5.015.195-7.252h-2zm-.191 7.13l-.193 3.152 1.996.122.193-3.152-1.996-.122zm.588 2.237l-2.448.544.434 1.952 2.448-.544-.434-1.952zm-2.448.544c-5.674 1.261-13.015 4.03-18.529 6.982L56.464 25c5.366-2.873 12.536-5.574 18.02-6.793l-.435-1.952zM55.52 23.238l-2.847 1.524.944 1.764L56.464 25l-.944-1.763zm-1.656 1.711l-5.151-5.333-1.439 1.39 5.152 5.333 1.438-1.39zm-5.151-5.333a130.052 130.052 0 00-3.802-3.793c-.513-.487-.955-.89-1.29-1.177a7.136 7.136 0 00-.453-.361 2.212 2.212 0 00-.229-.146 1.312 1.312 0 00-.18-.081 1.08 1.08 0 00-.401-.066l.063 2a.918.918 0 01-.435-.095c-.02-.01-.017-.01.017.014.065.046.17.13.32.257.296.252.708.629 1.211 1.106 1.003.951 2.331 2.272 3.74 3.732l1.439-1.39zm-6.355-5.623a2.2 2.2 0 00-.68.149c-.2.074-.415.173-.635.287-.44.228-.963.545-1.54.924-1.155.76-2.59 1.813-4.121 3.012-3.063 2.398-6.572 5.428-9.102 7.98l1.42 1.408c2.455-2.476 5.897-5.45 8.915-7.813 1.508-1.18 2.895-2.197 3.988-2.916.548-.36 1.006-.636 1.359-.818.177-.092.312-.152.41-.188.112-.042.115-.029.05-.027l-.064-1.998zM26.28 26.343c-2.545 2.567-4.906 5.194-6.636 7.334-.864 1.067-1.583 2.029-2.091 2.808a9.84 9.84 0 00-.62 1.07c-.135.28-.294.665-.294 1.052h2c0 .098-.024.065.096-.185.102-.212.264-.493.493-.845.456-.7 1.128-1.601 1.97-2.643 1.683-2.079 3.997-4.656 6.502-7.183l-1.42-1.408zm-9.64 12.264c0 .422.195.806.358 1.08.185.31.449.668.781 1.076.668.82 1.698 1.943 3.162 3.47l1.444-1.384c-1.461-1.524-2.443-2.598-3.056-3.35a7.553 7.553 0 01-.613-.836c-.135-.225-.077-.21-.077-.056h-2zm4.301 5.626c2.22 2.314 4.443 4.677 4.95 5.26l1.508-1.316c-.546-.625-2.807-3.026-5.014-5.328l-1.444 1.384zm4.95 5.26l.959 1.097 1.507-1.315-.958-1.098-1.507 1.315zm.858-.08l-1.218 2.004 1.71 1.038 1.217-2.003-1.71-1.039zm-1.218 2.004a78.702 78.702 0 00-7.95 17.595l1.91.593a76.702 76.702 0 017.75-17.15l-1.71-1.038zm-7.95 17.595c-.531 1.71-1.023 3.329-1.072 3.544l1.95.444.02-.074.068-.232.23-.77c.19-.626.444-1.45.714-2.319l-1.91-.593zm-1.073 3.545c.105-.461.475-.63.489-.637a.685.685 0 01.115-.046l.007-.002-.015.003-.046.007c-.04.006-.092.012-.16.018-.276.026-.71.045-1.316.054-1.203.019-2.994-.003-5.348-.065l-.053 2c2.362.062 4.186.084 5.431.065.619-.01 1.116-.03 1.472-.062.171-.016.348-.038.5-.075a1.44 1.44 0 00.312-.11c.058-.03.453-.222.563-.708l-1.95-.442zm-6.273-.668a151.492 151.492 0 00-5.33-.059c-.696.007-1.285.023-1.724.048a9.07 9.07 0 00-.571.046c-.08.01-.163.022-.243.039a1.353 1.353 0 00-.349.12l.929 1.772a.786.786 0 01-.149.062l.054-.008a7.16 7.16 0 01.44-.034c.396-.023.95-.038 1.634-.045 1.366-.014 3.21.004 5.255.058l.054-1.999zm-8.217.195c-.797.418-1.123 1.286-1.38 2.391-.273 1.18-.545 3.053-.922 6.02l1.984.253c.38-2.99.64-4.758.887-5.821.264-1.139.447-1.118.36-1.072l-.929-1.771zm-2.302 8.412c-.82 6.447-.96 17.004-.293 22.566l1.986-.238C.764 97.45.897 87.06 1.7 80.749l-1.983-.252zm-.293 22.566c.15 1.251.258 2.292.444 3.073.192.81.514 1.557 1.244 2.062.673.466 1.543.611 2.512.675.991.066 2.308.054 3.998.054v-2c-1.74 0-2.96.011-3.866-.049-.928-.062-1.314-.192-1.507-.325-.136-.094-.29-.269-.435-.879-.152-.638-.243-1.513-.404-2.849l-1.986.238zm8.198 5.864c2.98 0 6.177.086 7.118.184l.208-1.989c-1.061-.111-4.363-.195-7.326-.195v2zm7.118.184l1.82.19.208-1.989-1.82-.19-.208 1.989zm.933-.668l.171 1.251 1.982-.271-.172-1.252-1.981.272zm.171 1.251c.277 2.019 1.322 5.462 2.625 9.025 1.312 3.585 2.924 7.395 4.383 10.171l1.77-.931c-1.403-2.671-2.981-6.392-4.274-9.927-1.302-3.557-2.277-6.824-2.522-8.609l-1.982.271zm7.008 19.196l1.814 3.451 1.77-.93-1.814-3.452-1.77.931zm2.009 2.263l-2.22 2.119 1.381 1.447 2.22-2.12-1.381-1.446zm-2.22 2.12c-3.7 3.533-5.819 5.575-7.01 6.805-.592.61-.99 1.057-1.244 1.405-.246.339-.463.725-.463 1.191h2c0 .179-.092.222.08-.014.165-.226.478-.587 1.063-1.19 1.158-1.196 3.244-3.207 6.955-6.751l-1.381-1.446zm9.846 31.11c1.917 1.623 3.2 2.651 4.132 3.224.943.58 1.78.852 2.67.515l-.71-1.87c-.008.003-.143.124-.912-.348-.78-.48-1.947-1.405-3.887-3.048l-1.293 1.527zm6.801 3.739c.186-.071.365-.195.468-.268a9.9 9.9 0 00.462-.353c.344-.276.782-.65 1.282-1.09a120.49 120.49 0 003.583-3.306l-1.384-1.444a118.07 118.07 0 01-3.52 3.249c-.49.431-.903.782-1.214 1.032a9.066 9.066 0 01-.366.281c-.118.084-.105.061-.02.029l.71 1.87zm5.795-5.017a342.49 342.49 0 013.438-3.252c.46-.429.844-.781 1.123-1.032.14-.126.25-.223.329-.29.112-.097.097-.076.031-.037l-1.016-1.723c-.118.07-.251.185-.314.239-.098.083-.222.193-.367.324-.292.262-.684.623-1.149 1.055-.93.865-2.157 2.025-3.459 3.272l1.384 1.444zm4.922-4.611a.866.866 0 01-.372.12.503.503 0 01-.123-.002c-.019-.002.002-.001.078.024.147.048.377.141.693.291.624.295 1.485.759 2.497 1.358l1.018-1.721c-1.04-.616-1.96-1.115-2.66-1.446a8.386 8.386 0 00-.93-.384 2.466 2.466 0 00-.434-.104c-.09-.012-.442-.061-.784.142l1.017 1.722zm2.773 1.791c1.907 1.127 5.092 2.783 7.104 3.692l.823-1.822c-1.945-.879-5.065-2.501-6.91-3.592l-1.017 1.722zm7.104 3.692c1.878.849 4.675 1.931 7.123 2.799a79.51 79.51 0 003.29 1.098c.457.139.863.255 1.196.336.298.073.634.145.896.147l.014-2c.004 0-.116-.011-.433-.089-.283-.07-.651-.173-1.09-.307a77.456 77.456 0 01-3.205-1.07c-2.423-.86-5.161-1.92-6.968-2.736l-.823 1.822zm12.505 4.38c.054 0-.05.008-.185-.046a.735.735 0 01-.36-.309c-.041-.074-.035-.102-.018-.009.015.084.03.222.043.442.049.904.013 2.691-.072 6.269l2 .047c.083-3.525.123-5.421.069-6.425a5.792 5.792 0 00-.07-.683 1.962 1.962 0 00-.209-.622 1.274 1.274 0 00-.633-.565c-.241-.097-.466-.098-.55-.099l-.015 2zm-.592 6.347c-.065 2.769-.087 4.664-.056 5.918.015.625.044 1.117.092 1.491.024.186.055.365.1.527.04.148.11.355.25.545l1.614-1.18c.07.096.079.159.064.107a2.017 2.017 0 01-.044-.253 13.452 13.452 0 01-.077-1.286c-.03-1.2-.009-3.051.056-5.822l-1.999-.047zm.386 8.482c.285.39.742.617 1.13.77.43.169.985.325 1.66.477 1.355.304 3.332.623 6.07.994l.269-1.982c-2.732-.37-4.636-.679-5.9-.964-.634-.142-1.074-.271-1.365-.386-.332-.131-.322-.188-.25-.09l-1.614 1.181zm8.86 2.241c4.094.554 10.32.679 15.68.492 2.684-.094 5.178-.267 7.102-.509.959-.121 1.799-.262 2.459-.424.329-.081.634-.173.896-.28.241-.097.538-.243.769-.475l-1.414-1.414c.054-.054.055-.03-.107.036a4.567 4.567 0 01-.623.191c-.552.136-1.306.265-2.23.381-1.842.232-4.271.402-6.922.495-5.312.186-11.41.057-15.341-.475l-.269 1.982zm26.906-1.196c.27-.269.423-.596.522-.969.093-.352.152-.802.196-1.378.089-1.159.133-3.056.178-6.222l-2-.029c-.046 3.187-.089 5.015-.172 6.099-.042.545-.09.847-.136 1.019-.04.151-.058.122-.002.066l1.414 1.414zm5.101-15.94c4.79-1.187 11.852-4.006 16.976-6.769l-.949-1.761c-5.003 2.698-11.908 5.449-16.508 6.589l.481 1.941zm16.976-6.769l2.265-1.222-.949-1.76-2.265 1.221.949 1.761zm1.069-1.41l1.996 2.084 1.444-1.383-1.996-2.085-1.444 1.384zm1.996 2.084c1.096 1.146 3.378 3.542 5.07 5.325l1.451-1.376a2128.199 2128.199 0 00-5.077-5.332l-1.444 1.383zm5.07 5.325a41.937 41.937 0 002.428 2.385c.334.298.641.553.898.738.127.092.262.181.394.252.088.047.339.18.649.18v-2c.228 0 .359.091.293.056a1.584 1.584 0 01-.165-.109 10.355 10.355 0 01-.74-.611 40.53 40.53 0 01-2.306-2.267l-1.451 1.376zm4.369 3.555c.263 0 .512-.073.695-.139.201-.073.415-.172.633-.284a17.13 17.13 0 001.528-.922c1.149-.761 2.581-1.821 4.118-3.036 3.074-2.429 6.627-5.524 9.263-8.186l-1.421-1.407c-2.566 2.59-6.054 5.631-9.082 8.024-1.513 1.196-2.897 2.219-3.982 2.938-.545.361-.997.633-1.343.812-.173.09-.303.147-.394.18-.108.039-.098.02-.015.02v2zm16.237-12.567c3.439-3.472 6.999-7.546 8.702-9.974l-1.637-1.149c-1.61 2.295-5.081 6.277-8.486 9.716l1.421 1.407zm8.702-9.974c.27-.385.533-.804.67-1.264a2.356 2.356 0 00-.055-1.531c-.175-.476-.488-.933-.871-1.4-.388-.475-.902-1.023-1.539-1.677l-1.433 1.395c.634.651 1.096 1.146 1.425 1.549.335.409.481.661.541.824.044.121.041.183.015.269-.04.133-.142.332-.39.686l1.637 1.149zm-1.795-5.872c-.553-.569-.921-.958-1.145-1.241a1.615 1.615 0 01-.164-.235c-.013-.028.059.102.016.314a.666.666 0 01-.266.419c-.039.025-.027.007.107-.028.266-.069.697-.129 1.389-.209l-.23-1.986c-.654.075-1.235.148-1.662.259-.214.056-.468.14-.696.288a1.34 1.34 0 00-.602.861 1.49 1.49 0 00.136.936c.105.223.253.433.403.622.3.379.745.845 1.281 1.395l1.433-1.395zm-.063-.98c.953-.11 14.645-2.026 30.402-4.255l-.28-1.98c-15.783 2.232-29.432 4.142-30.352 4.249l.23 1.986zm30.402-4.255a97237.54 97237.54 0 0131.692-4.478l-.279-1.981c-1.66.234-15.922 2.249-31.693 4.479l.28 1.98zm31.692-4.478c.173-.025.337-.05.471-.078.065-.014.143-.032.22-.056.028-.008.233-.066.416-.223a1.016 1.016 0 00-.045-1.583c-.201-.153-.422-.198-.451-.204a3.653 3.653 0 00-.518-.069c-.762-.062-2.438-.105-5.429-.137-6.012-.064-17.49-.086-38.009-.103l-.002 2c20.524.017 31.99.039 37.99.103 3.015.032 4.612.075 5.288.13.177.014.235.026.229.024a.862.862 0 01-.309-.153.982.982 0 01.173-1.667.618.618 0 01.07-.026c.013-.005.007-.002-.029.005-.07.015-.182.034-.344.056l.279 1.981zm-43.345-2.453l-46.225-.038-.001 2 46.224.038.002-2zm-46.924.246l-2.671 2.604 1.395 1.432 2.672-2.604-1.396-1.432zm-2.671 2.603c-8.96 8.731-19.183 13.899-31.721 16.027l.335 1.971c12.931-2.194 23.526-7.546 32.781-16.565l-1.395-1.433zm-31.721 16.027c-2.187.371-5.613.547-9.092.522-3.477-.025-6.915-.25-9.124-.654l-.359 1.968c2.377.434 5.949.661 9.469.686 3.52.026 7.082-.15 9.441-.551l-.335-1.971zm-18.216-.132c-9.767-1.783-18.6-5.683-25.973-11.452l-1.233 1.576c7.643 5.979 16.78 10.005 26.847 11.844l.36-1.968zm-25.973-11.452c-2.661-2.082-7.712-7.142-9.788-9.805l-1.577 1.229c2.175 2.792 7.343 7.969 10.132 10.152l1.233-1.576zm-9.788-9.805c-6.166-7.913-10.088-17.015-11.631-26.998l-1.977.305c1.595 10.318 5.654 19.739 12.03 27.922l1.578-1.229zm-11.631-26.998c-.616-3.98-.679-12.19-.125-16.152l-1.98-.276c-.582 4.155-.517 12.562.128 16.733l1.977-.305zm-.125-16.151c1.127-8.06 4.292-16.666 8.553-23.27l-1.68-1.084c-4.424 6.856-7.688 15.738-8.854 24.077l1.98.276zm8.553-23.27c4.244-6.577 10.686-13.037 17.201-17.252l-1.086-1.679c-6.755 4.37-13.399 11.034-17.795 17.847l1.68 1.084zm17.201-17.252c6.665-4.31 14.137-7.172 22.507-8.608l-.338-1.971c-8.619 1.478-16.349 4.432-23.255 8.9l1.086 1.68zm22.507-8.608c1.986-.34 5.322-.518 8.717-.516 3.395.002 6.743.182 8.752.525l.337-1.972c-2.18-.372-5.663-.551-9.088-.553-3.424-.002-6.897.175-9.056.545l.338 1.97zm17.469.009c12.225 2.085 22.552 7.204 31.151 15.424l1.382-1.446c-8.9-8.507-19.595-13.8-32.196-15.95l-.337 1.972zm31.151 15.424l2.394 2.288 1.382-1.446-2.394-2.288-1.382 1.446zm3.083 2.565l46.464.082.003-2-46.464-.082-.003 2zm46.464.082c12.778.023 24.298.02 32.565-.004 4.133-.012 7.454-.029 9.713-.05 1.129-.01 1.997-.022 2.569-.035.283-.006.505-.013.651-.021.063-.003.148-.008.221-.018a1.2 1.2 0 00.204-.048 1 1 0 00-.087-1.925l-.475 1.943a1.006 1.006 0 01-.367-.177 1 1 0 01.452-1.775c.021-.003.015 0-.052.003-.115.006-.31.012-.592.018-.559.013-1.415.024-2.543.035-2.252.021-5.568.038-9.7.05-8.263.023-19.779.027-32.556.004l-.003 2zm45.836-2.101c-.297-.073-1.237-.22-2.433-.396-1.229-.18-2.803-.4-4.426-.614l-.262 1.983c1.615.213 3.179.431 4.398.61 1.251.183 2.068.316 2.248.36l.475-1.943zm-6.859-1.01c-6.756-.893-24.465-3.352-41.375-5.746l-.28 1.98c16.91 2.394 34.627 4.854 41.393 5.749l.262-1.983zm-41.375-5.746c-3.206-.454-6.16-.866-8.338-1.165-1.089-.15-1.985-.271-2.621-.356a90.58 90.58 0 00-.983-.124c-.028-.003-.125-.014-.205-.014v2c-.055 0-.087-.006-.012.002l.198.024c.175.021.424.053.74.095.631.084 1.523.204 2.611.354 2.174.299 5.126.711 8.33 1.164l.28-1.98zm-12.147-1.66c.145 0 .373.04.583.215.209.175.287.39.314.53a.767.767 0 01-.005.31l-.004.014.004-.009.011-.025a2.74 2.74 0 01.225-.354l-1.608-1.19c-.216.292-.412.613-.517.911-.043.12-.131.397-.072.713.035.185.132.436.369.635.239.2.506.25.7.25v-2zm1.128.68c.157-.211.317-.428.435-.627.125-.213.253-.489.275-.83.022-.34-.068-.63-.162-.857-.089-.214-.219-.454-.347-.692l-1.761.949c.144.266.219.409.261.511.038.09.007.053.013-.04.007-.097.043-.134-.002-.057-.054.09-.143.216-.32.455l1.608 1.189zm.201-3.006c-.409-.76-1.528-2.339-2.814-4.045a119.647 119.647 0 00-4.132-5.193l-1.524 1.295c1.26 1.481 2.771 3.391 4.059 5.1 1.307 1.736 2.326 3.19 2.65 3.792l1.761-.949zm-6.946-9.238c-2.474-2.91-6.227-6.605-9.543-9.566-1.66-1.481-3.226-2.793-4.482-3.738a18.818 18.818 0 00-1.667-1.144 5.49 5.49 0 00-.684-.351c-.192-.08-.475-.178-.781-.172l.039 2c-.117.001-.145-.031-.023.02.098.04.241.112.432.225.382.226.882.57 1.481 1.02 1.195.9 2.716 2.17 4.353 3.632 3.277 2.926 6.957 6.555 9.351 9.37l1.524-1.296zm-17.157-14.971a1.581 1.581 0 00-.53.111 3.08 3.08 0 00-.398.19 7.994 7.994 0 00-.834.558c-.6.45-1.336 1.081-2.139 1.835l1.37 1.458c.771-.724 1.447-1.302 1.968-1.692a6.13 6.13 0 01.614-.415c.074-.04.117-.06.133-.066.028-.01-.031.018-.145.02l-.039-2zm-3.901 2.694a1440.914 1440.914 0 01-5.349 4.995l1.36 1.466c1.535-1.425 3.946-3.676 5.359-5.003l-1.37-1.458zm-5.349 4.995l-2.789 2.588 1.361 1.466 2.788-2.588-1.36-1.466zm-1.575 2.475l-1.438-.906-1.066 1.693 1.438.905 1.066-1.692zm-1.438-.906c-5.789-3.647-11.481-6.224-18.708-8.477l-.596 1.91c7.08 2.207 12.611 4.714 18.238 8.26l1.066-1.693zm-18.708-8.477l-3.152-.983-.595 1.91 3.151.982.596-1.91zm-2.45-.017l.068-5.992-2-.023-.068 5.992 2 .023zm.068-5.993c.038-3.326.141-6.49.219-7.079l-1.982-.263c-.098.74-.2 4.055-.237 7.32l2 .022zm.219-7.079c.124-.933.12-1.942-.667-2.703-.355-.342-.801-.565-1.275-.731-.475-.167-1.046-.3-1.702-.424l-.371 1.965c.624.118 1.077.229 1.41.346.336.118.483.22.547.282.051.05.186.171.076 1.002l1.982.263zM109.639.567C106.976.063 102.356-.4 97.953-.69c-4.385-.288-8.689-.414-10.692-.209l.203 1.99c1.81-.185 5.95-.075 10.358.215 4.389.288 8.908.746 11.446 1.226l.371-1.965zm-21.84 36.706c-9.07.875-18.995 4.611-26.67 10.033l1.155 1.633c7.4-5.227 16.994-8.835 25.708-9.675l-.192-1.99zM61.13 47.306c-1.922 1.358-4.508 3.67-6.915 6.075-2.406 2.404-4.697 4.965-6.008 6.84l1.64 1.146c1.21-1.731 3.404-4.195 5.782-6.571 2.376-2.375 4.87-4.595 6.656-5.857l-1.154-1.633zM48.207 60.22c-11.362 16.247-13.52 36.075-5.88 54.129l1.841-.779c-7.368-17.411-5.295-36.513 5.678-52.204l-1.639-1.146zm-5.88 54.129c2.803 6.625 6.415 11.901 11.88 17.372l1.415-1.413c-5.298-5.304-8.759-10.369-11.454-16.738l-1.842.779zm11.88 17.372c4.706 4.713 8.297 7.342 13.995 10.241l.907-1.783c-5.502-2.799-8.923-5.301-13.487-9.871l-1.415 1.413zM68.2 141.963c11.353 5.776 24.098 7.511 36.522 4.966l-.402-1.959c-11.977 2.453-24.262.783-35.213-4.79l-.907 1.783zm36.522 4.966c1.524-.312 4.016-.999 6.083-1.63a59.2 59.2 0 002.665-.872c.335-.121.631-.236.846-.337a2.1 2.1 0 00.352-.2c.044-.031.194-.141.308-.331a1.02 1.02 0 00-.151-1.248l-1.415 1.414a.98.98 0 01-.149-1.195c.101-.168.225-.253.23-.257.044-.031.053-.03-.023.006-.129.06-.356.151-.679.268-.635.23-1.546.527-2.568.839-2.05.626-4.47 1.291-5.901 1.584l.402 1.959zm10.103-4.618a1.06 1.06 0 00-.69-.307 1.698 1.698 0 00-.281.003 4.62 4.62 0 00-.5.076c-.356.07-.806.184-1.272.323l.572 1.916c.421-.125.808-.222 1.088-.277a2.77 2.77 0 01.279-.045c.026-.002.006.001-.041-.002a.96.96 0 01-.569-.273l1.414-1.414zm-2.743.095c-2.406.718-6.496 1.313-10.585 1.519l.101 1.997c4.168-.209 8.435-.818 11.056-1.6l-.572-1.916zm-10.585 1.519c-10.806.542-22.734-2.957-31.656-9.292l-1.158 1.631c9.284 6.592 21.655 10.224 32.914 9.658l-.1-1.997zm-31.656-9.292c-3.256-2.311-9.04-7.886-11.381-10.967l-1.593 1.21c2.468 3.247 8.4 8.963 11.816 11.388l1.158-1.631zM58.46 123.666c-13.905-18.295-13.92-43.946-.041-62.199l-1.592-1.21c-14.425 18.97-14.407 45.61.04 64.619l1.593-1.21zm-.041-62.199c2.38-3.13 8.146-8.694 11.422-11.02l-1.158-1.63c-3.438 2.44-9.351 8.145-11.856 11.44l1.592 1.21zm11.422-11.02c8.314-5.903 19.418-9.402 29.868-9.402v-2c-10.854 0-22.365 3.622-31.026 9.771l1.158 1.631zm29.868-9.402c3.295 0 8.95.718 11.803 1.492l.524-1.93c-3.04-.826-8.873-1.562-12.327-1.562v2zm11.803 1.492c.873.237 1.517.393 1.929.47.173.033.407.073.606.063a1.15 1.15 0 00.308-.056 1.016 1.016 0 00.501-1.57 1.117 1.117 0 00-.229-.232 2.68 2.68 0 00-.527-.285 14.677 14.677 0 00-.706-.28 56.179 56.179 0 00-2.316-.787l-.61 1.904a53.83 53.83 0 012.229.758c.264.098.465.178.605.239.175.076.175.09.116.044a.847.847 0 01-.175-.18.977.977 0 01-.134-.895.976.976 0 01.614-.613c.118-.04.211-.043.231-.044.067-.004.053.006-.144-.031-.33-.062-.911-.2-1.774-.435l-.524 1.93zm-.434-2.677c-7.903-2.532-15.301-3.356-23.279-2.587l.192 1.99c7.697-.741 14.822.05 22.477 2.501l.61-1.904zM13.923 142.674c0 .3.11.583.181.753.087.206.206.435.34.674.271.479.65 1.069 1.096 1.723.894 1.31 2.1 2.933 3.36 4.55a114.561 114.561 0 003.728 4.551c.57.655 1.098 1.238 1.552 1.706.439.452.854.844 1.186 1.077l1.148-1.638c-.163-.114-.464-.385-.899-.832-.42-.433-.922-.986-1.478-1.625a113.156 113.156 0 01-3.66-4.469c-1.246-1.598-2.423-3.185-3.285-4.448a23.242 23.242 0 01-1.006-1.579 4.922 4.922 0 01-.24-.47c-.062-.145-.023-.107-.023.027h-2zm12.134 15.676c.846 1.085 3.301 3.384 6.43 6.033l1.292-1.527c-3.158-2.673-5.448-4.842-6.145-5.736l-1.577 1.23zm-.8-.73l.905.846 1.366-1.462-.906-.846-1.365 1.462zm83.585 18.042c.044-3.001.047-4.93-.004-6.082l-1.998.088c.048 1.084.046 2.954.002 5.965l2 .029zm-.003-6.038v-1.446h-2v1.446h2zm-.347-.465c.121.004.246 0 .373-.009l-.145-1.995a1.397 1.397 0 01-.155.005l-.073 1.999zm.373-.009c.765-.056 2.113-.347 4.182-.859l-.48-1.941c-2.118.524-3.287.765-3.847.805l.145 1.995zm-1 .027l.69-.018-.053-1.999-.689.018.052 1.999z"
                                          fill="#F60"
                                          mask="url(#a)"
                                      />
                                      <Path
                                          d="M127.626 66L90.36 110.366 74.542 90.669 70 96.02l10.246 12.068L90.36 120l10.049-11.836L132 70.954 127.626 66z"
                                          fill="#333"
                                      />
                                  </Svg>
                              </View>
                              <Text  style={styles.successPasswordPopup_title}>
                                  Ваш пароль
                                  успешно изменён
                              </Text>
                              <TouchableOpacity style={styles.successPasswordPopup_sign_in_btn} onPress={() => {this.redirectToSignIn()}}>
                                  <Text style={styles.successPasswordPopup_sign_in_btn_text}>Войти</Text>
                              </TouchableOpacity>
                          </ScrollView>
                      </View>
                  </View>
                }

            </SafeAreaView>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: '#ffffff',
        width: "100%",
        height: "100%",



    },

    recovery_account_header: {
        paddingHorizontal: 25,
        paddingTop: 20,
    },
    back_to_sign_in_btn_wrapper: {
        marginBottom: 5,
    },
    recovery_account_email_main_wrapper: {
        width: '100%',
        paddingHorizontal: 25,
        // paddingTop: 76,

    },

    recovery_account_email_main_title: {
        color: "#333333",
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 30,
        lineHeight: 36,
        textAlign: 'center',

    },

    recovery_account_email_second_title: {
        color: '#545454',
        fontSize: 14,
        fontWeight: '400',
        marginBottom: 18,
        lineHeight: 16,
    },

    recovery_account_email_input_field: {
        width: '100%',
        borderRadius: 6,
        backgroundColor: '#F1F1F1',
        height: 50,
        color: '#000000',
        fontSize: 15,
        fontWeight: '400',
        paddingHorizontal: 15,
    },


    recovery_account_email_input_title: {
        color: '#000000',
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 11,
        lineHeight: 17,
    },

    recovery_account_email_input_wrapper: {
        marginBottom: 66,
    },

    recovery_account_email_send_code_btn: {
        backgroundColor: '#FF6600',
        borderRadius: 8,
        width: "100%",
        maxWidth: 265,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },

    recovery_account_email_send_code_btn_text: {
        color: '#ffffff',
        fontWeight:'bold',
        fontSize: 18,
        lineHeight: 29,
    },


    error_text: {
        fontSize: 12,
        color: "red",
        fontWeight: "bold",
        marginTop: 5,
        marginBottom: 10,
    },

    recovery_account_img_parent: {
        paddingBottom: 30,
        alignItems: "flex-end",
    },

    recovery_account_img: {
        width: 113,
        height: 28,
    },

    recovery_account_code_header: {
        marginBottom: 34,
        paddingHorizontal: 15,
        paddingTop: 20,
        width: '100%',
    },

    back_to_recovery_email_btn_wrapper: {
        marginBottom: 31,
    },
    recovery_account_code_main_wrapper: {
        width: '100%',
        flex: 1,
        paddingHorizontal: 25,

    },

    recovery_account_code_main_title: {
        color: "#333333",
        fontSize: 36,
        fontWeight: 'bold',
        lineHeight: 36,
        textAlign: "center",
    },

    recovery_account_code_second_title: {
        color: '#545454',
        fontSize: 14,
        fontWeight: '400',
        marginBottom: 48,
        marginRight: 35,
        lineHeight: 16,
    },



    recovery_account_confirm_code_btn: {
        backgroundColor: '#FF6600',
        borderRadius: 8,
        width: "100%",
        maxWidth: 265,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },

    recovery_account_confirm_code_btn_text: {
        color: '#ffffff',
        fontWeight:'bold',
        fontSize: 18,
        lineHeight: 21,
    },

    code_input_field: {
        maxWidth: 45,
        flex:1,
        height: 60,
        backgroundColor: '#F1F1F1',
        fontSize:15,
        color:'#000000',
        borderRadius:8,
        fontWeight: "bold",
        marginRight: 10,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",

    },


    recovery_account_code_inputs_wrapper: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 10,
        width: 200,

    },
    send_code_again_btn_wrapper: {
        marginBottom: 36,
    },
    send_code_again_btn: {
        alignSelf: "center",
    },
    send_code_again_btn_text: {
        color: "#333333",
        fontSize: 14,
        fontWeight: '500',
        textDecorationLine: 'underline'
    },


    success_text: {
        fontSize: 12,
        color: "green",
        fontWeight: "bold",
        marginTop: 5,
        marginBottom: 10,
        marginLeft: 20
    },
    recovery_password_phone_code_popup: {
        backgroundColor:  'rgba(255, 255, 255, 0.25)',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 999,
        zIndex: 999999,
        width: '100%',
        height: windowHeight + 40,
        position: 'absolute',
        left: 0,
        top: 0,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },

    new_password_popup: {
        backgroundColor:  'rgba(255, 255, 255, 0.25)',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 999,
        zIndex: 999999,
        width: '100%',
        height: windowHeight + 40,
        position: 'absolute',
        left: 0,
        top: 0,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },

    new_password_popup_wrapper: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        paddingTop: 50,
        paddingBottom: 50,
        // paddingHorizontal: 40,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        position: 'relative',
        flex: 1,
    },
    recovery_password_phone_code_popup_wrapper: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        paddingTop: 50,
        paddingBottom: 50,
        // paddingHorizontal: 40,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        position: 'relative',
        flex: 1,
    },


    new_password_header: {
        paddingTop: 30,
        paddingHorizontal: 33,
        marginBottom: 35,
        width: '100%',
    },
    new_password_img_parent: {
        marginBottom: 47,
    },

    new_password_main_title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#333333',
        textAlign: 'center',
    },
    new_password_main_wrapper: {
        width: '100%',
        flex: 1,
        paddingHorizontal: 25,
    },
    new_password_second_title: {
        fontSize: 14,
        fontWeight: '400',
        color: '#545454',
        marginBottom: 35,

    },

    new_password_input_title: {
        marginBottom: 11,
        fontSize: 15,
        fontWeight: '500',
        color: "#000000",
    },

    new_password_input_field: {
        backgroundColor: "#F1F1F1",
        borderRadius: 6,
        width: '100%',
        height: 50,
        color: "#000000",
        fontSize: 15,
        fontWeight: '400',
        paddingHorizontal: 12,
    },
    new_password_input_title_wrapper: {
        marginBottom: 16,
    },

    new_password_send_code_btn: {
        borderRadius: 8,
        backgroundColor: '#FF6600',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    },

    new_password_send_code_btn_text: {
        fontSize: 18,
        fontWeight: '700',
        color: '#ffffff',
    },

    successPasswordPopup: {
        backgroundColor:  'rgba(255, 255, 255, 0.25)',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 999,
        zIndex: 999999,
        width: '100%',
        height: windowHeight + 40,
        position: 'absolute',
        left: 0,
        top: 0,
    },
    successPasswordPopup_wrapper: {
        backgroundColor: '#F5F5F5',
        width: '100%',
        height: '100%',
        paddingTop: 50,
        paddingBottom: 168,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },


    successPasswordPopup_close_btn: {
        position: 'absolute',
        right: 20,
        top:60,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,

    },
    successPasswordPopup_img_parent: {
        paddingTop: 70,
        marginBottom: 30,
        // width: 230,
        // height: 185,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },

    successPasswordPopup_img: {
        width: '100%',
    },
    successPasswordPopup_title: {
        marginBottom: 140,
        fontSize: 30,
        color: '#333333',
        fontWeight: '300',
        paddingHorizontal: 30,
        textAlign: 'center',
    },
    successPasswordPopup_sign_in_btn: {
        backgroundColor: '#FF6600',
        borderRadius: 8,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',

    },
    successPasswordPopup_sign_in_btn_text: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight:'700',
    },
    successPasswordPopup_scroll: {
        width: '100%',
        flex: 1,
        paddingHorizontal: 40,
    }

});
