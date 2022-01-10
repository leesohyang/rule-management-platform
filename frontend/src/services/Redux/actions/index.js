//for header version
export function saveVersion(data){
    return {
        type: "SAVE_VER",
        payload: data
    }
}
export function restoreVersion(data){
    return {
        type: "RESTORE_VER",
        payload: data
    }
}
export function openPop(data) {
    return {
        type: "OPEN_POP",
        payload: data
    }
}
export function openSavePop(data){
    return {
        type: "OPEN_SAVE_POP",
        payload:data
    }
}

export function openSelectPop(data){
    return {
        type: "OPEN_SELECT_POP",
        payload:data
    }
}
export function openSelectKeyFieldPop(data){
    return {
        type: "OPEN_KEY_POP",
        payload: data
    }
}
export function openSelectConFieldPop(data){
    return {
        type: "OPEN_CON_POP",
        payload: data
    }
}

export function selectHead(data){
    return {
        type: "HEAD_LIST",
        payload: data
    }
}
export function addedField(data){
    return {
        type: "ADD_FIELD",
        payload:data
    }
}
export function currType(data) {
    return {
        type:"CURR_TYPE",
        payload: data
    }
}

export function startHis(data){
    return {
        type:"START_HIS",
        payload:data
    }
}
//for history
export function hisFlag(data) {
    return {
        type:"HIS_FLAG",
        payload: data
    }
}
export function editZero(){
    return {
        type: "EDIT_ZERO",
    }
}
export function getAllHN(data) {  //TODO::이거 아래랑 똑같을건데
    return {
        type: "GET_ALLH_NORMAL",
        payload: data,
        init: data[0]
    };
}
export function getAllH(data) {  //TODO::이거 아래랑 똑같을건데
    return {
        type: "GET_ALLH",
        payload: data,
        init: data[0]
    };
}
export function getAllHL(data){
    return {
        type: "GET_ALLH_LIVE",
        payload: data,
        init: data[0]
    }
}
export function currEd(vi, i){
    return {
        type:"CURR_ED",
        viewIn:vi,
        In:i
    }
}

export function getAllR(data) {
    return {
        type: "GET_ALL",
        payload: data
    };
}
export function keyFieldSelect(data){
    return {
        type: "KEY_FIELD",
        payload: data
    }
}
export function addTmp(data){
    return {
        type:"ADD_TMP",
        payload:data
    }
}
export function deleteTmp(idx){
    return {
        type:"DEL_TMP",
        payload: idx
    }
}

export function getVens (data) {
    return {
        type: "GET_VENS",
        payload: data
    }
}

export function getTmp(data) {
    return {
        type: "GET_TMP",
        payload: data
    }
}

export function revRe(flag){
    return {
        type: "REV_RE",
        payload:flag
    }
}
export function restoreHead(flag){
    return {
        type: "HEAD_RESTORE",
        payload:flag
    }
}
export function revAd(flag){
    return {
        type: "REV_AD",
        payload:flag
    }
}

export function revOp(flag){
    return {
        type:"REV_OP",
        payload:flag
    }
}
export function clickedOpt(data){
    return {
        type:"CLICK_OPT",
        data:data
    }
}
export function clickedOp(data, flag){
    return {
        type:"CLICK_OP",
        data:data,
        flagOpen:flag

    }
}
export function clearClicked(data){
    return {
        type:"CLEAR_CLICK",
        data:data
    }
}

export function selectedOp(data){
    return {
        type:"SELECT_OP",
        data:data
    }
}

export function getGraphs(node, link){
    return {
        type: "GET_GRAPH2",
        link: link,
        node: node
    }
}

export function getLinks(link){
    return {
        type: "GET_GRAPH",
        link:link
    }
}

export function getEntities(data) {
    return {
        type: "SELECT_EN",
        data:data
    }
}

export function getEntityFrom(data) {
    return {
        type:"SELECT_ENF",
        data:data
    }
}

export function selectedOpFrom(data) {
    return {
        type:"SELECT_OP_FROM",
        data:data
    }
}

//추가/삭제/변경사항 저장용
export function addSave(data) {
    return {
        type:"ADD_SAVE",
        data: data
    }
}
export function delSave(data) {
    return {
        type:"DEL_SAVE",
        data: data,
    }
}
export function editSave(data) {
    return {
        type:"EDIT_SAVE",
        data: data,
    }
}

export function dataSave(data){
    return {
        type:"DATA_SAVE",
        data: data
    }
}
