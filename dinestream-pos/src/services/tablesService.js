import axiosInstance from './axiosInstance'

const tablesService = {

  getAll: async () => {
    const res = await axiosInstance.get('/tables')
    return res.data
  },

  create: async (data) => {
    const res = await axiosInstance.post('/tables', data)
    return res.data
  },

  updateStatus: async (id, data) => {
    const res = await axiosInstance.patch(`/tables/${id}`, data)
    return res.data
  },
}

export default tablesService