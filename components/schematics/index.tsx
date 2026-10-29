import type { SchematicKind } from '@/content/types'
import { FintechQaSchematic } from './FintechQa'
import { GymDaddySchematic } from './GymDaddy'
import { PrintSaathiSchematic } from './PrintSaathi'
import { TravelConciergeSchematic } from './TravelConcierge'

const SCHEMATICS: Record<SchematicKind, () => React.JSX.Element> = {
  'gym-daddy': GymDaddySchematic,
  'fintech-qa': FintechQaSchematic,
  printsaathi: PrintSaathiSchematic,
  'travel-concierge': TravelConciergeSchematic,
}

export function SchematicFor({ kind }: { kind: SchematicKind }) {
  const Figure = SCHEMATICS[kind]
  return <Figure />
}
