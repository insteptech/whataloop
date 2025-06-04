const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


exports.analyzeMessage = async (text) => {
  try {
    const prompt = `
You are an expert CRM assistant. Given an incoming WhatsApp message from a potential customer, classify the LEAD TYPE as one of:

- high_quality (ready to buy, serious interest, wants pricing or to order)
- follow_up (asking for more info, wants to be contacted later, requests call/callback)
- interesting_customer (describes needs, interested but not yet buying, asks relevant questions)
- not_interested (says no, not interested, irrelevant)
- unclear (spam, not enough info, cannot judge)

Reply with JUST the label: high_quality, follow_up, interesting_customer, not_interested, or unclear.

---
"${text}"
---
Label:`;

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 10,
      temperature: 0,
    });

    return chatCompletion.choices[0].message.content.trim();
  } catch (e) {
    console.error('[OpenAI NLP ERROR]', e.message);
    return "unclear";
  }
};