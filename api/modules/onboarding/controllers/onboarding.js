const onboardingManager = require('./../manager/onboarding');
const { sanitizePhoneNumber } = require('../../../utils/helper');

exports.onboardNewUser = async (req, res) => {
    try {
        const {
            businessName,
            whatsappNumber
        } = req.body;

        console.log("whatsApp number:", req.body);

        if (!businessName || !whatsappNumber) {
            return res.status(400).json({
                error: "Business Name and WhatsApp Number are required"
            });
        }

        // Call the manager to handle the onboarding process
        const result = await onboardingManager.onboardNewUser(businessName, sanitizePhoneNumber(whatsappNumber));

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