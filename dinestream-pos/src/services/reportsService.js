import axiosInstance from './axiosInstance'

const reportsService = {

  getDashboardStats: async () => {
    const res = await axiosInstance.get('/reports/dashboard')
    return res.data
  },

  getSalesData: async () => {
    const res = await axiosInstance.get('/reports/sales')
    return res.data
  },

  getTopItems: async () => {
    const res = await axiosInstance.get('/reports/top-items')
    return res.data
  },
}

export default reportsService