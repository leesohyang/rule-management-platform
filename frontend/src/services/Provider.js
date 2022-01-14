import axios from 'axios';
import {getAllH, getAllHL, getAllHN, getAllR, selectHead} from "./Redux/actions";

const BASE_URL = 'http://10.250.238.169:8096/api/v1/'

/**
 * @api {get} {ruleType}/selectall Request history data
 *
 * @apiVersion  0.1.0
 * @apiName getAll
 * @apiGroup History
 *
 * @apiParam ruleType   history type of rule
 *
 * @apiSuccess {Object[]} history list of history data
 * @apiSuccessExample Success Response:
 *      HTTP/1.1 200 OK
 *      - Body: JSON Array
 *      [
 *          {
 *              "id": 67,
 *              "user": "admin",
 *              "desc": "test",
 *              "released": false,
 *              "value": [
 *                  {
 *                      "id": 8,
 *                      "active": "test",
 *                      "ruletype": "live",
 *                      "keyfield": "test",
 *                      "confirms": "N:test",
 *                  },
 *                  ...
 *              ]
 *          },
 *          ...
 *      ]
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
 * @api {post} /header/insert Insert new version Header
 *
 * @apiVersion  0.1.0
 * @apiName insertHead
 * @apiGroup Header
 *
 * @apiBody {String} ver Header version
 * @apiBody {String} type Rule type
 * @apiBody {Array} header Rule table headers
 *
 * @apiExample Request Example:
 *      * Request
 *      - Body: JSON
 *      {
 *          "ver": "4.0",
 *          "type": "live",
 *          "header": [
 *              "id", "active", "ruletype", "keyfield", "confirms", "test"
 *          ]
 *      }
 *
 * @apiSuccess 200 OK
 *
 */
async function insertHead(ob) {
    return await axios
        .post(BASE_URL + 'header/insert', ob)
}

/**
 * @api {get} /header/deActive Deactivate all of those headers before insert new live header
 *
 * @apiVersion  0.1.0
 * @apiName deActiveHead
 * @apiGroup Header
 *
 * @apiSuccess HTTP/1.1 200 OK
 *
 */
async function deActiveHead() {
    return await axios
        .get(BASE_URL + 'header/deActive')
        .catch(error => {
            throw(error);
        })
}

/**
 * @api {post} /header/active Activate restored header version
 *
 * @apiVersion  0.1.0
 * @apiName activeHead
 * @apiGroup Header
 *
 * @apiBody {String} restored header version
 *
 * @apiSuccess 200 OK
 */
async function activeHead(version) {
    return await axios
        .post(BASE_URL + 'header/active', version)
}

/**
 * @api {get} /header/selectHeaderVersion?ver={ver} Get request header by version
 *
 * @apiVersion  0.1.0
 * @apiName getHeadVer
 * @apiGroup Header
 *
 * @apiParam {String} ver restored header version
 *
 * @apiSuccess {String} ver Header version
 * @apiSuccess {String} type Rule type
 * @apiSuccess {Array} header Header fields
 *
 * @apiSuccessExample Success Response:
 *      HTTP/1.1 200 OK
 *      - Body: JSON
 *      {
 *          "ver": "4.0",
 *          "type": "live",
 *          "header": [
 *              "id", "active", "ruletype", "keyfield", "confirms", "test"
 *          ]
 *      }
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
 * @api {get} /header/selectheader Get active header
 *
 * @apiVersion  0.1.0
 * @apiName getHead
 * @apiGroup Header
 *
 * @apiSuccess {String} ver Header version
 * @apiSuccess {String} type Rule type
 * @apiSuccess {Array} header Header fields
 *
 * @apiSuccessExample Success Response:
 *      HTTP/1.1 200 OK
 *      - Body: JSON
 *      {
 *          "ver": "4.0",
 *          "type": "live",
 *          "header": [
 *              "id", "active", "ruletype", "keyfield", "confirms", "test"
 *          ]
 *      }
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
 * @api {post} /header/init check header table and insert default data if the table is empty
 *
 * @apiVersion  0.1.0
 * @apiName initHead
 * @apiGroup Header
 *
 * @apiSuccess 200 OK
 */
