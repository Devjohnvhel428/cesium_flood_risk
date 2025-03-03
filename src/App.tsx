// q@ts-nocheck
/* qeslint-disable */
import { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { GGITech } from "@core/GGITech";
import Main from "./Main";

interface AppProps {
    ggiTech: GGITech;
}

const App = ({ ggiTech }: AppProps) => {
    useEffect(() => {
        if (!ggiTech.mainViewer.ggiTechMapViewer) {
            ggiTech.mainViewer.createGGITechMapViewer();
        }
    }, []);

    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <Main ggiTech={ggiTech} />
                </Route>
                <Route path="*" render={() => <Redirect to="/" />} />
            </Switch>
        </Router>
    );
};

export default App;
