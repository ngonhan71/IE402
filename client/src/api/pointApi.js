import axiosClient from "./axiosClient"

const pointApi = {
    update: (id, data) => {
        const url = `point/${id}`
        return axiosClient.put(url, data)
    },
}

export default pointApi