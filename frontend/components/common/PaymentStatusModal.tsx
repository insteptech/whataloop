import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import DownloadInvoiceButton from './DownloadInvoiceButton';
import { useSelector } from 'react-redux';
import { PaymenSuccessIcon } from './Icon';
import { useRouter } from 'next/router';

interface PaymentStatusModalProps {
    isOpen: boolean;
    sessionId: string | null;
    status: "success" | "rejected";
    onClose: () => void;
}

const PaymentStatusModal: React.FC<PaymentStatusModalProps> = ({
    isOpen,
    sessionId,
    status,
    onClose
}) => {

    const router = useRouter()
    const { data: user } = useSelector(
        (state: {
            profileReducer: { data: any; loading: boolean; error: string };
        }) => state.profileReducer
    );
    const today = new Date();
    const options = { year: 'numeric' as const, month: 'long' as const, day: 'numeric' as const };
    const localizedDate = today.toLocaleDateString(undefined, options);
    const isSuccessful = status === "success";

    return (
        <Modal show={isOpen} onHide={onClose} centered backdrop="static" className='payment-modal-container'>
            <Modal.Header closeButton className='payment-modal-header'>
            </Modal.Header>

            <Modal.Body className='payment-modal-body'>
                {isSuccessful ? (
                    <>
                        <div className='success-icon'>
                            <PaymenSuccessIcon />
                        </div>
                        <p>You are all set</p>
                        <h2>You’re a premium user now.</h2>

                        {/* {sessionId && ( */}
                        <>
                            <div className='purchase-detail-box'>
                                <div className="mt-3 text-sm text-muted">
                                    <strong>Plan Name</strong>
                                    <div className="break-all">{user?.account_type.toUpperCase()} </div>
                                </div>
                                <div className="mt-3 text-sm text-muted">
                                    <strong>Purchase Date</strong>
                                    <div className="break-all">{localizedDate}</div>
                                </div>
                                <div className="mt-3 text-sm text-muted">
                                    <strong>Stripe Session ID:</strong>
                                    <div className="break-all">{sessionId}</div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <DownloadInvoiceButton sessionId={sessionId}>
                                    Download Invoice
                                </DownloadInvoiceButton>
                            </div>
                        </>
                        {/* )} */}
                    </>
                ) : (
                    <>
                        {/* <PaymenFailIcon /> */}
                        <p className='mb-4'>We couldn't process your payment. Please try again.</p>
                        <button className='send-otp-button' onClick={() => {
                            router.push('/subscription/containers')
                        }}>
                            Retry
                        </button>
                    </>
                )}
            </Modal.Body>


        </Modal>
    );
};

export default PaymentStatusModal;