import React from "react";
import DownloadInvoiceButton from "@/components/common/DownloadInvoiceButton";

export default function StripeSuccess() {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get("session_id");

  function handleClick(sessionId: string): React.MouseEventHandler<HTMLButtonElement> {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h2>
      <p>Your payment has been received.</p>
      {sessionId && (
        <div className="mt-4 text-xs text-gray-500">
          <span>Stripe Session ID:</span>
          <br />
          <span className="break-all">{sessionId}</span>
        </div>
      )}
      <DownloadInvoiceButton
         sessionId={sessionId}>
        Download Invoice
      </DownloadInvoiceButton>
      <a
        href="/dashboard"
        className="mt-6 inline-block px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
      >
        Go to Dashboard
      </a>
    </div>
  );
}
