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
}

export default authService