import axiosClient from "./axiosClient"

const provinceApi = {
    getAll: ({page = 1, limit = 10,}) => {
        const url = 'province/'
        return axiosClient.get(url, { params: {page, limit}})
    },
    getById: (id) => {
        const url = `province/${id}`
        return axiosClient.get(url)
    },
    create: (data) => {
        const url = `province/`
        return axiosClient.post(url, data)
    },
    update: (id, data) => {
        const url = `province/${id}`
        return axiosClient.put(url, data)
    },
}

export default provinceApi