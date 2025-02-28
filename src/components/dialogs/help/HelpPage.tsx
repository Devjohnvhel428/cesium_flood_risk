import "@esri/calcite-components/dist/components/calcite-dialog";
import "@esri/calcite-components/dist/components/calcite-button";
import { CalciteDialog, CalciteButton } from "@esri/calcite-components-react";
import "react-phone-input-2/lib/style.css";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Paper, Grid } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import zIndex from "@mui/material/styles/zIndex";

interface DialogProps {
    open: boolean;
    onClose: () => void;
}

const HelpPage = ({ open, onClose }: DialogProps) => {
    return (
        <CalciteDialog
            open={open}
            modal
            scale="m"
            widthScale="m"
            closeDisabled
            outsideCloseDisabled
            id="confirm-dialog"
        >
            <Box sx={{ padding: 1, backgroundColor: "#f5f5f5", minHeight: "80vh" }}>
                <Paper elevation={3} sx={{ padding: 4, maxWidth: 800, margin: "0 auto" }}>
                    <Typography
                        variant="h4"
                        gutterBottom
                        sx={{ textAlign: "center", fontWeight: "bold", color: "#1976d2" }}
                    >
                        Welcome to the Help Page
                    </Typography>
                    <Typography variant="body1" gutterBottom sx={{ textAlign: "center", marginBottom: 4 }}>
                        Learn how to use the **Current Weather Display and Flood Warning Alert Project** effectively.
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                        What is this project about?
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        This project provides **current weather information** for 438 cities in the
                                        Philippines using mock data from the Weatherbit API. It also displays **flood
                                        alerts** for cities, using data from the OpenStreetMap API. Users can search for
                                        weather information by city name, filter by weather type, and view flood alerts
                                        within a circular range.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>

                        <Grid item xs={12}>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel2a-content"
                                    id="panel2a-header"
                                >
                                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                        How to use the weather search feature?
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        - Use the **search bar** to enter the name of a city. <br />- Apply filters to
                                        narrow down results by weather type (e.g., sunny, rainy, cloudy). <br />- View
                                        detailed weather information for the selected city, including temperature,
                                        humidity, and wind speed.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>

                        <Grid item xs={12}>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel3a-content"
                                    id="panel3a-header"
                                >
                                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                        How to view flood alerts?
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        - Flood alerts are displayed on the map as circular regions. <br />- Click on a
                                        city with a flood alert to view more details about the alert. <br />- The radius
                                        of the alert is determined using data from the OpenStreetMap API.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>

                        <Grid item xs={12}>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel4a-content"
                                    id="panel4a-header"
                                >
                                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                        How to customize the map?
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        - Use the **customized map control bar** to switch between different base maps
                                        (e.g., satellite, terrain, street view). <br />
                                        - Zoom in and out or pan across the map to explore different regions. <br />-
                                        The map is powered by CesiumJS for 3D geospatial visualization.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>

                        <Grid item xs={12}>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel5a-content"
                                    id="panel5a-header"
                                >
                                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                        Why does this project use mock data?
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        The project uses mock data because the Weatherbit API requires a premium account
                                        for full access. However, the mock data closely simulates real-world weather
                                        information to provide an accurate user experience.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                    </Grid>

                    <Box sx={{ marginTop: 4, textAlign: "center" }}>
                        <Typography variant="body2" color="textSecondary">
                            If you have further questions, feel free to contact the development team. Thank you for
                            using our project! This is the demo video of how you can use the project.
                            <br />
                            <iframe
                                style={{ border: "none" }}
                                src="https://drive.google.com/file/d/1OTfUVhXXOXrAe9xjuOgxkLAFhckrbUQo/preview"
                                allow="autoplay"
                            ></iframe>
                        </Typography>
                    </Box>
                </Paper>
            </Box>
            <CalciteButton
                slot="footer-end"
                appearance="outline"
                onClick={() => {
                    onClose();
                }}
            >
                Cancel
            </CalciteButton>
        </CalciteDialog>
    );
};

export default HelpPage;
