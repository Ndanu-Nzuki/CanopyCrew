import Icon from "./Icon";

function SectionHeading({ eyebrow, title, copy, action }) {
  return (
    <div className="section-heading">
      <div>
        <div className="eyebrow">
          <span /> {eyebrow}
        </div>
        <h2>{title}</h2>
      </div>
      <div className="heading-side">
        <p>{copy}</p>
        {action}
      </div>
    </div>
  );
}

function SiteCard({ site, index }) {
  const image = [
    "https://images.unsplash.com/photo-1780311933665-8d3e4e6a31e4?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1756192727102-91cc51abd12c?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1524608167924-8305dd66256b?auto=format&fit=crop&w=1000&q=85",
  ][index % 3];
  const light = site.sunlight_exposure.replaceAll("_", " ");

  return (
    <a className="site-card" href={`#site/${encodeURIComponent(site.site_id)}`}>
      <div className="site-image-wrap">
        <img src={image} alt={`${site.archetype_label} planting site`} />
        <span className="site-number">0{index + 1}</span>
        <span className="distance">
          <Icon name="pin" size={15} /> São Paulo
        </span>
      </div>
      <div className="site-body">
        <p className="site-location">
          <Icon name="pin" size={16} /> {site.archetype_label}
        </p>
        <h3>{site.name}</h3>
        <p className="site-description">{site.description}</p>
        <div className="tags">
          <span>{site.typical_dimensions}</span>
          <span>{light}</span>
        </div>
        <div className="card-link">
          <span>
            View site details · {site.ecological_goals.length} ecological goals
          </span>
          <Icon name="arrow" size={18} />
        </div>
      </div>
    </a>
  );
}

export default function Discover({ sites, status }) {
  return (
    <section className="section discover" id="discover">
      <div className="page-shell">
        <SectionHeading
          eyebrow="Discover a place"
          title={
            <>
              A greener corner
              <br />
              is closer than you think.
            </>
          }
          copy="Explore the São Paulo site types CanopyCrew helps communities transform, grounded in local growing conditions."
          action={
            <a className="text-link" href="#contact">
              Get involved <Icon name="arrow" size={18} />
            </a>
          }
        />
        {status === "loading" ? (
          <p className="api-state">Loading site types…</p>
        ) : status === "error" ? (
          <p className="api-state" role="alert">
            Site types could not be loaded. Check that the CanopyCrew API is
            running.
          </p>
        ) : (
          <div className="site-grid">
            {sites.map((site, index) => (
              <SiteCard key={site.site_id} site={site} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
