import axiosInstance from './axiosInstance'

const menuService = {

  getAll: async () => {
    const res = await axiosInstance.get('/menu')
    return res.data
  },

  getCategories: async () => {
    const res = await axiosInstance.get('/menu/categories')
    return res.data
  },

  create: async (data) => {
    const res = await axiosInstance.post('/menu', data)
    return res.data
  },

  update: async (id, data) => {
    const res = await axiosInstance.put(`/menu/${id}`, data)
    return res.data
  },

  delete: async (id) => {
    const res = await axiosInstance.delete(`/menu/${id}`)
    return res.data
  },
}

export default menuService