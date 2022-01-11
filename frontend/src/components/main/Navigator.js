import React from "react";
import { breadcrumbNameMap} from "../controls/BreadcrumbNameMap";
import './style.scss'
import { NavLink } from 'react-router-dom';

export default function Navigator() {
    const primary = (to) => {
        return breadcrumbNameMap[to]
    }

    return (
        <React.Fragment>
            <li>
                <NavLink to="/livedetectrule" activeClassName="active">
                    {primary("/livedetectrule")}
                </NavLink>
            </li>

        </React.Fragment>
    );

}
