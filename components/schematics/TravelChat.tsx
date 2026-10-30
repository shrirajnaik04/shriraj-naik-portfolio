import { Arrow, Box, Check, Note, Schematic } from './Frame'

const ID = 'travel-chat'

/** The travel chat assistant: the model answers only from the stays the search found. */
export function TravelChatSchematic() {
  return (
    <Schematic
      id={ID}
      height={404}
      title="AI travel chat assistant: search, answer, fallback"
      desc="A guest asks the chat widget, embedded through Shadow DOM, for a stay. Vector search finds matching listings, and only those stays are passed to Gemini 2.0 Flash, so it can't recommend one that doesn't exist. The answer and the stay cards stream back to the widget. When Gemini runs out of quota, Groq and then xAI answer instead. About 158 scripted checks cover it, 111 of them against the real support service."
    >
      <Note x={10} y={22} text="A guest asks for a stay" />
      <Box x={10} y={34} w={180} h={60} label="Chat widget" sub="Shadow DOM" />
      <Arrow id={ID} d="M190 64 H246" seq={0} />
      <Box x={250} y={34} w={180} h={60} label="Search" sub="vector search" />

      <Arrow id={ID} d="M340 94 V154" guard />
      <text className="sch-guard-label" x={330} y={128} textAnchor="end">
        only the stays found
      </text>
      <Box x={250} y={158} w={180} h={60} label="Gemini 2.0 Flash" sub="streams answers" />
      <Arrow id={ID} d="M250 188 H194" seq={2} />
      <Box x={10} y={158} w={180} h={60} label="Answer and cards" sub="in the widget" />

      <Arrow id={ID} d="M340 218 V276" guard />
      <text className="sch-guard-label" x={330} y={252} textAnchor="end">
        on quota error
      </text>
      <Box x={250} y={280} w={180} h={48} label="Groq, then xAI" quiet />

      <Check x={10} y={360} text="158 scripted checks" seq={3} />
      <Check x={10} y={392} text="111 run on the real support service" seq={4} />
    </Schematic>
  )
}
