const axios = require('axios'); // or use your WhatsApp API SDK

async function sendOtpToWhatsapp(phoneNumber, otp) {
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    if (!phoneNumberId) throw new Error("WhatsApp Phone Number ID is not configured.");

    // Build data payload exactly like your Postman payload:
    const data = {
        messaging_product: "whatsapp",
        to: phoneNumber,
        type: "template",
        template: {
            name: "business_verify_otp",
            language: { code: "en_US" },
            components: [
                {
                    type: "body",
                    parameters: [
                        { type: "text", text: String(otp) },         // OTP param
                        { type: "text", text: String(phoneNumber) }  // Phone param
                    ]
                },
                {
                    type: "button",
                    sub_type: "url",
                    index: "0",
                    parameters: [
                        { type: "text", text: "test" }       // Replace "test" with dynamic value if needed
                    ]
                }
            ]
        }
    };

    const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;
    const headers = {
        'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
    };

    try {
        const response = await axios.post(url, data, { headers });
        return response.data;
    } catch (err) {
        console.error("WhatsApp OTP Send Error:", err.response?.data || err.message);
        throw err;
    }
}

module.exports = sendOtpToWhatsapp;
