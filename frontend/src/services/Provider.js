import axios from 'axios';
import {
    getAllR,
    getGraphs,
    getLinks,
    getTmp,
    getVens,
    getAllH,
    selectHead,
    revRe,
    saveVersion,
    getAllHL, getAllHN
} from "./Redux/actions";
import {useDispatch} from "react-redux";


const BASE_URL = 'http://10.250.238.177:8096/api/v1'

function getAllRedux(type) {
    return async (dispatch) => {
        await axios
            .get('http://10.250.238.177:8096/api/v1/' + type + '/selectall')
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
            .post('http://10.250.238.177:8096/api/v1/normalizerule/selectAllFilters', obj)
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

function getNormalizeRule(offset, limit) {
    return async (dispatch) => {
        await axios
            .get('http://10.250.238.177:8096/api/v1/normalizerule/selectall?offset=' + offset + '&limit=' + limit)
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
        .get('http://10.250.238.177:8096/api/v1/' + type + '/getrowcount')
        .then((res) => res.data)
}

async function getFiltersCounts(type, obj) {
    return await axios
        .post('http://10.250.238.177:8096/api/v1/' + type + '/getFiltersCount', obj)
        .then((res) => res.data)
}


//for history
function getAll(type) {
    return async (dispatch) => {
        await axios
            .get('http://10.250.238.177:8096/api/v1/' + type + '/selectall')
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
        .get('http://10.250.238.177:8096/api/v1/header/deActive')
        .catch(error => {
            throw(error);
        })
}

async function insertHead(ob) {

    return await axios
        .post('http://10.250.238.177:8096/api/v1/header/insert', ob)
}

async function activeHead(version) {
    return await axios
        .post('http://10.250.238.177:8096/api/v1/header/active', version)
}

// function insertHead (ob) {
//     return async (dispatch) => {
//         await axios
//             .post('http://10.250.238.177:8096/api/v1/header/insert', ob)
//             .then(response => {
//                 dispatch(getHead)
//             })
//     }
// }
function getHeadVer(version) {
    console.log(version)
    return async (dispatch) => {
        await axios
            .get('http://10.250.238.177:8096/api/v1/header/selectHeaderVersion?ver=' + version)
            .then(response => {
                console.log(response.data.ver); //안가네
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

//live 되어있는 헤드 가져오기
async function getHead() {
    return await axios
        .get('http://10.250.238.177:8096/api/v1/header/selectheader')
        .then(response => {
            const res = response.data.header.map((it) =>
                Object.assign({}, {Header: it, accessor: it})
            )
            // dispatch(saveVersion(response.data.ver)) //버전 세팅
            // dispatch(selectHead(res))
            console.log(response.data.ver)
            return response.data.ver
        })
        .catch(error => {
            throw(error);
        })

}

async function getLiveRulesFilter(obj) {
        return await axios
            .post('http://10.250.238.177:8096/api/v1/rules/selectAllFilters', obj)
            .then(response => {
                const res = response.data.map(({conditions, ...other}) => {
                    const tp = {};
                    conditions.forEach(
                        ({field, value}) => {
                            tp[field] = value
                        }
                    )
                    return Object.assign({}, other, tp)
                })
                return res
            })
            .catch(error => {
                throw(error);
            })
}

//conditional field 땜에 떨어져있음.
async function getLiveRules(offset, limit) {

    return await axios
        .get('http://10.250.238.177:8096/api/v1/rules/selectall?offset=' + offset + '&limit=' + limit)
        .then(response => {
            const res = response.data.map(({conditions, ...other}) => {
                const tp = {};
                conditions.forEach(
                    ({field, value}) => {
                        tp[field] = value
                    }
                )
                return Object.assign({}, other, tp)
            })
            return res
        })
        .catch((error) => {
            console.error(error)
        })
}
async function upsertAndHistory(release, rules){
    return await axios
        .post('http://10.250.238.177:8096/api/v1/rules/upsertAndHistory2?released=' + release, rules)
        .catch((error)=>{
            console.error(error)
        })
}
async function restore(rules, release){
    return await axios
        .post('http://10.250.238.177:8096/api/v1/rules/restore?released='+ release , rules)
        .catch((error)=>{
            console.error(error)
        })
}
async function updateRelease(){
    return await axios
        .post('http://10.250.238.177:8096/api/v1/history/livedetectrule/updateRelease')
        .catch((error)=>{
            console.error(error)
        })
}

async function getReleaseForm(type) {
    return await axios
        .get('http://10.250.238.177:8096/api/v1/' + 'releaseForm' + '/select?type=' + type)
        .catch((error) => {
            console.error(error)
        })
}

async function signalZk(signals) {
    console.log(signals)
    return await axios
        .post('http://10.250.238.177:8096/api/v1/' + 'rules' + '/signal', signals)
        .catch((error) => {
            console.error(error)
        })
}

async function parse(parseStr) {
    console.log({parseStr})
    return await axios
        .post('http://10.250.238.177:8096/api/v1/normalizerule/parse', {parseStr})
        .then(response => {
            console.log(response)
            return JSON.parse(decodeURIComponent(response.data.replace(/\+/g, "%20")))
        })
        .catch((error) => {
            console.error(error)
        })

}

async function releaseZk(options) {
    console.log(options)
    return await axios
        .post('http://10.250.238.177:8096/api/v1/' + 'rules' + '/zookeeper', options)
        .then(response => {
            console.log(response.data)
        })
        .catch((error) => {
            console.error(error)
        })
}


function getNodes() { //select all => table 조회 용
    return async (dispatch) => {
        await axios.all([
            axios.get("http://10.250.238.177:8096/api/v1/node/selectall"),
            axios.get("http://10.250.238.177:8096/api/v1/link/selectall")
        ])
            .then(axios.spread(function (node, link) {
                const m = {}
                node.data.forEach((i) => {
                    m[i.id] = i.name
                })
                console.log(link.data)
                dispatch(getLinks(
                    link.data.map((i) => ({idx: i.id, ...i}))
                ))
            }))
            .catch((error) => {
                console.error(error)
            })
    }
}

function getAds(nodeId) { // select 인접 노드
    return async (dispatch) => {
        await axios.get("http://10.250.238.177:8096/api/v1/node/selectadjacent/" + nodeId)
            .then(response => {
                dispatch(getGraphs(
                    response.data.nodes,
                    response.data.links
                ))
            })
            .catch((error) => {
                console.error(error)
            })

    }
}

async function getAds2(nodeId) {
    return await axios
        .get("http://10.250.238.177:8096/api/v1/node/selectadjacent/" + nodeId)
        .then(response => {
            return response.data
        })
        .catch((error) => {
            console.error(error)
        })
}

async function getRow(type, id) {
    return await axios
        .get('http://10.250.238.177:8096/api/v1/' + type + '/select?id=' + id)
        .then(response => {
            console.log([...response.data].shift())
            return [...response.data].shift();
        })
        .catch((error) => {
            console.error(error)
        })
}

function getTemp(type) {
    return (dispatch) => {
        axios
            .get('http://10.250.238.177:8096/api/v1/template/selectbytype?node=' + type)
            .then(response => {
                dispatch(getTmp(response.data))
            })
            .catch(error => {
                throw(error);
            })

    }
}

async function getTypes(type) {
    return await axios
        .get("http://10.250.238.177:8096/api/v1/template/entitytypes?node=" + type)
        .catch((error) => {
            console.error(error)
        })
}

async function getVendors(enType) {
    return await axios
        .get("http://10.250.238.177:8096/api/v1/template/vendors?entity=" + enType)
        .catch((error) => {
            console.error(error)
        })
}

async function getModels(enType, venType) {
    return await axios
        .get("http://10.250.238.177:8096/api/v1/template/models?entity=" + enType + "&vendor=" + venType)
        .catch((error) => {
            console.error(error)
        })
}

// 추가 가능한 entity list 조회
async function getEna(enType) {
    return await axios
        .get("http://10.250.238.177:8096/api/v1/asset/selectbyquery?entityType=" + enType)
        .catch((error) => {
            console.error(error)
        })
}

async function getEnd(enType, venType, moType) {
    return await axios
        .get("http://10.250.238.177:8096/api/v1/device/selectbyquery?entityType=" + enType + "&vendor=" + venType + "&model=" + moType)
        .catch((error) => {
            console.error(error)
        })
}

async function insertLink(ob) {

    return await axios
        .post('http://10.250.238.177:8096/api/v1/link/insert', ob)
        .then(response => {
            console.log(response)
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
        .post('http://10.250.238.177:8096/api/v1/rules/insert', res)
        .then(() => console.log("hi"))
        .catch((error) => {
            console.error(error)
        })
}

async function insert(type, ob) {
    // const sob = (({id, createdAt, updatedAt, ... other}) => other)(ob)
    const sob = (({id, updatedAt, ...other}) => other)(ob) //여기서 id를 빼는데.
    // console.log(typeof sob.value)
    console.log(sob)
    return await axios
        .post('http://10.250.238.177:8096/api/v1/' + type + '/insert', sob)
        .catch((error) => {
            console.error(error)
        })

};


async function insertNormal(ob) {
    // ob["rules"] = []
    const sob = (({vendors, ...other}) => {
        return Object.assign({}, {vendors: vendors.split(',')}, other) //TODO::restore 할때 vendor 콤마가 사라짐
    })(ob)
    console.log(sob)
    return await axios
        .post('http://10.250.238.177:8096/api/v1/normalizerule/upsertall', sob)
        .catch((error) => {
            console.error(error)
        })
}

async function insertNormalTotal(ob) {
    const sob = (({vendors, ...other}) => {
        return Object.assign({}, {vendors: vendors.split(',')}, other)
    })(ob)
    console.log(sob)
    return await axios
        .post('http://10.250.238.177:8096/api/v1/normalizerule/upsert', sob)
        .catch((error) => {
            console.error(error)
        })
}

async function setHistory() {
    return await axios
        .get("http://10.250.238.177:8096/api/v1/normalizerule/selectall/tohistory")
        .then((response) => console.log(response.data))
        .catch((error) => {
            console.error(error)
        })
}

async function getNextVal() {
    return await axios
        .get("http://10.250.238.177:8096/api/v1/normalizerule/nextid")
        .catch((error) => {
            console.error(error)
        })
}

async function getNextId() {
    return await axios
        .get("http://10.250.238.177:8096/api/v1/rules/next_id")
        .then((res)=> res.data)
        .catch((error) => {
            console.error(error)
        })
}

async function update(type, ob) {
    console.log(ob)
    const sob = (({createdAt, updatedAt, ...other}) => other)(ob)

    return await axios
        .post('http://10.250.238.177:8096/api/v1/' + type + '/update', sob)
        .catch((error) => {
            console.error(error)
        })
}

async function del(type, ids) {
    console.log(ids)
    return await axios
        .delete('http://10.250.238.177:8096/api/v1/' + type + '/delete', {
            headers: {'Content-Type': 'application/json'},
            data: ids
        })
        .catch((error) => {
            console.error(error)
        })
}

async function delNormal(type, id) {
    return await axios
        .delete('http://10.250.238.177:8096/api/v1/' + type + '/delete', {
            headers: {'Content-Type': 'application/json'},
            data: id
        })
        .catch((error) => {
            console.error(error)
        })
}

async function delAll(type) {
    return await axios
        .get('http://10.250.238.177:8096/api/v1/' + type + '/deleteAll')
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
    getRow,
    getTemp,
    getTypes,
    getVendors,
    getModels,
    getNodes,
    getEna,
    getEnd,
    getNextVal,
    setHistory,
    insertLink,
    getAds,
    getAds2,
    getLiveRules,
    getLiveRulesFilter,
    insertLiveDetect,
    restore,
    updateRelease,
    insertNormal,
    insertNormalTotal,
    insertHead,
    activeHead,
    getHeadVer,
    getRowCounts,
    getFiltersCounts,
    deActiveHead,
    upsertAndHistory,
    getNextId

};