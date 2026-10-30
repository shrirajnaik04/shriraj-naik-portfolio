import { Arrow, Box, Check, Note, Schematic } from './Frame'

const ID = 'travel-messaging'

/** Guest and host messaging: contact details are blocked before anything is saved, and saves are atomic. */
export function TravelMessagingSchematic() {
  return (
    <Schematic
      id={ID}
      height={404}
      title="Guest and host messaging: block, save, deliver"
      desc="A guest's message goes over Socket.IO to the message service, which checks sign-in and rate limits. A contact-detail blocker stops phone numbers, emails, links and payment IDs, and a blocked message is never saved. An allowed message is saved with the unread counts in one MongoDB transaction, then delivered to the host's inbox, and Redis caches the counts. About 115 tests run against a real MongoDB replica set, and a 226-case corpus covers the blocker."
    >
      <Note x={10} y={22} text="A guest messages a host" />
      <Box x={10} y={34} w={180} h={60} label="Guest app" sub="Socket.IO" />
      <Arrow id={ID} d="M190 64 H246" seq={0} />
      <Box x={250} y={34} w={180} h={60} label="Message service" sub="sign-in, limits" />

      <Arrow id={ID} d="M340 94 V154" guard />
      <text className="sch-guard-label" x={330} y={128} textAnchor="end">
        no contact details
      </text>
      <Box x={250} y={158} w={180} h={60} label="MongoDB" sub="one transaction" />
      <Arrow id={ID} d="M250 188 H194" seq={2} />
      <Box x={10} y={158} w={180} h={60} label="Host inbox" sub="after the save" />

      <Arrow id={ID} d="M340 218 V276" seq={3} />
      <Note x={330} y={252} text="unread counts" anchor="end" />
      <Box x={250} y={280} w={180} h={48} label="Redis cache" quiet />

      <Check x={10} y={360} text="About 115 tests on a real replica set" seq={4} />
      <Check x={10} y={392} text="226-case contact-blocker corpus" seq={5} />
    </Schematic>
  )
}
