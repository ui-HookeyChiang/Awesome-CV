#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
if (args.length === 0) {
    console.error('Usage: node assemble.js <profile> [--output <path>]');
    process.exit(1);
}

const profileName = args[0];
let outputPath = null;
const outIdx = args.indexOf('--output');
if (outIdx !== -1 && args[outIdx + 1]) {
    outputPath = args[outIdx + 1];
}

const BASE_DIR = __dirname;
const FRAGMENTS_DIR = path.join(BASE_DIR, 'fragments');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Read a file relative to BASE_DIR */
function readFile(relPath) {
    return fs.readFileSync(path.join(BASE_DIR, relPath), 'utf8');
}

/** Read a fragment and strip its frontmatter HTML comment */
function readFragment(relPath) {
    const raw = fs.readFileSync(path.join(FRAGMENTS_DIR, relPath), 'utf8');
    return raw.replace(/^<!--[\s\S]*?-->\n?/, '');
}

/** Read a card fragment, strip frontmatter, and add 16-space base indent */
function readCardFragment(relPath) {
    let content = readFragment(relPath).trimEnd();
    // Add 16 spaces of base indent to each line (preserving relative indent)
    const lines = content.split('\n');
    return lines.map(line => {
        if (line.trim() === '') return '';
        return '                ' + line;
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
    intro: 'Self Introduction',
    skills: 'Core Technical Expertise',
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

// intro.html
parts.push(addSlideComment(SLIDE_COMMENTS.intro) + '\n' + readFragment('intro.html').trimEnd());

// Skills wrapper slide
const skillCards = profile.skills
    .map(name => readCardFragment(`skills/${name}.html`))
    .join('\n\n');

slideCounter++;
parts.push(
    `        <!-- Slide ${slideCounter}: ${SLIDE_COMMENTS.skills} -->\n` +
    `        <div class="slide">\n` +
    `            <div class="slide-number">{{N}} / {{TOTAL}}</div>\n` +
    `            <h1>Technical Experience</h1>\n` +
    `\n` +
    `            <div class="key-points">\n` +
    skillCards + '\n' +
    `            </div>\n` +
    `        </div>`
);

// Highlight slide fragments (in profile order) — already contain their own comments
for (const name of profile.highlights) {
    const content = readFragment(`highlights/${name}.html`).trimEnd();
    slideCounter++;
    parts.push(content);
}

// Case study slide fragments (in profile order) — already contain comments
// Collect cheat sheet data separately
const cheatSheetParts = [];
for (const name of profile['case-studies']) {
    const { html, cheatSheetEntries } = readCaseStudyFragment(`case-studies/${name}.html`);
    slideCounter++;
    parts.push(html);
    if (cheatSheetEntries) {
        cheatSheetParts.push(cheatSheetEntries);
    }
}

// Achievements wrapper slide
const achievementCards = profile.achievements
    .map(name => {
        let card = readCardFragment(`achievements/${name}.html`);
        return stripDataId(card);
    })
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

// 4. Apply suppressions
if (profile.suppress && profile.suppress.length > 0) {
    for (const id of profile.suppress) {
        const re = new RegExp(`\\s*<li data-id="${id}">.*?</li>`, 'g');
        assembled = assembled.replace(re, '');
    }
}

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
output = output.replace('<!-- CHEAT_SHEETS -->', cheatSheetData);

// 10. Write output
const outFile = outputPath
    ? path.resolve(outputPath)
    : path.join(BASE_DIR, 'interview-presentation.html');

fs.writeFileSync(outFile, output, 'utf8');
console.log(`Assembled ${totalSlides} slides → ${outFile}`);
