import axiosInstance from './axiosInstance'

const restaurantService = {

  get: async () => {
    const res = await axiosInstance.get('/restaurant')
    return res.data
  },

  update: async (data) => {
    const res = await axiosInstance.put('/restaurant', data)
    return res.data
  },
}

export default restaurantService