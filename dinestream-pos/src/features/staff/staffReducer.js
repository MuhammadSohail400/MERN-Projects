export const STAFF_ACTIONS = {
  SET_STAFF:    'SET_STAFF',
  ADD_STAFF:    'ADD_STAFF',
  EDIT_STAFF:   'EDIT_STAFF',
  DELETE_STAFF: 'DELETE_STAFF',
  SET_LOADING:  'SET_LOADING',
}

export const staffInitialState = {
  staff:     [],
  isLoading: false,
}

const staffReducer = (state, action) => {
  switch (action.type) {

    case STAFF_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload }

    case STAFF_ACTIONS.SET_STAFF:
      return { ...state, staff: action.payload, isLoading: false }

    case STAFF_ACTIONS.ADD_STAFF:
      return { ...state, staff: [action.payload, ...state.staff] }

    case STAFF_ACTIONS.EDIT_STAFF:
      return {
        ...state,
        staff: state.staff.map(s =>
          s.id === action.payload.id ? { ...s, ...action.payload } : s
        ),
      }

    case STAFF_ACTIONS.DELETE_STAFF:
      return {
        ...state,
        staff: state.staff.filter(s => s.id !== action.payload),
      }

    default:
      return state
  }
}

export default staffReducer