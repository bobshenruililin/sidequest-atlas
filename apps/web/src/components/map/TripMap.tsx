import type { Trip } from "@sidequest-atlas/domain";

const routePoints = [
  { city: "Oslo", countryCode: "NO", x: 18, y: 58 },
  { city: "Stockholm", countryCode: "SE", x: 51, y: 48 },
  { city: "Helsinki", countryCode: "FI", x: 82, y: 38 },
];

export function TripMap({ trip }: { trip: Trip }) {
  return <StaticMapFallback trip={trip} />;
}

function StaticMapFallback({ trip }: { trip: Trip }) {
  return (
    <section className="notebook-card rounded-[2rem] p-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row">
        <div>
          <p className="eyebrow">route map</p>
          <h2 className="mt-2 font-serif text-3xl">Oslo to Stockholm to Helsinki</h2>
        </div>
        <p className="max-w-sm text-sm leading-6 text-muted">
          Static SVG fallback, generated without map tokens or runtime services.
        </p>
      </div>
      <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-rule bg-paper">
        <svg
          viewBox="0 0 900 420"
          role="img"
          aria-label={`${trip.title} route map`}
          className="h-auto w-full"
        >
          <defs>
            <pattern id="map-grid" width="42" height="42" patternUnits="userSpaceOnUse">
              <path
                d="M 42 0 L 0 0 0 42"
                fill="none"
                stroke="var(--rule)"
                strokeOpacity="0.42"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="900" height="420" fill="var(--paper-elevated)" />
          <rect width="900" height="420" fill="url(#map-grid)" />
          <path
            d="M 80 330 C 180 210, 315 135, 455 205 S 705 250, 835 115"
            fill="none"
            stroke="var(--rule)"
            strokeWidth="18"
            strokeLinecap="round"
            opacity="0.45"
          />
          <path
            d="M 162 244 C 265 170, 365 135, 459 201 S 638 190, 738 159"
            fill="none"
            stroke="var(--ink)"
            strokeDasharray="6 12"
            strokeLinecap="round"
            strokeWidth="3"
          />
          <path
            d="M 459 201 C 548 156, 640 152, 738 159"
            fill="none"
            stroke="var(--accent-fi)"
            strokeLinecap="round"
            strokeWidth="5"
          />
          <path
            d="M 162 244 C 265 170, 365 135, 459 201"
            fill="none"
            stroke="var(--accent-se)"
            strokeLinecap="round"
            strokeWidth="5"
          />
          {routePoints.map((point, index) => (
            <g
              key={point.city}
              transform={`translate(${point.x * 9} ${point.y * 4.2})`}
            >
              <circle r="20" fill="var(--paper)" stroke={accent(point.countryCode)} strokeWidth="5" />
              <text
                y="5"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="16"
                fontWeight="700"
              >
                {index + 1}
              </text>
              <text
                x={index === 2 ? -8 : 8}
                y="-30"
                textAnchor={index === 2 ? "end" : "start"}
                fill="var(--ink)"
                fontSize="22"
                fontFamily="var(--font-source-serif)"
              >
                {point.city}
              </text>
            </g>
          ))}
          <text x="40" y="380" fill="var(--muted)" fontSize="15">
            Rail and ferry windows are planning objects until reverified.
          </text>
        </svg>
      </div>
    </section>
  );
}

function accent(countryCode: string): string {
  switch (countryCode) {
    case "NO":
      return "var(--accent-no)";
    case "SE":
      return "var(--accent-se)";
    case "FI":
      return "var(--accent-fi)";
    default:
      return "var(--muted)";
  }
}
