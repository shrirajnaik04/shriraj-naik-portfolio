import { Arrow, Box, Boundary, Check, GuardRect, Note, Schematic } from './Frame'

const ID = 'sch-printsaathi'

/** Privacy by construction: everything stays on the phone; untrusted files open in an isolated process. */
export function PrintSaathiSchematic() {
  return (
    <Schematic
      id={ID}
      height={420}
      title="PrintSaathi: on-device, isolated parsing"
      desc="Files arrive from WhatsApp's share sheet. Everything runs on the phone, and the release build has no internet permission. The interface hands untrusted files to an isolated engine process with no permissions, then sends finished pages to Android's print service. The release manifest is checked on the built APK."
    >
      <Box x={10} y={12} w={190} h={52} label="WhatsApp share" />
      <Arrow id={ID} d="M105 64 V140" seq={0} />

      <Boundary id={ID} x={10} y={96} w={420} h={258} label="On the phone, no internet permission" labelAt="bottom" />
      <Box x={28} y={146} w={160} h={62} label="Interface" sub="Preact, pdf.js" />
      <GuardRect id={ID} x={226} y={140} w={192} h={74} />
      <Box x={232} y={146} w={180} h={62} label="Isolated engine" sub="Kotlin process" />
      <Note x={322} y={234} text="no permissions" anchor="middle" />
      <Arrow id={ID} d="M190 177 H228" both seq={1} />

      <Arrow id={ID} d="M108 208 V262" seq={2} />
      <Box x={28} y={268} w={384} h={52} label="Android print service" />

      <Check x={10} y={396} text="Manifest checked on the built APK" seq={3} />
    </Schematic>
  )
}
