import axios from 'axios';
import {getAllH, getAllHL, getAllHN, getAllR, selectHead} from "./Redux/actions";


const BASE_URL = 'http://10.250.238.169:8096/api/v1/'

/**
 * @api {get} {ruleType}/getrowcount Request total rows count for paging
 *
 * @apiSuccess {Integer} total rows count
 */
async function getRowCounts(type) {
    return await axios
        .get(BASE_URL + type + '/getrowcount')
        .then((res) => res.data)
}

/**
 * @api {post} {ruleType}/getFiltersCount Request total filtered rows count for paging
 *
 * @apiBody {Object} column name(key): filtered value(value)*
 * @apiSuccess {Integer} total filtered rows count
 */
async function getFiltersCounts(type, obj) {
    return await axios
        .post(BASE_URL + type + '/getFiltersCount', obj)
        .then((res) => res.data)
}


/**
 * @api {get} {ruleType}/selectall Request history data
 *
 * @apiSuccess {Object[]} list of history data
 */
function getAll(type) {
    return async (dispatch) => {
        await axios
            .get(BASE_URL + type + '/selectall')
            .then(response => {

                switch (type) {
                    // case "history":
                    //     return response.data.length && dispatch(getAllH(response.data))
                    case "history/livedetectrule":
                        return response.data.length && dispatch(getAllHL(response.data))
                    // case "history/normalizerule":
                    //     return response.data.length && dispatch(getAllHN(response.data))
                    default:
                        return
                }
            })
            .catch(error => {
                throw(error);
            })
    }
}

/**
 * @api {get} /header/deActive Deactivate all of those headers before insert new live header
 *
 * @apiSuccess 200 OK
 */
async function deActiveHead() {
    return await axios
        .get(BASE_URL + 'header/deActive')
        .catch(error => {
            throw(error);
        })
}

/**
 * @api {post} /header/insert Insert new version Header
 *
 * @apiBody {Object} header object
 * @apiSuccess 200 OK
 */
async function insertHead(ob) {

    return await axios
        .post(BASE_URL + 'header/insert', ob)
}

/**
 * @api {post} /header/active Activate restored header version
 *
 * @apiBody {String} restored header version
 * @apiSuccess 200 OK
 */
async function activeHead(version) {
    return await axios
        .post(BASE_URL + 'header/active', version)
}

/**
 * @api {get} /header/selectHeaderVersion?ver= Request header by version
 *
 * @apiParam {String} restored header version
 * @apiSuccess 200 OK
 */
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

/**
 * @api {get} /header/selectheader Request active header
 *
 * @apiSuccess 200 OK
 */
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

/**
 * @api {post} /rules/selectAllFilters Request filtered data
 *
 * @apiBody {Object} column name(key): filtered value(value)*
 * @apiSuccess {Object[]} select filtered data
 */
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

/**
 * @api {get} /rules/selectall?offset=&limit= Request grid data
 *
 * @apiParam {Integer} offset for paging
 * @apiParam {Integer} limit for paging
 * @apiSuccess {Object[]} select Livedetectrule data
 */
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

/**
 * @api {post} /rules/upsertAndHistory2?released= Upsert data table and insert all to history table
 *
 * @apiParam {Boolean} release flag
 * @apiBody {Object[]} edited/added data list
 * @apiSuccess 200 OK
 */
async function upsertAndHistory(release, rules){
    return await axios
        .post(BASE_URL + 'rules/upsertAndHistory2?released=' + release, rules)
        .catch((error)=>{
            console.error(error)
        }) }

/**
 * @api {post} /rules/restore?relesed= Truncate data table & insert all (rollback) and insert to history
 *
 * @apiParam {Boolean} release flag
 * @apiBody {Object[]} rollback data
 * @apiSuccess 200 OK
 */
async function restore(rules, release){
    return await axios
        .post(BASE_URL + 'rules/restore?released='+ release , rules)
        .catch((error)=>{
            console.error(error)
        })
}

/**
 * @api {get} /releaseForm/select?type= Request releaseForm
 *
 * @apiParam {String} ruleType
 * @apiSuccess {Object} release Form and default value
 */
async function getReleaseForm(type) {
    return await axios
        .get(BASE_URL + 'releaseForm/select?type=' + type)
        .catch((error) => {
            console.error(error)
        })
}

/**
 * @api {post} /rules/signal Write signal on the zookeeper node path
 *
 * @apiBody {Object[]} zookeeper signal path & signal value
 * @apiSuccess 200 OK
 */
async function signalZk(signals) {
    return await axios
        .post(BASE_URL + 'rules/signal', signals)
        .catch((error) => {
            console.error(error)
        })
}

/**
 * @api {post} /rules/zookeeper Release data to zookeeper
 *
 * @apiBody {Object} release option
 * @apiSuccess 200 OK
 */
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

/**
 * @api {get} /rules/next_id Request nextId which is needed to add new data
 *
 * @apiSuccess {Integer} next sequence id of data tale
 */
async function getNextId() {
    return await axios
        .get(BASE_URL + 'rules/next_id')
        .then((res)=> res.data)
        .catch((error) => {
            console.error(error)
        })
}

/**
 * @api {post} /header/init check header table and insert default data if the table is empty
 *
 * @apiSuccess 200 OK
 */
async function initHead() {
    return await axios
        .post(BASE_URL + 'header/init')
        .then((res)=> res.data)
        .catch((error) => {
            console.error(error)
        })
}

/**
 * @api {post} /releaseForm/init check releaseForm table and insert default data if the table is empty
 *
 * @apiSuccess 200 OK
 */
async function initRelForm() {
    return await axios
        .post(BASE_URL + 'releaseForm/init')
        .then((res)=> res.data)
        .catch((error) => {
            console.error(error)
        })
}

/**
 * @api {delete} /rules/delete/id
 *
 * @apiParam {Integer} deleted id
 * @apiSuccess 200 OK
 */
async function delNormal(type, id) {
    console.log(id)
    return await axios
        .delete(BASE_URL + type + '/delete/' + id)
        .catch((error) => {
            console.error(error)
        })
}

export const apiProvider = {
    delNormal,
    getHead,
    getReleaseForm,
    releaseZk,
    signalZk,
    getAll,
    getLiveRules,
    getLiveRulesFilter,
    restore,
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