import React, {Component} from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import {SliderBox} from 'react-native-image-slider-box';
import {Content} from 'native-base';
import {connect} from 'react-redux';
import {baseBannerURL} from '../constants';

class HomeTopBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: Dimensions.get('window').width,
      images: this.props.banners,
      //   images: [],
      // images: [
      //   'https://www.softmark.com.gh/storage/banners/images/2100/conversions/Copy-of-Green-Black-Friday-Large-Rectangle-Ad-hero.jpg',
      //   'https://www.softmark.com.gh/storage/banners/images/2097/conversions/Copy-of-Red-Black-Friday-Sale-Email-Header-hero.jpg',
      //   'https://www.softmark.com.gh/storage/banners/images/2102/conversions/Copy-of-Black-and-Red-Controller-Black-Friday-Sale-Your-Story-hero.jpg',
      //   'https://www.softmark.com.gh/storage/banners/images/2104/conversions/Copy-of-Green-Black-Friday-Sale-Postcard-%281%29-hero.jpg', // Network image
      //   // require('./assets/images/girl.jpg'), // Local image
      // ],
    };
  }

  componentDidMount() {
    // alert(JSON.stringify(this.props.banners));
    // this.loadImages();
    // let sliders = [];
    // await this.props.banners.forEach((element) => {
    //   sliders.push(
    //     baseBannerURL +
    //       '/' +
    //       element.media[0].id +
    //       '/conversions/' +
    //       this.urlencode(this.formatImage(element.media[0].file_name)),
    //   );
    // });
    // if (sliders.length > 0) {
    //   await this.setState({
    //     images: sliders,
    //   });
    // }
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
      return fileName + '-hero.jpg';
    } else {
      return imgParts[0] + '-hero.jpg';
    }
  };

  loadImages() {
    let sliders = [];
    let {banners, actions} = this.props;

    // console.log(banners);
    banners.forEach((element) => {
      sliders.push(
        baseBannerURL +
          '/' +
          element.media[0].id +
          '/conversions/' +
          this.urlencode(this.formatImage(element.media[0].file_name)),
      );
    });
    this.setState({
      images: sliders,
    });
  }

  render() {
    return (
      <View style={{marginLeft: 0, marginRight: 5, marginTop: 5}}>
        <View style={styles.container} onLayout={this.onLayout}>
          <SliderBox
            images={this.state.images}
            sliderBoxHeight={150}
            onCurrentImagePressed={(index) =>
              console.warn(`image ${index} pressed`)
            }
            dotColor="orange"
            inactiveDotColor="#90A4AE"
            parentWidth={this.state.width}
            ImageComponentStyle={{borderRadius: 5, width: '97%'}}
            imageLoadingColor="#2196F3"
            autoplay
            circleLoop
            resizeMethod={'resize'}
            resizeMode={'cover'}
            paginationBoxStyle={{
              position: 'absolute', //relative
              bottom: 0,
              padding: 0,
              alignItems: 'center',
              alignSelf: 'center',
              justifyContent: 'center',
              paddingVertical: 2,
            }}
            dotStyle={{
              width: 6,
              height: 6,
              borderRadius: 3,
              marginHorizontal: 0,
              padding: 0,
              margin: 0,
              backgroundColor: 'rgba(128, 128, 128, 0.92)',
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
  },
});

// const mapStateToProps = (state) => ({
//   banners: state.banners.banners,
// });

export default HomeTopBar;
// export default connect(mapStateToProps)(HomeTopBar);
