import React from "react";
import {Field} from "redux-form";
import Table from "react-table"
import FormProvider from "./FormProvider";
import ActionsCell from "./ActionsCell";
import HighlightCell from "./HighlightCell";
import GridFilters from "./GridFilters";
import {connect} from "react-redux"
import {
    addedField, addSave,
    currEd, dataSave,
    deleteTmp, delSave, editSave, editZero,
    getAllR,
    hisFlag,
    keyFieldSelect,
    restoreHead, restoreVersion, saveVersion, selectHead, startHis
} from "../../services/Redux/actions";
import {bindActionCreators} from 'redux';
import {addTmp, revRe, openPop} from "../../services/Redux/actions";
import {apiProvider} from "../../services/Provider";
import "./style.scss"
import SelectKeyFieldPopup from "../popup/SelectKeyFieldPopup";
import SelectConfirmsPopup from "../popup/SelectConfirmsPopup";
import ReleasePopup from "../popup/ReleasePopup";

class GridTableLDR extends React.Component {
    state = {
        editing: null,
        selected: {},
        selectAll: 0,
        adding: false,
        columns: [],
        selectEdit: false,
        willRemoved: [],
        temps: false,
        pages: null,
        pagesH: null,
        loading: true,
        sorted: [],
        totalRows: 0,
        tableProps: {}
    };

    selectList = {
        typeList: ["String", "Numeric", "IP"],
        groupList: ["Required", "Additional"]
    }

    getSelect = (type, curr) => {
        const v = this.selectList[type].filter(i => i !== curr)
        return v
    }

    resetColumn = () => {
        this.setState((state) => {
            return {
                ...state, columns:
                    [{
                        columns: [
                            {
                                id: "checkbox",
                                accessor: "",
                                Cell: ({original}) => {
                                    return (
                                        <input
                                            type="checkbox"
                                            className="checkbox"
                                            checked={this.state.selected[original.id] === true}
                                            onChange={() => this.toggleRow(original.id)}
                                            disabled={this.props.delId.indexOf(original.id) !== -1} //있으면
                                        />
                                    );
                                },
                                Header: x => {
                                    return (
                                        <input
                                            type="checkbox"
                                            className="checkbox"
                                            checked={this.state.selectAll === 1}
                                            ref={input => {
                                                if (input) {
                                                    input.indeterminate = this.state.selectAll === 2;
                                                }
                                            }}
                                            onChange={() => this.toggleSelectAll()}
                                        />
                                    );
                                },
                                sortable: false,
                                width: 45
                            },
                        ]
                    }].concat(
                        this.props.columns.slice().map((item) => {
                            return {...item, ...this.editableColumnProps}
                        })
                    )
                        .concat(
                            {
                                Header: "",
                                maxWidth: 90,
                                filterable: false,
                                getProps: this.getActionProps,
                                Cell: ActionsCell
                            }
                        )
            }
        })
    }

    componentDidMount() {
//for testo
        apiProvider.getRowCounts("rules").then((res) => {
            this.setState({totalRows: res});
        })
        this.resetColumn()
        this.props.handleData()
    }

    componentDidUpdate = (prevProps) => {

        const restore = (prevProps.edited !== this.props.edited)
        const ver = (prevProps.version !== this.props.version)
        const resHead = (prevProps.headRestore !== this.props.headRestore)
        const cond = (prevProps.refre !== this.props.refre)
        const nField = (prevProps.newField !== this.props.newField)
        const col = (prevProps.header !== this.props.header)

        if (cond && this.props.refre && this.props.edited == 0) {
            this.setState({editing: null})
            this.adjustColumn(true)
        }
        if (this.props.edited !== 0 && restore) {
            this.adjustColumn(false)
        }
        if (col) {
            this.resetColumn()
        }
        if (cond) {
            this.props.handleHeadVer(this.props.version)
            this.resetColumn()
        }
        if (resHead && this.props.headRestore) {
            this.props.restoreVer(this.props.data[0].ver)
            this.props.handleHeadVer(this.props.data[0].ver)
            this.props.resHead(false)
        }
        if (nField) {
            const nCol = this.state.columns
            nCol.splice(-1, 0, {
                Header: this.props.newField,
                accessor: this.props.newField, ...this.editableColumnProps
            })
            this.setState((state) => {
                return {
                    ...state, columns: nCol
                }
            })
        }
        if (ver) {
            this.handleSaveNewVer()
        }
    }


