import React from "react";
import {AppBar, Button, makeStyles, Toolbar, Typography} from "@material-ui/core";
import {Link as RouterLink} from "react-router-dom";
import Link from "@material-ui/core/Link";
import {Route} from "react-router";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import {breadcrumbNameMap} from "../controls/BreadcrumbNameMap";
import './style.scss'
const LinkRouter = (props) => <Link {...props} component={RouterLink}/>;

const useStyles = makeStyles((theme) => ({
    root: {
        // display: 'flex',
        flexDirection:'column',
    },
    appBar: {
        // display: "flex",
        flexDirection: 'row',
        position: "static"
    },
    path: {
        flexGrow: 1
    },
}))

export default function MainAppBar(props) {
    const classes = useStyles();

    return (
        <React.Fragment>
             <Route>
                 {({ location }) => {
                     const pathnames = location.pathname.split('/').filter((x) => x);

                     return (
                         <Breadcrumbs color="inherit">
                             {pathnames.map((value, index) => {
                                 const last = index === pathnames.length - 1;
                                 const to = `/${pathnames.slice(0, index + 1).join('/')}`;

                                 return last ? (
                                     <Typography variant="h6" color="inherit" key={to}>
                                         {breadcrumbNameMap[to]}
                                     </Typography>
                                 ) : (
                                     <LinkRouter color="inherit" to={to} key={to}>
                                         {breadcrumbNameMap[to]}
                                     </LinkRouter>
                                 );
                             })}
                         </Breadcrumbs>
                     );
                 }}
             </Route>
        </React.Fragment>

        // <div className={classes.root}>
        //     <AppBar className={classes.appBar} >
        //         <Toolbar className={classes.path}>
        //             <Route>
        //                 {({ location }) => {
        //                     const pathnames = location.pathname.split('/').filter((x) => x);
        //
        //                     return (
        //                         <Breadcrumbs color="inherit">
        //                             {pathnames.map((value, index) => {
        //                                 const last = index === pathnames.length - 1;
        //                                 const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        //
        //                                 return last ? (
        //                                     <Typography variant="h6" color="inherit" key={to}>
        //                                         {breadcrumbNameMap[to]}
        //                                     </Typography>
        //                                 ) : (
        //                                     <LinkRouter color="inherit" to={to} key={to}>
        //                                         {breadcrumbNameMap[to]}
        //                                     </LinkRouter>
        //                                 );
        //                             })}
        //                         </Breadcrumbs>
        //                     );
        //                 }}
        //             </Route>
        //         </Toolbar>
        //         <Button color="inherit">Login</Button>
        //     </AppBar>
        // </div>
    );

}
