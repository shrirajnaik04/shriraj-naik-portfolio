import { Arrow, Box, Note, Schematic } from './Frame'

const ID = 'rag-chatbot'

/**
 * The RAG chatbot builder: uploads become a business's vectors; chats answer from them. The only
 * guardrail drawn is the model fallback. The per-business search is drawn as a plain connector,
 * because collections are keyed by the business's name, which isn't guaranteed unique.
 */
export function RagChatbotSchematic() {
  return (
    <Schematic
      id={ID}
      height={342}
      title="RAG chatbot builder: upload, search, answer"
      desc="A business uploads PDF or CSV files. They are split into chunks and stored as vectors in a Qdrant collection named for that business. A visitor's question comes from the embedded chat widget with a signed token for one business, and the search reads that business's documents. Gemini answers from the passages found, and Together AI answers instead when Gemini fails."
    >
      <Note x={10} y={22} text="A business uploads documents" />
      <Box x={10} y={34} w={180} h={60} label="Upload" sub="PDF or CSV" />
      <Arrow id={ID} d="M190 64 H246" seq={0} />
      <Box x={250} y={34} w={180} h={60} label="Qdrant" sub="its own vectors" />

      <Arrow id={ID} d="M340 94 V154" seq={1} />
      <Note x={330} y={128} text="its passages" anchor="end" />
      <Box x={250} y={158} w={180} h={60} label="Gemini" sub="answers" />
      <Arrow id={ID} d="M194 188 H250" both seq={2} />
      <Box x={10} y={158} w={180} h={60} label="Chat widget" sub="signed token" />

      <Arrow id={ID} d="M340 218 V276" guard />
      <text className="sch-guard-label" x={330} y={252} textAnchor="end">
        on error
      </text>
      <Box x={250} y={280} w={180} h={48} label="Together AI" quiet />
    </Schematic>
  )
}
