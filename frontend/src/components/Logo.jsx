import Icon from "./Icon";

export default function Logo() {
  return (
    <a href="#top" className="logo" aria-label="CanopyCrew home">
      <span className="logo-mark">
        <Icon name="leaf" size={24} />
      </span>
      <span>
        Canopy<span>Crew</span>
      </span>
    </a>
  );
}
