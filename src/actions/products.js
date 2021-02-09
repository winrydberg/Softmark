import {
  SET_NEW_ARRIVALS,
  SET_BEST_SELLER,
  SET_FEATURED,
  SET_SELECTED_PRODUCT,
  CATEGORY_PRODUCTS,
  SET_RECOMMENDATIONS,
  SETLOADING,
  RECENTLY_VIEWED,
} from '../constants/index';

export function setNewArrivals(newarrivals) {
  return {
    type: SET_NEW_ARRIVALS,
    payload: newarrivals,
  };
}

export function setFeatured(featured) {
  return {
    type: SET_FEATURED,
    payload: featured,
  };
}

export function setBestSeller(bestseller) {
  return {
    type: SET_BEST_SELLER,
    payload: bestseller,
  };
}

export function setSelectedProduct(product) {
  return {
    type: SET_SELECTED_PRODUCT,
    payload: product,
  };
}

export function setCategoryProducts(categoryproducts) {
  return {
    type: CATEGORY_PRODUCTS,
    payload: categoryproducts,
  };
}

export function setRecommendations(products) {
  return {
    type: SET_RECOMMENDATIONS,
    payload: products,
  };
}

export function setLoading(islaoding) {
  return {
    type: SETLOADING,
    payload: islaoding,
  };
}

export function setRecentlyViewed(products) {
  return {
    type: RECENTLY_VIEWED,
    payload: products,
  };
}
