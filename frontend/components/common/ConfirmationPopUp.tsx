import React, { useRef } from 'react';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

interface ConfirmationPopupProps {
    visible: boolean;
    onAccept: () => void;
    onReject: () => void;
    message: string;
    header?: string;
    type?: 'delete' | 'alert';
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({
    visible,
    onAccept,
    onReject,
    message,
    header = 'Confirmation',
    type = 'alert',
}) => {
    const toast = useRef<any>(null);

    const handleReject = () => {
        onReject();
    };

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog
                visible={visible}
                onHide={handleReject}
                message={message}
                header={header}
                icon={type === 'delete' ? 'pi pi-trash' : 'pi pi-exclamation-triangle'}
                acceptClassName={type === 'delete' ? 'p-button-danger' : 'p-button-success'}
                defaultFocus={type === 'delete' ? 'reject' : 'accept'}
                accept={onAccept}
                reject={handleReject}
            />
        </>
    );
};

export default ConfirmationPopup;
