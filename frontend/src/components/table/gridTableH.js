import React from "react";
import set from "lodash/fp/set"; //얘는 지우고
import { Field } from "redux-form";
// import Table from "react-table";
import Table from "react-table"
import * as BS from "react-bootstrap";
import initialData from "./dataFactory";
import FormProvider from "./FormProvider";
import { avatarColumnProps } from "./AvatarCell";
import ActionsCell from "./ActionsCell";
import HighlightCell from "./HighlightCell";
import GridFilters from "./GridFilters";
import {useSelector} from "react-redux";
import {connect} from "react-redux"
import fetchAPI from "../../services/Redux/reducers/fetchAPI";
// import 'react-table/react-table.css';
import {currEd, dataSave, deleteTmp, getAllR, hisFlag, restoreHead} from "../../services/Redux/actions";
import { bindActionCreators } from 'redux';
import {addTmp, revRe, openPop} from "../../services/Redux/actions";
import Pagination from "./Pagination";
import "./style.scss"


class GridTableH extends React.Component {
    state = { editing: null, selected:{}, selectAll:0, adding:false};
    componentDidMount() {
        this.props.handleData()
    }

    componentDidUpdate = (prevProps) => {

        const ref = (prevProps.refre !== this.props.refre)
        const cond = (this.props.hflag && (prevProps.hflag !== this.props.hflag)) //TODO::고치고
        if(cond){
            this.props.handleData() //history data reload
            this.props.hisFlag(false)
        }
        if(ref){
            console.log("hi?")
            this.props.handleData()
        }
        // if(ref){
            //checkbox 해제해놓기
        // }
    }
    //TODO:: history data 없을때는 no row가 떠야하는뎁..
    columns = [
        { Header: "No",
            // accessor:"id",
            Cell: ({row}) => {
            // console.log(flatRows)
            return row._viewIndex + 1;
            }
        },
        { Header: "Type", accessor: "type"},
        { Header: "User", accessor: "user" },
        { Header: "Desc", accessor: "desc"},
        { Header: "UpdatedAt", accessor: "updatedat"},
        { Header: "released", accessor: "released" },
        {
            id: "checkbox",
            accessor: "",
            Header: "Edited",
            Cell: ({row}) => {
                return (
                    <input
                        type="checkbox"
                        className="checkbox"
                        // checked={this.state.selected[original.id] === true}
                        checked={row._viewIndex == this.props.curr}
                        // checked={true}
                        // onChange={() => this.toggleRow(original.id)}
                    />
                );
            }},

        {
            Header: "",
            maxWidth: 90,
            filterable: false,
            Cell: ({row, flatRow})=>(
                <button className="btn" onClick={()=>this.handleRestore(row, flatRow)}>
                    restore
                </button>
            )
        },
    ];

    handleRestore = (cell, test) => {
        this.props.currEd(cell._viewIndex, cell._original)
        switch (this.props.name) {
            case "normalizerule":
                return this.props.addTmp(cell._original.value.field.map(
                    ({vendors, ...other})=>{
                        return {vendors:vendors.join(',').toString(), ...other}
                    }
                ))
            case "livedetectrule":
                const hisId = cell._original.id //이걸 저장해놔야함.
                const tmp = cell._original.value.map(({conditions, ...other})=>{
                    const tp = {};
                    conditions.forEach(
                        ({field, value})=>{
                            tp[field]=value
                        }
                    )
                    return Object.assign({}, other, tp)
                })
                this.props.addTmp(tmp)
                console.log(tmp)
                this.props.dataSave(tmp)
                return this.props.resHead(true)

            default:
                return this.props.addTmp(cell._original.value.field)
        }

    }

    historyCond = (name) => {
        switch (name) {
            case "field" :
               return this.props.history
            case "livedetectrule":
                return this.props.historyLive
            case "normalizerule":
                return this.props.historyNormal
            default:
                return
        }
    }


    render() {
        console.log(this.historyCond(this.props.name))
        console.log(this.props.curr)
        return (
            <React.Fragment>

                <div className="btns">
                </div>
                <div className="table-wrapper">
                    <div className="Fixed">
                        <Table
                            className="-striped -highlight"
                            getTdProps={(state, rowInfo, column) => ({
                                style: {
                                    height:'40px',
                                    display:'flex',
                                    flexDirection:'column',
                                    justifyContent:'center'
                                },
                            })}
                            columns={this.columns}
                            // data={this.props.history}
                            data={this.historyCond(this.props.name)}
                            sorted={[{id:'updatedat', desc: true}]}
                            // PaginationComponent={Pagination}
                            defaultPageSize={10}
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(
    state => ({
        history: state.fetchAPI.history,
        historyLive: state.fetchAPI.historyLive,
        historyNormal: state.fetchAPI.historyNormal,
        curr: state.fetchAPI.edited,
        currOr: state.fetchAPI.editedOrigin,
        hflag: state.fetchAPI.hflag,
        data: state.fetchAPI.data,
        refre: state.fetchAPI.refre,

    }),
    dispatch => {
        return bindActionCreators(
            {
                addTmp: addTmp,
                revRe: revRe,
                openPop: openPop,
                delTmp: deleteTmp,
                currEd: currEd,
                hisFlag: hisFlag,
                resHead: restoreHead,

                dataSave: dataSave
            },
            dispatch
        )
    }

)(GridTableH)