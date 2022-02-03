import {
  SHOW_ADDED_NOTIFICATION,
  SHOW_ALREADY_NOTIFICATION,
  SHOW_LOGOUT_NOTIFICATION,
  SHOW_DELETED_NOTIFICATION,
  HIDE_NOTIFICATION,
} from '../constants/notificationConstants'

const notificationReducer = (
  state = {
    showAdded: false,
    showAlready: false,
    showLogout: false,
    showDeleted: false,
  },
  action
) => {
  switch (action.type) {
    case SHOW_ADDED_NOTIFICATION:
      return {
        ...state,
        showAdded: true,
      }

    case SHOW_ALREADY_NOTIFICATION:
      return {
        ...state,
        showAlready: true,
      }

    case SHOW_LOGOUT_NOTIFICATION:
      return {
        ...state,
        showLogout: true,
      }

    case SHOW_DELETED_NOTIFICATION:
      return {
        ...state,
        showDeleted: true,
      }

    case HIDE_NOTIFICATION:
      return {
        showAdded: false,
        showAlready: false,
        showLogout: false,
        showDeleted: false,
      }
    default:
      return state
  }
}

export default notificationReducer
