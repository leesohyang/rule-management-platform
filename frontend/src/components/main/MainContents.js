import React from "react";
import { Route, Switch} from "react-router-dom";
import { Device} from "../../pages";

export default function MainContents() {

    return (
        <React.Fragment>

            <Switch>
                <Route path={'/livedetectrule'} exact={true} component={Device}/>
            </Switch>
        </React.Fragment>
    );

}
