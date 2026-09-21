# Mohammad Almokdad — Space portfolio variant

Monochrome orbital journey through a fixed zigzag Solar-System corridor. Isolated from the architectural portfolio in `../Portfolio`.

```text
Current version:
architectural / Engineering Core portfolio

Space version:
continuous monochrome orbital journey using the same professional content
```

## Run both versions side by side

```bash
# current portfolio
cd ../Portfolio
npm install
npm run dev

# space version
cd ../portfolio-space
npm install
npm run dev -- -p 3001
```

Compare:

```text
http://localhost:3000
http://localhost:3001
```

Journey debug overlay (development only):

```text
http://localhost:3001/?debug=journey
```

Direct destinations:

```text
http://localhost:3001/#about
http://localhost:3001/#contact
```

## Scripts

```bash
npm run dev -- -p 3001
npm run lint
npm run typecheck
npm run build
```
