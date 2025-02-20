// q@ts-nocheck
/* qeslint-disable */
import { SettingsContainer } from "./settings.styles";

interface SettingsProps {
    onClose: () => void;
}

const Settings = ({ onClose }: SettingsProps) => {
    return (
        <>
            <SettingsContainer></SettingsContainer>
        </>
    );
};

export default Settings;
