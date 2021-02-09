import React, {Component} from 'react';
import {Container, Header, Left, Body, Right, Title, Button} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {StatusBar} from 'react-native';
import {primaryColor} from '../constants';

export default class CompleteOrder extends Component {
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
            <Title>Complete Order</Title>
          </Body>
          <Right />
        </Header>
      </Container>
    );
  }
}
