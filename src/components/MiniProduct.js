import React, {Component} from 'react';

import {
  View,
  StyleSheet,
  Image,
  Text,
  Pressable,
  Dimensions,
} from 'react-native';
import {miniProductSize, baseIMGUrl} from '../constants';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setSelectedProduct} from '../actions/products';

class MiniProduct extends Component {
  constructor(props) {
    super(props);
  }

  urlencode = (str) => {
    str = (str + '').toString();
    let img = encodeURIComponent(str)
      .replace('!', '%21')
      .replace("'", '%27')
      .replace('(', '%28')
      .replace(')', '%29')
      .replace('*', '%2A')
      .replace('%20', '+');
    // alert(img);
    return img;
  };

  formatImage = (image) => {
    let imgParts = image.split('.');
    if (imgParts.length > 2) {
      let fileName = '';
      for (var i = 0; i < imgParts.length - 1; i++) {
        if (i == 0) {
          fileName = imgParts[0];
        } else {
          fileName = fileName + '.' + imgParts[i];
        }
      }
      return fileName + '-image.jpg';
    } else {
      return imgParts[0] + '-image.jpg';
    }
  };

  goToProductDetails = (product) => {
    let {actions} = this.props;
    actions.setSelectedProduct(product);
    this.props.navigation.navigate('Details');
  };

  render() {
    return (
      <Pressable
        onPress={() => this.goToProductDetails(this.props.product)}
        style={{
          borderColor: '#e5e5e5',
          borderWidth: 0.5,
          width: Dimensions.get('window').width / 3.3 - 20,
          borderRadius: 4,
          // height: 100,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View>
          <Image
            style={styles.imageStyle}
            source={{
              // uri:
              // baseIMGUrl +
              // '/' +
              // this.props.product.media[0].id +
              // '/conversions/' +
              // this.urlencode(
              //   this.formatImage(this.props.product.media[0].file_name),
              // ),
              uri:
                baseIMGUrl +
                '/' +
                this.props.product.media[0].id +
                '/' +
                this.props.product.media[0].file_name,
            }}
            defaultSource={require('../assets/images/placeholder.png')}
          />
        </View>
        <View style={styles.prodNameCon}>
          <Text
            ellipsizeMode="tail"
            numberOfLines={2}
            style={styles.productName}>
            {this.props.product.title}
          </Text>
        </View>
      </Pressable>
    );
  }
}

const styles = StyleSheet.create({
  itemContainer: {
    marginBottom: 10,
  },
  imageStyle: {
    height: miniProductSize,
    width: miniProductSize,
    borderRadius: 5,
    alignSelf: 'center',
    resizeMode: 'center',
  },
  productName: {
    fontSize: 10,
    alignItems: 'center',
  },
  prodNameCon: {
    paddingTop: 5,
    width: miniProductSize,
  },
});

const ActionCreators = Object.assign({}, {setSelectedProduct});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(null, mapDispatchToProps)(MiniProduct);
