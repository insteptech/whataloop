import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { fetchStripePaymentUrl } from "@/modules/stripepaymentstatus/redux/actions/stripeAction";

export default function StripeCheckoutButton({
    planId,
    businessId,
    userId,
    amount,
    successUrl,
    cancelUrl,
    children,
    setStripeLoading,
}) {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

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

    const handleCheckout = async () => {
        if (loading) return;

        if (!businessId) {
            toast.error("Please register your business first.");
            return;
        }

        setLoading(true);
        setStripeLoading(true);

        try {
            await dispatch(
                fetchStripePaymentUrl({
                    planId,
                    businessId,
                    userId,
                    amount,
                    successUrl,
                    cancelUrl,
                }) as any
            );
        } catch (error) {
            console.error("Error during checkout:", error);
            toast.error("Failed to initialize payment. Please try again.");
        } finally {
            setLoading(false);
            setStripeLoading(false);
        }
    };


    return (
        <div style={{ textAlign: "center" }}>
            <button
                type="button"
                style={loading ? disabledStyle : baseStyle}
                onClick={handleCheckout}
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
                {loading ? "Redirecting..." : children || "Pay with Stripe"}
            </button>
        </div>
    );
}