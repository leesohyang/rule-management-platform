import React, {useEffect} from 'react'
import {convertHex2Str} from "../util/utils";
import {useDispatch, useSelector} from "react-redux"
import {
    addedField, addTmp,
    currType,
    hisFlag, keyFieldSelect,
    openPop, openSavePop, openSelectConFieldPop,
    openSelectKeyFieldPop,
    openSelectPop, saveVersion
} from "../../services/Redux/actions";
import {apiProvider} from "../../services/Provider";
import {Field, change} from "redux-form";
import Table from "react-table";

import "../table/style.scss"

export default function SavePopup(props) {

    const [version, setVersion] = React.useState("")
    const dispatch = useDispatch();

    const onClose = () => {
        dispatch(openSavePop(false))
    }
    const handleSave = () => {
        //version 저장
        dispatch(saveVersion(version))
        dispatch(openSavePop(false))
    }

    return (


        <div
            className="popup popup--dark"
            id="releaseOptionPopup"
            style={{ width: '600px'}}
        >
            <div className="popup__header">
                <h5>
                    Save
                </h5>
                <button
                    className="btn btn-close"
                    onClick={() => onClose()}
                />
            </div>
            <div
                className="popup__body release-option-popup"
            >
                <div className="release-option-wrap">
                    <div className="release-option-tab"></div>
                    <div>
                        <label> Fields Version Set </label>
                        <input
                            onChange = { (event) => setVersion(event.target.value)}
                        >
                        </input>
                    </div>
                </div>
                <hr />

            </div>
            <div className="popup__footer">
                <button
                    className="btn"
                    onClick={() => onClose()}
                >
                    cancel
                </button>
                <button className="btn btn--blue" onClick={()=>handleSave()}>
                    {/*<IntlMessages id="save" />*/}
                    save
                </button>
            </div>


        </div>

    )
}
