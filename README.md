# Isaque Lucio — Portfolio

Personal portfolio showcasing my work and journey as a back-end and DevOps/DevSecOps
developer. Built as a fully static site — no frameworks, no build step — with a
distinctive retro-painting visual identity, multi-language support, and a
light/dark/system theme switcher.

**Live site:** [isaquelucio.dev](https://isaquelucio.dev) <!-- update once deployed -->

---

## Features

- **Fully static** — plain HTML, CSS, and vanilla JavaScript. No frameworks, no
  bundler, no build step required.
- **Internationalization (i18n)** — content available in Portuguese, English, and
  Spanish, switchable without reloading the page. Language choice persists across
  visits.
- **Theme switcher** — light, dark, and "follow system" modes, applied instantly with
  no flash of unstyled content on load.
- **Responsive layout** — desktop-first design that adapts to tablet and mobile,
  including a dedicated mobile navigation menu.
- **Accessible** — semantic HTML, keyboard-navigable certification tooltips
  (`aria-describedby`, focus-visible states), and WCAG AA contrast targets in both
  themes.
- **Scroll-driven interactions** — reveal animations, an animated tech stack, a
  parallax hero background, and a scrollspy-powered navigation, all respecting
  `prefers-reduced-motion`.
- **Custom illustrated backgrounds** — oil-painting-style artwork used as section
  backgrounds, generated to fit the site's retro/warm color palette.

## Sections

| Section          | Description                                                        |
|------------------|---------------------------------------------------------------------|
| Hero             | Name, tagline, and location, over a painted landscape background.  |
| About            | Bio, education, quick stats, and a personal photo.                 |
| Experience       | Timeline of internships and professional roles.                    |
| Stack            | Languages, frameworks, DevOps/cloud tools, and databases, each with an animated proficiency bar. |
| Projects         | Featured and secondary projects, some with embedded real code snippets. |
| Certifications   | Obtained and in-progress certifications, each with a hover/focus tooltip explaining its relevance. |
| Career Goal      | A closing statement on career direction, with a call to action.    |
| Contact          | GitHub, LinkedIn, and email, plus a personal photo.                 |

## Tech stack

- HTML5 (semantic markup)
- CSS3 (custom properties for theming, CSS Grid/Flexbox, `scroll-behavior`,
  `prefers-reduced-motion` support)
- Vanilla JavaScript (`IntersectionObserver` for scroll reveal and scrollspy,
  `matchMedia` for theme detection, no external dependencies)

## Running locally

This is a static site — any HTTP server works. Example using Python:

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

> Opening `index.html` directly via `file://` is not recommended — some features
> (fetch-based i18n loading, correct caching behavior) require a real HTTP server.

### Testing on a mobile device (same network)

```bash
python3 -m http.server 8000 --bind 0.0.0.0
```

Find your machine's local IP (e.g. `hostname -I` on Linux) and open
`http://<your-ip>:8000` from a phone connected to the same Wi-Fi network.

## Deployment

The site is designed to be deployed as static files behind Nginx. Example server
block:

```nginx
server {
    listen 8080;
    server_name isaquelucio.dev;
    root /path/to/Portfolio_Profissional;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

## Project structure

```
.
├── index.html
├── style.css
├── main.js
├── i18n.js
├── images/
│   ├── stack_icons/
│   └── ...
└── assets/
```

## License

This project's code is available for reference. The artwork, personal photos, and
written content are not licensed for reuse.

## Contact

- GitHub: [github.com/IsaqueLucio](https://github.com/IsaqueLucio)
- LinkedIn: [linkedin.com/in/isaque-lucio-946442238](https://www.linkedin.com/in/isaque-lucio-946442238)
- Email: isaque.o.lucio@gmail.com