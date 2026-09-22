import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { isValidTimeZone, normalizeTimeZone } from '@/lib/unlock-schedule'

export const runtime = 'nodejs'

type BuyerTimeZonePreference = {
  timeZone?: string | null
  timeZoneConfirmed?: boolean
}

const QUEST_SEQUENCE_SLUG = 'masculine-heart-quest'

const questSequenceSteps = [
  {
    step_index: 1,
    delay_hours: 0,
    subject: 'Your Masculine Heart Quest begins here',
    body_markdown: `Hi {{first_name|there}},

Welcome to Masculine Heart Quest.

You have stepped into a 21-day passage of strength, honesty, depth, and heart. This is not a course to consume quickly. It is a fire to sit beside, a trail to walk, a set of inner doors to open one at a time.

The landing page imagery is the right feeling: dusk light, wild ground, gold at the edge of shadow, the sense of entering something ancient and alive. Let that be your pace. Not rushed. Not performed. Entered.

Begin with Day 1. Let the question reach beneath the surface before you move on.

Warmly,
Paul`,
  },
  {
    step_index: 2,
    delay_hours: 48,
    subject: 'Keep the first fire lit',
    body_markdown: `Hi {{first_name|there}},

A few days in, the first doorway is simple: return.

Not perfectly. Not dramatically. Just return before the thread goes cold.

The mind may try to turn this into another thing to complete. The deeper invitation is different. Let the lesson, image, question, and practice work on you. Let them touch the places that usually stay armored or busy.

A masculine heart becomes trustworthy through return: returning to the body, returning to truth, returning after avoidance, returning after numbness, returning after old strategies try to take over.

Today, take one honest step inside the portal and one honest step in your actual life.

Warmly,
Paul`,
  },
  {
    step_index: 3,
    delay_hours: 48,
    subject: 'The body is part of the map',
    body_markdown: `Hi {{first_name|there}},

This quest will not fully open if it stays in the head.

The mind can understand courage, grief, devotion, anger, longing, and purpose. But the body tells the truth about where those forces actually live in you.

As you move through the next lessons, pause before and after each practice. Notice the chest, belly, throat, jaw, hands. Notice where you brace. Notice where warmth returns. Notice where the old shape of survival tries to become your identity again.

You are not trying to force a breakthrough. You are learning to listen with more of yourself.

The body is part of the map.

Warmly,
Paul`,
  },
  {
    step_index: 4,
    delay_hours: 48,
    subject: 'When resistance appears, stay close',
    body_markdown: `Hi {{first_name|there}},

At some point in a real quest, resistance appears.

It may come as distraction, sleepiness, cynicism, irritation, heaviness, or the sudden urge to make the work smaller than it is. This does not mean you are failing. Often it means you are near something true.

Do not attack the resistance. Do not obey it blindly either.

Get curious. What is it protecting? What would you feel if you did not turn away? What part of you learned to survive by staying hidden, hard, pleasing, performing, or alone?

The shadow gate does not open through force. It opens through steadiness, humility, and contact.

Stay close.

Warmly,
Paul`,
  },
  {
    step_index: 5,
    delay_hours: 48,
    subject: 'Strength that can stay open',
    body_markdown: `Hi {{first_name|there}},

One of the core movements of this quest is the reunion of strength and tenderness.

Many men learn to split them apart. Strength becomes hardness. Tenderness becomes something private, hidden, or unsafe. The heart gets protected, but also exiled.

Masculine Heart Quest asks for another possibility: grounded strength that can stay open.

This does not mean being soft in a vague or collapsed way. It means having enough center to feel, enough spine to tell the truth, enough humility to repair, enough courage to love without abandoning yourself.

As you continue, notice where your strength closes your heart, and where your heart needs more strength to become embodied.

Warmly,
Paul`,
  },
  {
    step_index: 6,
    delay_hours: 48,
    subject: 'Let the quest become action',
    body_markdown: `Hi {{first_name|there}},

A quest changes shape when insight becomes action.

Not grand action. Not a performance of transformation. One clean vow. One honest movement. One conversation, boundary, apology, request, creation, or practice that brings the inner work into the world.

The masculine heart is not proven by intensity. It is revealed through alignment.

Ask yourself today: what truth has become clear enough that it now asks something of me?

Then choose one grounded action that honors it.

Small is fine. Real is better than impressive.

Warmly,
Paul`,
  },
  {
    step_index: 7,
    delay_hours: 48,
    subject: 'Carry the thread forward',
    body_markdown: `Hi {{first_name|there}},

By now, Masculine Heart Quest may have opened a few doors: a feeling you had not made room for, a truth you could not unsee, a practice that steadied you, a question that keeps following you into daily life.

Let the thread continue.

The portal gives structure, but the real quest is in how you live afterward: how you meet conflict, how you listen to the body, how you tell the truth, how you let love and purpose move through you without abandoning your center.

Return to any lesson that still has heat. Repeat any practice that feels alive. Let the images, questions, and vows keep working on you.

This is not about finishing. It is about becoming more faithful to what is real.

Warmly,
Paul`,
  },
]


