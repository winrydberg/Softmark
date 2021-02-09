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
  List,
  ListItem,
  Thumbnail,
  Icon,
  Item,
  Input,
} from 'native-base';
import {primaryColor, brandsKey} from '../constants';
import {
  StatusBar,
  ActivityIndicator,
  View,
  Dimensions,
  SafeAreaView,
  FlatList,
  StyleSheet,
  Pressable,
  Text,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {setBrands, setBrandsFetched, setSelectedBrand} from '../actions/brands';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import axios from '../config/axios';
import {Divider} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {storeBrandsInStorage} from '../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Brands extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isloading: false,
      searchterm: null,
    };
  }

  componentDidMount() {
    // this.loadLocalBrands();

    this.loadBrands();
  }

  loadBrands = () => {
    this.setState({
      isloading: true,
    });
    axios
      .get('/get-brands')
      .then((response) => {
        if (response.data.status == 'success') {
          // if (response.data.brands.length != this.props.brands) {
          this.props.actions.setBrands(response.data.brands);
          // storeBrandsInStorage(response.data.brands);
          // }
          this.setState({
            isloading: false,
          });
        }
      })
      .catch((error) => {
        // alert(error.message);
        alert('Unable to get brands');
      });
  };

  getBrandsDetails = async (item) => {
    this.props.actions.setSelectedBrand(item);
    await this.props.navigation.navigate('BrandDetails');
    console.log(item);
  };

  searchBrands = () => {
    if (this.state.searchterm == null || this.state.searchterm == '') {
      return this.props.brands;
    } else {
      return this.props.brands.filter((brand) => {
        return brand.name
          .toLowerCase()
          .includes(this.state.searchterm.toLowerCase());
      });
    }
  };

  renderItem = ({item}) => {
    return (
      <Pressable onPress={() => this.getBrandsDetails(item)}>
        <View style={styles.brandItem}>
          <View style={styles.brandName}>
            <View style={styles.brandIcon}>
              <Ionicons color="#FFF" name="arrow-redo-outline" />
            </View>
            <View style={{marginLeft: 10}}>
              <Text>{item.name}</Text>
            </View>
          </View>
          <View>
            <Ionicons
              color={primaryColor}
              size={20}
              name="caret-forward-circle-outline"
            />
          </View>
        </View>
        <Divider />
      </Pressable>
    );
  };

  renderBrands = () => {
    if (this.state.isloading) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            // marginTop: Dimensions.get('window').height / 7,
          }}>
          <ActivityIndicator size="small" color={primaryColor} />
          <Text>Loading...</Text>
        </View>
      );
    } else {
      return (
        <View style={{flex: 1}}>
          <Item>
            <Icon name="ios-search" />
            <Input
              onChangeText={(value) => {
                this.setState({
                  searchterm: value,
                });
              }}
              placeholder="Search brands"
            />
            <Icon name="ios-people" />
          </Item>

          <SafeAreaView style={styles.container}>
            <FlatList
              data={this.searchBrands()}
              renderItem={this.renderItem}
              keyExtractor={(item) => item.id.toString()}
              removeClippedSubviews={true}
            />
          </SafeAreaView>
        </View>
      );
    }
  };
  render() {
    return (
      <Container>
        <Header noShadow style={{backgroundColor: primaryColor}}>
          <StatusBar barStyle="light-content" backgroundColor={'#157ed2'} />
          <Left>
            <Button transparent>
              <Ionicons name="basket" size={30} color="#fff" />
            </Button>
          </Left>
          <Body>
            <Title>Brands</Title>
          </Body>
          <Right />
        </Header>
        {this.renderBrands()}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  brandIcon: {
    width: 30,
    height: 30,
    backgroundColor: 'orange',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandName: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandItem: {
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
});

const mapStateToProps = (state) => ({
  brands: state.brands.brands,
  brandsFetched: state.brands.brandsFetched,
});

const ActionCreators = Object.assign(
  {},
  {
    setBrands,
    setBrandsFetched,
    setSelectedBrand,
  },
);

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Brands);
