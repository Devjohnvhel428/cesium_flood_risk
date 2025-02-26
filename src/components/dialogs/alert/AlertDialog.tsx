import "@esri/calcite-components/dist/components/calcite-dialog";
import "@esri/calcite-components/dist/components/calcite-button";
import { CalciteDialog, CalciteButton } from "@esri/calcite-components-react";
import "react-phone-input-2/lib/style.css";

import { AlertDialogContainer } from "./alert-dialog.style";

interface DialogProps {
    open: boolean;
    data: any;
    city: string;
    onClose: () => void;
}

const AlertDialog = ({ open, data = undefined, city = "", onClose }: DialogProps) => {
    return (
        <CalciteDialog
            open={open}
            modal
            heading={`The ${data?.type || "alert"}  in ${city}.`}
            scale="s"
            widthScale="s"
            outsideCloseDisabled
            closeDisabled
            id="confirm-dialog"
        >
            <AlertDialogContainer>
                <div className="confirm-content">
                    <span className="confirm-text">{data?.description || ""}</span>
                </div>
            </AlertDialogContainer>
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

export default AlertDialog;
