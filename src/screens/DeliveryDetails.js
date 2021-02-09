import React, {Component} from 'react';
import {
  Container,
  Header,
  Content,
  Item,
  Input,
  Icon,
  Button,
  Left,
  Body,
  Title,
  Right,
  ActionSheet,
  ListItem,
  Radio,
} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import {primaryColor, tokenKey, cartKey} from '../constants';
import {Picker} from '@react-native-picker/picker';
import axios from '../config/axios';
import Loader from 'react-native-modal-loader';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Divider} from 'react-native-elements';
import {setCart} from '../actions/cart';
import {showMessage, hideMessage} from 'react-native-flash-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPicker from 'search-modal-picker';
import {storeOrderInStorage, removeCartFromStorage} from '../utils';
import {TextInput} from 'react-native-gesture-handler';

var BUTTONS = ['Option 0', 'Option 1', 'Option 2', 'Delete', 'Cancel'];
var DESTRUCTIVE_INDEX = 3;
var CANCEL_INDEX = 4;

class DeliveryDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mycarts: [],
      cities: [],
      city: null,
      regions: [],
      region: '',
      deliverycharge: 0,
      deliveryType: 'pickup',
      couponcode: null,

      firstname: null,
      lastname: null,
      email: null,
      phoneno: null,
      landmark: null,
      postcode: null,
      isloading: true,
      pickups: [],
      pickuplocation: null,
      //new
      placeHolderText: 'Please Select City/Location',
      selectedText: '',
    };
  }

  async componentDidMount() {
    // alert(this.props.route.params.continueas);
    if (this.props.route.params.continueas == 'LOGINUSER') {
      //   alert(JSON.stringify(this.props.user));
      this.setState({
        firstname: this.props.user.name,
        lastname: this.props.user.name,
        email: this.props.user.email,
        phoneno: this.props.user.phone_number,
      });
    } else {
      // alert(JSON.stringify(this.props.route.params));
    }
    this.getRegionsWithCities();

    let thecarts = [];
    await this.props.carts.forEach((element) => {
      thecarts.push({
        productid: element.id,
        count: element.total,
        colourid: element.colour_id,
        pricing: element.pricing[0].id,
      });
    });

    this.setState({
      mycarts: thecarts,
    });
  }

  getRegionsWithCities = () => {
    axios
      .get('/get-regions')
      .then(async (response) => {
        if (response.data.status == 'success') {
          var pickupcities = [];
          for (var i = 0; i < response.data.pickups.length; i++) {
            var tempcity = {
              id: response.data.pickups[i].id,
              name:
                response.data.pickups[i].name +
                ' ' +
                response.data.pickups[i].region.name +
                ' Region',
            };

            pickupcities.push(tempcity);
          }
          await this.setState({
            pickups: pickupcities,
            // selectedText: pickupcities[0].name,
            // pickuplocation: pickupcities[0],
            regions: response.data.regions,
            isloading: false,
            cities: response.data.regions[0].cities,
            region: response.data.regions[0],
            // city: response.data.regions[0].cities[0],
            // deliverycharge: response.data.regions[0].cities[0].delivery_charge,
          });
        }
      })
      .catch((error) => {
        this.setState({
          isloading: false,
        });
      });
  };

  setCities = (itemValue, itemIndex) => {
    this.setState({
      region: itemValue,
      cities: itemValue.cities,
      // delivery_charge: itemValue.delivery_charge,
      // city: itemValue.cities[0],
    });
  };

  completeOrderNow = async () => {
    ActionSheet.hide();

    // alert(this.state.city.name);
    this.setState({
      isloading: true,
    });

    const token = JSON.parse(await AsyncStorage.getItem(tokenKey));

    // config.headers.Authorization;
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    axios
      .post('/order-now', {
        first_name: this.state.firstname,
        last_name: this.state.lastname,
        email: this.state.email,
        phone_number: this.state.phoneno,
        deliveryType: this.state.deliveryType,
        region: this.state.deliveryType != 'pickup' ? this.state.region.id : '',
        city: this.state.deliveryType != 'pickup' ? this.state.city.id : '',
        postcode:
          this.state.deliveryType != 'pickup' ? this.state.postcode : '',
        landmark:
          this.state.deliveryType != 'pickup' ? this.state.landmark : '',
        items: this.state.mycarts,
        couponcode: this.state.couponcode,
        pickuplocation:
          this.state.deliveryType == 'pickup'
            ? this.state.pickuplocation.id
            : '',
      })
      .then(async (response) => {
        // console.log(response.data);

        if (response.data.status == 'success') {
          await storeOrderInStorage(response.data.orders.orderno);
          this.props.actions.setCart([]);
          await removeCartFromStorage(cartKey);
          this.setState({
            isloading: false,
          });
          showMessage({
            message: response.data.message,
            type: 'success',
            icon: 'info',
          });

          Alert.alert(
            'Order Success',
            response.data.message,
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: false},
          );

          this.props.navigation.goBack();
        } else {
          this.setState({
            isloading: false,
          });
          showMessage({
            message: response.data.message,
            type: 'danger',
            icon: 'info',
          });
          Alert.alert(
            'Order Error',
            response.data.message,
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: false},
          );
        }
      })
      .catch((error) => {
        alert(error.message);
        this.setState({
          isloading: false,
        });
      });
  };

  renderRegions = () => {
    const regions = this.state.regions.map((element, index) => {
      return <Picker.Item label={element.name} key={index} value={element} />;
    });
    return regions;
  };

  renderCities = () => {
    const cities = this.state.cities.map((element, index) => {
      return <Picker.Item label={element.name} key={index} value={element} />;
    });
    return cities;
  };

  calculateTotal = (totalamount, charge) => {
    if (this.state.deliveryType == 'pickup') {
      return totalamount;
    } else {
      if (charge != null) {
        return Number(totalamount) + Number(charge);
      } else {
        return totalamount;
      }
    }
  };

  showDeliveryCharge = () => {
    if (this.state.deliveryType == 'pickup') {
      return 0;
    } else {
      return this.state.city != null ? this.state.city.delivery_charge : ' N/A';
    }
  };

  inputValidations = () => {
    const regex = /^(\+233|233|0|00233)?\d{9}$/;

    if (this.state.firstname == null || this.state.firstname == '') {
      Alert.alert(
        'Error',
        'First name field is required',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
      return false;
    } else if (this.state.lastname == null || this.state.lastname == '') {
      Alert.alert(
        'Error',
        'Last name field is required',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
      return false;
    } else if (this.state.phoneno == null || this.state.phoneno == '') {
      Alert.alert(
        'Error',
        'Phone number field is required',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
      return false;
      //do regex check of phone number as well
    } else if (!regex.test(this.state.phoneno)) {
      Alert.alert(
        'Error',
        'Enter a valid phone number',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
      return false;
    } else {
      if (this.state.deliveryType == 'deliver') {
        // make sure user provide deliver address
        if (this.state.region == null) {
          Alert.alert(
            'Error',
            'Please select region',
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: false},
          );
          return false;
        } else if (this.state.city == null) {
          Alert.alert(
            'Error',
            'Please select city',
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: false},
          );
          return false;
        } else if (this.state.landmark == null || this.state.landmark == '') {
          // alert('Please enter a landmark');
          Alert.alert(
            'Error',
            'Please enter a landmark',
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: false},
          );
          return false;
        } else {
          // go ahead and send order request
          return true;
        }
      } else {
        //its a pickup order, go ahead  and send order request
        if (
          this.state.pickuplocation == null ||
          this.state.pickuplocation == ''
        ) {
          Alert.alert(
            'Error',
            'Oops Softmark has multiple pickup locations. Please select a pickup location to continue ',
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: false},
          );
          return false;
        } else {
          return true;
        }
      }
    }
  };

  continueToDeliveryCharges = (city) => {
    // alert(JSON.stringify(city.name));
    if (this.inputValidations() == false) {
      return;
    }
    ActionSheet.show(
      {
        cancelButtonIndex: CANCEL_INDEX,
        destructiveButtonIndex: DESTRUCTIVE_INDEX,
        title: (
          <View
            style={{
              height: Dimensions.get('window').height - 100,
              flex: 1,
            }}>
            <Text style={{fontWeight: 'bold', marginBottom: 30}}> </Text>
            {/* <View> */}
            <ScrollView
              contentContainerStyle={{
                elevation: 0,
                alignItems: 'center',
                justifyContent: 'center',
                width: Dimensions.get('window').width - 30,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 20,
                }}>
                <Text style={{flex: 1, fontSize: 16}}>Total Item(s) Cost:</Text>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>
                  GH₵ : {this.props.totalAmount}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 20,
                }}>
                <Ionicons
                  name="information-circle-outline"
                  size={30}
                  color="brown"
                />
                <Text
                  style={{
                    flex: 1,
                    fontSize: 16,
                    color: 'brown',
                    fontWeight: 'bold',
                  }}>
                  Delivery Fee: GH₵
                  {this.showDeliveryCharge()}
                </Text>
              </View>

              <Divider style={{color: 'gray'}} />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 20,
                }}>
                <Text style={{flex: 1, fontSize: 16}}>Total Cost Due:</Text>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>
                  GH₵ :
                  {this.calculateTotal(
                    this.props.totalAmount,
                    this.state.deliveryType != 'pickup'
                      ? city.delivery_charge
                      : 0,
                  )}
                </Text>
              </View>

              <Button
                success
                full
                block
                style={{elevation: 0}}
                onPress={() => this.completeOrderNow()}
                disabled={this.state.isloading}>
                <Text style={{color: '#FFF'}}>COMPLETE ORDER</Text>
              </Button>
            </ScrollView>
          </View>
        ),
      },
      (buttonIndex) => {
        this.setState({clicked: BUTTONS[buttonIndex]});
      },
    );
  };

  renderPickupCities = () => {
    const pickup = this.state.pickups.map((element, index) => {
      return (
        <Picker.Item
          label={element.name + ' ' + element.region.name + ' Region'}
          key={index}
          value={element}
        />
      );
    });
    return pickup;
  };

  _selectedValue(index, item) {
    if (this.state.deliveryType == 'pickup') {
      this.setState({
        pickuplocation: item,
        selectedText: item.name,
      });
    } else {
      this.setState({
        city: item,
        selectedText: item.name,
        deliverycharge: item.delivery_charge,
      });
    }
  }

  renderDeliverAddress = () => {
    if (this.state.deliveryType == 'pickup') {
      return (
        <View style={styles.inputItem}>
          <Item regular>
            <MaterialCommunityIcons
              size={25}
              color="gray"
              style={{padding: 3}}
              name="home-city-outline"
            />
            {/* <Picker
              selectedValue={this.state.pickuplocation}
              style={{height: 50, width: '90%'}}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({pickuplocation: itemValue})
              }>
              <View>
                <TextInput />
              </View>
              {this.renderPickupCities()}
            </Picker> */}
            <RNPicker
              dataSource={this.state.pickups}
              // dummyDataSource={this.state.dataSource}
              defaultValue={false}
              pickerTitle={'Select PickUp Location'}
              showSearchBar={true}
              disablePicker={false}
              changeAnimation={'none'}
              searchBarPlaceHolder={'Search.....'}
              showPickerTitle={true}
              searchBarContainerStyle={this.props.searchBarContainerStyle}
              pickerStyle={styles.pickerStyle}
              pickerItemTextStyle={styles.listTextViewStyle}
              selectedLabel={this.state.selectedText}
              placeHolderLabel={this.state.placeHolderText}
              selectLabelTextStyle={styles.selectLabelTextStyle}
              // placeHolderTextStyle={styles.placeHolderTextStyle}
              // selectedLabel={this.state.selectedText}
              // dropDownImageStyle={styles.dropDownImageStyle}
              // dropDownImage={require('./res/ic_drop_down.png')}
              selectedValue={(index, item) => this._selectedValue(index, item)}
            />
          </Item>
          <View style={{margin: 10}}></View>
        </View>
      );
    } else {
      return (
        <View>
          <View style={styles.inputItem}>
            <Item regular>
              <Ionicons
                size={25}
                color="gray"
                style={{padding: 3}}
                name="locate"
              />
              <Picker
                selectedValue={this.state.region}
                style={{height: 50, width: '90%'}}
                onValueChange={(itemValue, itemIndex) =>
                  this.setCities(itemValue, itemIndex)
                }>
                {/* <Picker.Item label="Java" value="java" />
                <Picker.Item label="JavaScript" value="js" /> */}
                {this.renderRegions()}
              </Picker>
            </Item>
          </View>

          <View style={styles.inputItem}>
            <Item regular>
              <MaterialCommunityIcons
                size={25}
                color="gray"
                style={{padding: 3}}
                name="home-city-outline"
              />
              {/* <Picker
                selectedValue={this.state.city}
                style={{height: 50, width: '90%'}}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({city: itemValue})
                }>
                {this.renderCities()}
              </Picker> */}
              <RNPicker
                dataSource={this.state.cities}
                // dummyDataSource={this.state.dataSource}
                defaultValue={false}
                pickerTitle={'Choose Delivery Location'}
                showSearchBar={true}
                disablePicker={false}
                changeAnimation={'none'}
                searchBarPlaceHolder={'Search.....'}
                showPickerTitle={true}
                searchBarContainerStyle={this.props.searchBarContainerStyle}
                pickerStyle={styles.pickerStyle}
                pickerItemTextStyle={styles.listTextViewStyle}
                selectedLabel={this.state.selectedText}
                placeHolderLabel={this.state.placeHolderText}
                selectLabelTextStyle={styles.selectLabelTextStyle}
                placeHolderTextStyle={styles.placeHolderTextStyle}
                // dropDownImageStyle={styles.dropDownImageStyle}
                // dropDownImage={require('./res/ic_drop_down.png')}
                selectedValue={(index, item) =>
                  this._selectedValue(index, item)
                }
              />
            </Item>
            <Text
              style={{
                color: 'gray',
                fontSize: 12,
                // color: 'brown',
                marginBottom: 10,
              }}>
              If you cannot find your city, select a city nearest to you.
            </Text>
          </View>

          <View style={{marginTop: 5}}>
            <Item regular>
              <Ionicons
                size={25}
                color="gray"
                style={{padding: 3}}
                name="location-outline"
              />
              <Input
                placeholder="Nearest Landmark*"
                onChangeText={(value) => {
                  this.setState({
                    landmark: value,
                  });
                }}
              />
            </Item>
          </View>

          <View style={styles.inputItem}>
            <Item regular>
              <Ionicons
                size={25}
                color="gray"
                style={{padding: 3}}
                name="qr-code"
              />
              <Input
                placeholder="Ghana Post Code"
                onChangeText={(value) => {
                  this.setState({
                    postcode: value,
                  });
                }}
              />
            </Item>
          </View>
        </View>
      );
    }
  };

  showHideEmail = () => {
    if (this.props.route.params.continueas == 'LOGINUSER') {
      return (
        <View style={styles.inputItem}>
          <Item regular>
            <Ionicons
              size={25}
              color="gray"
              style={{padding: 3}}
              name="mail-outline"
            />
            <Input
              placeholder="Email Address"
              value={this.state.email}
              onChangeText={(value) => {
                this.setState({
                  email: value,
                });
              }}
            />
          </Item>
        </View>
      );
    } else {
      return;
    }
  };
  render() {
    return (
      <Container>
        <Header noShadow style={{backgroundColor: primaryColor}}>
          <StatusBar barStyle="light-content" backgroundColor={'#157ed2'} />

          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Ionicons
                name="chevron-back-circle-outline"
                size={30}
                color="#fff"
              />
            </Button>
          </Left>
          <Body>
            <Title>Delivery Details</Title>
          </Body>
          <Right />
        </Header>
        <Content padder>
          <Loader loading={this.state.isloading} color={primaryColor} />
          <View>
            <Text style={{fontWeight: 'bold'}}>USER DETAILS</Text>
          </View>
          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={[{flex: 1}]}>
              <Item regular>
                <Ionicons
                  size={25}
                  color="gray"
                  style={{padding: 3}}
                  name="person-circle-outline"
                />
                <Input
                  placeholder="First Name*"
                  value={this.state.firstname}
                  onChangeText={(value) => {
                    this.setState({
                      firstname: value,
                    });
                  }}
                />
              </Item>
            </View>

            <View style={[{flex: 1}]}>
              <Item regular>
                <Ionicons
                  size={25}
                  color="gray"
                  style={{padding: 3}}
                  name="person-circle-outline"
                />
                <Input
                  placeholder="Last Name*"
                  value={this.state.lastname}
                  onChangeText={(value) => {
                    this.setState({
                      lastname: value,
                    });
                  }}
                />
              </Item>
            </View>
          </View>

          {this.showHideEmail()}

          <View style={styles.inputItem}>
            <Item regular>
              <Ionicons
                size={25}
                color="gray"
                style={{padding: 3}}
                name="ios-call-outline"
              />
              <Input
                placeholder="Phone Number*"
                keyboardType="phone-pad"
                value={this.state.phoneno}
                onChangeText={(value) => {
                  this.setState({
                    phoneno: value,
                  });
                }}
              />
            </Item>
          </View>

          <View style={{marginTop: 20}}>
            <Text style={{fontWeight: 'bold'}}>ADDRESS</Text>
          </View>

          <View style={styles.inputItem}>
            <Item regular>
              <Picker
                selectedValue={this.state.deliveryType}
                style={{height: 50, width: '100%'}}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({
                    deliveryType: itemValue,
                  });
                }}>
                <Picker.Item label="Softmark (Pickup)" value="pickup" />
                <Picker.Item label="Select Delivery Location" value="deliver" />
              </Picker>
            </Item>
          </View>
          <Text style={{marginBottom: 10, fontSize: 10}}>
            Please choose mode of collection.
          </Text>

          {this.renderDeliverAddress()}

          <View style={{marginTop: 10}}>
            <Button
              block
              style={{elevation: 0}}
              onPress={() => this.continueToDeliveryCharges(this.state.city)}>
              <Text style={{color: '#FFF'}}>CONTINUE</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  inputItem: {
    marginTop: 10,
  },
  searchBarContainerStyle: {
    marginBottom: 10,
    flexDirection: 'row',
    height: 40,
    shadowOpacity: 1.0,
    shadowRadius: 5,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    backgroundColor: 'rgba(255,255,255,1)',
    shadowColor: '#d3d3d3',
    borderRadius: 10,
    elevation: 3,
    marginLeft: 10,
    marginRight: 10,
  },

  selectLabelTextStyle: {
    color: '#000',
    textAlign: 'left',
    width: '99%',
    padding: 10,
    flexDirection: 'row',
  },
  placeHolderTextStyle: {
    color: '#D3D3D3',
    padding: 10,
    textAlign: 'left',
    width: '99%',
    flexDirection: 'row',
  },
  dropDownImageStyle: {
    marginLeft: 10,
    width: 10,
    height: 10,
    alignSelf: 'center',
  },
  listTextViewStyle: {
    color: '#000',
    marginVertical: 10,
    flex: 0.9,
    marginLeft: 20,
    marginHorizontal: 10,
    textAlign: 'left',
  },
  pickerStyle: {
    marginLeft: 15,
    elevation: 0,
    paddingRight: 30,
    marginRight: 50,
    marginBottom: 2,
    shadowOpacity: 1.0,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    // borderWidth: 1,
    borderColor: 'gray',
    shadowRadius: 10,
    backgroundColor: 'rgba(255,255,255,1)',
    shadowColor: '#d3d3d3',
    borderRadius: 1,
    flexDirection: 'row',
  },
});

const mapStateToProps = (state) => ({
  carts: state.carts.cart,
  totalAmount: state.carts.totalAmount,
  user: state.user.user,
});

const ActionCreators = Object.assign({}, {setCart});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryDetails);
