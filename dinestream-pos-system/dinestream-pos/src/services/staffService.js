
import axiosInstance from './axiosInstance'

const staffService = {

  getAll: async () => {
    const res = await axiosInstance.get('/staff')
    return res.data
  },

  create: async (data) => {
    const res = await axiosInstance.post('/staff', data)
    return res.data
  },

  update: async (id, data) => {
    const res = await axiosInstance.put(`/staff/${id}`, data)
    return res.data
  },

  delete: async (id) => {
    const res = await axiosInstance.delete(`/staff/${id}`)
    return res.data
  },
}

export default staffService