async function initHead() {
    return await axios
        .post(BASE_URL + 'header/init')
        .then((res)=> res.data )
        .catch((error) => {
            console.error(error)
        })
}

/**
 * @api {get} {ruleType}/getrowcount Request number of total rows for pagination
 *
 * @apiVersion  0.1.0
 * @apiName GetRowCounts
 * @apiGroup    Rules
 *
 * @apiParam {String} ruleType Type of rule.
 *
 * @apiSuccess {Number} rowCount Number of total rows according to ruleType.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          4
 *      }
 *
 */
async function getRowCounts(ruleType) {
    return await axios
        .get(BASE_URL + ruleType + '/getrowcount')
        .then((res) => res.data )
}

/**
 * @api {post} {ruleType}/getFiltersCount Request number of total filtered rows for pagination
 *
 * @apiVersion  0.1.0
 * @apiName getFiltersCounts
 * @apiGroup Rules
 *
 * @apiBody {Number} offset     select offset for pagination
 * @apiBody {Number} limit      select limit for pagination
 * @apiBody {String} filters.active     active field filter string
 * @apiBody {String} filters.ruletype   ruletype field filter string
 * @apiBody {String} filters.keyfield   keyfield field filter string
 * @apiBody {String} filters.confirms   confirms field filter string
 *
 * @apiExample Request Example:
 *      * Request
 *      - Body: json
 *      {
 *          "offset": 0,
 *          "limit": 5,
 *          "filters": {
 *              "active": "filter string",
 *              "ruletype": "filter string",
 *              "keyfield": "filter string",
 *              "confirms": "filter string"
 *          }
 *      }
 *
 * @apiSuccess {Number} rowCount Number of total filtered rows
 *
 * @apiSuccessExample Response Example:
 *     HTTP/1.1 200 OK
 *     - Body: Number
 *     {
 *         4
 *     }
 */
async function getFiltersCounts(type, obj) {
    return await axios
        .post(BASE_URL + type + '/getFiltersCount', obj)
        .then((res) => res.data)
}

