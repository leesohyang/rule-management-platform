import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import MainAppBar from "../components/main/MainAppBar";
import Navigator from "../components/main/Navigator";
import MainContents from "../components/main/MainContents";
import '../components/styles/styles.scss'
import {apiProvider} from "../services/Provider";


async function inits() {
    await apiProvider.initHead()
    await apiProvider.initRelForm()
}

function App() {
    inits().then(r => console.log("Init tables"));

    return (
        <React.Fragment>

            <BrowserRouter initialEntries={['/']} initialIndex={0}>
                <div className="navbar">
                    <div className="navbar__logo">
                        <div className="logo"/>
                    </div>
                    <MainAppBar/>
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

                    <MainContents/>

                </div>
            </BrowserRouter>
        </React.Fragment>
    );
}

export default App;