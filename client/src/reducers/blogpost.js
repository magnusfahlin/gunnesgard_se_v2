import { POST_SHOW_FEATURES, POST_HIDE_FEATURES } from "./../actionTypes";
import initialState from "./../data/initialState";

const blogpost = (state = initialState.blogpost, action) => {
  switch (action.type) {
    case POST_SHOW_FEATURES:
      return {
        type: action.type,
        showAddComment: true,
        showComments: true
      };
    case POST_HIDE_FEATURES:
      return {
        type: action.type,
        showAddComment: false,
        showComments: false
      };

    default:
      return state
  }
};

export default blogpost;
