# Ɉuice PWA Stijlgids

Deze stijlgids bevat de visuele richtlijnen voor het Ɉuice PWA project. Ontwikkelaars kunnen deze gids gebruiken om consistente componenten te creëren, ongeacht of ze Tailwind CSS of custom CSS gebruiken.

## Kleuren

### Primaire kleuren
- **Primair blauw**: `#2563eb` (rgb(37, 99, 235))
- **Donker blauw**: `#1d4ed8` (rgb(29, 78, 216))
- **Licht blauw**: `#3b82f6` (rgb(59, 130, 246))
- **Extra licht blauw**: `#eff6ff` (rgb(239, 246, 255))

### Grijstinten
- **Extra donker grijs**: `#111827` (rgb(17, 24, 39))
- **Donker grijs**: `#1f2937` (rgb(31, 41, 55))
- **Medium grijs**: `#4b5563` (rgb(75, 85, 99))
- **Licht grijs**: `#6b7280` (rgb(107, 114, 128))
- **Extra licht grijs**: `#9ca3af` (rgb(156, 163, 175))
- **UI grijs**: `#e5e7eb` (rgb(229, 231, 235))
- **Achtergrond grijs**: `#f3f4f6` (rgb(243, 244, 246))
- **Pagina achtergrond**: `#f9fafb` (rgb(249, 250, 251))

### Status kleuren
- **Succes**: `#059669` (rgb(5, 150, 105))
- **Succes licht**: `#d1fae5` (rgb(209, 250, 229))
- **Fout**: `#dc2626` (rgb(220, 38, 38))
- **Fout licht**: `#fee2e2` (rgb(254, 226, 226))
- **Info**: `#1e40af` (rgb(30, 64, 175))
- **Info licht**: `#dbeafe` (rgb(219, 234, 254))

## Typografie

### Fontgroottes
- **Zeer klein**: 12px
- **Klein**: 14px
- **Normaal**: 16px
- **Medium**: 18px
- **Groot**: 20px
- **X-Groot**: 24px
- **2X-Groot**: 36px
- **3X-Groot**: 48px

### Fontgewichten
- **Normaal**: 400
- **Medium**: 500
- **Semi-vet**: 600
- **Vet**: 700
- **Extra vet**: 800

## Afstanden & Spacing

### Padding & Margin
- **Zeer klein**: 4px
- **Klein**: 8px
- **Medium**: 12px
- **Normaal**: 16px
- **Groot**: 24px
- **X-Groot**: 32px

### Border Radius
- **Klein**: 4px
- **Medium**: 6px
- **Normaal**: 8px
- **Groot**: 12px
- **Rond**: 9999px (voor cirkelvormige elementen)

## UI Componenten

### Kaart (Card)
```css
.card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.card-title {
  font-size: 20px;
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 16px;
}
```

### Knoppen
```css
.button-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
}

.button-primary:hover {
  background-color: #1d4ed8;
}

.button-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  background-color: #f3f4f6;
  color: #4b5563;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
}

.button-secondary:hover {
  background-color: #e5e7eb;
}
```

### Formulierelementen
```css
.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 16px;
}

.form-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 16px;
  background-color: white;
}
```

### Statusberichten
```css
.status-success {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: #d1fae5;
  color: #065f46;
}

.status-error {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: #fee2e2;
  color: #b91c1c;
}

.status-info {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: #dbeafe;
  color: #1e40af;
}
```

## Responsiveness

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 768px
- **Desktop**: > 768px

Gebruik deze breakpoints in media queries:

```css
/* Mobile (default) */
.element {
  /* Mobile styling */
}

/* Tablet */
@media (min-width: 640px) {
  .element {
    /* Tablet styling */
  }
}

/* Desktop */
@media (min-width: 768px) {
  .element {
    /* Desktop styling */
  }
}
```

## Animaties & Transities

### Transities
- **Snel**: 0.2s
- **Normaal**: 0.3s
- **Langzaam**: 0.5s

### Laadanimatic (Spinner)
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-top-color: #3b82f6;
  animation: spin 1s linear infinite;
}
```

## Best Practices

1. **CSS Custom Properties gebruiken** voor herhaalde waarden:
   ```css
   :root {
     --color-primary: #2563eb;
     --shadow-card: 0 4px 6px rgba(0, 0, 0, 0.1);
   }
   ```

2. **BEM Methodologie** (Block, Element, Modifier) kan gebruikt worden voor CSS class naamgeving:
   ```css
   /* Block */
   .card { }
   
   /* Element */
   .card__title { }
   
   /* Modifier */
   .card--featured { }
   ```

3. **Stylen voor Theming**: Denk aan toekomstige dark mode ondersteuning
   ```css
   :root {
     --text-color: #111827;
     --bg-color: #ffffff;
   }
   
   @media (prefers-color-scheme: dark) {
     :root {
       --text-color: #f9fafb;
       --bg-color: #1f2937;
     }
   }
   ```

4. **SVG-iconen** hebben de voorkeur boven font-iconen voor betere toegankelijkheid en prestaties.

## CSS Klassen

Als je besluit om eigen CSS klassen te definiëren in plaats van Tailwind te gebruiken, 
overweeg dan om een bestand aan te maken met herbruikbare klassen voor het hele project:

```css
/* common-styles.css */
.j-card { /* ... */ }
.j-button { /* ... */ }
.j-input { /* ... */ }
/* etc. */
```

En importeer dit in de globale app.css:

```css
/* app.css */
@import './common-styles.css';
```

Dit zorgt ervoor dat alle componenten toegang hebben tot dezelfde consistente stijlen.