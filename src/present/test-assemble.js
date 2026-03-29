#!/usr/bin/env node
'use strict';

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PRESENT_DIR = __dirname;
const ORIGINAL = path.join(PRESENT_DIR, 'interview-presentation.html');
const ASSEMBLED = '/tmp/assembled-validation.html';

// Assemble
console.log('Assembling from general profile...');
execSync(`node ${path.join(PRESENT_DIR, 'assemble.js')} general --output ${ASSEMBLED}`, {
    stdio: 'inherit'
});

// Normalize whitespace for comparison
function normalize(content) {
    return content
        .split('\n')
        .map(line => line.trimEnd())
        .join('\n')
        .replace(/\n{3,}/g, '\n\n');
}

const original = normalize(fs.readFileSync(ORIGINAL, 'utf8'));
const assembled = normalize(fs.readFileSync(ASSEMBLED, 'utf8'));

if (original === assembled) {
    console.log('PASS: Assembled output matches original exactly.');
    process.exit(0);
} else {
    fs.writeFileSync('/tmp/original-normalized.html', original);
    fs.writeFileSync('/tmp/assembled-normalized.html', assembled);
    console.log('FAIL: Differences found. Run:');
    console.log('  diff /tmp/original-normalized.html /tmp/assembled-normalized.html | head -80');
    process.exit(1);
}
