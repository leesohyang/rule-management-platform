
const initialState = {
    open: false,
    openSelect: false,
    currType: '',
    data: [{}],
    history: [],
    historyLive: [], //[{}]=>[]
    historyNormal:[],
    linkData: [{}],
    temp: [{}],
    refre: false,
    headerRestore: false,
    ad: false,
    link: [{}],
    node: [{}],
    dataTmp: {
        nodes:[
        ],
        links:[
        ]
    },
    //for history
    edited: 0,
    editedOrigin:{},
    hflag: false,
    addedField: "",
    header: [],
    keyField: {},
    openKeyField: false,
    openConField: false,
    openSave: false,
    headVersion: "",
    headVersionTmp: "",
    startHistory: false

}

export default function fetchAPI(state = initialState, action) {
    switch (action.type) {
        case "HIS_FLAG":
            return {
                ...state,
                hflag: action.payload
            }
        case "START_HIS":
            return {
                ...state,
                startHistory: action.payload
            }
        case "CURR_ED":
            return {
                ...state,
                edited: action.viewIn,
                editedOrigin: action.In
            }
        case "KEY_FIELD":
            return {
                ...state,
                keyField:action.payload
            }
        case "HEAD_LIST":
            return {
                ...state,
                header: action.payload
            }
        case "RESTORE_VER":
            return {
                ...state,
                headVersionTmp: action.payload
            }
        case "SAVE_VER":
            return {
                ...state,
                headVersion: action.payload
            }
        case "OPEN_POP":
            return {
                ...state,
                open: action.payload
            }
        case "ADD_FIELD":
            return {
                ...state,
                addedField: action.payload
            }
        case "OPEN_SAVE_POP":
            return {
                ...state,
                openSave: action.payload
            }

        case "OPEN_CON_POP":
            return {
                ...state,
                openConField: action.payload
            }
        case "OPEN_KEY_POP":
            return {
                ...state,
                openKeyField: action.payload
            }
        case "OPEN_SELECT_POP":
            return {
                ...state,
                openSelect: action.payload
            }
        case "CURR_TYPE":
            return {
                ...state,
                currType: action.payload
            }
        case "EDIT_ZERO":
            return {
                ...state,
                edited: 0
            }
        case "GET_ALLH_NORMAL":
            return {
                ...state,
                historyNormal: action.payload,
                editedOrigin: action.init,
                edited: 0
            }
        case "GET_ALLH_LIVE":
            return {
                ...state,
                historyLive: action.payload,
                editedOrigin: action.init,
                edited: 0
            }
        case "GET_ALLH":
            return {
                ...state,
                history:action.payload,
                editedOrigin: action.init, //배포용
                edited: 0
            }
        case "GET_ALL":
            return {
            ...state,
            refre: false,
            ad: false,
            data: action.payload
            // data:
        }
        case "ADD_TMP":
            return {
                ...state,
                data: action.payload
            }
        case "DEL_TMP":
            return {
                ...state,
                data: state.data.filter((data, i)=>
                    // data.id !== state.data.length
                    data.id != action.payload
        )
            }
        case "GET_TMP":
            return {
                ...state,
                temp: action.payload
            }
        case "REV_RE":
            return {
                ...state,
                refre: action.payload
            }
        case "HEAD_RESTORE":
            return {
                ...state,
                headRestore: action.payload
            }
        case "REV_AD":
            return {
                ...state,
                ad: action.payload
            }

        case "GET_GRAPH":
            return {
                ...state,
                ad: false,
                linkData: action.link,
            }
        case "GET_GRAPH2":
            return {
                ...state,
                linkData: action.link,
                dataTmp: {
                    nodes: action.node,
                    links: action.link
                }
            }
        default:
            return state;
    }
}