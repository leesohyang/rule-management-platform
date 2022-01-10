import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Route, Switch} from "react-router-dom";
import {Asset, Device, Relation, NormalizeRule} from "../../pages";
import {Repeat} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    root: {
        margin: 10,
    },
}));

export default function MainContents() {
    const classes = useStyles();

    return (
        <React.Fragment>

            <Switch>
                {/*<Route path={'/home'} exact={true}>*/}
                {/*</Route>*/}
                {/*<Route path={'/assetgroup/asset'} exact={true}>*/}
                {/*</Route>*/}
                <Route path={'/livedetectrule'} exact={true} component={Device}>
                    {/*    <ContentsTable title={'Device Group'} headCells={headCells} rows={rows}/>*/}
                </Route>
            </Switch>
        </React.Fragment>
    );

}
