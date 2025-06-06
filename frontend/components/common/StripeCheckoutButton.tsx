import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { fetchStripePaymentUrl } from "@/modules/stripepaymentstatus/redux/actions/stripeAction";
import loader from "./loader";
// Import your async thunk
export default function StripeCheckoutButton({
    planId,
    businessId,
    userId,
    amount, // optional, only for one-time payments
    successUrl,
    cancelUrl,
    children,
}) {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const baseStyle = {
        padding: "12px 24px",
        borderRadius: "12px",
        fontWeight: "bold",
        color: "#fff",
        backgroundColor: "linear-gradient(90deg, #667eea, #764ba2)",
        border: "none",
        cursor: "pointer",
        width: "100%",
        maxWidth: "300px",
        margin: "auto",
        transition: "all 0.3s ease",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        fontSize: "16px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(90deg, #667eea, #764ba2)",
    };

    const disabledStyle = {
        ...baseStyle,
        opacity: 0.7,
        cursor: "not-allowed",
    };

    const handleCheckout = async () => {
        setLoading(true);

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