/**
 * @api {post} /rules/selectAllFilters Request filtered data
 *
 * @apiVersion  0.1.0
 * @apiName getliveRulesFilter
 * @apiGroup Rules
 *
 * @apiBody {Number} offset     select offset for pagination
 * @apiBody {Number} limit      select limit for pagination
 * @apiBody {String} filters.active     active field filter string
 * @apiBody {String} filters.ruletype   ruletype field filter string
 * @apiBody {String} filters.keyfield   keyfield field filter string
 * @apiBody {String} filters.confirms   confirms field filter string
 *
 * @apiExample Request Example:
 *      * Request
 *      - Body: json
 *      {
 *          "offset": 0,
 *          "limit": 5,
 *          "filters": {
 *              "active": "filter string",
 *              "ruletype": "filter string",
 *              "keyfield": "filter string",
 *              "confirms": "filter string"
 *          }
 *      }
 *
 * @apiSuccess {Number} id          LiveDetectRule id
 * @apiSuccess {String} active      LiveDetectRule is activated
 * @apiSuccess {String} ruletype    LiveDetectRule type
 * @apiSuccess {String} keyfield    LiveDetectRule key field that select conditions
 * @apiSuccess {Array}  conditions  Additional column at LiveDetectRule
 * @apiSuccess {String} confirms    Additional column type def.
 * @apiSuccess {String} ver         LiveDetectRule version
 * @apiSuccess {String} updatedat   Update time
 *
 * @apiSuccessExample Response Example:
 *      HTTP/1.1 200 OK
 *      - Body: JSON Array
 *      [
 *          {
 *              "id": 5,
 *              "active": "true",
 *              "ruletype": "live",
 *              "keyfield": "test",
 *              "confirms": "test",
 *              "conditions": [
 *                  {
 *                      "field": "test",
 *                      "value": "1234"
 *                  },
 *                  ...
 *              ],
 *              "ver": "1.0",
 *              "updatedat": "2022-01-13 14:27:31"
 *          },
 *          ...
 *      ]
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
 * @api {get} /rules/selectall?offset={offset}&limit={limit} Request grid data
 *
 * @apiVersion  0.1.0
 * @apiName getliveRules
 * @apiGroup Rules
 *
 * @apiParam {Integer} offset   LiveDetectRule offest for pagination
 * @apiParam {Integer} limit    LiveDetectRule limit for pagination
 *
 * @apiSuccess {Number} id          LiveDetectRule id
 * @apiSuccess {String} active      LiveDetectRule is activated
 * @apiSuccess {String} ruletype    LiveDetectRule type
 * @apiSuccess {String} keyfield    LiveDetectRule key field that select conditions
 * @apiSuccess {Array}  conditions  Additional column at LiveDetectRule
 * @apiSuccess {String} confirms    Additional column type def.
 * @apiSuccess {String} ver         LiveDetectRule version
 * @apiSuccess {String} updatedat   Update time
 *
 * @apiSuccessExample Response Example:
 *      HTTP/1.1 200 OK
 *      - Body: JSON Array
 *      [
 *          {
 *              "id": 5,
 *              "active": "true",
 *              "ruletype": "live",
 *              "keyfield": "test",
 *              "confirms": "test",
 *              "conditions": [
 *                  {
 *                      "field": "test",
 *                      "value": "1234"
 *                  },
 *                  ...
 *              ],
 *              "ver": "1.0",
 *              "updatedat": "2022-01-13 14:27:31"
 *          },
 *          ...
 *      ]
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
 * @api {post} /rules/upsertAndHistory2?released={released} Upsert data table and insert all to history table
 *
 * @apiVersion  0.1.0
 * @apiName upsertAndHistory
 * @apiGroup Rules
 *
 * @apiParam {Boolean} released Is rule released
 *
 * @apiBody {Number} id          LiveDetectRule id
 * @apiBody {String} active      LiveDetectRule is activated
 * @apiBody {String} ruletype    LiveDetectRule type
 * @apiBody {String} keyfield    LiveDetectRule key field that select conditions
 * @apiBody {Array}  conditions  Additional column at LiveDetectRule
 * @apiBody {String} confirms    Additional column type def.
 * @apiBody {String} ver         LiveDetectRule version
 * @apiBody {String} updatedat   Update time
 *
 * @apiExample Request Example:
 *      * Request
 *      - Body: JSON Array
 *      [
 *          {
 *              "id": 8,
 *              "active": "true",
 *              "ruletype": "live",
 *              "keyfield": "test",
 *              "confirms": "test",
 *              "conditions": [
 *                  {
 *                      "field": "test",
 *                      "value": "1234"
 *                  },
 *                  ...
 *              ],
 *              "ver": "1.0"
 *          },
 *          ...
 *      ]
 *
 * @apiSuccess 200 OK
 */
async function upsertAndHistory(release, rules){
    return await axios
        .post(BASE_URL + 'rules/upsertAndHistory2?released=' + release, rules)
        .catch((error)=>{
            console.error(error)
        }) }

