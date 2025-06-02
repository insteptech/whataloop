import { useRouter } from "next/router";
import React, { useState } from "react";
import { Modal, Button, Form as BootstrapForm } from "react-bootstrap";
import InputFieldWithCountryCode from "@/components/common/InputFieldWithCountryCode";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { sendOtp } from "../redux/actions/subscriptionAction";
import { verifyOtp } from "../redux/actions/subscriptionAction";
import { createBusiness } from "../redux/actions/subscriptionAction";
import { useSelector } from "react-redux";




const SubscriptionTiers = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // 6-digit OTP
  const [whatsappForOtp, setWhatsappForOtp] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.profileReducer.data);


  const plans = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      period: "forever",
      price_id: "",
      features: [
        "Basic features",
        "Community support",
        "Limited storage",
        "Up to 3 projects",
        "Email notifications",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      id: "starter",
      name: "Starter",
      price: "$9",
      period: "per month",
      price_id: "",
      features: [
        "All Free features",
        "Priority support",
        "Unlimited projects",
        "Advanced analytics",
        "API access",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      id: "pro",
      name: "Pro",
      price: "$19",
      period: "per month",
      price_id: "",
      features: [
        "All Intermediate features",
        "24/7 dedicated support",
        "White-labeling",
        "Team collaboration",
        "Custom integrations",
        "Premium templates",
      ],
      cta: "Get Pro",
      popular: false,
    },
  ];

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
    setShowModal(true);
  };

  const handleSendOtp = async (number: string) => {
    try {
      const resultAction = await dispatch(sendOtp(number) as any);
      if (sendOtp.fulfilled.match(resultAction)) {
        setWhatsappForOtp(number);
        setShowModal(false);
        setShowOtpModal(true);
      } else {
        alert(resultAction.payload || "Something went wrong sending OTP.");
      }
    } catch (error) {
      console.error("OTP send error:", error);
      alert("Unexpected error while sending OTP.");
    }
  };

  const handleOtpChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleProceed = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length === 6 && selectedPlan) {
      try {
        const resultAction = await dispatch(
          verifyOtp({
            whatsapp_number: whatsappForOtp,
            otp: enteredOtp,
          }) as any
        );

        if (verifyOtp.fulfilled.match(resultAction)) {
          setShowOtpModal(false);
          setShowDetailsModal(true);
        } else {
          alert(resultAction.payload || "OTP verification failed.");
        }
      } catch (error) {
        console.error("OTP verification error:", error);
        alert("Unexpected error verifying OTP.");
      }
    } else {
      alert("Please enter the complete 6-digit OTP.");
    }
  };


  const handleFinalSubmit = async (values) => {
    if (!user?.id || !whatsappForOtp) {
      alert("Missing user ID or WhatsApp number.");
      return;
    }

    const businessPayload = {
      user_id: user.id,
      whatsapp_number: whatsappForOtp.replace(/\D/g, ""),
      name: values.fullName,
      // Optional fields can be added here if needed:
      // description: "Best digital agency",
      // website: "https://example.com",
      // logo_url: "https://cdn.example.com/logo.png"
    };

    try {
      const resultAction = await dispatch(createBusiness(businessPayload) as any);

      if (createBusiness.fulfilled.match(resultAction)) {
        router.push({
          pathname: "/subscription/checkout",
          query: {
            plan: selectedPlan,
            name: values.fullName,
            email: values.email,
            altMobile: values.alternateMobile || "",
          },
        });
      } else {
        alert(resultAction.payload || "Failed to create business.");
      }
    } catch (error) {
      console.error("Error creating business:", error);
      alert("Unexpected error creating business.");
    }
  };

  return (
    <>
      {/* Subscription Plans Section */}
      <section className="subscription-tiers">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Choose Your Plan</h2>
            <p className="section-subtitle">Select the perfect plan for your needs</p>
          </div>
          <div className="row g-4">
            {plans.map((plan) => (
              <div key={plan.id} className="col-md-4">
                <div className={`tier-card ${plan.popular ? "popular" : ""} ${selectedPlan === plan.id ? "selected" : ""}`}>
                  {plan.popular && <div className="popular-badge">Most Popular</div>}
                  <div className="tier-header">
                    <h3 className="tier-name">{plan.name}</h3>
                    <div className="tier-price">
                      <span className="price">{plan.price}</span>
                      <span className="period">/{plan.period}</span>
                    </div>
                  </div>
                  <ul className="tier-features">
                    {plan.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <button className="btn btn-outline-primary" onClick={() => handleSelectPlan(plan.id)}>
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal 1: WhatsApp Number */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Get Premium</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{ whatsappNumber: "" }}
          validationSchema={Yup.object({
            whatsappNumber: Yup.string()
              .required("Phone is required")
              .matches(/^\+?[0-9]{10,}$/, "Phone number is not valid")
              .min(12, "Phone number too short")
              .max(15, "Phone number is too long"),
          })}
          onSubmit={(values) => handleSendOtp(values.whatsappNumber)}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <Modal.Body>
                <h5>Enter your WhatsApp Business number to sign in or create a new account</h5>
                <InputFieldWithCountryCode
                  label="Enter your WhatsApp Business number"
                  name="whatsappNumber"
                  placeholder="Enter WhatsApp number"
                  className="country-code-select-with-number leads-country-code"
                  required
                />
                <i>You’ll receive a 6-digit code on this number</i>
                <div className="mt-3 d-flex justify-content-center align-items-center">
                  <Button type="submit" variant="outline-success" className="mt-3">
                    Send OTP
                  </Button>
                </div>
              </Modal.Body>
            </Form>
          )}
        </Formik>
      </Modal>

      {/* Modal 2: OTP Entry */}
      <Modal show={showOtpModal} onHide={() => setShowOtpModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Get Premium</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-left mb-3">
            Enter the 6-digit OTP sent to <strong>{whatsappForOtp}</strong>
          </p>
          <div className="d-flex justify-content-center gap-2">
            {otp.map((digit, index) => (
              <BootstrapForm.Control
                key={index}
                id={`otp-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                maxLength={1}
                className="text-center"
                style={{ width: "40px", fontSize: "1.5rem" }}
              />
            ))}
          </div>
          <div className="mt-4 d-flex justify-content-center">
            <Button variant="success" className="px-5" onClick={handleProceed}>
              Continue
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal 3: Full Name, Email, Alternate Mobile */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Get Premium</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{
            fullName: "",
            email: "",
            alternateMobile: "",
          }}
          validationSchema={Yup.object({
            fullName: Yup.string().required("Full Name is required"),
            email: Yup.string().email("Invalid email").required("Email is required"),
          })}
          onSubmit={handleFinalSubmit}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <Modal.Body>
                <BootstrapForm.Group>
                  <h3>Personal Information</h3>
                  <BootstrapForm.Label>Full Name</BootstrapForm.Label>
                  <Field name="fullName" className="form-control" placeholder="Enter your full name" />
                  <ErrorMessage name="fullName" component="div" className="text-danger" />
                </BootstrapForm.Group>

                <BootstrapForm.Group className="mt-3">
                  <BootstrapForm.Label>Email Address</BootstrapForm.Label>
                  <Field name="email" type="email" className="form-control" placeholder="Enter your email" />
                  <ErrorMessage name="email" component="div" className="text-danger" />
                </BootstrapForm.Group>

                <div className="mt-3">
                  <InputFieldWithCountryCode
                    label="Alternate Mobile Number (Optional)"
                    name="alternateMobile"
                    placeholder="Alternate mobile number"
                    className="country-code-select-with-number leads-country-code"
                  />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button type="submit" variant="success">
                  Confirm And Pay
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default SubscriptionTiers;
