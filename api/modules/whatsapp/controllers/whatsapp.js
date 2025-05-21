const whatsappManager = require('../manager/whatsapp');
const { logToFile } = require('../../../utils/logger');

// exports.incomingMessage = async (req, res) => {
//   try {
//     await whatsappManager.processIncoming(req.body);
//     res.status(200).send('Message received');
//   } catch (err) {
//     console.error('WhatsApp Webhook Error:', err);
//     res.status(500).send('Internal Server Error');
//   }
// };

exports.incomingMessage = async (req, res) => {
  logToFile('📥 WhatsApp Webhook Triggered');
  logToFile(`Payload: ${JSON.stringify(req.body)}`);

  try {
    await whatsappManager.processIncoming(req.body);
    res.status(200).send('Message received');
  } catch (err) {
    logToFile('❌ Webhook error: ' + (err.stack || err.message));
    res.status(500).send('Internal Server Error');
  }
};

exports.verifyWebhook = (req, res) => {
  const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || 'whataloop_verify';

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('👉 Mode:', mode);
  console.log('👉 Token:', token);
  console.log('👉 Expected Token:', VERIFY_TOKEN);
  console.log('👉 Challenge:', challenge);

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ WEBHOOK VERIFIED');
    return res.status(200).send(challenge);
  } else {
    console.warn('❌ Verification failed. Token mismatch or mode is wrong.');
    return res.sendStatus(403);
  }
};

// exports.receiveMessage = async (req, res) => {
//   try {
//     console.log('📩 Incoming WhatsApp message:');
//     console.dir(req.body, { depth: null });

//     await whatsappManager.handleIncomingPayload(req.body);

//     return res.sendStatus(200);
//   } catch (error) {
//     console.error('❌ Error handling incoming WhatsApp message:', error);
//     return res.sendStatus(500);
//   }
// };

exports.receiveMessage = async (req, res) => {
  try {
    logToFile('📩 Incoming WhatsApp message');
    logToFile(`Payload: ${JSON.stringify(req.body, null, 2)}`);

    await whatsappManager.handleIncomingPayload(req.body);

    return res.sendStatus(200);
  } catch (error) {
    logToFile(`❌ Error handling incoming WhatsApp message: ${error.stack || error.message}`);
    return res.sendStatus(500);
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { phone, message } = req.body;
    if (!phone || !message) {
      return res.status(400).json({ error: 'Phone and message are required.' });
    }

    const response = await whatsappManager.sendMessage(phone, message);
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    // console.error('Error sending WhatsApp message:', error);
    res.status(500).json({ error: 'Failed to send message.' });
  }
};