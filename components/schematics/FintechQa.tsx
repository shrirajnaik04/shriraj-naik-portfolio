import { Arrow, Box, Boundary, Check, Note, Schematic } from './Frame'

const ID = 'sch-fintech-qa'

const LAYERS: { label: string; tools: string }[] = [
  { label: 'UI and end-to-end', tools: 'Playwright, TestSigma' },
  { label: 'API', tools: 'Postman, Supertest' },
  { label: 'Data', tools: 'SQL and NoSQL checks' },
  { label: 'Performance', tools: 'JMeter' },
]

/** A generalized view of the coverage layers a release passes through (no product specifics). */
export function FintechQaSchematic() {
  return (
    <Schematic
      id={ID}
      height={526}
      title="FinTech QA automation: coverage layers"
      desc="A generalized view: a release candidate passes UI and end-to-end, API, data and performance checks before release. The suites run on Jenkins and Docker, and results are reported in OpenSearch."
    >
      <Box x={120} y={10} w={200} h={44} label="Release candidate" />
      <Arrow id={ID} d="M220 54 V84" seq={0} />

      <Boundary id={ID} x={10} y={90} w={420} h={262} label="Release gate" />
      {LAYERS.map((layer, i) => {
        const y = 128 + i * 54
        return (
          <g key={layer.label}>
            <rect className="sch-box" x={30} y={y} width={380} height={44} rx={4} />
            <text className="sch-label" x={46} y={y + 27.5}>
              {layer.label}
            </text>
            <text className="sch-mono" x={394} y={y + 27} textAnchor="end">
              {layer.tools}
            </text>
          </g>
        )
      })}

      <Arrow id={ID} d="M220 352 V382" seq={2} />
      <Box x={120} y={386} w={200} h={40} label="Release" />
      <Note x={220} y={456} text="suites run on Jenkins, Docker" anchor="middle" />
      <Note x={220} y={478} text="results reported in OpenSearch" anchor="middle" />
      <Check x={10} y={514} text="Defects found earlier, across releases" seq={3} />
    </Schematic>
  )
}
