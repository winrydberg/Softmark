import React, {Component} from 'react';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Button,
  Content,
  Card,
  CardItem,
} from 'native-base';
import {StatusBar, View, Text, Image} from 'react-native';
import {primaryColor} from '../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
export default class AboutApp extends Component {
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
            <Title>About Softmark</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
              marginTop: 20,
            }}>
            {/* <View> */}
            <Image
              source={require('../assets/images/iconmain.png')}
              style={{
                height: 90,
                width: 85,
                margin: 20,
                padding: 10,
              }}
            />
            {/* </View> */}
            <Text>Softmark Mobile</Text>
            <Text>Version: 1.0.0</Text>
          </View>
          <Card style={{elevation: 0}}>
            <CardItem header>
              <Text>OUR CONTACTS</Text>
            </CardItem>
            <CardItem>
              <Ionicons
                style={{
                  padding: 6,
                  backgroundColor: primaryColor,
                  borderRadius: 3,
                  marginRight: 10,
                }}
                size={20}
                color="#fff"
                name="location-outline"
              />
              <Text>
                Softmark, 10th Avenue, Batsona Hwy, Batsona, Spintex Rd, Ghana
              </Text>
            </CardItem>
            <CardItem>
              <Ionicons
                style={{
                  padding: 6,
                  backgroundColor: 'green',
                  borderRadius: 3,
                  marginRight: 10,
                }}
                name="md-call-outline"
                size={20}
                color="#fff"
              />
              <Text> +(233) 506-129-305</Text>
            </CardItem>

            <CardItem>
              <Ionicons
                style={{
                  padding: 6,
                  backgroundColor: 'orange',
                  borderRadius: 3,
                  marginRight: 10,
                }}
                color="#fff"
                name="mail-open-outline"
                size={20}
              />
              <Text> support@softmark.com.gh</Text>
            </CardItem>
            <CardItem>
              <Ionicons
                style={{
                  padding: 6,
                  backgroundColor: '#900C3F',
                  borderRadius: 3,
                  marginRight: 10,
                }}
                color="#fff"
                name="globe-outline"
                size={20}
              />
              <Text>https://www.softmark.com.gh/</Text>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}
