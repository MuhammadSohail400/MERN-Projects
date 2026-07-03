import { createContext, useReducer, useEffect, useState } from 'react'
import menuReducer, {
  menuInitialState,
  MENU_ACTIONS,
} from '../features/menu/menuReducer'
import menuService from '../services/menuService'

const MenuContext = createContext(null)

export const MenuProvider = ({ children }) => {

  const [state, dispatch]       = useReducer(menuReducer, menuInitialState)
  const [categories, setCategories] = useState([])

  // ── Fetch categories ─────────────────────────────────────────
  const fetchCategories = async () => {
    try {
      const res = await menuService.getCategories()
      setCategories(res.data)
      console.log('Categories loaded:', res.data)
    } catch (err) {
      console.error('Categories fetch failed:', err)
    }
  }

  // ── Fetch menu ───────────────────────────────────────────────
  const fetchMenu = async () => {
    dispatch({ type: MENU_ACTIONS.SET_LOADING, payload: true })
    try {
      const res = await menuService.getAll()
      const items = res.data.map(item => ({
        ...item,
        category:   item.category?.name || 'Uncategorized',
        categoryId: item.categoryId,
        emoji:      item.emoji || '🍽️',
      }))
      dispatch({ type: MENU_ACTIONS.SET_MENU, payload: items })
    } catch (err) {
      console.error('Menu fetch failed:', err)
      dispatch({ type: MENU_ACTIONS.SET_LOADING, payload: false })
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchMenu()
  }, [])

  // ── Helper: name → categoryId ────────────────────────────────
  const getCategoryId = (categoryName) => {
    if (!categoryName) return null
    const found = categories.find(
      c => c.name.toLowerCase() === categoryName.toLowerCase()
    )
    console.log('getCategoryId:', categoryName, '→', found?.id)
    return found?.id || null
  }

  // ── Add Item ─────────────────────────────────────────────────
  const addItem = async (itemData) => {
    try {
      const categoryId = getCategoryId(itemData.category)

      console.log('Adding item:', { ...itemData, categoryId })

      if (!categoryId) {
        alert(`Category "${itemData.category}" not found!\nAvailable: ${categories.map(c => c.name).join(', ')}`)
        return
      }

      const payload = {
        name:        itemData.name,
        description: itemData.description || '',
        price:       parseFloat(itemData.price),
        emoji:       itemData.emoji || '🍽️',
        prepTime:    parseInt(itemData.prepTime) || 10,
        isAvailable: itemData.isAvailable ?? true,
        categoryId,
      }

      const res = await menuService.create(payload)
      const newItem = {
        ...res.data,
        category:   res.data.category?.name || itemData.category,
        categoryId: res.data.categoryId,
        emoji:      res.data.emoji || itemData.emoji,
      }
      dispatch({ type: MENU_ACTIONS.ADD_ITEM, payload: newItem })

    } catch (err) {
      console.error('Add item failed:', err.response?.data || err)
      alert('Error: ' + (err.response?.data?.message || err.message))
    }
  }

  // ── Edit Item ────────────────────────────────────────────────
  const editItem = async (itemData) => {
    try {
      const categoryId = itemData.categoryId || getCategoryId(itemData.category)

      const payload = {
        name:        itemData.name,
        description: itemData.description || '',
        price:       parseFloat(itemData.price),
        emoji:       itemData.emoji || '🍽️',
        prepTime:    parseInt(itemData.prepTime) || 10,
        isAvailable: itemData.isAvailable ?? true,
        categoryId,
      }

      const res = await menuService.update(itemData.id, payload)
      const updated = {
        ...itemData,
        ...res.data,
        category:   res.data.category?.name || itemData.category,
        categoryId: res.data.categoryId || categoryId,
      }
      dispatch({ type: MENU_ACTIONS.EDIT_ITEM, payload: updated })

    } catch (err) {
      console.error('Edit item failed:', err.response?.data || err)
      alert('Error: ' + (err.response?.data?.message || err.message))
    }
  }

  // ── Delete Item ──────────────────────────────────────────────
  const deleteItem = async (id) => {
    try {
      await menuService.delete(id)
      dispatch({ type: MENU_ACTIONS.DELETE_ITEM, payload: id })
    } catch (err) {
      console.error('Delete item failed:', err.response?.data || err)
      alert('Error: ' + (err.response?.data?.message || err.message))
    }
  }

  // ── Toggle Availability ──────────────────────────────────────
  const toggleAvailability = async (id) => {
    const item = state.items.find(i => i.id === id)
    if (item) {
      await editItem({ ...item, isAvailable: !item.isAvailable })
    }
  }
  const addCategory = async (data) => {
  try {
    const res = await menuService.createCategory(data)
    setCategories(prev => [...prev, res.data])
    return { success: true, category: res.data }
  } catch (err) {
    console.error('Add category failed:', err.response?.data || err)
    return { success: false, error: err.response?.data?.message || err.message }
  }
}

  // ── Value — getCategoryId export karo ────────────────────────
  const value = {
    items:              state.items,
    categories,                        // ← categories list
    isLoading:          state.isLoading,
    addItem,
    editItem,
    deleteItem,
    toggleAvailability,
    fetchMenu,
    getCategoryId,
     addCategory,                // ← export karo
  }

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  )
}

export default MenuContext