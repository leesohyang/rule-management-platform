import React from 'react'
import { useDispatch, useSelector} from "react-redux"
import { openSelectConFieldPop} from "../../services/Redux/actions";
import { change} from "redux-form";
import Table from "react-table";

import "../table/style.scss"

export default function SelectConfirmsPopup() {

    //TODO:: submit 누르면 dispatch(change)) 하기.
    const kfOb = useSelector(state => state.fetchAPI.keyField)
    const headers = useSelector(state => state.fetchAPI.header)
    // const [selectKey, setSelectKey] = React.useState("")

    const [selField, setSelField] = React.useState("")
    const [selConType, setSelConType] = React.useState("")
    const [data, setData] = React.useState([])

    const conType = ["String", "Numeric", "IP"]
    const columns = [
        {Header: "Field", accessor: "field"},
        {Header: "Condition Type", accessor: "conType"}
    ];

    const condList = ({id, active, ruletype, keyfield, confirms, ...other}) => {
        const li = Object.keys(other).filter(it => other[it] !== "")
        return !li.length ?
            headers.slice().map(({Header}) => Header).filter(it => ["id", "active", "ruletype", "keyfield", "confirms", "updatedat", "ver"].indexOf(it) === -1) : li
    }

    const dispatch = useDispatch();

    const handleSelect = () => {
        let res = []
        data.forEach((it)=>{
            res = [...res, it.conType !== "String" ? (it.conType.charAt(0) + ":" + it.field) : it.field]
        })
        dispatch(change("inline", "confirms", res.join(',')))
        dispatch(openSelectConFieldPop(false))
    }

    const onClose = () => {
        dispatch(openSelectConFieldPop(false))
    }

    const handleAdd = () => {
        setData([...data, {field:selField, conType:selConType}])
    }

    return (

        <div
            className="popup popup--dark"
            id="releaseOptionPopup"
            style={{width: '600px'}}
        >
            <div className="popup__header">
                <h5>
                    select Field
                </h5>
                <button
                    className="btn btn-close"
                    onClick={() => onClose()}
                />
            </div>
            <div className="popup__body">

                <button type="button" className="btn" onClick={(e) => (selField && selConType) && handleAdd()}>
                    Add
                </button>


                <div
                    className="table-wrapper"
                >
                    <table className="signal-option-table">
                        <colgroup>
                            <col style={{width: "240px"}}/>
                            <col/>
                            <col style={{width: "30px"}}/>
                        </colgroup>
                        <thead>
                        <tr>
                            <th>Select Field</th>
                            <th>Select Condition Type</th>
                            <th/>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>
                                <select
                                    className="form-control"
                                    onChange={(e) => {
                                        setSelField(e.target.value);
                                    }}
                                >
                                    <option/>
                                    {condList(kfOb).map(
                                        (item, index) => (
                                            <option key={index} value={item}>{item}</option>
                                        )
                                    )}
                                </select>
                            </td>
                            <td>
                                <select
                                    className="form-control"
                                    onChange={(e) => {
                                        setSelConType(e.target.value);
                                    }}
                                >
                                    <option/>
                                    {conType.map(
                                        (item, index)=>(
                                            <option key={index} value={item}>{item}</option>
                                        )
                                    )}
                                </select>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div className="table-wrapper">
                    <Table
                        columns={columns}
                        data={data}
                        defaultPageSize={5}
                    >
                    </Table>
                </div>

                <div className="popup__footer">
                    <button
                        className="btn"
                        onClick={() => onClose()}
                    >
                        cancel
                    </button>
                    <button className="btn btn--blue" onClick={() => handleSelect()}>
                        select
                    </button>
                </div>

            </div>
        </div>
    )
}
