const onboardingService = require('../services/onboarding');

exports.onboardNewUser = async (businessName, whatsappNumber,business_id) => {
  const businessProfile = await onboardingService.createBusinessProfile(businessName, whatsappNumber, business_id);
  const webhookUrl = await onboardingService.setupWebhook();

  return { businessProfile, webhookUrl };
};

exports.triggerWabaOnboarding = async ({ businessId, businessName, whatsappNumber }) => {
  return onboardingService.handleWabaOnboarding({ businessId, businessName, whatsappNumber });
};