import React, { useState } from "react";

export default function StripeCheckoutButton({
    planId,
    businessId,
    userId,
    amount,         // Only for one-time payments
    mode = "subscription", // or "payment"
    successUrl,
    cancelUrl,
    children,
}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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
        setError("");
        try {
            const origin = window.location.origin;
            const _successUrl = successUrl || `${origin}/billing/success`;
            const _cancelUrl = cancelUrl || `${origin}/billing/cancel`;

            const body = {
                planId,
                businessId,
                userId,
                mode,
                successUrl: _successUrl,
                cancelUrl: _cancelUrl,
                ...(mode === "payment" && amount ? { amount } : {}),
            };

            const response = await fetch("/stripe/checkout-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error || "Failed to create Stripe checkout session");
            }

            const { url } = await response.json();
            if (url) {
                window.location.href = url;
            } else {
                throw new Error("Stripe session URL not returned");
            }
        } catch (err) {
            setError(err.message || "An error occurred. Please try again.");
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
                        style={{ width: "20px", height: "20px", marginRight: "10px", animation: "spin 1s linear infinite" }}
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

            {/* Error Message */}
            {error && <div style={{ color: "red", marginTop: "8px" }}>{error}</div>}
        </div>
    );
}