async function enrollBuyerInQuestEmailSequence(
  supabase: any,
  email: string,
  firstName?: string | null,
) {
  const db = supabase as any

  const sequence = await db.from('email_sequences').upsert(
    {
      slug: QUEST_SEQUENCE_SLUG,
      title: 'Masculine Heart Quest',
      description: 'Purchase-triggered 7-email onboarding and integration sequence for Masculine Heart Quest buyers.',
    },
    { onConflict: 'slug' },
  )
  if (sequence.error) throw sequence.error

  const steps = await db.from('email_sequence_steps').upsert(
    questSequenceSteps.map((step) => ({
      sequence_slug: QUEST_SEQUENCE_SLUG,
      ...step,
    })),
    { onConflict: 'sequence_slug,step_index' },
  )
  if (steps.error) throw steps.error

  const enrollment = await db.from('email_sequence_enrollments').upsert(
    {
      email,
      first_name: firstName || null,
      sequence_slug: QUEST_SEQUENCE_SLUG,
      current_step: 0,
      status: 'active',
      next_send_at: new Date().toISOString(),
    },
    { onConflict: 'email,sequence_slug' },
  )
  if (enrollment.error) throw enrollment.error
}

async function enrollBuyer(email: string, stripeCustomerId?: string | null, preference?: BuyerTimeZonePreference) {
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

  const normalizedTimeZone = normalizeTimeZone(preference?.timeZone)
  const validTimeZone = normalizedTimeZone && isValidTimeZone(normalizedTimeZone) ? normalizedTimeZone : null
  const timeZoneConfirmed = !!preference?.timeZoneConfirmed && !!validTimeZone

  const profile = await supabase.from('profiles').upsert(
    {
      id: userId,
      email: normalizedEmail,
      enrolled: true,
      full_name: '',
      ...(validTimeZone ? { time_zone: validTimeZone } : {}),
      time_zone_confirmed: timeZoneConfirmed,
    },
    { onConflict: 'id' },
  )
  if (profile.error) throw profile.error

  const firstProgress = await supabase.from('lesson_progress').upsert(
    {
      user_id: userId,
      lesson_id: 'heart-intro',
      status: 'in_progress',
      unlock_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,lesson_id' },
  )
  if (firstProgress.error) throw firstProgress.error

  await enrollBuyerInQuestEmailSequence(supabase, normalizedEmail)

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
    const timeZone = normalizeTimeZone(session.metadata?.time_zone)
    const timeZoneConfirmed = session.metadata?.time_zone_confirmed === 'true'
    if (!email) {
      return NextResponse.json({ ok: false, error: 'missing_buyer_email' }, { status: 400 })
    }

    try {
      await enrollBuyer(email, typeof session.customer === 'string' ? session.customer : null, { timeZone, timeZoneConfirmed })
      console.log('stripe_checkout_enrolled', {
        email: email.trim().toLowerCase(),
        customerId: typeof session.customer === 'string' ? session.customer : null,
        sessionId: session.id,
        timeZone: timeZone || null,
        timeZoneConfirmed,
      })
    } catch (err) {
      console.error(err)
      return NextResponse.json({ ok: false, error: 'enrollment_failed' }, { status: 500 })
    }
  }

  return NextResponse.json({ ok: true, received: true })
}
