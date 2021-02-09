import React, {Component} from 'react';
import {View, Text} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class TabItem extends Component {
  constructor(props) {
    super(props);
  }

  showIcons = () => {
    if (this.props.icon != null) {
      return <Ionicons name={this.props.icon.name} size={16} />;
    } else {
      return;
    }
  };
  render() {
    return (
      <View style={{paddingTop: 15, paddingBottom: 15}}>
        <View style={{alignItems: 'center'}}>
          {this.showIcons()}
          <Text
            style={{
              fontSize: 12,
              fontWeight: '100',
              marginLeft: 5,
              marginRight: 5,
              textAlign: 'center',
            }}>
            {this.props.category.name}
          </Text>
        </View>
      </View>
    );
  }
}
