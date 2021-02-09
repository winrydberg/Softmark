import React, {Component} from 'react';
import {
  Text,
  StatusBar,
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
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
  Content,
} from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {primaryColor} from '../constants';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import InfiniteScroll from 'react-native-infinite-scrolling';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FlatList} from 'react-native-gesture-handler';
import FeedProduct from '../components/FeedProduct';
import axios from '../config/axios';

class Feeds extends Component {
  constructor(props) {
    super(props);

    this.state = {
      feeds: [],
      isloading: true,
      lastpid: 0,
      loadingmore: false,
    };
  }
  componentDidMount() {
    this.loadInitialData();
  }

  loadInitialData = () => {
    axios
      .get('/feeds/' + 0)
      .then((response) => {
        if (response.data.status == 'success') {
          this.setState({
            isloading: false,
          });
          // alert(response.data.products);
          this.setState({
            feeds: [...this.state.feeds, ...response.data.products],
          });
        }
      })
      .catch((error) => {
        // alert(error.message);
        alert('Unable to get feeds');
      });
  };

  loadMore = () => {
    // alert('loading more');
    this.setState({
      loadingmore: true,
    });
    axios
      .get('/feeds/' + 49)
      .then((response) => {
        if (response.data.status == 'success') {
          this.setState({
            isloading: false,
            loadingmore: false,
          });
          // alert(response.data.products);
          this.setState({
            feeds: [...this.state.feeds, ...response.data.products],
          });
        }
      })
      .catch((error) => {
        // alert(error.message);
        alert('Unable to get feeds');
      });
  };

  /**
   * CART INDICATOR
   */
  loadCartIndicator = () => {
    if (this.props.cart.length > 0) {
      return (
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            // marginRight: 10,
            padding: 10,
          }}
          onPress={() => this.props.navigation.navigate('Cart')}>
          {/* <Button transparent> */}
          <Ionicons size={25} color="#fff" name="cart" />
          {/* </Button> */}
          <View
            style={{
              backgroundColor: 'red',
              width: 18,
              height: 18,
              borderRadius: 9,
              position: 'absolute',
              alignItems: 'center',
              alignSelf: 'center',
              justifyContent: 'center',
              marginLeft: 30,
            }}>
            <Text style={{color: '#fff', fontSize: 10}}>
              {this.props.cart.length}
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Cart')}>
          {/* <Button transparent> */}
          <Ionicons size={25} color="#fff" name="cart" />
          {/* </Button> */}
        </TouchableOpacity>
      );
    }
  };

  renderProduct = ({item}) => {
    return <FeedProduct product={item} navigation={this.props.navigation} />;
  };

  showLoadingMoreIndicator = () => {
    if (this.state.loadingmore) {
      return (
        <View
          style={{
            backgroundColor: '#5cb85c',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            padding: 5,
          }}>
          <ActivityIndicator size="small" color={'#FFF'} />
          <Text style={{fontSize: 10, color: '#FFF'}}> Loading more...</Text>
        </View>
      );
    } else {
      return;
    }
  };
  renderAllProducts = () => {
    if (this.state.isloading) {
      return (
        <Content
          contentContainerStyle={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{}}>
            <ActivityIndicator size={'small'} color={primaryColor} />
            <Text>Loading feeds...</Text>
          </View>
        </Content>
      );
    } else {
      return (
        <SafeAreaView style={styles.container}>
          <FlatList
            data={this.state.feeds}
            renderItem={this.renderProduct}
            keyExtractor={(item, index) => index.toString()}
            // numColumns={2}
            contentContainerStyle={{
              //   justifyContent: 'space-between',
              //   alignItems: 'flex-start',
              flexDirection: 'column',
            }}
            onEndReached={this.loadMore}
            onEndReachedThreshold={0.5}
            initialNumToRender={5}
          />
          {this.showLoadingMoreIndicator()}
        </SafeAreaView>
      );
    }
  };

  render() {
    return (
      <Container>
        <Header noShadow style={{backgroundColor: primaryColor}}>
          <StatusBar barStyle="light-content" backgroundColor={'#157ed2'} />

          {/* <Left /> */}
          <Left>
            <Ionicons name="logo-rss" color="#fff" size={25} />
          </Left>
          <Body>
            <Title>Feeds</Title>
          </Body>
          <Right style={{padding: 10}}>{this.loadCartIndicator()}</Right>
        </Header>

        {this.renderAllProducts()}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const mapStateToProps = (state) => ({
  cart: state.carts.cart,
});

const ActionCreators = Object.assign({}, {});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Feeds);
