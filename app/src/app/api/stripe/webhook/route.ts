import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

async function enrollBuyer(email: string, stripeCustomerId?: string | null) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) throw new Error('supabase_not_configured')

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const normalizedEmail = email.trim().toLowerCase()
  const existing = await supabase.from('profiles').select('id').eq('email', normalizedEmail).maybeSingle()

  let userId = existing.data?.id
  if (!userId) {
    const created = await supabase.auth.admin.createUser({
      email: normalizedEmail,
      email_confirm: true,
      user_metadata: { source: 'stripe_checkout' },
    })
    if (created.error) throw created.error
    userId = created.data.user?.id
  }

  if (!userId) throw new Error('user_not_created')

  const profile = await supabase.from('profiles').upsert(
    {
      id: userId,
      email: normalizedEmail,
      enrolled: true,
      full_name: '',
    },
    { onConflict: 'id' },
  )
  if (profile.error) throw profile.error

  const firstProgress = await supabase.from('lesson_progress').upsert(
    {
      user_id: userId,
      lesson_id: 'day-1',
      status: 'in_progress',
      unlock_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,lesson_id' },
  )
  if (firstProgress.error) throw firstProgress.error

  return { userId, email: normalizedEmail, stripeCustomerId }
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  const stripeKey = process.env.STRIPE_SECRET_KEY

  if (!secret || !stripeKey) {
    return NextResponse.json({ ok: false, error: 'stripe_webhook_not_configured' }, { status: 400 })
  }

  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(stripeKey)
  const signature = request.headers.get('stripe-signature')
  const body = await request.text()

  if (!signature) {
    return NextResponse.json({ ok: false, error: 'missing_signature' }, { status: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ ok: false, error: 'invalid_signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const email = session.customer_details?.email || session.customer_email || session.metadata?.buyer_email
    if (!email) {
      return NextResponse.json({ ok: false, error: 'missing_buyer_email' }, { status: 400 })
    }

    try {
      await enrollBuyer(email, typeof session.customer === 'string' ? session.customer : null)
    } catch (err) {
      console.error(err)
      return NextResponse.json({ ok: false, error: 'enrollment_failed' }, { status: 500 })
    }
  }

  return NextResponse.json({ ok: true, received: true })
}
