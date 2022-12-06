import axiosClient from "./axiosClient"

const symbolApi = {
    getAll: ({page = 1, limit = 10,}) => {
        const url = 'symbol/'
        return axiosClient.get(url, { params: {page, limit}})
    },
    getById: (id) => {
        const url = `symbol/${id}`
        return axiosClient.get(url)
    },
    create: (data) => {
        const url = `symbol/`
        return axiosClient.post(url, data)
    },
    update: (id, data) => {
        const url = `symbol/${id}`
        return axiosClient.put(url, data)
    },
}

export default symbolApi