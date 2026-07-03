export const MENU_ACTIONS = {
  SET_MENU:    'SET_MENU',
  ADD_ITEM:    'ADD_ITEM',
  EDIT_ITEM:   'EDIT_ITEM',
  DELETE_ITEM: 'DELETE_ITEM',
  SET_LOADING: 'SET_LOADING',
}



export const menuInitialState = {
  items:     [],
  isLoading: false,
}

const menuReducer = (state, action) => {
  switch (action.type) {

    case MENU_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload }

    case MENU_ACTIONS.SET_MENU:
      return { ...state, items: action.payload, isLoading: false }

    case MENU_ACTIONS.ADD_ITEM:
      return {
        ...state,
        // Naya item array ke start mein add karo
        items: [action.payload, ...state.items],
      }

    case MENU_ACTIONS.EDIT_ITEM:
      return {
        ...state,
        // Sirf woh item update karo jiska id match kare
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, ...action.payload }
            : item
        ),
      }

    case MENU_ACTIONS.DELETE_ITEM:
      return {
        ...state,
        // Woh item filter out karo
        items: state.items.filter(item => item.id !== action.payload),
      }

    default:
      return state
  }
}

export default menuReducer