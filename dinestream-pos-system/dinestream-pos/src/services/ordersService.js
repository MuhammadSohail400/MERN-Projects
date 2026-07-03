import axiosInstance from './axiosInstance'

const ordersService = {

  getAll: async (status) => {
    const params = status ? { status } : {}
    const res = await axiosInstance.get('/orders', { params })
    return res.data
  },

  getById: async (id) => {
    const res = await axiosInstance.get(`/orders/${id}`)
    return res.data
  },

  create: async (data) => {
    const res = await axiosInstance.post('/orders', data)
    return res.data
  },

  updateStatus: async (id, status) => {
    const res = await axiosInstance.patch(`/orders/${id}`, { status })
    return res.data
  },

  delete: async (id) => {
    const res = await axiosInstance.delete(`/orders/${id}`)
    return res.data
  },
}

export default ordersService