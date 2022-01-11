import React from 'react'
import { connect, useDispatch, useSelector} from "react-redux"
import { openSelectKeyFieldPop} from "../../services/Redux/actions";
import { Field, getFormValues} from "redux-form";

function SelectKeyFieldPopup() {
    const kfOb = useSelector(state => state.fetchAPI.keyField)
    const headers = useSelector(state => state.fetchAPI.header)

    const dispatch = useDispatch();

    const condList = ({id, active, ruletype, keyfield, confirms, ...other}) => {
        const li = Object.keys(other).filter(it => other[it] !== "")
        return !li.length ?
            headers.slice().map(({Header}) => Header).filter(it => ["id", "active", "ruletype", "keyfield", "confirms", "updatedat", "ver"].indexOf(it) === -1) : li
    }

    const handleSelect = () => {
        dispatch(openSelectKeyFieldPop(false))
    }

    const onClose = () => {
        dispatch(openSelectKeyFieldPop(false))
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
            <div
                className="popup__body release-option-popup"
            >
                <div className="release-option-wrap">
                    <div className="release-option-tab"></div>
                    <div>
                        <label>Select Field to Add : </label>
                        <Field name="keyfield" component="select">
                            <option/>
                            {/*<option>{kfOb.keyField}</option>*/}
                            {condList(kfOb).map(
                                (item, index) => (
                                    <option key={index} value={item}>{item}</option>
                                )
                            )}
                        </Field>
                    </div>
                </div>
                <hr/>

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
    )
}

export default connect(state => ({
    values: getFormValues("inline")(state)
}))(SelectKeyFieldPopup);