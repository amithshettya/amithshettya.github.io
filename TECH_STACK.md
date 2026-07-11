# Teaching Stack: HTMX + Tailwind CSS

A guide to building modern web applications with HTMX and Tailwind CSS.

---

## Documentation Links

### HTMX
- Official Documentation: https://htmx.org/docs/
- Reference: https://htmx.org/reference
- Examples: https://htmx.org/examples/
- Extensions: https://htmx.org/extensions/

### Tailwind CSS
- Official Documentation: https://tailwindcss.com/docs
- Installation: https://tailwindcss.com/docs/installation
- Utility Classes: https://tailwindcss.com/docs/utility-first
- Responsive Design: https://tailwindcss.com/docs/responsive-design
- Dark Mode: https://tailwindcss.com/docs/dark-mode

---

## Folder Structure

```
project/
├── src/
│   ├── templates/           # HTML templates (served by backend)
│   │   ├── index.html       # Main page
│   │   ├── components/      # Reusable HTML fragments
│   │   └── layouts/         # Base layouts
│   ├── css/
│   │   ├── input.css        # Tailwind directives
│   │   └── output.css       # Compiled CSS (generated)
│   └── js/
│       └── htmx.min.js      # HTMX library
├── dist/                    # Compiled assets (served to clients)
│   ├── css/
│   │   └── output.css       # Compiled Tailwind CSS
│   └── js/
│       └── htmx.min.js
├── tailwind.config.js       # Tailwind configuration
├── package.json
└── server.js                # Backend server (Node/Express example)
```

---

## Setup Commands

### 1. Initialize Project
```bash
npm init -y
npm install -D tailwindcss
```

### 2. Create Tailwind Config
```bash
npx tailwindcss init
```

### 3. Configure Tailwind (tailwind.config.js)
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 4. Create CSS Input File (src/css/input.css)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 5. Compile Tailwind CSS
```bash
# Development (watch mode)
npx tailwindcss -i ./src/css/input.css -o ./dist/css/output.css --watch

# Production (minified)
npx tailwindcss -i ./src/css/input.css -o ./dist/css/output.css --minify
```

### 6. Serve HTMX + Tailwind
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="/dist/css/output.css" rel="stylesheet">
  <script src="/dist/js/htmx.min.js"></script>
</head>
<body>
  <!-- Your HTMX-powered content here -->
</body>
</html>
```

---

## How HTMX Uses Tailwind CSS

1. **Tailwind Compilation**: Tailwind scans your HTML templates and generates a CSS file with only the classes you use.

2. **Static Serving**: The compiled CSS file is served statically to the client.

3. **HTMX Updates**: When HTMX fetches HTML fragments from the server, those fragments already contain Tailwind classes.

4. **Browser Rendering**: The browser applies the pre-compiled CSS to the new HTML fragments automatically.

The key insight: **Tailwind CSS is pre-compiled**, so HTMX doesn't need to recompile anything. The CSS is already available when new HTML is swapped in.

---

## Best Practices & Common Patterns

### HTMX Patterns

**Progressive Enhancement**
```html
<a href="/page" hx-get="/page" hx-push-url="true" hx-target="body">
  Link with fallback
</a>
```

**Loading Indicators**
```html
<button hx-get="/data" hx-indicator="#spinner">
  Load Data
</button>
<div id="spinner" class="htmx-indicator">Loading...</div>
```

**Form Submission**
```html
<form hx-post="/submit" hx-swap="outerHTML">
  <input type="text" name="email" required>
  <button type="submit">Submit</button>
</form>
```

**Search with Debounce**
```html
<input 
  type="search" 
  hx-get="/search" 
  hx-trigger="keyup changed delay:300ms" 
  hx-target="#results"
  placeholder="Search..."
>
<div id="results"></div>
```

**Infinite Scroll**
```html
<div hx-get="/more-items" hx-trigger="revealed" hx-swap="afterend">
  <!-- Content -->
</div>
```

### Tailwind CSS Patterns

**Responsive Design**
```html
<div class="flex flex-col md:flex-row gap-4">
  <div class="w-full md:w-1/2">Column 1</div>
  <div class="w-full md:w-1/2">Column 2</div>
</div>
```

**Dark Mode**
```html
<div class="bg-white dark:bg-gray-900 text-black dark:text-white">
  Theme-aware content
</div>
```

**Interactive States**
```html
<button class="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 
               focus:ring-2 focus:ring-blue-300 transition-colors">
  Button
</button>
```

**Component Extraction**
```html
<!-- Define reusable component classes -->
<button class="px-4 py-2 bg-blue-500 text-white rounded-lg 
               hover:bg-blue-600 transition-colors">
  Primary Button
</button>
```

### Combined HTMX + Tailwind Patterns

**Dynamic List Updates**
```html
<div id="item-list">
  <!-- Initial items -->
</div>

<button hx-get="/items" hx-target="#item-list" hx-swap="innerHTML">
  Load Items
</button>
```

**Modal Dialog**
```html
<button hx-get="/modal" hx-target="body" hx-swap="beforeend">
  Open Modal
</button>

<!-- Modal will be appended to body -->
```

**Tab Navigation**
```html
<div class="flex border-b">
  <button class="px-4 py-2 border-b-2 border-blue-500" 
          hx-get="/tab1" hx-target="#content">
    Tab 1
  </button>
  <button class="px-4 py-2 border-b-2 border-transparent" 
          hx-get="/tab2" hx-target="#content">
    Tab 2
  </button>
</div>
<div id="content" class="p-4">
  <!-- Tab content -->
</div>
```

**Toast Notifications**
```html
<button hx-post="/action" hx-swap="none" hx-on::after-request="showToast('Success!')">
  Perform Action
</button>
```

### Performance Tips

1. **Use HTMX Extension for Loading States**: Add loading indicators with `hx-indicator` and `hx-disabled-elt`.

2. **Optimize Tailwind Output**: Ensure `tailwind.config.js` only scans files you use.

3. **Lazy Load Content**: Use `hx-trigger="revealed"` for content below the fold.

4. **Cache Responses**: Use HTTP caching headers on server responses.

5. **Minimize Bundle Size**: HTMX is ~14KB, Tailwind CSS compiles to only used classes.

### Security Best Practices

1. **Escape User Content**: Always escape user-generated content to prevent XSS.

2. **Use CSRF Protection**: Include CSRF tokens in HTMX requests.

3. **Validate Server-Side**: Never trust client-side validation alone.

4. **Use HTTPS**: Always serve over HTTPS in production.

---

## Development Workflow

1. **Edit HTML templates** in `src/templates/`
2. **Run Tailwind compiler** in watch mode: `npx tailwindcss -i ./src/css/input.css -o ./dist/css/output.css --watch`
3. **Start your backend server** that serves HTML fragments
4. **HTMX handles** the dynamic updates automatically
5. **For production**: Compile minified CSS and bundle assets

---

## Backend Integration

HTMX works with any backend that returns HTML:

- **Node.js/Express**: Use template engines (EJS, Pug, Handlebars)
- **Python/Django**: Use Django templates
- **Go**: Use html/template
- **Ruby/Rails**: Use ERB or Slim
- **PHP**: Use Blade or plain PHP

The server returns HTML fragments, not JSON. HTMX swaps these fragments into the page.

---

## Resources

- HTMX + Tailwind Tutorial: https://htmx.org/examples/
- Tailwind CSS Play CDN: https://tailwindcss.com/docs/installation/play-cdn
- HTMX Extensions: https://htmx.org/extensions/
- Community Examples: https://htmx.org/examples/
