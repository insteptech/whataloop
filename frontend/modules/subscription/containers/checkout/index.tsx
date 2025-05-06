import Loader from "@/components/common/loader";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  popular: boolean;
}

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { plan: planId } = router.query;
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const plans: Plan[] = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "Basic features",
        "Community support",
        "Limited storage",
        "Up to 3 projects",
        "Email notifications",
      ],
      cta: "Select Free Plan",
      popular: false,
    },
    {
      id: "starter",
      name: "Starter",
      price: "$9",
      period: "per month",
      features: [
        "All Free features",
        "Priority support",
        "Unlimited projects",
        "Advanced analytics",
        "API access",
      ],
      cta: "Select Starter Plan",
      popular: true,
    },
    {
      id: "pro",
      name: "Pro",
      price: "$19",
      period: "per month",
      features: [
        "All Starter features",
        "24/7 dedicated support",
        "White-labeling",
        "Team collaboration",
        "Custom integrations",
        "Premium templates",
      ],
      cta: "Select Pro Plan",
      popular: false,
    },
  ];

  useEffect(() => {
    if (planId && typeof planId === "string") {
      const plan = plans.find((p) => p.id === planId);
      if (plan) {
        setSelectedPlan(plan);
      } else {
        router.push("/");
      }
    }
  }, [planId]);

  if (!selectedPlan) {
    return (
      <div className="container py-5">
        <Loader />
      </div>
    );
  }

  return (
    <div className={`container py-5 checkoutPage`}>
      <div className="row justify-content-center">
        <div className="col-lg-12">
          <div className="text-center mb-5">
            <h1 className="pageTitle">Complete Your Subscription</h1>
            <p className="pageSubtitle">
              Review your plan and enter payment details
            </p>
          </div>

          <div className="row">
            {/* Plan Summary Column */}
            <div className="col-md-5 mb-4 mb-md-0">
              <div className={`card summaryCard`}>
                <div className="card-body">
                  <h2 className="summaryTitle">Order Summary</h2>

                  <div className="planSummary">
                    <h3 className="planName">{selectedPlan.name} Plan</h3>
                    <div className="planPrice">
                      {selectedPlan.price}
                      <span className="planPeriod">
                        {selectedPlan.period !== "forever" &&
                          `/${selectedPlan.period}`}
                      </span>
                    </div>
                  </div>

                  <hr className="divider" />

                  <h4 className="featuresTitle">Included Features:</h4>
                  <ul className="featuresList">
                    {selectedPlan.features.map((feature, index) => (
                      <li key={index} className="featureItem">
                        <span className="checkmark">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Payment Form Column */}
            <div className="col-md-7">
              <div className={`card paymentCard`}>
                <div className="card-body">
                  <h2 className="paymentTitle">Payment Details</h2>

                  <form className="paymentForm">
                    <div className="mb-4">
                      <label htmlFor="email" className="formLabel">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className={`form-control formInput`}
                        id="email"
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="cardName" className="formLabel">
                        Name on Card
                      </label>
                      <input
                        type="text"
                        className={`form-control formInput`}
                        id="cardName"
                        placeholder="Name on Card"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="cardNumber" className="formLabel">
                        Card Number
                      </label>
                      <input
                        type="text"
                        className={`form-control formInput`}
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <label htmlFor="expiryDate" className="formLabel">
                          Expiration Date
                        </label>
                        <input
                          type="text"
                          className={`form-control formInput`}
                          id="expiryDate"
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-4">
                        <label htmlFor="cvv" className="formLabel">
                          Security Code
                        </label>
                        <div className="cvvContainer">
                          <input
                            type="text"
                            className={`form-control formInput`}
                            id="cvv"
                            placeholder="CVV"
                            required
                          />
                          <span className="cvvHelp">?</span>
                        </div>
                      </div>
                    </div>

                    <div className="form-check mb-4">
                      <input
                        className={`form-check-input checkbox`}
                        type="checkbox"
                        id="saveCard"
                      />
                      <label className="checkboxLabel" htmlFor="saveCard">
                        Save this card for future payments
                      </label>
                    </div>

                    <button
                      type="submit"
                      className={`btn btn-primary submitButton`}
                    >
                      Complete Subscription
                    </button>

                    <div className="securityNote">
                      <span className="lockIcon">🔒</span>
                      Your payment is secure and encrypted
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
