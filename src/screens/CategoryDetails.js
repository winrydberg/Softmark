import React, {Component} from 'react';
import {
  View,
  StatusBar,
  Text,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {
  Container,
  Header,
  Title,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Content,
} from 'native-base';
import {primaryColor} from '../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setSelectedCategory, setViewAllCategory} from '../actions/categories';
import Loader from 'react-native-modal-loader';
import axios from '../config/axios';
import {FlatList} from 'react-native-gesture-handler';
import FeedProduct from '../components/FeedProduct';

class CategoryDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingmore: false,
      products:
        this.props.viewallcategory.products != null
          ? this.props.viewallcategory.products
          : [],
    };
  }

  loadMore = () => {
    this.setState({
      loadingmore: true,
    });
    axios
      .post('/more-category-products', {
        category: this.props.viewallcategory.id,
        lastid: this.state.products[this.state.products.length - 1].id,
      })
      .then((response) => {
        if (response.data.status == 'success') {
          this.setState({
            loadingmore: false,
            products: [...this.state.products, ...response.data.products],
          });
        } else {
          this.setState({
            loadingmore: false,
          });
        }
      })
      .catch((error) => {
        alert('Oops an error occured. Please try refreshing the page');
      });
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

  renderProduct = ({item}) => {
    return <FeedProduct product={item} navigation={this.props.navigation} />;
  };
  render() {
    return (
      <Container>
        <Header noShadow style={{backgroundColor: primaryColor}}>
          <StatusBar barStyle="light-content" backgroundColor={'#157ed2'} />

          <Left>
            <Ionicons
              onPress={() => this.props.navigation.goBack()}
              name="chevron-back-circle-outline"
              color="#fff"
              size={25}
            />
          </Left>
          <Body>
            <Title>
              {this.props.viewallcategory != null
                ? this.props.viewallcategory.name
                : 'Category Details'}
            </Title>
          </Body>
          <Right />
        </Header>
        <SafeAreaView style={styles.container}>
          <FlatList
            data={this.state.products}
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
  categories: state.categories,
  categoryproducts: state.products.categoryProducts,
  viewallcategory: state.categories.viewallcategorySelected,
});

const ActionCreators = Object.assign({}, {setViewAllCategory});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CategoryDetails);
