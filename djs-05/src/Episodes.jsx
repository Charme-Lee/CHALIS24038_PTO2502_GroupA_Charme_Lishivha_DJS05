export default function EpisodeCard({ episode }) {
  const short = (episode.description || "").split(" ").slice(0, 24).join(" ");
  return (
    <article className="episode-body">
      <div className="episode-num">
        E{String(episode.episode).padStart(2, "0")}
      </div>
      <div>
        <h4 className="episode-title">{episode.title}</h4>
        <p className="episode-desc">
          {short}
          {episode.description && "…"}
        </p>
      </div>
    </article>
  );
}
