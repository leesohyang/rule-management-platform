import React from 'react'
import { convertHex2Str} from "../util/utils";
import { useDispatch} from "react-redux";
import { openPop} from "../../services/Redux/actions";
import { apiProvider} from "../../services/Provider";

export default function ReleasePopup(props) {

    const dispatch = useDispatch();

    const [state, setState] = React.useState({
        releasePath: "",
        nodeSize: "",
        makeSubNode: false,
        separator: "",
    })

    const [signals, setSignals] = React.useState([]);
    const [sigDef, setSigDef] = React.useState([]);

    React.useEffect(() => {
        apiProvider.getReleaseForm("Field").then((res) => {
                setState(res.data.value);
                setSigDef(res.data.signal);
            }
        )
    }, [])

    const onChange = (key, value) => {
        setState({
            ...state,
            [key]: value,
        });
    }

    const onClose = () => {
        dispatch(openPop(false))
    }

    const handleRelease = () => {

        props.handleSave()
        apiProvider.releaseZk(state).then(() => apiProvider.signalZk(signals))

        dispatch(openPop(false))
    }

    return (
        <div
            className="popup popup--dark"
            id="releaseOptionPopup"
            style={{width: '600px'}}
        >
            <div className="popup__header">
                <h5>
                    release option
                </h5>
                <button
                    className="btn btn-close"
                    onClick={() => onClose()}
                />
            </div>
            <div className="popup__body release-option-popup" >
                <div className="release-option-wrap">
                    <div className="release-option-tab"/>
                    <div>
                        <label>Release Path : </label>
                        <input
                            type="text"
                            value={state.releasePath}
                            className="form-control"
                            style={{width: "455px"}}
                            onChange={e => {
                                const {value} = e.target;
                                onChange("releasePath", value);
                            }}
                        />
                    </div>
                    <div>
                        <label>Node Size : </label>
                        <input
                            type="text"
                            value={state.nodeSize}
                            className="form-control"
                            style={{width: "155px"}}
                            onChange={e => {
                                const {value} = e.target;
                                onChange("nodeSize", value);
                            }}
                        />
                    </div>
                    <div>
                        <label>Make Sub Node : </label>
                        <input
                            type="text"
                            value={state.makeSubNode}
                            className="form-control"
                            style={{width: "155px"}}
                            onChange={e => {
                                const {value} = e.target;
                                onChange("makeSubNode", value);
                            }}
                        />
                    </div>

                    <div>
                        <label>Separator : </label>
                        <input
                            type="text"
                            value={state.separator}
                            className="form-control"
                            style={{width: "140px"}}
                            onChange={e => {
                                const {value} = e.target;
                                onChange("separator", value);
                            }}
                        />
                        <label style={{marginLeft: "15px"}}>Convert : </label>
                        <strong>{"\"" + convertHex2Str(state.separator) + "\""}</strong>
                    </div>
                </div>
                <hr/>
                <div className="signal-option-wrapper">
                    <strong>Signal Option</strong>
                    <button
                        className="btn btn--blue"
                        style={{marginLeft: "430px"}}
                        onClick={() => {
                            if (signals.length > 0 && (!signals.slice(-1)[0].signal && !signals.slice(-1)[0].path)) {
                                return;
                            }
                            setSignals([...signals, sigDef]);
                        }}
                    >ADD
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
                                <th>Signal</th>
                                <th>Path</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {signals &&
                                signals.map((item, idx) => (
                                    <tr key={"signal-option-popup-" + idx}>
                                        <td>
                                            <input
                                                type="text"
                                                value={item.signal}
                                                className="form-control"
                                                onChange={e => {
                                                    const {value} = e.target;
                                                    setSignals([
                                                        ...signals.slice(0, idx),
                                                        {
                                                            ...item,
                                                            signal: value,
                                                        },
                                                        ...signals.slice(idx + 1),
                                                    ]);
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={item.path}
                                                className="form-control"
                                                onChange={e => {
                                                    const {value} = e.target;
                                                    setSignals([
                                                        ...signals.slice(0, idx),
                                                        {
                                                            ...item,
                                                            path: value,
                                                        },
                                                        ...signals.slice(idx + 1),
                                                    ]);
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <button
                                                className="btn"
                                                onClick={() => {
                                                    setSignals([
                                                        ...signals.slice(0, idx),
                                                        ...signals.slice(idx + 1),
                                                    ]);
                                                }}
                                            >X
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>


            </div>
            <div className="popup__footer">
                <button
                    className="btn"
                    onClick={() => onClose()}
                >
                    cancel
                </button>
                <button className="btn btn--blue" onClick={() => handleRelease()}>
                    save
                </button>
            </div>
        </div>
    )
}
