import React from "react";

export default function StripeCancel() {
  const params = new URLSearchParams(window.location.search);
  const error = params.get("checkout_error");

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Payment Cancelled</h2>
      <p>Your payment was not completed.</p>
      {error && <div className="mt-4 text-xs text-gray-500">{decodeURIComponent(error)}</div>}
      <a
        href="/billing"
        className="mt-6 inline-block px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
      >
        Back to Billing
      </a>
    </div>
  );
}
