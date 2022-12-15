import axiosClient from "./axiosClient"

const tourApi = {
    getAll: ({page = 1, limit = 10,}) => {
        const url = 'tour/'
        return axiosClient.get(url, { params: {page, limit}})
    },
    getAllToRenderMap: () => {
        const url = 'tour/render-map'
        return axiosClient.get(url)
    },
    getById: (id) => {
        const url = `tour/${id}`
        return axiosClient.get(url)
    },
    create: (data) => {
        const url = `tour/`
        return axiosClient.post(url, data)
    },
    update: (idTour, data) => {
        const url = `tour/${idTour}`
        return axiosClient.put(url, data)
    },
}

export default tourApi