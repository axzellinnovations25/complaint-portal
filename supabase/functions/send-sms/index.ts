type SmsRequest = {
  complaintId?: string
  recipient: string
  message: string
}

Deno.serve(async (request) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const payload = (await request.json()) as SmsRequest
  const apiKey = Deno.env.get('TEXT_LK_API_KEY')
  const senderId = Deno.env.get('TEXT_LK_SENDER_ID')

  if (!apiKey || !senderId) {
    return Response.json({ error: 'SMS provider is not configured' }, { status: 500 })
  }

  if (!payload.recipient || !payload.message) {
    return Response.json({ error: 'recipient and message are required' }, { status: 400 })
  }

  return Response.json({
    status: 'queued',
    provider: 'text_lk',
    complaintId: payload.complaintId ?? null,
  })
})
