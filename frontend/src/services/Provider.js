import axios from 'axios';
import {getAllH, getAllHL, getAllHN, getAllR, selectHead} from "./Redux/actions";


const BASE_URL = 'http://10.250.238.169:8096/api/v1/'

function getAllRedux(type) {
    return async (dispatch) => {
        await axios
            .get(BASE_URL + type + '/selectall')
            .then(response => {
                switch (type) {
                    case "normalizerule":
                        return dispatch(getAllR(response.data.map(
                            ({vendors, ...other}) => {
                                return {vendors: vendors.join(',').toString(), ...other}
                            }
                        )))
                    default:
                        return dispatch(getAllR(response.data))
                }
            })
            .catch(error => {
                throw(error);
            })
    }
}

function getNormalizeRuleFilter(obj) {
    return async (dispatch) => {
        await axios
            .post(BASE_URL + 'normalizerule/selectAllFilters', obj)
            .then(response => {
                return dispatch(getAllR(response.data.slice().map(
                    ({vendors, ...other}) => {
                        return {vendors: vendors.join(',').toString(), ...other}
                    }
                )))
            })
            .catch(error => {
                throw(error);
            })
    }
}

function getNormalizeRule(offset, limit) {
    return async (dispatch) => {
        await axios
            .get(BASE_URL + 'normalizerule/selectall?offset=' + offset + '&limit=' + limit)
            .then(response => {
                console.log(response.data)
                return dispatch(getAllR(response.data.slice().map(
                    ({vendors, ...other}) => {
                        return {vendors: vendors.join(',').toString(), ...other}
                    }
                )))
            })
            .catch(error => {
                throw(error);
            })
    }
}

async function getRowCounts(type) {
    return await axios
        .get(BASE_URL + type + '/getrowcount')
        .then((res) => res.data)
}

async function getFiltersCounts(type, obj) {
    return await axios
        .post(BASE_URL + type + '/getFiltersCount', obj)
        .then((res) => res.data)
}


//for history
function getAll(type) {
    return async (dispatch) => {
        await axios
            .get(BASE_URL + type + '/selectall')
            .then(response => {

                switch (type) {
                    case "history":
                        return response.data.length && dispatch(getAllH(response.data))
                    case "history/livedetectrule":
                        return response.data.length && dispatch(getAllHL(response.data))
                    case "history/normalizerule":
                        return response.data.length && dispatch(getAllHN(response.data))
                    default:
                        return
                }
            })
            .catch(error => {
                throw(error);
            })
    }
}


async function deActiveHead() {
    return await axios
        .get(BASE_URL + 'header/deActive')
        .catch(error => {
            throw(error);
        })
}

async function insertHead(ob) {

    return await axios
        .post(BASE_URL + 'header/insert', ob)
}

async function activeHead(version) {
    return await axios
        .post(BASE_URL + 'header/active', version)
}

function getHeadVer(version) {
    return async (dispatch) => {
        await axios
            .get(BASE_URL + 'header/selectHeaderVersion?ver=' + version)
            .then(response => {
                const res = response.data.header.map((it) =>
                    Object.assign({}, {Header: it, accessor: it})
                );
                dispatch(selectHead(res));
            })
            .catch(error => {
                throw(error);
            })
    }
}

async function getHead() {
    return await axios
        .get(BASE_URL + 'header/selectheader')
        .then(response => {
            return response.data.ver
        })
        .catch(error => {
            throw(error);
        })
}

async function getLiveRulesFilter(obj) {
        return await axios
            .post(BASE_URL + 'rules/selectAllFilters', obj)
            .then(response => {
                return response.data.map(({conditions, ...other}) => {
                    const tp = {};
                    conditions.forEach(
                        ({field, value}) => {
                            tp[field] = value
                        }
                    )
                    return Object.assign({}, other, tp)
                })
            })
            .catch(error => {
                throw(error);
            })
}

async function getLiveRules(offset, limit) {
    return await axios
        .get(BASE_URL + 'rules/selectall?offset=' + offset + '&limit=' + limit)
        .then(response => {
            return response.data.map(({conditions, ...other}) => {
                const tp = {};
                conditions.forEach(
                    ({field, value}) => {
                        tp[field] = value
                    }
                )
                return Object.assign({}, other, tp)
            })
        })
        .catch((error) => {
            console.error(error)
        })
}
async function upsertAndHistory(release, rules){
    return await axios
        .post(BASE_URL + 'rules/upsertAndHistory2?released=' + release, rules)
        .catch((error)=>{
            console.error(error)
        }) }

async function restore(rules, release){
    return await axios
        .post(BASE_URL + 'rules/restore?released='+ release , rules)
        .catch((error)=>{
            console.error(error)
        })
}
async function updateRelease(){
    return await axios
        .post(BASE_URL + 'history/livedetectrule/updateRelease')
        .catch((error)=>{
            console.error(error)
        })
}

