export const TABLE_ACTIONS = {
  SET_TABLES:          'SET_TABLES',
  UPDATE_TABLE_STATUS: 'UPDATE_TABLE_STATUS',
  SET_LOADING:         'SET_LOADING',
  SET_SELECTED:        'SET_SELECTED',
}

export const tablesInitialState = {
  tables:    [],
  selected:  null,
  isLoading: false,
}

const tablesReducer = (state, action) => {
  switch (action.type) {

    case TABLE_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload }

    case TABLE_ACTIONS.SET_TABLES:
      return { ...state, tables: action.payload, isLoading: false }

    case TABLE_ACTIONS.UPDATE_TABLE_STATUS:
      return {
        ...state,
        tables: state.tables.map(table =>
          table.id === action.payload.id
            ? { ...table, status: action.payload.status }
            : table
        ),
      }

    case TABLE_ACTIONS.SET_SELECTED:
      return { ...state, selected: action.payload }

    default:
      return state
  }
}

export default tablesReducer