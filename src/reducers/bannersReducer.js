import {SET_BANNERS} from '../constants/index';
const initialState = {
  banners: [],
};
const bannersReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BANNERS:
      return {
        ...state,
        banners: action.payload,
      };
    default:
      return state;
  }
};
export default bannersReducer;
