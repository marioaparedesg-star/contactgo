const PHONE_NUMBER_ID = '1237770472751989';

async function sendRenewalMessage(token, to, name, product) {
  let phone = to.replace(/[^0-9]/g, '');
  if (/^(809|829|849)/.test(phone) && phone.length === 10) phone = '1' + phone;

  const body = {
    messaging_product: 'whatsapp',
    to: phone,
    type: 'template',
    template: {
      name: 'renovacion_lentes',
      language: { code: 'es' },
      components: [{
        type: 'body',
        parameters: [
          { type: 'text', text: name },
          { type: 'text', text: product },
        ]
      }]
    }
  };

  console.log(`\n📤 Enviando a ${name} (${phone})...`);
  const res = await fetch(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (data.messages?.[0]?.id) {
    console.log(`   ✅ Enviado — ID: ${data.messages[0].id}`);
    return { success: true };
  } else {
    console.log(`   ❌ Error:`, JSON.stringify(data.error || data));
    return { success: false, error: data.error };
  }
}

async function main() {
  const token = process.env.WHATSAPP_TOKEN;
  if (!token) { console.error('❌ Falta WHATSAPP_TOKEN'); process.exit(1); }

  console.log('🕐 ContactGo — Mensajes de renovación');
  console.log(`   ${new Date().toISOString()}`);

  const customers = [
    { name: 'Christie', phone: '8098739955', product: 'tus lentes 1-DAY ACUVUE MOIST' },
    { name: 'Katherine', phone: '+393514358889', product: 'tus lentes AIR OPTIX COLORS' },
  ];

  for (const c of customers) {
    await sendRenewalMessage(token, c.phone, c.name, c.product);
    await new Promise(r => setTimeout(r, 2000));
  }
}

main().catch(console.error);
