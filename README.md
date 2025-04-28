# Blank Slate met WebAssembly

Dit project demonstreert een integratie tussen Svelte en Rust via WebAssembly (WASM). Het is een Progressive Web App (PWA) met offline functionaliteit.

## WebAssembly Integratie

Het project bevat een eenvoudige Rust module (`token-engine`) die wordt gecompileerd naar WebAssembly en geïntegreerd met de Svelte frontend.

### Installatie en Setup

Voor dit project heb je nodig:

1. [Node.js en npm](https://nodejs.org/) (voor Svelte frontend)
2. [Rust](https://www.rust-lang.org/tools/install) (voor WebAssembly compilatie)
3. [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/) (voor het bouwen van WebAssembly)

### WASM Module bouwen

Volg deze stappen om de WebAssembly module te bouwen:

```bash
# Navigeer naar de token-engine directory
cd token-engine

# Bouw de WebAssembly module
wasm-pack build --target web

# Ga terug naar de project root
cd ..

# Installeer dependencies
npm install

# Start de ontwikkelserver
npm run dev
```

### Aanpassingen aan Rust code

De huidige implementatie bevat twee eenvoudige functies:

- `add(a: u32, b: u32) -> u32`: Telt twee getallen op
- `hello(name: &str) -> String`: Genereert een begroeting

Om je eigen Rust-functionaliteit toe te voegen:

1. Bewerk `token-engine/src/lib.rs`
2. Voeg nieuwe functies toe met de `#[wasm_bindgen]` annotatie
3. Bouw de WASM opnieuw met `wasm-pack build --target web`
4. Importeer en gebruik de nieuwe functies in je Svelte componenten

### Belangrijke bestanden

- `token-engine/src/lib.rs`: Rust code die naar WASM wordt gecompileerd
- `src/lib/WasmBasis.svelte`: Svelte component die de WASM functies demonstreert
- `vite.config.ts`: Bevat WASM configuratie voor Vite

## PWA Functionaliteit

Dit project implementeert PWA-functies via het `vite-plugin-pwa` pakket. Je kunt de offline functionaliteit testen door:

1. De applicatie te bouwen met `npm run build`
2. De build te serveren met `npm run preview`
3. De netwerkverbinding uit te schakelen en de pagina te herladen

## Project architectuur

- Svelte 5 met TypeScript
- Tailwind CSS voor styling
- Vite als build tool
- PWA ondersteuning via vite-plugin-pwa
- Rust/WebAssembly integratie
- Meertalige ondersteuning via svelte-i18n

## Volgende stappen

- Implementeer meer complexe Rust functionaliteit
- Bouw volledige token-engine in Rust
- Implementeer UI voor token-manipulatie
- Voeg tests toe voor zowel Rust als Svelte code