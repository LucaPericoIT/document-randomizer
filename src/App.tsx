import * as React from 'react';
import {hot} from "react-hot-loader";
import Main from "./component/main/main";

const App = () => {
    return <div className="container"><Main/></div>
};

export default hot(module)(App);