import { usePokedex } from "../app/PokedexContext"
import { artworkUrl } from "../data/pokemon"
import { EmptyState, PageIntro } from "../components/UI"

const formatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})

export default function HistoryPage() {
  const { history, isStoreLoading } = usePokedex()
  const sorted = [...history].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  )
  return (
    <div className="page content-section history-page">
      <PageIntro
        eyebrow="Trainer log"
        title="Pokémon History"
        description="Every catch and farewell, remembered."
        side={
          !isStoreLoading && (
            <span className="result-count">{history.length} activities</span>
          )
        }
      />
      {isStoreLoading && (
        <div className="history-list">
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="history-row history-skeleton" key={index}>
              <div className="skeleton" />
              <div className="skeleton" />
              <div className="skeleton" />
            </div>
          ))}
        </div>
      )}
      {!isStoreLoading && sorted.length === 0 && (
        <EmptyState
          title="No activity yet"
          message="Catch your first Pokémon to start your trainer log."
          actionLabel="Explore Pokémon"
          actionTo="/"
        />
      )}
      {!isStoreLoading && sorted.length > 0 && (
        <div className="history-table">
          <div className="history-head">
            <span>Pokémon</span>
            <span>Activity</span>
            <span>Date & time</span>
          </div>
          {sorted.map((entry) => (
            <article className="history-row" key={entry.id}>
              <div className="history-pokemon">
                <div
                  className={`history-thumb type-bg-${entry.pokemon.types[0]}`}
                >
                  <img src={artworkUrl(entry.pokemon.id)} alt="" />
                </div>
                <strong>{entry.pokemon.name}</strong>
              </div>
              <div>
                <span className={`activity-badge activity-${entry.action}`}>
                  {entry.action}
                </span>
              </div>
              <time dateTime={entry.timestamp}>
                {formatter
                  .format(new Date(entry.timestamp))
                  .replace(" at", ",")}
              </time>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
