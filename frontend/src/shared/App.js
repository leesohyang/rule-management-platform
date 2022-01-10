import React, { Component } from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import { Home, About } from '../pages';
import {CssBaseline} from "@material-ui/core";
import MainAppBar from "../components/main/MainAppBar";
import Navigator from "../components/main/Navigator";
import {makeStyles} from "@material-ui/core";
import MainContents from "../components/main/MainContents";
import '../components/styles/styles.scss'
import {apiProvider} from "../services/Provider";

//TODO::Navigator 따로 빼야함.

function App() {
    React.useEffect(()=>{
        async function inits(){
            apiProvider.initHead().then(()=>console.log("initHead"))
            apiProvider.initRelForm().then(()=>console.log("initRelForm"))
        }
        inits().then(()=>console.log("done!"));
    }, [])

    return (
        // <div className={classes.root}>
        <React.Fragment>

            <BrowserRouter initialEntries={['/']} initialIndex={0}>
                <div className="navbar">
                    <div className="navbar__logo">
                        <div className="logo" />
                    </div>
                    <MainAppBar />
                </div>


                <div className="wrapper correlation-rule">

                    <nav className="left-menu-wrapper">
                        <div className="left-menu">
                            <div className="left-menu__title">Admin</div>
                            <ul className="left-menu__list">
                                <Navigator/>
                            </ul>

                            <div className="left-menu__title">Rules</div>
                        </div>
                    </nav>

                    <MainContents />

                </div>
            </BrowserRouter>
        </React.Fragment>

        // </div>


    );
}
export default App;