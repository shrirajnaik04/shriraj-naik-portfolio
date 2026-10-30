import { Arrow, Box, Boundary, Check, GuardLine, Note, Schematic } from './Frame'

const ID = 'sch-gym-daddy'

/** Tenant isolation: the guardrail lives in the database, not only in application code. */
export function GymDaddySchematic() {
  return (
    <Schematic
      id={ID}
      height={420}
      title="Gym Daddy: tenant isolation"
      desc="Web, Android and desktop clients share one Next.js application. Each request takes the gym ID from the session. Inside Postgres, row-level security keeps each gym's rows apart, and RLS and RBAC tests pin that boundary."
    >
      <Box x={10} y={14} w={128} h={56} label="Web" sub="Next.js" />
      <Box x={156} y={14} w={128} h={56} label="Android" sub="Capacitor" />
      <Box x={302} y={14} w={128} h={56} label="Desktop" sub="Tauri" />

      <Arrow id={ID} d="M74 70 V104" seq={0} />
      <Arrow id={ID} d="M220 70 V104" seq={0} />
      <Arrow id={ID} d="M366 70 V104" seq={0} />

      <Box x={10} y={110} w={420} h={50} label="One Next.js application" />

      <Arrow id={ID} d="M220 160 V218" seq={1} />
      <Note x={232} y={194} text="gym ID from the session" />

      <Boundary id={ID} x={10} y={226} w={420} h={142} label="Row-level security" />
      <Box x={32} y={262} w={176} h={56} label="Gym A rows" quiet />
      <Box x={232} y={262} w={176} h={56} label="Gym B rows" quiet />
      <GuardLine id={ID} x1={220} y1={254} x2={220} y2={330} />
      <Note x={220} y={352} text="Supabase Postgres" anchor="middle" />

      <Check x={10} y={404} text="RLS and RBAC tests pin the boundary" seq={2} />
    </Schematic>
  )
}
