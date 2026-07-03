export const TOAST_ACTIONS = {
  ADD_TOAST:    'ADD_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
}

export const toastInitialState = {
  toasts: [],
}

const toastReducer = (state, action) => {
  switch (action.type) {

    case TOAST_ACTIONS.ADD_TOAST:
      return {
        ...state,
        toasts: [...state.toasts, action.payload],
      }

    case TOAST_ACTIONS.REMOVE_TOAST:
      return {
        ...state,
        toasts: state.toasts.filter(t => t.id !== action.payload),
      }

    default:
      return state
  }
}

export default toastReducer