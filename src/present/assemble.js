#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const BASE_DIR = __dirname;
const FRAGMENTS_DIR = path.join(BASE_DIR, 'fragments');

// ---------------------------------------------------------------------------
// Frontmatter parsing
// ---------------------------------------------------------------------------

/**
 * Parse the <!-- fragment: ... --> frontmatter comment from fragment content.
 * Returns an object with { id, type, tags, domain, metrics, source } or null.
 */
function parseFrontmatter(content) {
    const match = content.match(/^<!--\s*fragment:\s*\n([\s\S]*?)-->/);
    if (!match) return null;

    const block = match[1];
    const meta = {};

    for (const line of block.split('\n')) {
        const kv = line.match(/^\s*(\w+)\s*:\s*(.+)$/);
        if (!kv) continue;
        const key = kv[1];
        let val = kv[2].trim();

        // Parse arrays: [item1, item2, ...]
        if (val.startsWith('[') && val.endsWith(']')) {
            val = val.slice(1, -1).split(',').map(s => s.trim()).filter(Boolean);
        }

        meta[key] = val;
    }

    // Require at least an id to be considered valid frontmatter
    return meta.id ? meta : null;
}

// ---------------------------------------------------------------------------
// --list-fragments mode
// ---------------------------------------------------------------------------

if (process.argv.includes('--list-fragments')) {
    const results = [];

    // Scan all .html files recursively
    function scanDir(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                scanDir(fullPath);
            } else if (entry.name.endsWith('.html') && !entry.name.startsWith('_')) {
                const content = fs.readFileSync(fullPath, 'utf8');
                const meta = parseFrontmatter(content);
                if (meta) {
                    meta.file = path.relative(FRAGMENTS_DIR, fullPath);
                    results.push(meta);
                }
            }
        }
    }

    scanDir(FRAGMENTS_DIR);
    console.log(JSON.stringify(results, null, 2));
    process.exit(0);
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
if (args.length === 0) {
    console.error('Usage: node assemble.js <profile> [--output <path>]');
    console.error('       node assemble.js --list-fragments');
    process.exit(1);
}

