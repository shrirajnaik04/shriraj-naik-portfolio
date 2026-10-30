import { Arrow, Boundary, Box, Check, Note, Schematic } from './Frame'

const ID = 'agent-loop'

/** The build loop behind every project: agents in parallel, inside guardrails, gated by a harness and a human. */
export function AgentLoopSchematic() {
  return (
    <Schematic
      id={ID}
      height={604}
      title="Agentic engineering: the build loop"
      desc="A plan I approve and a failing test come first. Inside guardrails (secret scanning, budgets, no production access), a code agent, a test agent and a review agent work in parallel. A harness of lint, types, tests, accessibility and budgets checks their work, and a failure sends it back to the agents. Work that passes goes to my review, and only then ships."
    >
      <Box x={120} y={10} w={200} h={48} label="Plan" sub="I approve it" />
      <Arrow id={ID} d="M220 58 V84" seq={0} />
      <Box x={120} y={88} w={200} h={48} label="Failing test" sub="written first" />
      <Arrow id={ID} d="M220 136 V166" seq={1} />

      <Boundary id={ID} x={10} y={172} w={420} h={236} label="Guardrails" />
      <Note x={30} y={214} text="secrets, budgets, no prod access" />
      <Box x={30} y={226} w={116} h={48} label="Code agent" />
      <Box x={162} y={226} w={116} h={48} label="Test agent" />
      <Box x={294} y={226} w={116} h={48} label="Review agent" />
      <Arrow id={ID} d="M88 274 V306" seq={2} />
      <Arrow id={ID} d="M220 274 V306" seq={2} />
      <Arrow id={ID} d="M352 274 V306" seq={2} />
      <Box x={30} y={310} w={380} h={52} label="Harness" sub="lint, types, tests, a11y, budgets" />
      <Arrow id={ID} d="M30 346 H18 V250 H30" seq={3} />
      <Note x={30} y={392} text="on failure: retry" />

      <Arrow id={ID} d="M220 362 V430" seq={4} />
      <Box x={120} y={434} w={200} h={48} label="Human review" sub="I sign off" />
      <Arrow id={ID} d="M220 482 V508" seq={5} />
      <Box x={120} y={512} w={200} h={40} label="Ship" />
      <Check x={10} y={590} text="Ships only when every check passes" seq={6} />
    </Schematic>
  )
}