    selectableComponent = ({input, editing, value, ...rest}) => {

        const result = Object.keys(rest).reduce((prev, current) =>
            ({...prev, [current.toLowerCase()]: rest[current]}), {})
        // result.show = "true";
        result.show = value ? "false" : "true"
        const Component = editing ? 'select' : 'p';
        const children = //여기 value 에 직접 넣을 수 있으면 좋을텐데.
            (!editing && <HighlightCell value={value} {...rest} />) || <React.Fragment>
                <option>{value}</option>
                {this.getSelect("typeList", value).map(
                    (item, index) => (
                        <option key={index} value={item}>{item}</option>
                    )
                )}
            </React.Fragment>;
        return <Component {...input} {...result} children={children}/>;
    };


    editableComponent = ({input, editing, value, ...rest}) => {

        const result = Object.keys(rest).reduce((prev, current) =>
            ({...prev, [current.toLowerCase()]: rest[current]}), {})
        // result.show = "true";
        result.show = value ? "false" : "true"
        const Component = editing ? 'input' : 'p';
        const children =
            (!editing && <HighlightCell value={value} {...rest} />) || undefined;
        return <Component {...input} {...result} children={children}/>;
    };

    isSelectField = (col) => ["type", "group"].indexOf(col) !== -1

    editableColumnProps = {
        ...GridFilters,
        Cell: (props) => {
            const editing = this.state.editing === props.original;
            const fieldProps = {
                component: this.isSelectField(props.column.id) ? this.selectableComponent : this.editableComponent,
                editing,
                props
            };
            return <Field name={props.column.id} {...fieldProps} />;

        }
    };

    handleCellClick = (data) => {
        // this.props.handleRow(data)
    }

    getActionProps = (gridState, rowProps) =>
        (rowProps && {
            mode: this.state.editing === rowProps.original ? (this.state.adding ? "add" : "edit") : "view",

            actions: {
                onEdit: () => {
                    !this.state.adding && this.setState({editing: rowProps.original, adding: false})
                },
                onCancel: () => {
                    this.setState({editing: null, adding: false});
                    this.state.adding && this.props.delTmp(this.props.data.length)
                }
            }
        }) ||
        {};

    toggleRow(id) {
        const newSelected = Object.assign({}, this.state.selected);
        newSelected[id] = !this.state.selected[id];
        this.setState({
            selected: newSelected,
            selectAll: 2
        });
    }

    toggleSelectAll() {
        let newSelected = {};
        if (this.state.selectAll === 0) {
            this.props.data.forEach(x => {
                newSelected[x.id] = true;
            });
        }

        this.setState({
            selected: newSelected,
            selectAll: this.state.selectAll === 0 ? 1 : 0
        });
    }

    handleSubmit = (values) => {
        this.props.editSave([values.id, ...this.props.editId])

        this.setState((state) => {
            this.props.addTmp(this.props.data.map((item) => {
                return item.id === values.id ? values : item
            }))

            return state.adding ? {...state, adding: false} : {...state}

        });
    };

    adjustColumn = (flag) => {
        const last = this.state.columns[this.state.columns.length - 1]
        const tmp = this.state.columns.slice().splice(0, this.state.columns.length - 1)
        last.show = flag
        this.setState({
            columns: [
                ...tmp,
                last
            ]
        })
    }
    handleConFieldSelect = (ob) => {
        this.props.setKfOb(ob)
        this.props.openConSelectPopup()
    }
    handleKeyFieldSelect = (ob) => {
        this.props.setKfOb(ob)
        this.props.openKeySelectPopup()
    }

    handleFieldAdd = () => {
        this.props.openSelectPopup()
    }

