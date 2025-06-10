import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Loader from "@/components/common/loader";
import { getSubscriptionPlans } from "../redux/actions/subscriptionAction";
import StripeCheckoutButton from "@/components/common/StripeCheckoutButton";
import { getUsersBusinessExist } from "@/modules/dashboard/redux/actions/businessAction";
import { toast } from "react-toastify";

const SubscriptionTiers = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [error, setError] = useState("");

  // Redux state
  const businessId = useSelector((state: any) => state.businessOnboardingReducer?.businessId);
  const user = useSelector((state: any) => state.profileReducer?.data);
  const plansData = useSelector((state: any) => state.subscriptionReducer?.plans);

  console.log('plasData', plansData)
  console.log('user', user)

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          dispatch(getUsersBusinessExist(user.id) as any),
          dispatch(getSubscriptionPlans() as any)
        ]);
      } catch (err) {
        setError("Failed to load subscription plans or business info.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [dispatch, user]);

  // 🔁 Filter out the plan that matches user's current subscription
  const filteredPlans = plansData?.filter(
    (plan) => plan.id !== user?.subscription_plan_id
  );

  if (loading || stripeLoading) return <Loader />;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <section className="subscription-tiers">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="section-title">Choose Your Plan</h2>
          <p className="section-subtitle">Select the perfect plan for your needs</p>
        </div>
        <div className="row g-4">
          {filteredPlans?.length > 0 ? (
            filteredPlans.map((plan) => (
              <div key={plan.id} className="col-md-4">
                <div className={`tier-card ${plan.popular ? "popular" : ""}`}>
                  {plan.popular && <div className="popular-badge">Most Popular</div>}
                  <div className="tier-header">
                    <h3 className="tier-name">{plan.name}</h3>
                    <div className="tier-price">
                      <span className="price">{plan.price}</span>
                      <span className="period">/{plan.interval}</span>
                    </div>
                  </div>
                  <ul className="tier-features">
                    {plan.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>

                  <StripeCheckoutButton
                    planId={plan.id}
                    businessId={businessId || "default"}
                    userId={user?.id}
                    amount={plan.price}
                    successUrl={`http://localhost:3001/stripepaymentstatus/successfull`}
                    cancelUrl={`http://localhost:3001/stripepaymentstatus/unsuccessfull`}
                    setStripeLoading={setStripeLoading}
                  >
                    Upgrade to {plan.name}
                  </StripeCheckoutButton>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center">
              <p>No available plans to upgrade.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SubscriptionTiers;