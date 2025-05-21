const onboardingService = require('../services/onboarding');

exports.onboardNewUser = async (businessName, whatsappNumber) => {
  const businessProfile = await onboardingService.createBusinessProfile(businessName, whatsappNumber);
  const webhookUrl = await onboardingService.setupWebhook();

  return { businessProfile, webhookUrl };
};