const initialState = {
    username: '',
    name: '',
    userId: '',
    role: 0,
};
const userReducer = (state = initialState, action) => {
    switch (action.type) {

        case "LOGIN": {
            console.log({
                ...state,
                ...action.payload,
            })
            return {
                ...state,
                ...action.payload,
            };
        }

        case "LOGOUT": {
            return {
                ...state,
                username: '',
                name: '',
                userId: '',
                role: 0,
            };
        }

        default: {
            return state;
        }
    }
};
  
export default userReducer;
  