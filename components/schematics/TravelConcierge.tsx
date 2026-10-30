import { Arrow, Box, Check, Note, Schematic } from './Frame'

const ID = 'sch-travel-concierge'

/** Two lanes: the AI concierge (with its fallback path as the guardrail) and real-time messaging. */
export function TravelConciergeSchematic() {
  return (
    <Schematic
      id={ID}
      height={440}
      title="AI concierge and messaging: how the pieces connect"
      desc="The chat widget, embedded through Shadow DOM, streams answers built from vector search and Gemini 2.0 Flash; if a model fails, the request falls back to Groq, then xAI. Separately, hosts and guests message in real time through an SDK built on Socket.IO, Redis and MongoDB. A Jest suite covers the SDK, and Detox and Maestro gate the mobile app."
    >
      <Note x={10} y={22} text="AI concierge" />
      <Box x={10} y={34} w={128} h={60} label="Chat widget" sub="Shadow DOM" />
      <Arrow id={ID} d="M138 64 H152" />
      <Box x={156} y={34} w={128} h={60} label="Retrieval" sub="vector search" />
      <Arrow id={ID} d="M284 64 H298" />
      <Box x={302} y={34} w={128} h={60} label="Gemini" sub="2.0 Flash" />

      <Arrow id={ID} d="M366 94 V140" guard />
      <text className="sch-guard-label" x={356} y={124} textAnchor="end">
        on failure
      </text>
      <Box x={262} y={146} w={168} h={48} label="Groq, then xAI" quiet />

      <Note x={10} y={244} text="Real-time messaging" />
      <Box x={10} y={258} w={84} h={50} label="Host" />
      <Arrow id={ID} d="M94 283 H130" both />
      <Box x={134} y={252} w={172} h={62} label="Messaging SDK" sub="Socket.IO, Redis" />
      <Arrow id={ID} d="M306 283 H342" both />
      <Box x={346} y={258} w={84} h={50} label="Guest" />

      <Check x={10} y={372} text="Jest suite on the SDK" />
      <Check x={10} y={404} text="Detox and Maestro gate the mobile app" />
    </Schematic>
  )
}
