import React, {useEffect} from 'react'
import {convertHex2Str} from "../util/utils";
import {connect, useDispatch, useSelector} from "react-redux"
import {
    addedField, addTmp,
    currType,
    hisFlag, keyFieldSelect,
    openPop,
    openSelectKeyFieldPop,
    openSelectPop
} from "../../services/Redux/actions";
import {apiProvider} from "../../services/Provider";
import {change, Field, getFormValues, FormName} from "redux-form";
import formValueSelector from "redux-form/lib/formValueSelector";

function SelectKeyFieldPopup({values}) {


    const kfOb = useSelector(state => state.fetchAPI.keyField)
    console.log(kfOb)
    const data = useSelector(state => state.fetchAPI.data)
    const headers = useSelector(state => state.fetchAPI.header)
    const [selectKey, setSelectKey] = React.useState("")

    const dispatch = useDispatch();

    //이거랑 ldr history table 복원할때 없어도 되는 필드가 안줄어들었던 것 같은데 확인해봐.
    //지금 헤더 세팅되는거랑 테이블 저장되는거랑 달라서 그럼. <- 동기 맞출 것.
    //TODO:: 전체가 없는 경우 new add 하는 경우 추가해야함 맞네  + 헤더가 값이 있는게 아무것도 없으면 알아서 없애야하나? + 값이 없던/아예 없던 새 필드에 값을 넣고 동시에 keyField 를 추가하려고 하면? 어떻게 되어야하지?
    //멀 어캐 내 실제 condition field랑 new added field 합쳐서 keyfield select으로 줘야지 + version 빼고
    //values 가져와서 쓰는것도 괜찮은 방법일듯. inline form 가져와서 밸류값 있으면 집어넣는거지. //-> redux form api
    //TODO:: add 용, edit 용 따로 헤애힐 갓 같지? -> 나중에는 keyfield 에 있는 값 field 의 value 를 대상으로 validation 해야할 add 할 때는 그냥 값 먼저 넣으라고 해야지..
    const condList = ({id, active, ruletype, keyfield, confirms, ...other}) => {

        console.log(values) //여기서 값 있는거 하면 되겠다.

        const li = Object.keys(other).filter(it => other[it] !== "") //이거 원본배열 바뀐다아
        return !li.length ?
            headers.slice().map(({Header}) => Header).filter(it => ["id", "active", "ruletype", "keyfield", "confirms"].indexOf(it) === -1) : li
    }

    //for confirms_popup
    const handleSelect = () => {
        // kfOb.keyField=selectKey //keyField 가 셀렉되면,,
        // dispatch(keyFieldSelect(kfOb)) //이럴 필요가 있나? 응 이썽
        //
        // console.log(kfOb)
        // const nVal = data.slice().filter( ({id}) => id !== kfOb.id)
        // dispatch(addTmp([kfOb, ...nVal]))
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