    handleGridData = async (version) => {
        console.log(this.props.openReleasePop)
        const tmp = this.props.data
            .map((item) => {
                const con = []
                const res = (({id, active, ruletype, keyfield, confirms, ver, updatedat, ...other}) => {
                    Object.keys(other)
                        .filter(it => other[it] !== "")
                        .forEach(it => {
                            con.push({field: it, value: other[it]})
                        })
                    return ({id, active, ruletype, keyfield, confirms, ver: version})
                })(item)
                res['conditions'] = con
                return res
            })

        if (this.props.edited != 0) {
            apiProvider.restore(tmp, "false").then(() => {
                this.props.revRe(true);
                this.props.editZero();
            })
            this.adjustColumn(true)
        } else {
            console.log(this.state.willRemoved)
            this.state.willRemoved.length && this.state.willRemoved.forEach((id) => {
                apiProvider.delNormal("rules", parseInt(id)).then(() => this.setState({willRemoved: []}))
            })
            apiProvider.upsertAndHistory(this.props.openReleasePop, tmp).then(() => {
                this.props.revRe(true);
                this.props.editSave([]);
                this.props.delSave([]);
            })
        }
    }

    handleSaveNewVer = () => {
        const temp = this.state.columns.slice()
        temp.splice(0, 1)
        temp.splice(-1, 1)
        const header = {
            ver: this.props.version,
            type: "live",
            header: temp.map(({Header}) => Header)
        }
        apiProvider.deActiveHead().then(
            () => apiProvider.insertHead(header).then(() => this.handleGridData(this.props.version))
        )
    }

    handleSaveSameVer = (version) => {
        apiProvider.deActiveHead().then(
            apiProvider.activeHead(version).then(
                () => this.handleGridData(version)
            ))
        // this.handleGridData()
    }
    handleSave = () => {
        //밑에 조건 둘 중 무조건 하나만 실행됨. 그래야함..
        if (this.props.columns.length != this.state.columns.length - 2) this.props.openSave()
        else if (this.props.versionTmp !== "") this.handleSaveSameVer(this.props.versionTmp)
        else this.handleGridData(this.props.version)

    }

    handleDelete = () => {
        Object.keys(this.state.selected).forEach((i) => {
            this.props.delTmp(i);
            this.props.delSave(i);
        })
        this.setState((state) => {
            return {
                ...state,
                selected: {},
                willRemoved: [...Object.keys(this.state.selected), ...this.state.willRemoved]
            }
        })
    }

    handleAdd = async () => {
        const addTemp = this.state.columns.slice()
        addTemp.splice(-1, 1)
        addTemp.splice(0, 1)
        const tp = {};
        addTemp.forEach(({accessor}) => {
            tp[accessor] = ""
        })
        const i = await apiProvider.getNextId()
        tp.id = i + 1
        // tp.id = this.props.data.length + 1
        this.setState((state) => {
            return {...state, editing: tp, adding: true}
        })
        this.props.addTmp([tp, ...this.props.data])
    }


    handleClickPopUp = (columnId, data) => {
        switch (columnId) {
            case "keyfield" :
                return this.handleKeyFieldSelect(data)
            case "confirms" :
                return this.handleConFieldSelect(data)
            default:
                return
        }
    }

    sendWithQuery = (filtered, offset, limit, pageSize) => {
        const ob = {}
        filtered.forEach(({id, value}) => {
            ob[id] = value
        })
        const obj = {
            offset: offset,
            limit: limit,
            filters: ob
        }
        apiProvider.getFiltersCounts("rules", obj).then((res) => this.setState({totalRows: res}))
        //TODO:: debounce it
        apiProvider.getLiveRulesFilter(obj).then((res) => {
            this.props.setData(res)
            this.setState({loading: false, pages: Math.ceil(this.state.totalRows / pageSize)})
        })
    }

    fetchData = (state, instance) => {

        apiProvider.getRowCounts("rules").then((res) => this.setState({totalRows: res}))
        this.setState({loading: true})
        const offset = state.page * state.pageSize
        const limit = state.pageSize

        //TODO::여기서 수정내역 있으면 save 하라고 popup 띄워야함.

        state.filtered.length ? (
            this.sendWithQuery(state.filtered, offset, limit, state.pageSize)
        ) : (
            apiProvider.getLiveRules(offset, limit).then((res) => {
                this.props.setData(res)
                this.setState({loading: false, pages: Math.ceil(this.state.totalRows / state.pageSize)})
            })
        )
    }

