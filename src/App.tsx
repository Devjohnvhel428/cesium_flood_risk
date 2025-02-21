// q@ts-nocheck
/* qeslint-disable */
import { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { GeoTech } from "@core/GeoTech";
import Main from "./Main";

interface AppProps {
    geoTech: GeoTech;
}

const App = ({ geoTech }: AppProps) => {
    useEffect(() => {
        if (!geoTech.mainViewer.geoTechMapViewer) {
            geoTech.mainViewer.createGeoTechMapViewer();
        }
    }, []);

    return (
        <Router>
            <Switch>
                {
                    <Route exact path="/">
                        <Main geoTech={geoTech} />
                    </Route>
                }
                <Route path="*" render={() => <Redirect to="/" />} />
            </Switch>
        </Router>
    );
};

export default App;
