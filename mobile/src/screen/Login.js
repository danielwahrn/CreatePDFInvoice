import React, { Component, Fragment } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Alert,
  Dimensions
} from 'react-native';

import DeepLinking from 'react-native-deep-linking';

export default class Login extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    username: '',
    password: '',
    response: {} // app link
  };

  /////// app link //////////
  componentDidMount() {
    DeepLinking.addScheme('ytd://');
    // Linking.addEventListener('url', this.handleUrl);

    DeepLinking.addRoute('/test', (response) => {
      // ytd://test
      this.setState({ response });
    });

    DeepLinking.addRoute('/test/:id', (response) => {
      // ytd://test/23
      this.setState({ response });
    });

    DeepLinking.addRoute('/test/:id/details', (response) => {
      // ytd://test/100/details
      this.setState({ response });
    });

    // Linking.getInitialURL().then((url) => {
    //   if (url) {
    //     Linking.openURL(url);
    //   }
    // }).catch(err => console.error('An error occurred', err));
  }

  componentWillUnmount() {
    //Linking.removeEventListener('url', this.handleUrl);
  }

  handleUrl = ({ url }) => {
    // Linking.canOpenURL(url).then((supported) => {
    //   if (supported) {
    //     DeepLinking.evaluateUrl(url);
    //   }
    // });
  }
  ///////////////////////////

  handleLogin = async () => {
    const { username, password } = this.state;
    const { navigation } = this.props;

    if (username === '') {
      Alert.alert('Please enter your e-mail.');
    } else if (password === '') {
      Alert.alert('Please, enter your password.');
    } else {
      try {
        const url = 'http://10.0.2.2:8001/api/auth/contractor/mobile/login';
        var data = {username: username, password: password};
        fetch(url, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }, 
          method: 'post', 
          body: JSON.stringify(data) 
        })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if(data.status == 200){
            console.log('Login Success', data.data);
            global.userid = data.data.id;
            global.username = data.data.name;
            this.taskRequest();         
          }
          else {
            console.log('Login Failed', data.msg);
            Alert.alert('', 'Login Failed');
          }
        });
      } catch (error) {
          console.log('Login Error', error);
      }
    }
  };

  taskRequest = () => {
    try {
      const url = 'http://10.0.2.2:8001/api/contractor/loadtask';
      fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if(data.status){
          console.log('Load Task Success', data.result);
          this.props.navigation.navigate('EditForm', {data: data.result});
        }
        else {
          console.log('Load Task Failed');
          Alert.alert('', 'Load Task Failed');
        }
      });
    } catch (error) {
        console.log('Load Task Error', error);
    }
  }

  render() {
    return (
        <KeyboardAvoidingView style={ styles.container } behavior="padding" enabled>
          <Text style={styles.greeting}>
            {'YTD Login'}
          </Text>
          <View style={styles.form}>
            <View>
              <Text style={styles.inputTitle}>User name</Text>
              <TextInput
                style={styles.textInput}
                autoCapitalize="none"
                onChangeText={(username) => this.setState({ username })}
                value={this.state.username}
              />
            </View>

            <View style={{ marginTop: 32 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.inputTitle}>Password</Text>
              </View>

              <TextInput
                style={styles.textInput}
                secureTextEntry
                autoCapitalize="none"
                onChangeText={(password) => this.setState({ password })}
                value={this.state.password}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={this.handleLogin}>
              <Text style={{ color: '#ffffff', fontFamily: 'SourceSansPro-Bold', fontSize: 20 }}>SIGN IN</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
  }
}

const height = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    minHeight: height,
    marginHorizontal: 24,
  },
  greeting: {
    fontSize: 30,
    lineHeight: 60,
    textAlign: 'center',
    fontFamily: 'PlayfairDisplay-Regular',
    marginBottom: 30
  },
  form: {
    marginBottom: 20,
  },
  inputTitle: {
    color: '#999999',
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 16,
    textTransform: 'none',
    letterSpacing: 2,
  },
  textForgot: {
    color: '#999999',
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 12,
    textTransform: 'none',
    letterSpacing: 2,
  },
  textInput: {
    borderBottomColor: '#999999',
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 50,
    fontFamily: 'PlayfairDisplay-Regular',
    textTransform: 'none',
    fontSize: 25,
    letterSpacing: 1,
  },
  button: {
    marginTop: 40,
    backgroundColor: '#222222',
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
});