async function getReleaseForm(type) {
    return await axios
        .get(BASE_URL + 'releaseForm/select?type=' + type)
        .catch((error) => {
            console.error(error)
        })
}

async function signalZk(signals) {
    return await axios
        .post(BASE_URL + 'rules/signal', signals)
        .catch((error) => {
            console.error(error)
        })
}

async function parse(parseStr) {
    return await axios
        .post(BASE_URL + 'normalizerule/parse', {parseStr})
        .then(response => {
            console.log(response)
            return JSON.parse(decodeURIComponent(response.data.replace(/\+/g, "%20")))
        })
        .catch((error) => {
            console.error(error)
        })

}

async function releaseZk(options) {
    return await axios
        .post(BASE_URL + 'rules/zookeeper', options)
        .then(response => {
            console.log(response.data)
        })
        .catch((error) => {
            console.error(error)
        })
}

async function getVendors(enType) {
    return await axios
        .get(BASE_URL + 'template/vendors?entity=' + enType)
        .catch((error) => {
            console.error(error)
        })
}

async function getModels(enType, venType) {
    return await axios
        .get(BASE_URL + 'template/models?entity=' + enType + '&vendor=' + venType)
        .catch((error) => {
            console.error(error)
        })
}

// 추가 가능한 entity list 조회
async function getEna(enType) {
    return await axios
        .get(BASE_URL + 'asset/selectbyquery?entityType=' + enType)
        .catch((error) => {
            console.error(error)
        })
}

async function getEnd(enType, venType, moType) {
    return await axios
        .get(BASE_URL + 'device/selectbyquery?entityType=' + enType + '&vendor=' + venType + '&model=' + moType)
        .catch((error) => {
            console.error(error)
        })
}

async function insertLiveDetect(ob, version) {
    const con = []
    const res = (({id, active, ruleType, keyField, confirms, ver, ...other}) => {
        Object.keys(other)
            .filter(it => other[it] !== "")
            .forEach(it => {
                con.push({field: it, value: other[it]})
            })
        return ({active, ruleType, keyField, confirms, ver: version})
    })(ob)
    res['conditions'] = con
    return await axios
        .post(BASE_URL + 'rules/insert', res)
        .then(() => console.log("hi"))
        .catch((error) => {
            console.error(error)
        })
}

async function insert(type, ob) {
    const sob = (({id, updatedAt, ...other}) => other)(ob) //여기서 id를 빼는데.
    return await axios
        .post(BASE_URL + type + '/insert', sob)
        .catch((error) => {
            console.error(error)
        })

}

async function setHistory() {
    return await axios
        .get(BASE_URL + 'normalizerule/selectall/tohistory')
        .then((response) => console.log(response.data))
        .catch((error) => {
            console.error(error)
        })
}

async function getNextId() {
    return await axios
        .get(BASE_URL + 'rules/next_id')
        .then((res)=> res.data)
        .catch((error) => {
            console.error(error)
        })
}

async function initHead() {
    return await axios
        .post(BASE_URL + 'header/init')
        .then((res)=> res.data)
        .catch((error) => {
            console.error(error)
        })
}

async function initRelForm() {
    return await axios
        .post(BASE_URL + 'releaseForm/init')
        .then((res)=> res.data)
        .catch((error) => {
            console.error(error)
        })
}
async function update(type, ob) {
    const sob = (({createdAt, updatedAt, ...other}) => other)(ob)

    return await axios
        .post(BASE_URL + type + '/update', sob)
        .catch((error) => {
            console.error(error)
        })
}

async function del(type, ids) {
    return await axios
        .delete(BASE_URL + type + '/delete', {
            headers: {'Content-Type': 'application/json'},
            data: ids
        })
        .catch((error) => {
            console.error(error)
        })
}

async function delNormal(type, id) {
    console.log(id)
    return await axios
        .delete(BASE_URL + type + '/delete/' + id)
        .catch((error) => {
            console.error(error)
        })
}

async function delAll(type) {
    return await axios
        .get('http://10.250.238.169:8096/api/v1/' + type + '/deleteAll')
        .catch((error) => {
            console.error(error)
        })
}

export const apiProvider = {
    insert,
    update,
    del,
    delNormal,
    delAll,
    getAllRedux,
    getNormalizeRule,
    getNormalizeRuleFilter,
    getHead,
    getReleaseForm,
    releaseZk,
    parse,
    signalZk,
    getAll,
    getVendors,
    getModels,
    getEna,
    getEnd,
    setHistory,
    getLiveRules,
    getLiveRulesFilter,
    insertLiveDetect,
    restore,
    updateRelease,
    insertHead,
    activeHead,
    getHeadVer,
    getRowCounts,
    getFiltersCounts,
    deActiveHead,
    upsertAndHistory,
    getNextId,
    initHead,
    initRelForm
};