import {
  SET_BEST_SELLER,
  SET_FEATURED,
  SET_NEW_ARRIVALS,
  SET_SELECTED_PRODUCT,
  CATEGORY_PRODUCTS,
  SET_RECOMMENDATIONS,
  SETLOADING,
  RECENTLY_VIEWED,
} from '../constants/index';
const initialState = {
  featured: [],
  bestseller: [],
  newarrivals: [],
  selectedProduct: null,
  categoryProducts: [],
  recommendations: [],
  isLoading: true,
  recentlyviewed: [],
};
const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BEST_SELLER:
      return {
        ...state,
        bestseller: action.payload,
      };
    case SET_FEATURED:
      return {
        ...state,
        featured: action.payload,
      };
    case SET_NEW_ARRIVALS:
      return {
        ...state,
        newarrivals: action.payload,
      };
    case SET_SELECTED_PRODUCT:
      return {
        ...state,
        selectedProduct: action.payload,
      };
    case CATEGORY_PRODUCTS:
      return {
        ...state,
        categoryProducts: action.payload,
      };
    case SET_RECOMMENDATIONS:
      return {
        ...state,
        recommendations: action.payload,
      };
    case SETLOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case RECENTLY_VIEWED:
      return {
        ...state,
        recentlyviewed: action.payload,
      };
    default:
      return state;
  }
};
export default productReducer;
