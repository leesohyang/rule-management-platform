const initialState = {
    addId: [],
    delId: [],
    editId: [],
    savedData: []
}

export default function editOperator(state = initialState, action ){
    switch (action.type) {
        case "ADD_SAVE":
            return {
                ...state,
                addId: action.data
            }
        case "DEL_SAVE":
            return {
                ...state,
                delId: action.data
            }
        case "EDIT_SAVE":
            return {
                ...state,
                editId: action.data
            }
        case "DATA_SAVE":
            return {
                ...state,
                savedData: action.data
            }
        default:
            return state;
    }
}

//그리고 submit 되는 모든걸 저장하면 되나?