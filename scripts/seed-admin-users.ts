/**
 * Seed admin users via Supabase Admin API.
 * Run with: npx tsx scripts/seed-admin-users.ts
 *
 * Requires env vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
 */

import 'dotenv/config'

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '')
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required')
  process.exit(1)
}

interface AdminUser {
  id: string
  email: string
  password: string
  full_name: string
  role: string
  admin_role: string
}

const ADMIN_USERS: AdminUser[] = [
  {
    id: '10000000-0000-0000-0000-000000000001',
    email: 'admin@infntystudio.com',
    password: 'Admin123!',
    full_name: 'Super Admin',
    role: 'admin',
    admin_role: 'super_admin',
  },
  {
    id: '10000000-0000-0000-0000-000000000002',
    email: 'producer@infntystudio.com',
    password: 'Producer123!',
    full_name: 'Producer Admin',
    role: 'admin',
    admin_role: 'producer_admin',
  },
  {
    id: '10000000-0000-0000-0000-000000000003',
    email: 'content@infntystudio.com',
    password: 'Content123!',
    full_name: 'Content Admin',
    role: 'admin',
    admin_role: 'content_admin',
  },
  {
    id: '10000000-0000-0000-0000-000000000004',
    email: 'operations@infntystudio.com',
    password: 'Operations123!',
    full_name: 'Operations Admin',
    role: 'admin',
    admin_role: 'operations_admin',
  },
]

async function headers(json = true) {
  const h: Record<string, string> = {
    apikey: SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
  }
  if (json) h['Content-Type'] = 'application/json'
  return h
}

async function upsertAuthUser(u: AdminUser): Promise<string> {
  // Try creating with specific UUID
  const createRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: 'POST',
    headers: await headers(),
    body: JSON.stringify({
      id: u.id,
      email: u.email,
      password: u.password,
      user_metadata: { full_name: u.full_name },
      email_confirm: true,
    }),
  })

  if (createRes.ok) {
    const data = await createRes.json()
    console.log(`  ✓ Created auth user: ${u.email} (id: ${data.id})`)
    return data.id
  }

  if (createRes.status === 422) {
    // User exists — update password
    const updateRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${u.id}`, {
      method: 'PUT',
      headers: await headers(),
      body: JSON.stringify({ password: u.password }),
    })
    if (updateRes.ok) {
      console.log(`  ↺ Updated existing auth user: ${u.email}`)
    } else {
      console.warn(`  ⚠ Could not update password for ${u.email}: ${updateRes.status}`)
    }
    return u.id
  }

  const err = await createRes.json().catch(() => ({})) as any
  throw new Error(`Failed to create ${u.email}: ${err.msg ?? err.message ?? createRes.status}`)
}

async function upsertProfile(u: AdminUser, authId: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${authId}`, {
    method: 'PATCH',
    headers: {
      ...(await headers()),
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      role: u.role,
      admin_role: u.admin_role,
      full_name: u.full_name,
      email: u.email,
    }),
  })

  if (!res.ok) {
    // Try insert (profile might not exist yet if trigger didn't run)
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: 'POST',
      headers: {
        ...(await headers()),
        Prefer: 'return=minimal,resolution=merge-duplicates',
      },
      body: JSON.stringify({
        id: authId,
        role: u.role,
        admin_role: u.admin_role,
        full_name: u.full_name,
        email: u.email,
      }),
    })
    if (!insertRes.ok) {
      const text = await insertRes.text()
      console.warn(`  ⚠ Profile upsert failed for ${u.email}: ${text}`)
      return
    }
  }
  console.log(`  ✓ Profile set: role=${u.role}, admin_role=${u.admin_role}`)
}

async function main() {
  console.log('\n🔧 Seeding INFNTY Studio admin users...\n')

  for (const u of ADMIN_USERS) {
    console.log(`\n→ ${u.email} (${u.admin_role})`)
    try {
      const authId = await upsertAuthUser(u)
      await upsertProfile(u, authId)
      console.log(`  ✅ Done — login: ${u.email} / ${u.password}`)
    } catch (err) {
      console.error(`  ❌ Error:`, err)
    }
  }

  console.log('\n✅ Seed complete!\n')
  console.log('Admin login credentials:')
  console.log('─────────────────────────────────────────')
  for (const u of ADMIN_USERS) {
    console.log(`${u.admin_role.padEnd(20)} ${u.email} / ${u.password}`)
  }
  console.log('─────────────────────────────────────────\n')
}

main().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})
