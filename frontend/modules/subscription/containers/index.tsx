import { useRouter } from "next/router";
import React, { useState } from "react";

const SubscriptionTiers = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const router = useRouter();
  const plans = [
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
      cta: "Get Started",
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
      cta: "Start Free Trial",
      popular: true,
    },
    {
      id: "pro",
      name: "Pro",
      price: "$19",
      period: "per month",
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
  };

  const handleSubmitPlan = () => {
    if (selectedPlan) {
      router.push({
        pathname: "/subscription/checkout",
        query: { plan: selectedPlan },
      });
    }
  };

  return (
    <section className="subscription-tiers">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="section-title">Choose Your Plan</h2>
          <p className="section-subtitle">
            Select the perfect plan for your needs
          </p>
        </div>

        <div className="row g-4">
          {plans.map((plan) => (
            <div key={plan.id} className="col-md-4">
              <div
                className={`tier-card ${plan.popular ? "popular" : ""} ${
                  selectedPlan === plan.id ? "selected" : ""
                }`}
              >
                {plan.popular && (
                  <div className="popular-badge">Most Popular</div>
                )}
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
                <button
                  className={`btn btn btn-outline-primary`}
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
        {selectedPlan && (
          <div className="text-center mt-5">
            <div className="d-inline-block">
              <h4 className="mb-3">
                You selected:{" "}
                <span className="text-primary">
                  {plans.find((p) => p.id === selectedPlan)?.name} Plan
                </span>
              </h4>
              <button
                className={`btn btn-primary submitButton`}
                onClick={handleSubmitPlan}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SubscriptionTiers;
