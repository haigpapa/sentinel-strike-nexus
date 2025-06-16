# Sentinel Strike Nexus

Sentinel Strike Nexus visualizes an organization's attack surface and lets you experiment with simulated threats. The UI is built with React, Three.js and Tailwind CSS and deploys as a static site via GitHub Pages.

## Major features

- **Interactive 3D map** – hexagonal nodes represent assets and show risk level at a glance.
- **Configurable control panel** – tweak look-back windows, threat severity, zoom scope and more.
- **Asset drawer** – inspect open ports, patch status and active alerts for a selected node.
- **Status indicator** – a top bar reflects overall stream health.

## Development

### Install dependencies
```sh
npm install
```

### Start the dev server
```sh
npm run dev
```

### Run tests
```sh
npm test
```

### Build for production
```sh
npm run build
```
Use `npm run preview` to serve the built files locally.

## Environment variables
No environment variables are required for development or testing.

## Continuous integration
A GitHub Actions workflow deploys the site to GitHub Pages. See [`.github/workflows/static.yml`](.github/workflows/static.yml) for details.

## License
This project is released under the [MIT License](LICENSE).
