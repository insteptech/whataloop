const onboardingManager = require('./../manager/onboarding');

exports.onboardNewUser = async (req, res) => {
    try {
        const { businessName, whatsappNumber } = req.body;

        console.log("whatsApp number:", req.body)

        if (!businessName || !whatsappNumber) {
            return res.status(400).json({ error: "Business Name and WhatsApp Number are required" });
        }

        // Call the manager to handle the onboarding process
        const result = await onboardingManager.onboardNewUser(businessName, whatsappNumber);

        res.status(200).json({
            success: true,
            message: "User onboarded successfully",
            result
        });
    } catch (err) {
        console.error('WhatsApp Onboarding Error:', err);
        res.status(500).json({ error: "Something went wrong during the onboarding process" });
    }
};
