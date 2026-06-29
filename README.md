# KaEatSaan - Where to Eat? 🍜

_Saan tayo kakain?_ No more "Bahala na si Batman"! Let KaEatSaan decide for you!

## About 🤔

KaEatSaan (a play on "Kahit Saan" or "Anywhere") is your trusty sidekick for those moments when you and your friends can't decide where to eat. Say goodbye to the endless "Kayo bahala" loop!

## Tech Stack 💻

- **Framework:** [Next.js](https://nextjs.org/) (App Router, static export) + React 19 + TypeScript
- **Hosting & DB:** [Firebase](https://firebase.google.com/) (Auth + Realtime Database + Hosting)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [Material UI v7](https://mui.com/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/) + HTML Canvas (wheel)
- **Maps:** [Leaflet](https://leafletjs.com/) + react-leaflet

## Getting Started 🚀

1. Clone the repo
2. Install dependencies: `npm install`
3. Copy `.env.development` and fill in your Firebase config (`NEXT_PUBLIC_FIREBASE_*` vars)
4. Run the dev server: `npm run dev`

Other commands:

```bash
npm run build   # Production build (static export to /out)
npm run lint    # ESLint v9
```

## Environments 🌐

We have two environments fully set up:

- **Production:** [kaeatsaan.web.app](https://kaeatsaan.web.app)
- **Development:** [dev-kaeatsaan.web.app](https://dev-kaeatsaan.web.app)

Each environment has its own hosting and database configuration.

## Testing 🧪

Do we have unit tests? Nope. I just test whatever locally before pushing. It is what it is.

## Contributing 🤝

I'm not strict about contributions, but if you want to help, check out the `CONTRIBUTING.md` file for some loose guidelines. There are also simple PR templates to keep things a bit organized, but no pressure to follow them religiously.

## Community 👨‍👩‍👧‍👦

Join our Discord server to hang out, ask questions, or just share your favorite food spots:
[https://discord.gg/e3b9rtYUx5](https://discord.gg/e3b9rtYUx5)

---

Made with ❤️
