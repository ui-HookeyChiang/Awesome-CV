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

// cover.html
parts.push(readFragment('cover.html'));

// intro.html
parts.push(readFragment('intro.html'));

// Skills wrapper slide
const skillCards = profile.skills
    .map(name => readFragment(`skills/${name}.html`))
    .join('\n');

parts.push(
    `        <div class="slide">\n` +
    `            <div class="slide-number">{{N}} / {{TOTAL}}</div>\n` +
    `            <h2 class="section-title">Technical Experience</h2>\n` +
    `            <div class="key-points">\n` +
    skillCards + '\n' +
    `            </div>\n` +
    `        </div>`
);

// Highlight slide fragments (in profile order)
for (const name of profile.highlights) {
    parts.push(readFragment(`highlights/${name}.html`));
}

// Case study slide fragments (in profile order)
for (const name of profile['case-studies']) {
    parts.push(readFragment(`case-studies/${name}.html`));
}

// Achievements wrapper slide
const achievementCards = profile.achievements
    .map(name => readFragment(`achievements/${name}.html`))
    .join('\n');

parts.push(
    `        <div class="slide">\n` +
    `            <div class="slide-number">{{N}} / {{TOTAL}}</div>\n` +
    `            <h2 class="section-title">Additional Achievements Overview</h2>\n` +
    `            <div class="key-points">\n` +
    achievementCards + '\n' +
    `            </div>\n` +
    `        </div>`
);

// summary.html
parts.push(readFragment('summary.html'));

// qna.html
parts.push(readFragment('qna.html'));

let assembled = parts.join('\n');

// 4. Apply suppressions
if (profile.suppress && profile.suppress.length > 0) {
    for (const id of profile.suppress) {
        const re = new RegExp(`<li data-id="${id}">.*?</li>`, 'g');
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
assembled = assembled.replace(/\{\{tagline\}\}/g, profile.cover.tagline);
assembled = assembled.replace(/\{\{summary-tagline\}\}/g, profile.summary.tagline);
assembled = assembled.replace(/\{\{strength-1\}\}/g, profile.summary.strengths[0]);
assembled = assembled.replace(/\{\{strength-2\}\}/g, profile.summary.strengths[1]);
assembled = assembled.replace(/\{\{strength-3\}\}/g, profile.summary.strengths[2]);

// 8. Inject into base.html at <!-- SLIDES --> placeholder
const output = base.replace('        <!-- SLIDES -->', assembled);

// 9. Write output
const outFile = outputPath
    ? path.resolve(outputPath)
    : path.join(BASE_DIR, 'interview-presentation.html');

fs.writeFileSync(outFile, output, 'utf8');
console.log(`Assembled ${totalSlides} slides → ${outFile}`);
