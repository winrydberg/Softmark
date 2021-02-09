import React, {Component} from 'react';
import {View, Text, Dimensions, Pressable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {primaryColor, primaryDark, primaryBg} from '../constants';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setMyCategory} from '../actions/categories';

class HomeCategory extends Component {
  getCategoryDetails = () => {
    // alert(this.props.icons.bgColor);
    // return;
    this.props.actions.setMyCategory(this.props.category);
    this.props.navigation.navigate('CategoryProducts', {
      category: this.props.category,
      color: this.props.icons.bgColor,
    });
  };
  render() {
    return (
      <View style={{margin: 1, overflow: 'hidden'}}>
        <Pressable
          onPress={() => this.getCategoryDetails()}
          android_ripple={{color: primaryBg, borderless: true}}
          style={{
            margin: 10,
            alignItems: 'center',
            justifyContent: 'center',
            width: Dimensions.get('window').width / 6,
          }}>
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: this.props.icons.bgColor,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Ionicons name={this.props.icons.name} size={25} color="#fff" />
          </View>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{color: primaryDark, fontSize: 10, textAlign: 'center'}}>
            {this.props.category.name}
          </Text>
        </Pressable>
      </View>
    );
  }
}

const ActionCreators = Object.assign({}, {setMyCategory});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(null, mapDispatchToProps)(HomeCategory);