/**
 * @api {post} /rules/restore?relesed={released} Truncate data table & insert all (rollback) and insert to history
 *
 * @apiVersion  0.1.0
 * @apiName restore
 * @apiGroup Rules
 *
 * @apiParam {Boolean} released Release flag
 *
 * @apiBody {Number} id          LiveDetectRule id
 * @apiBody {String} active      LiveDetectRule is activated
 * @apiBody {String} ruletype    LiveDetectRule type
 * @apiBody {String} keyfield    LiveDetectRule key field that select conditions
 * @apiBody {Array}  conditions  Additional column at LiveDetectRule
 * @apiBody {String} confirms    Additional column type def.
 * @apiBody {String} ver         LiveDetectRule version
 * @apiBody {String} updatedat   Update time
 *
 * @apiExample Request Example:
 *      * Request
 *      - Body: JSON Array
 *      [
 *          {
 *              "id": 8,
 *              "active": "true",
 *              "ruletype": "live",
 *              "keyfield": "test",
 *              "confirms": "test",
 *              "conditions": [
 *                  {
 *                      "field": "test",
 *                      "value": "1234"
 *                  },
 *                  ...
 *              ],
 *              "ver": "1.0"
 *          },
 *          ...
 *      ]
 *
 *
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
 * @api {post} /rules/signal Write signal on the zookeeper node path
 *
 * @apiVersion  0.1.0
 * @apiName signalZk
 * @apiGroup Rules
 *
 * @apiBody {String} path   Zookeeper signal path
 * @apiBody {String} signal Zookeeper signal
 * @apiExample Request Example:
 *      * Request
 *      - Body: JSON
 *      {
 *          "path": "/signal",
 *          "signal": "test"
 *      }
 *
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
 * @apiVersion  0.1.0
 * @apiName releaseZk
 * @apiGroup Rules
 *
 * @apiBody {String} releasePath   Release path in Zookeeper
 * @apiBody {String} nodeSize      Release node size in Zookeeper
 * @apiBody {String} makeSubNode   Is Zookeeper make child node
 * @apiBody {String} separator     Field separator
 *
 * @apiExample Request Example:
 *      * Request
 *      - Body: JSON
 *      {
 *          "releasePath": "/tmp",
 *          "nodeSize": "30",
 *          "makeSubNode": "true",
 *          "separator": "@"
 *      }
 *
 * @apiSuccess 200 OK
 */
async function releaseZk(options) {
    return await axios
        .post(BASE_URL + 'rules/zookeeper', options)
        .catch((error) => {
            console.error(error)
        })
}

/**
 * @api {get} /rules/next_id Request nextId which is needed to add new data
 *
 * @apiVersion  0.1.0
 * @apiName getNextId
 * @apiGroup Rules
 *
 * @apiSuccess {Integer} id Next sequence id of data tale
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
 * @api {delete} /rules/delete/id Delete Rule by id
 *
 * @apiVersion  0.1.0
 * @apiName delNormal
 * @apiGroup Rules
 *
 * @apiParam {String} ruleType Rule Type
 * @apiParam {Integer} id Deleted rule id
 *
 * @apiSuccess 200 OK
 */
async function delNormal(type, id) {
    return await axios
        .delete(BASE_URL + type + '/delete/' + id)
        .catch((error) => {
            console.error(error)
        })
}

/**
 * @api {post} /releaseForm/init check releaseForm table and insert default data if the table is empty
 *
 * @apiVersion  0.1.0
 * @apiName initRelForm
 * @apiGroup ReleaseForm
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
 * @api {get} /releaseForm/select?type={ruleType} Request releaseForm
 *
 * @apiVersion  0.1.0
 * @apiName getReleaseForm
 * @apiGroup ReleaseForm
 *
 * @apiParam {String} ruleType Release rule type
 *
 * @apiSuccess {Object} release Form and default value
 * @apiSuccess {Number} id                  Release form id
 * @apiSuccess {String} type                Release rule type
 * @apiSuccess {String} value.releasePath   Release path in Zookeeper
 * @apiSuccess {String} value.nodeSize      Release node size in Zookeeper
 * @apiSuccess {String} value.makeSubNode   Is Zookeeper make child node
 * @apiSuccess {String} value.separator     Field separator
 * @apiSuccess {String} signal.path         Zookeeper signal path
 * @apiSuccess {String} signal.signal       Zookeeper release signal
 *
 * @apiSuccessExample Response Example:
 *      HTTP/1.1 200 OK
 *      - Body: JSON
 *      {
 *          "id": 6,
 *          "type": "live",
 *          "value": {
 *              "releasePath": "/tmp",
 *              "nodeSize": "30",
 *              "makeSubNode": "true",
 *              "separator": "@"
 *          },
 *          "signal": {
 *              "path": "/signal",
 *              "signal": "test"
 *          }
 *      }
 */
async function getReleaseForm(type) {
    return await axios
        .get(BASE_URL + 'releaseForm/select?type=' + type)
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