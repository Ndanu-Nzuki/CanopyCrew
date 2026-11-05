import { useState } from "react"
import Icon from "./Icon"
import Logo from "./Logo"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  return <header className="navbar"><div className="nav-inner"><Logo /><nav className={open ? "nav-links open" : "nav-links"} aria-label="Primary navigation"><a href="#discover" onClick={close}>Discover</a><a href="#plants" onClick={close}>Plant catalogue</a><a href="#about" onClick={close}>About us</a><a href="#contact" onClick={close}>Contact</a><a className="button button-small mobile-cta" href="#discover" onClick={close}>MyWorkspace <Icon name="arrow" size={17} /></a></nav><a className="button button-small desktop-cta" href="#discover">Join the crew <Icon name="arrow" size={17} /></a><button className="menu-button" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}><Icon name={open ? "close" : "menu"} size={25} /></button></div></header>
}