    render() {
        const tableProps = this.props.edited == 0 ? {
            manual: true,
            pages: this.state.pages,
            onFetchData: this.fetchData
        } : {
            manual: false
        }
        return (
            <React.Fragment>

                <div className="btns">
                    <button className="btn" onClick={this.handleAdd} disabled={this.props.edited !== 0}>
                        Add
                    </button>
                    <button className="btn" onClick={this.handleDelete} disabled={this.props.edited !== 0}>
                        Delete
                    </button>
                    <button className="btn" onClick={() => {
                        this.props.editZero();
                        this.props.revRe(true)
                    }}>
                        Refresh
                    </button>

                    <div className="seperate-bar-100"/>

                    <button className="btn" onClick={() => {
                        this.handleFieldAdd()
                    }} disabled={this.props.edited !== 0}>
                        Field Add
                    </button>
                    <button className="btn" onClick={this.handleSave}>
                        Save
                    </button>
                    <button className="btn" onClick={() => this.props.openPop(true)} disabled={this.props.edited !== 0}>
                        배포
                    </button>
                </div>
                <div className="table-wrapper">
                    <div className="Fixed">

                        <FormProvider
                            form="inline"
                            onSubmit={this.handleSubmit}
                            onSubmitSuccess={() => this.setState({editing: null})}
                            initialValues={this.state.editing}
                            enableReinitialize
                        >
                            {(formProps) => {
                                return (
                                    <form onSubmit={formProps.handleSubmit}>
                                        <Table
                                            key={[this.props.edited, this.props.refre]}
                                            getTdProps={(state, rowInfo, column) => ({
                                                onClick: () => (rowInfo !== undefined && this.state.editing) ? this.handleClickPopUp(column.id, rowInfo.original) : undefined
                                            })}
                                            columns={
                                                this.state.columns
                                            }
                                            {...tableProps}
                                            defaultPageSize={5}
                                            data={this.props.data}
                                            sorted={[{id: 'id'}]}

                                            // defaultPageSize={10}
                                        />
                                        {this.props.selectKPop && <SelectKeyFieldPopup/>}
                                        {this.props.selectCPop && <SelectConfirmsPopup/>}
                                        {this.props.openReleasePop && <ReleasePopup name="history/livedetectrule"
                                                                                    handleSave={this.handleSave}> </ReleasePopup>}
                                    </form>
                                );
                            }}
                        </FormProvider>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(
    state => ({
        version: state.fetchAPI.headVersion,
        versionTmp: state.fetchAPI.headVersionTmp,
        selectKPop: state.fetchAPI.openKeyField,
        selectCPop: state.fetchAPI.openConField,
        openReleasePop: state.fetchAPI.open,
        kfOb: state.fetchAPI.keyField,
        data: state.fetchAPI.data,
        refre: state.fetchAPI.refre,
        add: state.fetchAPI.ad,
        hflag: state.fetchAPI.hflag,
        newField: state.fetchAPI.addedField,
        header: state.fetchAPI.header,
        headRestore: state.fetchAPI.headRestore,
        his: state.fetchAPI.startHistory,

        edited: state.fetchAPI.edited,

        addId: state.editOperator.addId,
        delId: state.editOperator.delId,
        editId: state.editOperator.editId,
        savedData: state.editOperator.savedData
    }),
    dispatch => {
        return bindActionCreators(
            {
                setKfOb: keyFieldSelect,
                addTmp: addTmp,
                revRe: revRe,
                openPop: openPop,
                delTmp: deleteTmp,
                currEd: currEd,
                hisFlag: hisFlag,
                addedField: addedField,
                setHead: selectHead,
                resHead: restoreHead,
                saveVer: saveVersion,
                restoreVer: restoreVersion,
                startHis: startHis,

                editZero: editZero,
                getData: apiProvider.getLiveRules,
                getDataFilter: apiProvider.getLiveRulesFilter,

                addSave: addSave,
                delSave: delSave,
                editSave: editSave,
                dataSave: dataSave,
                setData: getAllR
            },
            dispatch
        )
    }
)(GridTableLDR)