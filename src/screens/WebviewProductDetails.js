import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Content,
  Footer,
  Button,
} from 'native-base';
import {primaryColor} from '../constants';
import {StatusBar, Dimensions} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class WebviewProductDetails extends Component {
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
            <Title>Details</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <WebView
            javaScriptEnabled
            style={{
              //   height: Dimensions.get('screen').height,
              height: 800,
              //   flex1: 1,
            }}
            // scrollEnabled={true}
            source={{
              uri:
                'https://www.softmark.com.gh/products/inflatable-bed-with-pump-double-bed-blue',
            }}
          />
        </Content>
      </Container>
    );
  }
}
