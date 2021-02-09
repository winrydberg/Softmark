import {
  SET_CATEGORIES,
  SET_SELECTED_CATEGORY,
  SET_MY_CATEGORY,
  SET_VIEW_ALL_CATEGORY_ELECTED,
} from '../constants/index';

export function setCategories(categories) {
  return {
    type: SET_CATEGORIES,
    payload: categories,
  };
}

export function setSelectedCategory(category) {
  return {
    type: SET_SELECTED_CATEGORY,
    payload: category,
  };
}

export function setMyCategory(category) {
  return {
    type: SET_MY_CATEGORY,
    payload: category,
  };
}

export function setViewAllCategory(category) {
  return {
    type: SET_VIEW_ALL_CATEGORY_ELECTED,
    payload: category,
  };
}
