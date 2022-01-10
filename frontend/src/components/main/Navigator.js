import React, {useState} from "react";
import {Divider, makeStyles, Typography} from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import PropTypes from "prop-types";
import List from "@material-ui/core/List";
import Collapse from "@material-ui/core/Collapse";
import {breadcrumbNameMap} from "../controls/BreadcrumbNameMap";
import {Link} from "react-router-dom";
import './style.scss'
import { NavLink } from 'react-router-dom';

//TODO:: 또 여길 고쳐야겠ㄴ네
function ListItemLink(props) {
    const { to, open, ...other } = props;
    const primary = breadcrumbNameMap[to];

    return (
        <React.Fragment>
            <li>

                <NavLink to="/asset" activeClassName="active" {...other}>
                    {primary}
                </NavLink>
                {/*<ListItem button component={Link} to={to} {...other}>*/}
                {/*    <ListItemText primary={primary} />*/}
                {/*    {open != null ? open ? <ExpandLess /> : <ExpandMore /> : null}*/}
                {/*</ListItem>*/}
            </li>
            <li>

                <NavLink to="/livedetectrule" activeClassName="active" {...other}>
                    {primary}
                </NavLink>
            </li>
        </React.Fragment>
    );
}

// ListItemLink.propTypes = {
//     open: PropTypes.bool,
//     to: PropTypes.string.isRequired,
// };


export default function Navigator() {
    const [open, setOpen] = useState(true);
    const primary = (to) => {
        return breadcrumbNameMap[to]
    }
    const handleClick = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    return (
        <React.Fragment>
            <li>
                <NavLink to="/livedetectrule" activeClassName="active">
                    {primary("/livedetectrule")}
                </NavLink>
            </li>

        </React.Fragment>
        // </div>
    );

}
