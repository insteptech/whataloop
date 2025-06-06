const onboardingManager = require('./../manager/onboarding');
const { sanitizePhoneNumber } = require('../../../utils/helper');

exports.onboardNewUser = async (req, res) => {
    try {
        const {
            businessName,
            whatsappNumber,
            business_id
        } = req.body;

        console.log("whatsApp number:", req.body);

        if (!businessName || !whatsappNumber || !business_id) {
            return res.status(400).json({
                error: "Business Name and WhatsApp Number are required"
            });
        }

        // Call the manager to handle the onboarding process
        const result = await onboardingManager.onboardNewUser(businessName, sanitizePhoneNumber(whatsappNumber), business_id);

        return res.status(200).json({
            success: true,
            message: "User onboarded successfully",
            result
        });

    } catch (err) {
        if (err.message === 'WhatsApp number already onboarded.') {
            return res.status(409).json({
                success: false,
                message: err.message,
            });
        }

        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                success: false,
                message: 'WhatsApp number already exists. Please try a different number.',
            });
        }
        if (err.message?.includes('Failed to associate WhatsApp number')) {
            return res.status(400).json({
                success: false,
                message: err.message,

            });
        }

        if (err.message === 'WhatsApp number already registered') {
            return res.status(409).json({
                success: false,
                message: err.message,
            });

        }

        console.error('WhatsApp Onboarding Error:', err);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        });
    }
};

exports.triggerWabaOnboarding = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { businessName, whatsappNumber } = req.body;
    const onboarding = await onboardingManager.triggerWabaOnboarding({
      businessId,
      businessName,
      whatsappNumber
    });
    res.json({ success: true, onboarding });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};