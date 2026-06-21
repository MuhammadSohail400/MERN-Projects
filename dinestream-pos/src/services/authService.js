import axiosInstance from './axiosInstance'

const authService = {

  login: async (email, password) => {
    const res = await axiosInstance.post('/auth/login', { email, password })
    return res.data
  },

  signup: async (data) => {
    const res = await axiosInstance.post('/auth/signup', data)
    return res.data
  },

  getMe: async () => {
    const res = await axiosInstance.get('/auth/me')
    return res.data
  },

  updateProfile: async (data) => {
    const res = await axiosInstance.put('/auth/profile', data)
    return res.data
  },

  changePassword: async (data) => {
    const res = await axiosInstance.put('/auth/change-password', data)
    return res.data
  },
}

export default authService