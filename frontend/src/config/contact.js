export const OMAR_WHATSAPP = '201507044651';

export const buildWhatsAppUrl = (message) =>
    `https://wa.me/${OMAR_WHATSAPP}?text=${encodeURIComponent(message)}`;

export const buildLeadWhatsAppMessage = ({ name, phone, budget, requirements, summary }) => {
    return `Hi Omar,

📋 *New Project Inquiry*
👤 Name: ${name || 'Not provided'}
📱 Phone: ${phone || 'Not provided'}
💰 Budget: ${budget || 'Not specified'}

📝 *Project Summary:*
${summary || requirements || 'Not specified'}

🔧 *Requirements:*
${requirements || 'Not specified'}

— Sent via AI Assistant`;
};
