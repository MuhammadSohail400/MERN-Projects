// ─── Action Types ───────────────────────────────────────────
// String constants — typo se bachne ke liye
export const AUTH_ACTIONS = {
  LOGIN_START:      'LOGIN_START',
  LOGIN_SUCCESS:    'LOGIN_SUCCESS',
  LOGIN_FAILURE:    'LOGIN_FAILURE',
  LOGOUT:           'LOGOUT',
  UPDATE_PROFILE:   'UPDATE_PROFILE',
  CLEAR_ERROR:      'CLEAR_ERROR',
}

// ─── Initial State ──────────────────────────────────────────
export const authInitialState = {
  user:      null,
  token:     localStorage.getItem('ds_token') || null,
  isLoading: false,
  error:     null,
}

// ─── Reducer Function ───────────────────────────────────────
// reducer(currentState, action) → newState
// PURE FUNCTION: same input → always same output, no side effects
const authReducer = (state, action) => {
  switch (action.type) {

    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,         // baaki sab same raho
        isLoading: true,  // spinner on
        error: null,      // purani error clear
      }

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user:  action.payload.user,
        token: action.payload.token,
        error: null,
      }

    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,  // error message
      }

    case AUTH_ACTIONS.LOGOUT:
      return {
        user:      null,
        token:     null,
        isLoading: false,
        error:     null,
      }

    case AUTH_ACTIONS.UPDATE_PROFILE:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      }

    case AUTH_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null }

    default:
      return state  // unknown action → state as-is
  }
}

export default authReducer