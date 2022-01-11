import axios from 'axios';
import {getAllH, getAllHL, getAllHN, getAllR, selectHead} from "./Redux/actions";


const BASE_URL = 'http://10.250.238.169:8096/api/v1/'

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


async function delNormal(type, id) {
    console.log(id)
    return await axios
        .delete(BASE_URL + type + '/delete/' + id)
        .catch((error) => {
            console.error(error)
        })
}


export const apiProvider = {
    insert,
    update,
    delNormal,
    getHead,
    getReleaseForm,
    releaseZk,
    signalZk,
    getAll,
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