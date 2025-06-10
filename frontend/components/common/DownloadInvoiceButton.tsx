import React from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { downloadStripeInvoice } from '@/modules/stripepaymentstatus/redux/actions/stripeAction';
import { string } from 'yup';

const DownloadInvoiceButton = ({ sessionId, children }) => {

    const dispatch = useDispatch()
    const handleDownload = async () => {
        if (!sessionId) {
            alert('Session ID is missing');
            return;
        }

        try {

            const response = dispatch(downloadStripeInvoice(sessionId) as any)
            if (response) {
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = url;
                link.download = `invoice-${sessionId}.pdf`;
                link.click();

                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Failed to download invoice:', error);
            alert('Could not download invoice. Please try again.');
        }
    };

    return (
        <button
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
            Download Invoice
        </button>
    );
};

export default DownloadInvoiceButton;


