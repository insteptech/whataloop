import React from 'react'
import { Modal, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';

interface PaymentStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const RemiderModal: React.FC<PaymentStatusModalProps> = ({
    isOpen,
    onClose
}) => {

    const router = useRouter()
    return (
        <Modal show={isOpen} onHide={onClose} centered backdrop="static" className='reminder-modal-container'>
            <Modal.Header closeButton className='payment-modal-header'>
            <Modal.Title>
                <h1>Add Reminder</h1>
                <h3>For Jhon Doe</h3>
            </Modal.Title>
            </Modal.Header>

            <Modal.Body className='remider-modal-body'>
                    <div className='success-icon'>

                    </div>
                    <p>You are all set</p>
                    <h2>You’re a premium user now.</h2>

                    {/* {sessionId && ( */}
                    <>
                        <div className='purchase-detail-box'>
                            <div className="mt-3 text-sm text-muted">
                                <strong>Plan Name</strong>
                                <div className="break-all"> </div>
                            </div>
                            <div className="mt-3 text-sm text-muted">
                                <strong>Purchase Date</strong>
                                <div className="break-all"></div>
                            </div>

                        </div>
                        <div className="mt-4">

                        </div>
                    </>
            </Modal.Body>


        </Modal>
    )
}

export default RemiderModal;
