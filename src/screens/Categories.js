import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
  View,
  StatusBar,
  ActivityIndicator,
  Pressable,
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
  Card,
  CardItem,
} from 'native-base';
import TabItem from '../components/TabItem';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {primaryColor, icons} from '../constants';
import MiniProduct from '../components/MiniProduct';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setSelectedCategory, setViewAllCategory} from '../actions/categories';
import Loader from 'react-native-modal-loader';
import axios from '../config/axios';

class Categories extends Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    let {categories} = this.props;
    this.state = {
      loading: false,
      counter: 0,
      categoryid: 1,
      selectedCategory: null,
      categories: categories.categories,
      data: [],
      archive: [],
    };
  }

  componentDidMount() {
    this.formatCategory();
  }

  formatCategory = () => {
    let {categories} = this.props;
    if (categories.categories.length > 0) {
      this.setState({
        selectedCategory: categories.categories[0],
        categoryid: categories.categories[0].id,
        loading: true,
      });
      this.getSelectedCategoryProduct(categories.categories[0]);
    } else {
      this.setState({
        loading: true,
      });
    }

    // console.log(categories);
  };

  setcategory = (item) => {
    this.props.actions.setSelectedCategory(item);
    this.setState({
      selectedCategory: item,
      categoryid: item.id,
      loading: true,
    });

    this.getSelectedCategoryProduct(item);
  };

  /**
   *
   * @param {category} item
   */
  goToViewMore = async (category) => {
    this.props.actions.setViewAllCategory(category);
    this.props.navigation.navigate('CategoryDetails');
  };

  getSelectedCategoryProduct(item) {
    var cat = this.state.archive.find((x) => x.mother.id === item.id);

    if (cat == undefined) {
      axios
        .post('/category-products', {
          category: item.id,
        })
        .then((response) => {
          this.setState({
            loading: false,
          });

          if (response.data.status == 'success') {
            let oldstate = this.state.archive;
            oldstate.push({
              mother: item,
              children: response.data.data,
            });
            this.setState({
              data: response.data.data,
              archive: oldstate,
            });

            // console.log(this.state.archive);
          }
        })
        .catch((error) => {
          // console.log(error);
          this.setState({
            loading: false,
          });
          alert(JSON.stringify(error.message));
        });
    } else {
      this.setState({
        loading: false,
        data: cat.children,
      });
    }
  }

  renderItem = ({item, index}) => {
    if (this.state.categoryid == item.id) {
      return (
        <TouchableOpacity
          onPress={() => this.setcategory(item)}
          style={{
            borderLeftColor: 'orange',
            backgroundColor: '#f6f6f6',
            borderLeftWidth: 5,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TabItem category={item} icon={icons[index]} />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity onPress={() => this.setcategory(item)}>
          <TabItem category={item} icon={icons[index]} />
        </TouchableOpacity>
      );
    }
  };

  renderMiniPro = (product) => {
    // console.log(product.item.title);
    return (
      <View
        style={{
          margin: 2,
          // alignItems: 'center',
          // justifyContent: 'center',
          // alignSelf: 'center',
          // marginBottom: 10,
        }}>
        <MiniProduct
          product={product.item}
          navigation={this.props.navigation}
        />
      </View>
    );
  };

  showSubCategories = () => {
    if (this.state.loading == false) {
      if (this.state.data.length > 0) {
        return (
          <View style={{marginBottom: 50}}>
            <FlatList
              data={this.state.data}
              renderItem={(item) => this.renderSubCategoryItem(item)}
              keyExtractor={(item) => JSON.stringify(item.id)}
            />
          </View>
        );
      } else {
        return (
          <View>
            <Text>No Products Found</Text>
          </View>
        );
      }
    } else {
      return (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: Dimensions.get('window').height / 3,
          }}>
          <ActivityIndicator size="small" color={primaryColor} />
          <Text style={{fontSize: 10}}>Loading... Please wait...</Text>
        </View>
      );
    }
  };

  renderSubCategoryItem = (sub) => {
    return (
      <Card
        style={{
          elevation: 0,
          // borderWidth: 0,
          // borderColor: '#f6f6f6',
          // padding: 20,
        }}>
        <CardItem bordered style={{justifyContent: 'space-between', flex: 1}}>
          <Text style={styles.subCatHeader}>{sub.item.name}</Text>
          <Pressable onPressIn={() => this.goToViewMore(sub.item)}>
            <Text style={styles.viewMore}>VIEW MORE</Text>
          </Pressable>
        </CardItem>
        <CardItem style={{padding: 10}}>
          <Body style={{flex: 1, alignItems: 'center'}}>
            <FlatList
              data={sub.item.products}
              renderItem={(item) => this.renderMiniPro(item)}
              keyExtractor={(item) => item.id}
              numColumns={3}
            />
            <View style={{marginTop: 10, marginBottom: 20}}>
              {/* <Text style={styles.viewMore}>VIEW MORE</Text> */}
            </View>
          </Body>
        </CardItem>
      </Card>
    );
    // }
  };

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

  render() {
    return (
      <Container>
        <Header noShadow style={{backgroundColor: primaryColor}}>
          <StatusBar barStyle="light-content" backgroundColor={'#157ed2'} />

          <Left>
            <Ionicons name="apps-outline" color="#fff" size={25} />
          </Left>
          <Body>
            <Title>Categories</Title>
          </Body>
          <Right>{this.loadCartIndicator()}</Right>
        </Header>

        <View style={styles.mainContainer}>
          <SafeAreaView style={styles.tabContainer}>
            <FlatList
              data={this.state.categories}
              renderItem={(item, index) => this.renderItem(item, index)}
              keyExtractor={(item) => JSON.stringify(item.id)}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                flexGrow: 1,
                // alignItems: 'center',
                // justifyContent: 'center',
              }}
            />
          </SafeAreaView>
          <View style={{backgroundColor: '#f6f6f6', width: 5}}></View>

          <SafeAreaView
            // showsVerticalScrollIndicator={false}
            style={styles.tabContentContainer}>
            {/* <Loader loading={this.state.loading}  color={primaryColor} /> */}

            <View style={styles.selectedCatContainer}>
              <Text style={styles.selectetedCatText}>
                {this.state.selectedCategory != null
                  ? this.state.selectedCategory.name
                  : 'All Categories'}
              </Text>
            </View>

            <View>{this.showSubCategories()}</View>
          </SafeAreaView>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  tabContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabContentContainer: {
    flex: 4,
    backgroundColor: '#f6f6f6',
    // marginBottom: 30,
  },
  selectedCatContainer: {
    marginTop: 5,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    borderRadius: 2,
    backgroundColor: '#fff',
    marginRight: 3,
    marginLeft: 2,
  },
  selectetedCatText: {
    fontWeight: 'bold',
    marginLeft: 10,
  },
  subCatHeader: {
    color: 'gray',
    fontWeight: 'bold',
    width: '70%',
  },
  viewMore: {
    fontSize: 12,
    color: primaryColor,
    alignSelf: 'flex-end',
  },
});

const mapStateToProps = (state) => ({
  cart: state.carts.cart,
  categories: state.categories,
  categoryproducts: state.products.categoryProducts,
});

const ActionCreators = Object.assign(
  {},
  {setSelectedCategory, setViewAllCategory},
);

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Categories);
