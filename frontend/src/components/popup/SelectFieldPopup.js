import React from 'react'
import { useDispatch} from "react-redux";
import { addedField, openSelectPop} from "../../services/Redux/actions";

export default function SelectFieldPopup() {
    const colList = ["test1", "test2", "test3", "test4"]; //field list api
    const [addField, setAddField] = React.useState();

    const dispatch = useDispatch();

    //TODO::list는 kfob에서 가져오고, save하면 어캐 저장하지

    const handleSelect = () => {
        dispatch(addedField(addField))
        dispatch(openSelectPop(false))
    }

    const onClose = () => {
        dispatch(openSelectPop(false))
    }

    return (

        <div
            className="popup popup--dark"
            id="releaseOptionPopup"
            style={{ width: '600px'}}
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
                    <div className="release-option-tab"/>
                    <div>
                        <label>Select Field to Add : </label>
                        <select
                            onChange = { (event) => setAddField(event.target.value)}
                        >
                            <option/>
                            {colList.map(item=>(
                                <option value={item}> {item} </option>
                            ))}
                        </select>
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
                <button className="btn btn--blue" onClick={()=>handleSelect()}>
                    save
                </button>
            </div>


        </div>
    )
}
