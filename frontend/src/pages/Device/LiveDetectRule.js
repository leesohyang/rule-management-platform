import React, { useEffect} from "react";
import "react-sliding-pane/dist/react-sliding-pane.css";
import {apiProvider} from "../../services/Provider";
import {useDispatch, useSelector} from "react-redux";
import {
    revRe,
    openSelectPop,
    openSelectKeyFieldPop,
    openSelectConFieldPop,
    openSavePop,
    saveVersion
} from "../../services/Redux/actions";
import "react-table/react-table.css";
import SelectFieldPopup from "../../components/popup/SelectFieldPopup";
import GridTableLDR from "../../components/table/gridTableLDR";
import SavePopup from "../../components/popup/SavePopup";
import GridTableH from "../../components/table/gridTableH";

const LiveDetectRule = () => {
    const selectPop = useSelector(state => state.fetchAPI.openSelect)
    const savePop = useSelector(state => state.fetchAPI.openSave)
    const headers = useSelector(state => state.fetchAPI.header)
    const dispatch = useDispatch();


    useEffect(() => {
        apiProvider.getHead().then((ver) => {
            dispatch(saveVersion(ver))
            dispatch(apiProvider.getHeadVer(ver))

        })
        // handleData()
    }, [])

    const handleUpdate = (data) => {
        apiProvider.update("rules", data).then(() => dispatch(revRe(true)))
    }
    const addOrEdit = (data, ver) => {
        apiProvider.insertLiveDetect(data, ver)
    }

    const editOrDelete = (id) => {
        apiProvider.del("field", id).then(() => {
            dispatch(revRe(true))
        })

    }
    const handleHeadVer = (ver) => {
        dispatch(apiProvider.getHeadVer(ver))
    }
    const handleData = () => {
        apiProvider.getLiveRules(0, 5).then((res) => {

        })
    }

    const handleDataH = () => {
        dispatch(apiProvider.getAll("history/livedetectrule"))
    }

    const openConSelectPopup = () => {
        dispatch(openSelectConFieldPop(true))
    }
    const openKeySelectPopup = () => {
        dispatch(openSelectKeyFieldPop(true))
    }
    const openSelectPopup = () => {
        dispatch(openSelectPop(true))
    }
    const openSavePopup = () => {
        dispatch(openSavePop(true))
    }
    const insertHead = (header) => {
        apiProvider.insertHead(header).then(() => {
            dispatch(revRe(true))
        })
    }

    const activeHead = (version) => {
        apiProvider.activeHead(version).then(() => {
            dispatch(revRe(true))
        })
    }
    return headers.length > 0 && (
        <React.Fragment>

            <div className="component component-list">
                <div className="component__title"/>
                <div className="header-bar">
                    <span className="header__title"> Live Detect Rule </span>
                    <div className="binder"/>
                </div>

                <GridTableLDR
                    handleData={handleData}
                    addf={addOrEdit}
                    delete={editOrDelete}
                    insertHead={insertHead}
                    activeHead={activeHead}
                    handleHeadVer={handleHeadVer}
                    update={handleUpdate}
                    columns={
                        headers
                    }
                    openSelectPopup={openSelectPopup}
                    openKeySelectPopup={openKeySelectPopup}
                    openConSelectPopup={openConSelectPopup}
                    openSave={openSavePopup}
                />

                <GridTableH
                    name="livedetectrule"
                    handleData={handleDataH}
                />

                {selectPop && <SelectFieldPopup> </SelectFieldPopup>}
                {savePop && <SavePopup/>}

            </div>


        </React.Fragment>
    );
};


export default React.memo(LiveDetectRule);