import axiosClient from "./axiosClient"

const locationApi = {
    getAll: ({page = 1, limit}) => {
        const url = 'location/'
        return axiosClient.get(url, { params: {page, limit}})
    },
    getAllToRenderMap: () => {
        const url = 'location/render-map'
        return axiosClient.get(url)
    },
    getById: (id) => {
        const url = `location/${id}`
        return axiosClient.get(url)
    },
    create: (data) => {
        const url = `location/`
        return axiosClient.post(url, data)
    },
    update: (id, data) => {
        const url = `location/${id}`
        return axiosClient.put(url, data)
    },
}

export default locationApi