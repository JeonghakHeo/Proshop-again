import {
  SHOW_ADDED_NOTIFICATION,
  SHOW_ALREADY_NOTIFICATION,
  SHOW_LOGOUT_NOTIFICATION,
  SHOW_DELETED_NOTIFICATION,
  HIDE_NOTIFICATION,
  SHOW_EMAIL_NOT_FOUND_NOTIFICATION,
} from '../constants/notificationConstants'

export const showAddedNotification = () => (dispatch) => {
  try {
    dispatch({ type: SHOW_ADDED_NOTIFICATION })

    setTimeout(() => {
      dispatch({ type: HIDE_NOTIFICATION })
    }, 3000)
  } catch (error) {
    console.log(error.message)
  }
}

export const showAlreadyNotification = () => (dispatch) => {
  try {
    dispatch({ type: SHOW_ALREADY_NOTIFICATION })

    setTimeout(() => {
      dispatch({ type: HIDE_NOTIFICATION })
    }, 3000)
  } catch (error) {
    console.log(error.message)
  }
}

export const showLogoutNotification = () => (dispatch) => {
  try {
    dispatch({ type: SHOW_LOGOUT_NOTIFICATION })

    setTimeout(() => {
      dispatch({ type: HIDE_NOTIFICATION })
    }, 3000)
  } catch (error) {
    console.log(error.message)
  }
}

export const showDeletedNotification = () => (dispatch) => {
  try {
    dispatch({ type: SHOW_DELETED_NOTIFICATION })

    setTimeout(() => {
      dispatch({ type: HIDE_NOTIFICATION })
    }, 3000)
  } catch (error) {
    console.log(error.message)
  }
}

export const showEmailNotFondNotification = () => (dispatch) => {
  try {
    dispatch({ type: SHOW_EMAIL_NOT_FOUND_NOTIFICATION })

    setTimeout(() => {
      dispatch({ type: HIDE_NOTIFICATION })
    }, 3000)
  } catch (error) {
    console.log(error.message)
  }
}
