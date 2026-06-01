-- ─── Admin Role System ──────────────────────────────────────────────────────

-- Add admin_role to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS admin_role text
  CHECK (admin_role IN ('super_admin', 'producer_admin', 'content_admin', 'operations_admin'));

-- ─── Admin Assignments ───────────────────────────────────────────────────────
-- Links a producer/content admin to their assigned subscribers

CREATE TABLE IF NOT EXISTS admin_assignments (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id       uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subscriber_id  uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  pillar         text NOT NULL CHECK (pillar IN ('soundlab', 'content')),
  assigned_by    uuid REFERENCES profiles(id),
  assigned_at    timestamptz NOT NULL DEFAULT now(),
  notes          text,
  UNIQUE (admin_id, subscriber_id, pillar)
);

-- ─── Audit Logs ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS audit_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    uuid REFERENCES profiles(id) ON DELETE SET NULL,
  admin_email text,
  action      text NOT NULL,
  target_type text,
  target_id   uuid,
  details     jsonb NOT NULL DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_id   ON audit_logs (admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_assignments_admin_id      ON admin_assignments (admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_assignments_subscriber_id ON admin_assignments (subscriber_id);

-- ─── Row Level Security ───────────────────────────────────────────────────────

ALTER TABLE admin_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs        ENABLE ROW LEVEL SECURITY;

-- Admin assignments: any admin can view; super_admin can insert/update/delete
CREATE POLICY "Admins can view assignments" ON admin_assignments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Super admins manage assignments" ON admin_assignments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND admin_role = 'super_admin')
  );

-- Audit logs: super_admin and operations_admin can read
CREATE POLICY "Privileged admins read audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND admin_role IN ('super_admin', 'operations_admin')
    )
  );

CREATE POLICY "Admins insert audit logs" ON audit_logs
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ─── Demo Admin Profiles ─────────────────────────────────────────────────────
-- Auth users are created by the seed script (scripts/seed-admin-users.ts).
-- These inserts set up the profile rows that the seed script expects.
-- UUIDs match what the seed script assigns.

-- Super Admin: admin@infntystudio.com
INSERT INTO profiles (id, role, admin_role, full_name, email)
VALUES (
  '10000000-0000-0000-0000-000000000001',
  'admin',
  'super_admin',
  'Super Admin',
  'admin@infntystudio.com'
)
ON CONFLICT (id) DO UPDATE
  SET role = 'admin', admin_role = 'super_admin', full_name = 'Super Admin';

-- Sound Lab Producer Admin: producer@infntystudio.com
INSERT INTO profiles (id, role, admin_role, full_name, email)
VALUES (
  '10000000-0000-0000-0000-000000000002',
  'admin',
  'producer_admin',
  'Producer Admin',
  'producer@infntystudio.com'
)
ON CONFLICT (id) DO UPDATE
  SET role = 'admin', admin_role = 'producer_admin', full_name = 'Producer Admin';

-- Content Engine Admin: content@infntystudio.com
INSERT INTO profiles (id, role, admin_role, full_name, email)
VALUES (
  '10000000-0000-0000-0000-000000000003',
  'admin',
  'content_admin',
  'Content Admin',
  'content@infntystudio.com'
)
ON CONFLICT (id) DO UPDATE
  SET role = 'admin', admin_role = 'content_admin', full_name = 'Content Admin';

-- Operations Admin: operations@infntystudio.com
INSERT INTO profiles (id, role, admin_role, full_name, email)
VALUES (
  '10000000-0000-0000-0000-000000000004',
  'admin',
  'operations_admin',
  'Operations Admin',
  'operations@infntystudio.com'
)
ON CONFLICT (id) DO UPDATE
  SET role = 'admin', admin_role = 'operations_admin', full_name = 'Operations Admin';

-- ─── Demo subscriber profiles for pillar assignment examples ─────────────────

-- Rehearsal subscriber
INSERT INTO profiles (id, role, full_name, email)
VALUES (
  '20000000-0000-0000-0000-000000000001',
  'customer',
  'Alex de Vries',
  'rehearsal@infntystudio.com'
)
ON CONFLICT (id) DO UPDATE SET full_name = 'Alex de Vries';

-- Sound Lab subscriber (assigned to producer admin)
INSERT INTO profiles (id, role, full_name, email)
VALUES (
  '20000000-0000-0000-0000-000000000002',
  'customer',
  'DJ Monique',
  'soundlab@infntystudio.com'
)
ON CONFLICT (id) DO UPDATE SET full_name = 'DJ Monique';

-- Content subscriber (assigned to content admin)
INSERT INTO profiles (id, role, full_name, email)
VALUES (
  '20000000-0000-0000-0000-000000000003',
  'customer',
  'Sarah Bakker',
  'sarah@demo.infntystudio.com'
)
ON CONFLICT (id) DO NOTHING;

-- ─── Demo assignments ─────────────────────────────────────────────────────────

-- Assign soundlab subscriber to producer admin
INSERT INTO admin_assignments (admin_id, subscriber_id, pillar, notes)
VALUES (
  '10000000-0000-0000-0000-000000000002',
  '20000000-0000-0000-0000-000000000002',
  'soundlab',
  'Primary producer for DJ Monique'
)
ON CONFLICT (admin_id, subscriber_id, pillar) DO NOTHING;

-- Assign content subscriber to content admin
INSERT INTO admin_assignments (admin_id, subscriber_id, pillar, notes)
VALUES (
  '10000000-0000-0000-0000-000000000003',
  '20000000-0000-0000-0000-000000000003',
  'content',
  'Primary content manager for Sarah Bakker'
)
ON CONFLICT (admin_id, subscriber_id, pillar) DO NOTHING;

-- ─── Initial audit log entries ────────────────────────────────────────────────

INSERT INTO audit_logs (admin_id, admin_email, action, target_type, details)
VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    'admin@infntystudio.com',
    'system_init',
    'system',
    '{"note": "Admin role system initialized"}'
  ),
  (
    '10000000-0000-0000-0000-000000000001',
    'admin@infntystudio.com',
    'assignment_created',
    'admin_assignment',
    '{"admin": "producer@infntystudio.com", "subscriber": "soundlab@infntystudio.com", "pillar": "soundlab"}'
  ),
  (
    '10000000-0000-0000-0000-000000000001',
    'admin@infntystudio.com',
    'assignment_created',
    'admin_assignment',
    '{"admin": "content@infntystudio.com", "subscriber": "sarah@demo.infntystudio.com", "pillar": "content"}'
  );
