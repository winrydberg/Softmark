import React, {Component} from 'react';
import {Text, StatusBar} from 'react-native';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Button,
  Icon,
  Title,
  Item,
  Input,
} from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {primaryColor} from '../constants';

export default class Notifications extends Component {
  render() {
    return (
      <Container>
        <Header noShadow style={{backgroundColor: primaryColor}}>
          <StatusBar barStyle="light-content" backgroundColor={primaryColor} />

          {/* <Left /> */}
          <Left>
            <FontAwesome name="bell" color="#fff" size={25} />
          </Left>
          <Body>
            <Title>Notifications</Title>
          </Body>
          <Right />
        </Header>
      </Container>
    );
  }
}
