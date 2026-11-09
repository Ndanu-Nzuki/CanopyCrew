import { useState } from "react";
import Icon from "./Icon";
import Logo from "./Logo";

export default function Navbar({ onWorkspace, workspaceOpen = false }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className={workspaceOpen ? "navbar workspace-navbar" : "navbar"}>
      <div className="nav-inner">
        <Logo />
        <nav
          className={open ? "nav-links open" : "nav-links"}
          aria-label="Primary navigation"
        >
          <a href="#discover" onClick={close}>
            Discover
          </a>
          <a href="#plants" onClick={close}>
            Plant catalogue
          </a>
          <a href="#about" onClick={close}>
            About us
          </a>
          <a href="#contact" onClick={close}>
            Contact
          </a>
          <button
            className="button button-small mobile-cta"
            onClick={() => { close(); onWorkspace(); }}
          >
            MyWorkspace <Icon name="arrow" size={17} />
          </button>
        </nav>
        <button className="button button-small desktop-cta" onClick={onWorkspace}>
          MyWorkspace <Icon name="arrow" size={17} />
        </button>
        <button
          className="menu-button"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <Icon name={open ? "close" : "menu"} size={25} />
        </button>
      </div>
    </header>
  );
}
