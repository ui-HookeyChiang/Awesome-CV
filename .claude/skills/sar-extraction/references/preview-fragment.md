---
name: references
description: Throwaway test-profile script for previewing a new SAR case-study fragment in the interview presentation before committing it.
landing-group: resume
---

# Preview Fragment Script

Create a throwaway test profile that includes the new fragment, assemble, and open:

```bash
# Create a throwaway test profile that includes the new fragment
cat > src/present/profiles/preview.yaml << 'EOF'
name: Preview
description: Preview new case study fragment
derived_from: general

cover:
  tagline: "Preview"
summary:
  tagline: "Preview"
  strengths: [A, B, C]

highlights: [ubiquiti, qnap]
case-studies: [NEW_FRAGMENT_ID, kernel-upgrade, nas-stability]
achievements: [innovation, performance]
suppress: []
EOF

# Assemble and open
cd src/present
node assemble.js preview --output ~/Downloads/preview.html
open ~/Downloads/preview.html

# Clean up after review
rm src/present/profiles/preview.yaml
```

Replace `NEW_FRAGMENT_ID` with the actual fragment ID. The new case study appears as slide 6 (first case study position) for easy review.

## Verification checklist

- Situation text renders with highlighted terms
- Chart displays correctly (if included)
- All 7 flow boxes are clickable and open cheat sheets
- Result metrics display properly
- No layout overflow or broken styles
