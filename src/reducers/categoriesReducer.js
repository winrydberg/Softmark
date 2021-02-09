import {
  SET_CATEGORIES,
  SET_SELECTED_CATEGORY,
  SET_MY_CATEGORY,
  SET_VIEW_ALL_CATEGORY_ELECTED,
} from '../constants/index';
const initialState = {
  categories: [],
  category: null,
  mycategory: null,
  viewallcategorySelected: null,
};
const categoriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
      };
    case SET_SELECTED_CATEGORY:
      return {
        ...state,
        category: action.payload,
      };
    case SET_SELECTED_CATEGORY:
      return {
        ...state,
        category: action.payload,
      };
    case SET_MY_CATEGORY:
      return {
        ...state,
        mycategory: action.payload,
      };
    case SET_VIEW_ALL_CATEGORY_ELECTED:
      return {
        ...state,
        viewallcategorySelected: action.payload,
      };
    default:
      return state;
  }
};
export default categoriesReducer;