const profileName = args[0];
let outputPath = null;
const outIdx = args.indexOf('--output');
if (outIdx !== -1 && args[outIdx + 1]) {
    outputPath = args[outIdx + 1];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Indent depth for card fragments inside the achievements wrapper (8 slide + 8 key-points)
const CARD_INDENT = 16;

/** Read a file relative to BASE_DIR */
function readFile(relPath) {
    return fs.readFileSync(path.join(BASE_DIR, relPath), 'utf8');
}

/** Read a fragment and strip its frontmatter HTML comment */
function readFragment(relPath) {
    const raw = fs.readFileSync(path.join(FRAGMENTS_DIR, relPath), 'utf8');
    return raw.replace(/^<!--[\s\S]*?-->\n?/, '');
}

/** Read a card fragment, strip frontmatter, and add base indent */
function readCardFragment(relPath, indent = CARD_INDENT) {
    let content = readFragment(relPath).trimEnd();
    const pad = ' '.repeat(indent);
    const lines = content.split('\n');
    return lines.map(line => {
        if (line.trim() === '') return '';
        return pad + line;
    }).join('\n');
}

/**
 * Read a case-study fragment and separate HTML slide content from cheat sheet JS.
 * Returns { html, cheatSheetEntries }
 */
function readCaseStudyFragment(relPath) {
    const content = readFragment(relPath);
    const scriptIdx = content.indexOf('\n<script>');
    if (scriptIdx === -1) {
        return { html: content.trimEnd(), cheatSheetEntries: '' };
    }
    const html = content.substring(0, scriptIdx).trimEnd();
    // Extract the JS object entries from Object.assign(window.cheatSheets = ..., { ... });
    const scriptBlock = content.substring(scriptIdx);
    const match = scriptBlock.match(/Object\.assign\(window\.cheatSheets\s*=\s*window\.cheatSheets\s*\|\|\s*\{\}\s*,\s*\{([\s\S]*)\}\s*\)\s*;?\s*<\/script>/);
    if (match) {
        return { html, cheatSheetEntries: match[1].trimEnd() };
    }
    return { html, cheatSheetEntries: '' };
}

/** Strip data-id attributes from HTML */
function stripDataId(html) {
    return html.replace(/ data-id="[^"]*"/g, '');
}

// ---------------------------------------------------------------------------
// Slide comment labels (for slides that need assembler-generated comments)
// ---------------------------------------------------------------------------
const SLIDE_COMMENTS = {
    cover: 'Cover',
    background: 'Background',
    achievements: 'Additional Achievements',
    summary: 'Summary',
    qna: 'Q&A'
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

// 1. Parse profile
const profilePath = path.join(BASE_DIR, 'profiles', `${profileName}.yaml`);
if (!fs.existsSync(profilePath)) {
    console.error(`Profile not found: ${profilePath}`);
    process.exit(1);
}
const profile = yaml.load(fs.readFileSync(profilePath, 'utf8'));

// 2. Read base.html
let base = readFile('base.html');

// 3. Concatenate fragments in presentation order
const parts = [];

// Slide counter for comments
let slideCounter = 0;

function addSlideComment(label) {
    slideCounter++;
    return `        <!-- Slide ${slideCounter}: ${label} -->`;
}

// cover.html
parts.push(addSlideComment(SLIDE_COMMENTS.cover) + '\n' + readFragment('cover.html').trimEnd());

// background.html
parts.push(addSlideComment(SLIDE_COMMENTS.background) + '\n' + readFragment('background.html').trimEnd());

// Highlight slide fragments (in profile order)
for (const name of profile.highlights) {
    let content = readFragment(`highlights/${name}.html`).trimEnd();
    // Strip any hardcoded slide comment from the fragment
    content = content.replace(/^\s*<!--\s*Slide\s+\d+:.*?-->\n?/, '');
    const label = name.charAt(0).toUpperCase() + name.slice(1) + ' Career Highlights';
    parts.push(addSlideComment(label) + '\n' + content);
}

// Case study slide fragments (in profile order)
// Collect cheat sheet data and auto-suppress data-ids from active case studies
const cheatSheetParts = [];
const autoSuppress = [];
let caseNum = 0;
for (const name of profile['case-studies']) {
    const rawContent = fs.readFileSync(path.join(FRAGMENTS_DIR, `case-studies/${name}.html`), 'utf8');
    const meta = parseFrontmatter(rawContent);
    if (meta && meta.suppresses) {
        const ids = Array.isArray(meta.suppresses) ? meta.suppresses : [meta.suppresses];
        autoSuppress.push(...ids);
    }
    let { html, cheatSheetEntries } = readCaseStudyFragment(`case-studies/${name}.html`);
    caseNum++;
    // Strip any hardcoded slide comment from the fragment
    html = html.replace(/^\s*<!--\s*Slide\s+\d+:.*?-->\n?/, '');
    html = html.replace(/\{\{CASE_NUM\}\}/g, String(caseNum));
    const label = `Case Study ${caseNum}: ${name}`;
    parts.push(addSlideComment(label) + '\n' + html);
    if (cheatSheetEntries) {
        cheatSheetParts.push(cheatSheetEntries);
    }
}

// Achievements wrapper slide
const achievementCards = profile.achievements
    .map(name => readCardFragment(`achievements/${name}.html`))
    .join('\n');

slideCounter++;
parts.push(
    `        <!-- Slide ${slideCounter}: ${SLIDE_COMMENTS.achievements} -->\n` +
    `        <div class="slide">\n` +
    `            <div class="slide-number">{{N}} / {{TOTAL}}</div>\n` +
    `            <h1>Additional Achievements Overview</h1>\n` +
    `\n` +
    `            <div class="key-points">\n` +
    achievementCards + '\n' +
    `            </div>\n` +
    `        </div>`
);

// summary.html
parts.push(addSlideComment(SLIDE_COMMENTS.summary) + '\n' + readFragment('summary.html').trimEnd());

// qna.html
parts.push(addSlideComment(SLIDE_COMMENTS.qna) + '\n' + readFragment('qna.html').trimEnd());

let assembled = parts.join('\n\n');

// 4. Apply suppressions (profile + auto-suppress from active case studies), then strip data-id
const allSuppress = [...(profile.suppress || []), ...autoSuppress];
if (allSuppress.length > 0) {
    for (const id of allSuppress) {
        const re = new RegExp(`\\s*<li data-id="${id}">.*?</li>`, 'g');
        assembled = assembled.replace(re, '');
    }
}
assembled = stripDataId(assembled);

// 5. Count total slides
const totalSlides = (assembled.match(/<div class="slide"/g) || []).length;

// 6. Replace {{N}} / {{TOTAL}} sequentially
let slideNum = 0;
assembled = assembled.replace(/\{\{N\}\} \/ \{\{TOTAL\}\}/g, () => {
    slideNum++;
    return `${slideNum} / ${totalSlides}`;
});

// 7. Replace template variables
assembled = assembled.replace(/\{\{tagline\}\}/g, `"${profile.cover.tagline}"`);
assembled = assembled.replace(/\{\{summary-tagline\}\}/g, profile.summary.tagline);
assembled = assembled.replace(/\{\{strength-1\}\}/g, profile.summary.strengths[0]);
assembled = assembled.replace(/\{\{strength-2\}\}/g, profile.summary.strengths[1]);
assembled = assembled.replace(/\{\{strength-3\}\}/g, profile.summary.strengths[2]);

// 8. Inject slides into base.html at <!-- SLIDES --> placeholder
let output = base.replace('        <!-- SLIDES -->', assembled);

// 9. Inject cheat sheet data into <!-- CHEAT_SHEETS --> placeholder
// Read the pre-ordered cheat sheet data file if it exists, otherwise use fragment data
const cheatSheetDataPath = path.join(FRAGMENTS_DIR, 'cheat-sheet-data.js');
let cheatSheetData;
if (fs.existsSync(cheatSheetDataPath)) {
    cheatSheetData = fs.readFileSync(cheatSheetDataPath, 'utf8').trimEnd();
} else {
    cheatSheetData = cheatSheetParts.join(',\n');
}

// Validate cheat sheet data forms a valid JS object
try {
    new Function(`return {${cheatSheetData}}`);
} catch (e) {
    console.error(`Cheat sheet syntax error: ${e.message}`);
    console.error('Check fragment <script> blocks for missing commas or syntax issues.');
    process.exit(1);
}

output = output.replace('<!-- CHEAT_SHEETS -->', cheatSheetData);

// 10. Write output
const outFile = outputPath
    ? path.resolve(outputPath)
    : path.join(BASE_DIR, 'interview-presentation.html');

fs.writeFileSync(outFile, output, 'utf8');
console.log(`Assembled ${totalSlides} slides → ${outFile}`);
