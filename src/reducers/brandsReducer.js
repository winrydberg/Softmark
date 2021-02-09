import {
  SET_BRANDS,
  SET_BRANDS_FETCHED,
  SET_SELECTED_BRAND,
} from '../constants/index';
const initialState = {
  brands: [],
  brandsFetched: false,
  selectedbrand: null,
};
const brandsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BRANDS:
      return {
        ...state,
        brands: action.payload,
      };
    case SET_BRANDS_FETCHED:
      return {
        ...state,
        brandsFetched: action.payload,
      };
    case SET_SELECTED_BRAND:
      return {
        ...state,
        selectedbrand: action.payload,
      };
    default:
      return state;
  }
};
export default brandsReducer;
