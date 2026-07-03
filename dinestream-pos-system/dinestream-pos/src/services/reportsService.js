import axiosInstance from './axiosInstance'

const reportsService = {

  getDashboardStats: async () => {
    const res = await axiosInstance.get('/reports/dashboard')
    return res.data
  },

  getSalesData: async (range = '7days') => {
    const res = await axiosInstance.get('/reports/sales', { params: { range } })
    return res.data
  },

  getTopItems: async (range = '7days') => {
    const res = await axiosInstance.get('/reports/top-items', { params: { range } })
    return res.data
  },

  getHourlyOrders: async () => {
    const res = await axiosInstance.get('/reports/hourly')
    return res.data
  },

  getCategoryBreakdown: async (range = '7days') => {
    const res = await axiosInstance.get('/reports/categories', { params: { range } })
    return res.data
  },

  getStaffPerformance: async (range = '7days') => {
    const res = await axiosInstance.get('/reports/staff-perf', { params: { range } })
    return res.data
  },
}

export default reportsService