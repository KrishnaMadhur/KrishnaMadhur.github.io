---
description: How to update website content — blogs, projects, photos, CV, and general text
---

# Updating Your Website

## Quick Reference: File Structure

```
KrishnaMadhur.github.io/
├── index.html              ← Main site (all 5 tabs)
├── css/style.css           ← All styles
├── js/main.js              ← All behavior
├── projects/               ← Project detail pages
│   ├── alscn-ferroelectrics.html
│   ├── tia-optical-receiver.html
│   ├── mems-cantilever.html
│   ├── sram-array.html
│   ├── sensor-board.html
│   └── device-modelling.html
├── writing/posts/          ← Blog posts
│   ├── _template.html      ← Copy this for new posts
│   └── sample-post.html
├── assets/gallery/          ← Photo folders
│   ├── architecture/
│   ├── campus/
│   ├── macro/
│   ├── nature/
│   ├── street/
│   └── travel/
└── reports/                ← PDF reports
```

---

## 1. Edit Home Page Text

Open `index.html` and find the `<!-- HOME -->` section (~line 38).

- **Bio**: Edit the `<p class="home-bio">` paragraph
- **Status LED text**: Edit the `<span class="status-text">` inside `.status-indicator`
- **Selected Work cards**: Edit the `<div class="selected-work-item">` blocks

---

## 2. Add a New Blog Post

### Step 1: Copy the template
```bash
cp writing/posts/_template.html writing/posts/my-new-post.html
```

### Step 2: Edit the new file
Open `my-new-post.html` and replace all `<!-- TEMPLATE: ... -->` placeholders:
- Title, date, tag, and body content
- The `data-tag` attribute should be one of: `technical`, `books`, `personal`

### Step 3: Add a card to the Writing tab
In `index.html`, find the `<div class="writing-list">` section and add:
```html
<a href="writing/posts/my-new-post.html" class="writing-card float-up" data-tag="technical">
  <p class="writing-card-tag">Technical</p>
  <h3 class="writing-card-title">Your Post Title</h3>
  <p class="writing-card-excerpt">A one-line summary of the post.</p>
  <p class="writing-card-date">Feb 2026</p>
</a>
```

---

## 3. Add a New Project

### Step 1: Create the detail page
Copy any existing project page (e.g., `projects/sensor-board.html`) and edit:
- `<title>`, `<meta description>`
- `<span class="detail-tag">` — tools used
- `<h1 class="detail-title">` — project name
- `<p class="detail-meta">` — date range
- `<div class="detail-body">` — all content (use `<h2>`, `<p>`, `<ul>` inside)

### Step 2: Add a card to the Projects tab
In `index.html`, find `<div class="projects-list">` and add:
```html
<a href="projects/your-project.html" class="project-row float-up">
  <div>
    <h3 class="project-row-title">Project Title</h3>
    <p class="project-row-desc">One or two sentence description.</p>
  </div>
  <div class="project-row-meta">
    <p class="project-row-tools">Tool / Platform</p>
    <p class="project-row-date">Season Year</p>
    <p class="project-row-arrow">→</p>
  </div>
</a>
```

---

## 4. Add Photos to the Gallery

### Step 1: Drop images into category folders
```bash
cp your-photo.jpg assets/gallery/architecture/
```
Supported categories: `architecture`, `campus`, `macro`, `nature`, `street`, `travel`

### Step 2: Add gallery items in index.html
Find `<div id="photography"` and replace the placeholder with:
```html
<div class="gallery-grid">
  <div class="gallery-item" data-category="architecture">
    <img src="assets/gallery/architecture/your-photo.jpg" alt="Description" />
  </div>
  <!-- repeat for more photos -->
</div>
```
The lightbox will work automatically on click.

---

## 5. Update CV Content

In `index.html`, find `<div id="cv"` (~line 260+). The CV has these sections:
- **Education** — `<div class="cv-edu-item">`
- **Experience** — `<div class="cv-exp-item">`
- **Skills** — `<div class="cv-skill-group">` with `<span class="cv-skill-tag">`
- **Projects** — same `cv-exp-item` structure
- **Leadership** — `<div class="cv-leadership-item">`

Just edit the text directly. All styling is automatic.

---

## 6. Deploy Changes

// turbo
```bash
cd /Users/krishnamadhurakella/Developer/KrishnaMadhur.github.io
git add -A && git commit -m "update: brief description" && git push origin main
```
Changes go live on GitHub Pages within ~2 minutes.

## 7. Test Locally

// turbo
```bash
cd /Users/krishnamadhurakella/Developer/KrishnaMadhur.github.io
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.
