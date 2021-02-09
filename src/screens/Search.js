import React, {Component} from 'react';
import {
  Container,
  Header,
  Item,
  Input,
  Icon,
  Button,
  Text,
  Body,
  Left,
  Content,
} from 'native-base';
import {
  StatusBar,
  View,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {primaryColor} from '../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SearchProduct from '../components/SearchProduct';
import axios from '../config/axios';

export default class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isloading: false,
      products: [],
      term: '',
      searched: false,
    };
  }

  searchProduct = (term) => {
    this.setState({
      isloading: true,
      searched: true,
    });
    axios
      .post('/search', {
        term: term,
      })
      .then((response) => {
        if (response.data.status == 'success') {
          this.setState({
            isloading: false,
            products: response.data.products,
          });
        }
      })
      .catch((error) => {
        // console.log(error);
        this.setState({
          isloading: false,
        });
      });
  };
  renderItem = ({item}) => {
    return (
      <View>
        <SearchProduct product={item} navigation={this.props.navigation} />
      </View>
    );
  };

  showResults = () => {
    if (!this.state.searched) {
      return (
        <View
          style={{
            marginTop: Dimensions.get('window').height / 3,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Ionicons name="search" size={50} color="gray" />
          <Text>Search on Softmark</Text>
        </View>
      );
    } else {
      if (this.state.isloading) {
        return (
          <View
            style={{
              height: Dimensions.get('window').height / 2,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator size="large" color={primaryColor} />
            <Text>Searching Product...</Text>
          </View>
        );
      } else {
        if (this.state.products.length <= 0 && this.state.searched) {
          return (
            <View
              style={{
                height: Dimensions.get('window').height / 2,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text>No Product Found</Text>
            </View>
          );
        } else {
          return (
            <SafeAreaView>
              <FlatList
                data={this.state.products}
                renderItem={(item) => this.renderItem(item)}
                keyExtractor={(item) => item.id.toString()}
              />
            </SafeAreaView>
          );
        }
      }
    }
  };
  render() {
    return (
      <Container>
        <Header searchBar rounded style={{backgroundColor: primaryColor}}>
          <StatusBar barStyle="light-content" backgroundColor={primaryColor} />

          {/* <Button transparent onPress={() => this.props.navigation.goBack()}>
            <Ionicons
              name="chevron-back-circle-outline"
              size={30}
              color="#fff"
            />
          </Button> */}
          <Item
            rounded
            style={{
              // width: '100%',
              borderColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon
              name="ios-close"
              onPress={() => this.props.navigation.goBack()}
            />
            <Input
              placeholder="Search"
              autoFocus={true}
              onChangeText={(term) =>
                this.setState({
                  term: term,
                })
              }
              keyboardType={'web-search'}
            />
            <Icon
              name="ios-search"
              onPress={() => this.searchProduct(this.state.term)}
            />
          </Item>
        </Header>

        <View>{this.showResults()}</View>
      </Container>
    );
  }
}
