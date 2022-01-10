
const initialState = {
    isOpen: false,
    clickedData: '',
    selectedData: [],
    selectedDataF: [],
    entities: [],
    entityFrom: []
}

//payload에 여러개 담을땐 어떡하지?
export default function SlidePop(state = initialState, action) {
    switch (action.type) {

        case "REV_OP":
            // return action.payload;
            return {
                ...state,
                isOpen: action.payload
            }
        case "CLICK_OPT":
            return {
                ...state,
                clickedData: action.data
            }
        case "CLICK_OP":
            return {
                ...state,
                isOpen: action.flagOpen,
                clickedData: action.data
            }
        case "CLEAR_CLICK":
            return {
                ...state,
                clickedData: action.data
            }
        case "SELECT_OP":
            return {
                ...state,
                selectedData: action.data
            }
        case "SELECT_OP_FROM":
            return {
                ...state,
                selectedDataF: action.data
            }
        case "SELECT_EN":
            return {
                ...state,
                entities: action.data
            }
        case "SELECT_ENF":
            return {
                ...state,
                entityFrom: action.data
            }
        default:
            return state;
    }
}