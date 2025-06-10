import React from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { downloadStripeInvoice } from '@/modules/stripepaymentstatus/redux/actions/stripeAction';
import { string } from 'yup';

const DownloadInvoiceButton = ({ sessionId, children }) => {
    const [loading, setLoading] = React.useState(false);

    const baseStyle = {
        background: "#168c7e",
        color: "white",
        border: "none",
        padding: "0.75rem",
        width: "100%",
        fontWeight: "bold",
        borderRadius: "50px",
        cursor: "pointer",
        transition: "background 0.3s ease",
        maxWidth: "300px",
        margin: "auto",
        fontSize: "16px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    };

    const disabledStyle = {
        ...baseStyle,
        opacity: 0.7,
        cursor: "not-allowed",
        // backgroundColor: "#168c7e",
    };

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
            type="button"
            style={loading ? disabledStyle : baseStyle}
            onClick={handleDownload}
            disabled={loading}
        >
            {loading && (
                <svg
                    style={{
                        width: "20px",
                        height: "20px",
                        marginRight: "10px",
                        animation: "spin 1s linear infinite",
                    }}
                    viewBox="0 0 24 24"
                >
                    <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="#fff"
                        strokeWidth="2"
                        fill="none"
                        strokeOpacity="0.3"
                    />
                    <path
                        d="M12 2a10 10 0 0 1 10 10"
                        stroke="#fff"
                        strokeWidth="2"
                        fill="none"
                    />
                </svg>
            )}
            {loading ? "Redirecting..." : children}
        </button>

    );
};

export default DownloadInvoiceButton;


