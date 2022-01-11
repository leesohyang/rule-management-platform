import React from 'react'
import { useDispatch} from "react-redux"
import { openSavePop, saveVersion } from "../../services/Redux/actions";
import "../table/style.scss"

export default function SavePopup() {

    const [version, setVersion] = React.useState("")
    const dispatch = useDispatch();

    const onClose = () => {
        dispatch(openSavePop(false))
    }
    const handleSave = () => {
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
                    <div className="release-option-tab"/>
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
                    save
                </button>
            </div>


        </div>

    )
}
