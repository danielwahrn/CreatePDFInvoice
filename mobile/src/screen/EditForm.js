import React, { Component } from 'react';
import {
    StyleSheet,
    KeyboardAvoidingView,
    Text,
    Keyboard,
    TextInput,
    TouchableOpacity,
    Alert,
    View,
    Dimensions
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import {Dropdown} from 'react-native-material-dropdown';

export default class EditForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
          tasklist:[],
          code: '',
          title: '',
          description: '',
          startTime: '',
          finishTime: '',
          hours: '',
          comment: '',
          lunchTime: '',
          lunchHours: ''
        }
    }

    async componentDidMount(){
        
      const { params } = this.props.navigation.state;
      this.setState({ tasklist: params.data });     

      await AsyncStorage.getItem('tasknote')
        .then((tasknote) => {
          if(tasknote){
              console.log('tasknote', tasknote);
              tasknote = JSON.parse(tasknote);
              this.setState({
                  code: tasknote.code,
                  title: tasknote.title,
                  description: tasknote.description,
                  startTime: tasknote.startTime,
                  finishTime: tasknote.finishTime,
                  hours: tasknote.hours
              });
          }
          else{
            console.log('no exist task note');
          }
        })
        .catch((err)=>{
          console.log('note error', err);
        });

      await AsyncStorage.getItem('lunchnote')
        .then((lunchnote) => {
          if(lunchnote){
              console.log('lunchnote', lunchnote);
              lunchnote = JSON.parse(lunchnote);
              this.setState({
                  lunchTime: lunchnote.lunchTime,
                  lunchHours: lunchnote.lunchHours
              });
          }
          else{
            console.log('no exist lunch note');
          }
        })
        .catch((err)=>{
          console.log('note error', err);
        })
    }

    onTaskSave = () => {
      Keyboard.dismiss();
      const { code, title, description, startTime, finishTime, hours, comment } = this.state;
      const tasknote = {
          code: code,
          title: title,
          description: description,
          startTime: startTime,
          finishTime: finishTime,
          hours: hours,
          comment: comment
      };

      AsyncStorage.setItem('tasknote', JSON.stringify(tasknote));
      console.log('tasknote', tasknote);
      Alert.alert('tasknote:', JSON.stringify(tasknote));
    };

    onTaskSubmit = () => {
      const { code, title, description, startTime, finishTime, hours, comment } = this.state;

      if (title == '') {
          Alert.alert('Input error', 'Please select task.');
          return;
      }
      if (startTime == '') {
          Alert.alert('Input error', 'Please input start time.');
          return;
      }
      if (finishTime == '') {
          Alert.alert('Input error', 'Please input finish time.');
          return;
      }
      if (hours == '') {
          Alert.alert('Input error', 'Please input hours.');
          return;
      }
      
      var tasknote = {
        code: code,
        title: title,
        description: description,
        startTime: startTime,
        finishTime: finishTime,
        hours: hours,
        comment: comment,
      }

      var userid = global.userid;
      const url = 'http://10.0.2.2:8001/api/contractor/savetask';
      const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({task:tasknote, userid })
      };

      fetch(url, requestOptions)
        .then(res => res.json())
        .then(data => {
            if(data.error) {
                console.log('Save Task Fail', data.error)
                return;
            }
            console.log('responsedata', data.result);
            Alert.alert(JSON.stringify(data.result));
        })
        .catch(error => {
            console.log('Save Task Error', error);
        });

      AsyncStorage.removeItem('tasknote');

      this.setState({
        code: '',
        title: '',
        description: '',
        startTime: '',
        finishTime: '',
        hours: '',
        comment: '',
      });
    }

    onLunchSave = () => {
      Keyboard.dismiss();
      
      const { lunchTime, lunchHours } = this.state;
      const lunchnote = {
          lunchTime: lunchTime,
          lunchHours: lunchHours
      };
        
      AsyncStorage.setItem('lunchnote', JSON.stringify(lunchnote));
      console.log('lunchnote', lunchnote);
      Alert.alert('lunchnote:', JSON.stringify(lunchnote));
    };

    onLunchSubmit = () => {
      const { lunchTime, lunchHours } = this.state;      

      if (lunchTime == '') {
          Alert.alert('Input error', 'Please input lunch time.');
          return;
      }
      if (lunchHours == '') {
          Alert.alert('Input error', 'Please input lunch hours.');
          return;
      }
      
      // var note = {
      //   lunchTime: lunchTime,
      //   lunchHours: lunchHours,
      // }

      var userid = global.userid;
      const url = 'http://10.0.2.2:8001/api/contractor/savelunch';
      const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({lunch: lunchTime, lunchhour: lunchHours, userid })
      };

      fetch(url, requestOptions)
        .then(res => res.json())
        .then(data => {
            if(data.error) {
                console.log('Save Lunch Fail', data.error)
                return;
            }
            console.log('responsedata', data.result);
            Alert.alert(JSON.stringify(data.result));
        })
        .catch(error => {
            console.log('Save Lunch Error', error);
        });
      
      AsyncStorage.removeItem('lunchnote');

      this.setState({
        lunchTime: '',
        lunchHours: '',
      });
    }


    render() {
      const { tasklist, note } = this.state;
      const titleData = [];
      for(var each of this.state.tasklist){
          titleData.push({value: each.title});
      }

      const { code, title, description, startTime, finishTime, hours, comment, lunchTime, lunchHours } = this.state;

      return (
          <KeyboardAvoidingView behavior="padding" style={styles.container}>
              <Text style={styles.screenTitle}>Input your work </Text>
              
              <View style={styles.dropdownContainer}>
                  <Dropdown
                      dropdownOffset={{top: 10}}
                      rippleInsets={{top: 0}}
                      data={titleData}
                      placeholder='Select Task'
                      onChangeText={text => this.setState({title: text, code: tasklist[tasklist.findIndex(o=>o.title==text)].code, description: tasklist[tasklist.findIndex(o=>o.title==text)].description})}
                      inputContainerStyle={{borderBottomColor: 'transparent'}}
                      value={title}
                  />
              </View>
              <TextInput
                  style={styles.textInput}
                  placeholder="Task Description"
                  returnKeyType="done"
                  blurOnSubmit
                  editable={false}
                  value={description}
              />
              <TextInput
                  style={styles.textInput}
                  placeholder="Start Time"
                  keyboardType="text"
                  returnKeyType="done"
                  blurOnSubmit
                  onChangeText={text => this.setState({startTime: text })}
                  value={startTime}
              />
              <TextInput
                  style={styles.textInput}
                  placeholder="Finish Time"
                  keyboardType="text"
                  returnKeyType="done"
                  blurOnSubmit
                  onChangeText={text => this.setState({ finishTime: text })}
                  value={finishTime}
              />
              <TextInput
                  style={styles.textInput}
                  placeholder="Hours"
                  keyboardType="text"
                  returnKeyType="done"
                  blurOnSubmit
                  onChangeText={text => this.setState({ hours: text })}
                  value={hours}
              />
              <TextInput
                  style={styles.textInput}
                  placeholder="Comment"
                  keyboardType="text"
                  returnKeyType="done"
                  blurOnSubmit
                  onChangeText={text => this.setState({ comment: text })}
                  value={comment}
              />
              <View style={styles.buttons}>
                <TouchableOpacity style={styles.button} onPress={this.onTaskSave}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={this.onTaskSubmit}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>

              <TextInput
                  style={styles.textInput}
                  placeholder="Lunch Time"
                  keyboardType="text"
                  returnKeyType="done"
                  blurOnSubmit
                  onChangeText={text => this.setState({ lunchTime: text })}
                  value={lunchTime}
              />
              <TextInput
                  style={styles.textInput}
                  placeholder="Lunch Hours"
                  keyboardType="text"
                  returnKeyType="done"
                  blurOnSubmit
                  onChangeText={text => this.setState({ lunchHours: text })}
                  value={lunchHours}
              />

              <View style={styles.buttons}>
                <TouchableOpacity style={styles.button} onPress={this.onLunchSave}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={this.onLunchSubmit}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>
          </KeyboardAvoidingView>
      );
    }
}

const height = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        minHeight: height,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    screenTitle: {
        fontSize: 35,
        textAlign: 'center',
        margin: 10,
    },
    dropdownContainer:{
        height: 40,
        borderWidth: 1,
        borderRadius: 3,
        backgroundColor: '#FFF',
        paddingHorizontal: 10,
        marginTop:40,
        marginBottom: 10,
        fontSize: 18,
        color: '#3F4EA5',
    },
    textInput: {
        height: 40,
        borderWidth: 1,
        borderRadius: 3,
        backgroundColor: '#FFF',
        paddingHorizontal: 10,
        marginBottom: 10,
        fontSize: 18,
        color: '#3F4EA5',
    },
    buttons:{
      flex: 1,
      flexDirection: 'row'
    },
    button: {
        backgroundColor: '#222222',
        borderRadius: 3,
        width: '50%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});