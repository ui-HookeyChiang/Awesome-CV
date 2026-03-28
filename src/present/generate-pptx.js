const PptxGenJS = require("pptxgenjs");

// ============================================================
// Color Palette (NO "#" prefix — PptxGenJS corrupts with "#")
// ============================================================
const C = {
  darkBg:    "1A1A2E",
  white:     "FFFFFF",
  lightGray: "F0F0F5",
  medGray:   "888899",
  blue:      "006FFF",
  green:     "00C853",
  cyan:      "00D4FF",
  orange:    "FF9F00",
  red:       "FF4545",
  cardBg:    "25253A",
  deepBg:    "0D0D1A",
};

const FONT = "Avenir Next";
const W = 13.333;
const H = 7.5;

// ============================================================
// Helper: accent line below title
// ============================================================
function addAccentLine(pres, slide, y, width) {
  width = width || 3.5;
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: y, w: width, h: 0.04,
    fill: { color: C.blue },
  });
}

// ============================================================
// Helper: metric boxes in a row
// ============================================================
function addMetricBoxes(pres, slide, metrics, y, boxWidth) {
  boxWidth = boxWidth || 2.8;
  const gap = 0.4;
  const totalW = metrics.length * boxWidth + (metrics.length - 1) * gap;
  const startX = (W - totalW) / 2;

  metrics.forEach((m, i) => {
    const x = startX + i * (boxWidth + gap);
    // Card background
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x, y: y, w: boxWidth, h: 1.2,
      fill: { color: C.cardBg }, rectRadius: 0.1,
      line: { color: "3A3A55", width: 1 },
    });
    // Number
    slide.addText(m.number, {
      x: x, y: y + 0.1, w: boxWidth, h: 0.7,
      fontFace: FONT, fontSize: 38, color: C.cyan,
      bold: true, align: "center", valign: "middle",
    });
    // Label
    slide.addText(m.label, {
      x: x, y: y + 0.75, w: boxWidth, h: 0.4,
      fontFace: FONT, fontSize: 12, color: C.medGray,
      align: "center", valign: "top",
    });
  });
}

// ============================================================
// Helper: SAR panel (Situation / Action / Result)
// ============================================================
function addSARPanel(pres, slide, type, title, content, y, height) {
  const borderColor = type === "situation" ? C.red : type === "action" ? C.blue : C.green;
  const panelX = 0.5;
  const panelW = W - 1.0;

  // Background rect
  slide.addShape(pres.shapes.RECTANGLE, {
    x: panelX, y: y, w: panelW, h: height,
    fill: { color: C.cardBg },
    line: { color: "3A3A55", width: 1 },
  });
  // Left border
  slide.addShape(pres.shapes.RECTANGLE, {
    x: panelX, y: y, w: 0.08, h: height,
    fill: { color: borderColor },
  });
  // Header
  slide.addText(title.toUpperCase(), {
    x: panelX + 0.25, y: y + 0.08, w: 3, h: 0.35,
    fontFace: FONT, fontSize: 16, color: borderColor,
    bold: true, valign: "middle",
  });
  // Body text (if string)
  if (typeof content === "string") {
    slide.addText(content, {
      x: panelX + 0.25, y: y + 0.4, w: panelW - 0.5, h: height - 0.5,
      fontFace: FONT, fontSize: 14, color: C.lightGray,
      valign: "top",
    });
  }
}

// ============================================================
// Helper: flowchart boxes inside an Action panel
// ============================================================
function addFlowchartBoxes(pres, slide, prep, topRow, bottomRow, baseY) {
  const boxW = 2.2;
  const boxH = 1.0;
  const gap = 0.35;

  // Prep box (centered, wider)
  const prepW = 2.4;
  const prepX = (W - prepW) / 2;
  const prepY = baseY;
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: prepX, y: prepY, w: prepW, h: boxH,
    fill: { color: C.deepBg }, rectRadius: 0.08,
    line: { color: C.blue, width: 1 },
  });
  slide.addText([
    { text: prep.title, options: { bold: true, fontSize: 12, color: C.white, breakLine: true } },
    { text: prep.subtitle || "", options: { fontSize: 11, color: C.medGray } },
  ], {
    x: prepX, y: prepY, w: prepW, h: boxH,
    fontFace: FONT, align: "center", valign: "middle",
  });

  // Arrow from prep to top row
  const arrowY = prepY + boxH;
  slide.addShape(pres.shapes.LINE, {
    x: W / 2, y: arrowY, w: 0, h: 0.25,
    line: { color: C.blue, width: 1.5 },
  });

  // Top row
  const topY = arrowY + 0.25;
  const totalTopW = topRow.length * boxW + (topRow.length - 1) * gap;
  const topStartX = (W - totalTopW) / 2;
  topRow.forEach((box, i) => {
    const bx = topStartX + i * (boxW + gap);
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: bx, y: topY, w: boxW, h: boxH,
      fill: { color: C.deepBg }, rectRadius: 0.08,
      line: { color: C.blue, width: 0.5 },
    });
    slide.addText([
      { text: box.title, options: { bold: true, fontSize: 12, color: C.white, breakLine: true } },
      { text: box.subtitle || "", options: { fontSize: 11, color: C.medGray } },
    ], {
      x: bx, y: topY, w: boxW, h: boxH,
      fontFace: FONT, align: "center", valign: "middle",
    });
  });

  // Arrows between top and bottom rows
  const midArrowY = topY + boxH;
  topRow.forEach((_, i) => {
    const bx = topStartX + i * (boxW + gap) + boxW / 2;
    slide.addShape(pres.shapes.LINE, {
      x: bx, y: midArrowY, w: 0, h: 0.2,
      line: { color: C.blue, width: 1 },
    });
  });

  // Bottom row
  const botY = midArrowY + 0.2;
  const totalBotW = bottomRow.length * boxW + (bottomRow.length - 1) * gap;
  const botStartX = (W - totalBotW) / 2;
  bottomRow.forEach((box, i) => {
    const bx = botStartX + i * (boxW + gap);
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: bx, y: botY, w: boxW, h: boxH,
      fill: { color: C.deepBg }, rectRadius: 0.08,
      line: { color: C.green, width: 0.5 },
    });
    slide.addText([
      { text: box.title, options: { bold: true, fontSize: 12, color: C.white, breakLine: true } },
      { text: box.subtitle || "", options: { fontSize: 11, color: C.medGray } },
    ], {
      x: bx, y: botY, w: boxW, h: boxH,
      fontFace: FONT, align: "center", valign: "middle",
    });
  });
}

// ============================================================
// Helper: card with title and bullet items
// ============================================================
function addCard(slide, x, y, w, h, title, items, titleColor) {
  titleColor = titleColor || C.cyan;
  slide.addShape(slide._slideLayout ? undefined : "roundRect", {
    x: x, y: y, w: w, h: h,
  });
  // Just use ROUNDED_RECTANGLE via the pres reference — we'll do it inline
}

// ============================================================
// Helper: slide number at bottom-right
// ============================================================
function addSlideNumber(slide, num, total) {
  slide.addText(num + " / " + total, {
    x: W - 1.5, y: H - 0.4, w: 1.2, h: 0.3,
    fontFace: FONT, fontSize: 10, color: C.medGray,
    align: "right", valign: "bottom",
  });
}

// ============================================================
// Main generation
// ============================================================
async function generate() {
  const pres = new PptxGenJS();
  pres.defineLayout({ name: "CUSTOM_WIDE", width: W, height: H });
  pres.layout = "CUSTOM_WIDE";
  pres.author = "Tsunghan Chiang";
  pres.title = "Interview Presentation - Tsunghan Chiang";

  // ========== SLIDE 1: Cover ==========
  {
    const slide = pres.addSlide();
    slide.background = { color: C.darkBg };

    // Name
    slide.addText("Tsunghan Chiang (Hookey)", {
      x: 0.5, y: 2.2, w: W - 1, h: 1,
      fontFace: FONT, fontSize: 48, color: C.white,
      bold: true, align: "center", valign: "middle",
    });

    // Title
    slide.addText("Operating System & Performance Engineer", {
      x: 0.5, y: 3.3, w: W - 1, h: 0.6,
      fontFace: FONT, fontSize: 24, color: C.medGray,
      align: "center", valign: "middle",
    });

    // Accent line (centered)
    const lineW = 3;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: (W - lineW) / 2, y: 4.1, w: lineW, h: 0.04,
      fill: { color: C.blue },
    });

    // Contact row
    slide.addText("Email: hookey.chiang@gmail.com  |  GitHub: ui-HookeyChiang  |  LinkedIn: hookey-chiang", {
      x: 0.5, y: 4.6, w: W - 1, h: 0.5,
      fontFace: FONT, fontSize: 14, color: C.medGray,
      align: "center", valign: "middle",
    });

    // Metric boxes
    addMetricBoxes(pres, slide, [
      { number: "8", label: "Years Experience" },
      { number: "6", label: "Product Variants" },
      { number: "2M+", label: "Users Impacted" },
    ], 5.5);
    addSlideNumber(slide, 1, 11);
  }

  // ========== SLIDE 2: Self Introduction ==========
  {
    const slide = pres.addSlide();
    slide.background = { color: C.darkBg };

    slide.addText("Self Introduction", {
      x: 0.7, y: 0.4, w: 10, h: 0.7,
      fontFace: FONT, fontSize: 36, color: C.white, bold: true,
    });
    addAccentLine(pres, slide, 1.1);

    // Education section header
    slide.addText("Education", {
      x: 0.7, y: 1.8, w: 5, h: 0.4,
      fontFace: FONT, fontSize: 14, color: C.blue, bold: true,
    });

    slide.addText([
      { text: "M.S. Computer Science \u2014 National Taiwan University (GPA: 3.84/4.30)", options: { bullet: true, breakLine: true } },
      { text: "B.S. Electrical Engineering \u2014 National Chiao Tung University (90.2%)", options: { bullet: true, breakLine: true } },
      { text: "Exchange Student \u2014 University of Illinois at Urbana-Champaign", options: { bullet: true } },
    ], {
      x: 0.9, y: 2.2, w: 11, h: 1.4,
      fontFace: FONT, fontSize: 16, color: C.lightGray,
      paraSpaceAfter: 6,
    });

    // Core Experience header
    slide.addText("Core Experience", {
      x: 0.7, y: 3.8, w: 5, h: 0.4,
      fontFace: FONT, fontSize: 14, color: C.blue, bold: true,
    });

    // 3 experience cards
    const cardW = 3.6;
    const cardGap = 0.4;
    const totalCards = 3 * cardW + 2 * cardGap;
    const cardStartX = (W - totalCards) / 2;
    const cardY = 4.3;
    const cardH = 2.6;

    const expCards = [
      { title: "Bottom-Up Platform Development", body: "BSP integration to file services" },
      { title: "Performance Engineering", body: "Tuning and bottleneck analysis" },
      { title: "Quality Assurance", body: "Unit testing, integration testing, work review and product validation" },
    ];

    expCards.forEach((card, i) => {
      const cx = cardStartX + i * (cardW + cardGap);
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: cx, y: cardY, w: cardW, h: cardH,
        fill: { color: C.cardBg }, rectRadius: 0.1,
        line: { color: "3A3A55", width: 1 },
      });
      slide.addText(card.title, {
        x: cx + 0.2, y: cardY + 0.2, w: cardW - 0.4, h: 0.7,
        fontFace: FONT, fontSize: 15, color: C.cyan, bold: true,
        valign: "top",
      });
      slide.addText(card.body, {
        x: cx + 0.2, y: cardY + 0.9, w: cardW - 0.4, h: cardH - 1.1,
        fontFace: FONT, fontSize: 12, color: C.lightGray,
        valign: "top",
      });
    });
    addSlideNumber(slide, 2, 11);
  }

  // ========== SLIDE 3: Technical Experience ==========
  {
    const slide = pres.addSlide();
    slide.background = { color: C.darkBg };

    slide.addText("Technical Experience", {
      x: 0.7, y: 0.4, w: 10, h: 0.7,
      fontFace: FONT, fontSize: 36, color: C.white, bold: true,
    });
    addAccentLine(pres, slide, 1.1);

    const cardW = 5.8;
    const cardH = 2.4;
    const gapX = 0.4;
    const gapY = 0.6;
    const startX = (W - 2 * cardW - gapX) / 2;
    const startY = 1.8;

    const techCards = [
      { title: "Operating System", body: "Debian, Linux Kernel, Filesystem, Block Layer" },
      { title: "Tools", body: "Test suites, AI tools, Fio/iperf/mbw, bpftrace/ss" },
      { title: "Programming & System Languages", body: "C/C++, Go, Shell Scripting, SQL, Python" },
      { title: "Frameworks & Protocols", body: "gRPC, Samba/NFS, libev, FUSE" },
    ];

    techCards.forEach((card, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const cx = startX + col * (cardW + gapX);
      const cy = startY + row * (cardH + gapY);

      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: cx, y: cy, w: cardW, h: cardH,
        fill: { color: C.cardBg }, rectRadius: 0.1,
        line: { color: "3A3A55", width: 1 },
      });
      slide.addText(card.title, {
        x: cx + 0.3, y: cy + 0.2, w: cardW - 0.6, h: 0.5,
        fontFace: FONT, fontSize: 15, color: C.cyan, bold: true,
      });
      slide.addText(card.body, {
        x: cx + 0.3, y: cy + 0.8, w: cardW - 0.6, h: cardH - 1.0,
        fontFace: FONT, fontSize: 14, color: C.lightGray,
        valign: "top",
      });
    });
    addSlideNumber(slide, 3, 11);
  }

  // ========== SLIDE 4: Ubiquiti Career Highlights ==========
  {
    const slide = pres.addSlide();
    slide.background = { color: C.darkBg };

    slide.addText("Ubiquiti \u2014 Career Highlights", {
      x: 0.7, y: 0.4, w: 10, h: 0.7,
      fontFace: FONT, fontSize: 36, color: C.white, bold: true,
    });
    addAccentLine(pres, slide, 1.1);

    slide.addText("UniFi-OS Storage Engineer (2022-Present)", {
      x: 0.7, y: 1.2, w: 10, h: 0.4,
      fontFace: FONT, fontSize: 18, color: C.medGray,
    });

    slide.addText("First NAS! From BSP integration to filesystem services! All-platform optimization.", {
      x: 0.7, y: 1.7, w: 11, h: 0.4,
      fontFace: FONT, fontSize: 16, color: C.lightGray, italic: true,
    });

    // Row 1 metrics
    addMetricBoxes(pres, slide, [
      { number: "0\u21926", label: "Product Variants" },
      { number: "2M", label: "Devices" },
      { number: "180", label: "Support Escalations" },
    ], 2.5);

    // Row 2 metrics
    addMetricBoxes(pres, slide, [
      { number: "3\u21925", label: "Team Scaling" },
      { number: "3", label: "OOM Issues" },
      { number: "544\u2192830", label: "Transfer MB/s" },
    ], 4.5);
    addSlideNumber(slide, 4, 11);
  }

  // ========== SLIDE 5: QNAP Career Highlights ==========
  {
    const slide = pres.addSlide();
    slide.background = { color: C.darkBg };

    slide.addText("QNAP \u2014 Career Highlights", {
      x: 0.7, y: 0.4, w: 10, h: 0.7,
      fontFace: FONT, fontSize: 36, color: C.white, bold: true,
    });
    addAccentLine(pres, slide, 1.1);

    slide.addText("File System Engineer (2018-2022)", {
      x: 0.7, y: 1.2, w: 10, h: 0.4,
      fontFace: FONT, fontSize: 18, color: C.medGray,
    });

    slide.addText("Architected FUSE-based cloud storage gateway with advanced caching, encryption, and comprehensive performance optimization", {
      x: 0.7, y: 1.7, w: 11, h: 0.4,
      fontFace: FONT, fontSize: 16, color: C.lightGray, italic: true,
    });

    addMetricBoxes(pres, slide, [
      { number: "190K+", label: "Deployments" },
      { number: "50M+", label: "Files" },
      { number: "+300%", label: "Metadata Boost" },
    ], 2.5);

    addMetricBoxes(pres, slide, [
      { number: "<20", label: "Support Involvement" },
      { number: "36%", label: "Latency Cut" },
      { number: "22s\u21921s", label: "Dir Deletion" },
    ], 4.5);
    addSlideNumber(slide, 5, 11);
  }

  // ========== SLIDE 6: Case Study 1 — Kernel Upgrade ==========
  {
    const slide = pres.addSlide();
    slide.background = { color: C.darkBg };

    slide.addText("Case Study 1: Linux Kernel Upgrade", {
      x: 0.7, y: 0.2, w: 11, h: 0.6,
      fontFace: FONT, fontSize: 32, color: C.white, bold: true,
    });
    addAccentLine(pres, slide, 0.8, 4);

    // SITUATION
    addSARPanel(pres, slide, "situation", "Situation", "Evaluated fast Btrfs checksum feature for data integrity and CPU resource-saving.", 1.0, 0.9);

    // ACTION
    addSARPanel(pres, slide, "action", "Action", null, 2.0, 3.5);
    addFlowchartBoxes(pres, slide,
      { title: "Btrfs Feature Backporting" },
      [
        { title: "Kernel Upgrade", subtitle: "4.19\u21925.10" },
        { title: "API Compatibility", subtitle: "PCI+AHCI+PHY" },
        { title: "Driver Modernization", subtitle: "PCA9575+RTL8211F" },
      ],
      [
        { title: "Critical Bug Resolution", subtitle: "RAID5+PHY fixes" },
        { title: "Comprehensive Validation", subtitle: "stress-ng+xfstests" },
        { title: "Stable Deployment", subtitle: "Zero regression" },
      ],
      2.3
    );

    // RESULT
    addSARPanel(pres, slide, "result", "Result", null, 5.6, 1.5);
    addMetricBoxes(pres, slide, [
      { number: "32x", label: "Checksum Speed" },
      { number: "0", label: "Regression" },
      { number: "Feature", label: "Scalability" },
      { number: "+40%", label: "SSD IOPS" },
    ], 5.95, 2.2);

    // Speaker notes
    slide.addNotes(
      "**Btrfs Feature Backporting:** Evaluated CRC32C NEON acceleration from kernel 5.10 for ARM64 NAS platform. Baseline: 0.47 GiB/s software CRC32C.\n" +
      "**Kernel Upgrade 4.19\u21925.10:** Full kernel upgrade with Alpine SDK compatibility. Rebuilt bootloader, device tree, and platform drivers.\n" +
      "**API Compatibility:** PCI, AHCI, and PHY subsystem API changes between 4.19 and 5.10. Updated register access patterns.\n" +
      "**Driver Modernization:** PCA9575 GPIO expander and RTL8211F PHY driver updates for new kernel API.\n" +
      "**Critical Bug Resolution:** Fixed RAID5 write-hole and PHY link instability under load.\n" +
      "**Comprehensive Validation:** stress-ng CPU/memory, xfstests filesystem, and fio storage validation across all 6 product variants.\n" +
      "**Stable Deployment:** Zero-regression deployment across UNAS, UNAS4, UNAS Pro product lines."
    );
    addSlideNumber(slide, 6, 11);
  }

  // ========== SLIDE 7: Case Study 2 — NAS Stability Testing ==========
  {
    const slide = pres.addSlide();
    slide.background = { color: C.darkBg };

    slide.addText("Case Study 2: NAS Stability Testing", {
      x: 0.7, y: 0.2, w: 11, h: 0.6,
      fontFace: FONT, fontSize: 32, color: C.white, bold: true,
    });
    addAccentLine(pres, slide, 0.8, 4);

    // SITUATION
    addSARPanel(pres, slide, "situation", "Situation", "NAS platform lacked comprehensive stability testing under IO stress.", 1.0, 0.9);

    // ACTION
    addSARPanel(pres, slide, "action", "Action", null, 2.0, 3.5);
    addFlowchartBoxes(pres, slide,
      { title: "Stability Gap Analysis" },
      [
        { title: "Test Draft", subtitle: "Hardware+software" },
        { title: "Human Resource Allocation", subtitle: "SQA partnership" },
        { title: "Test Finalization", subtitle: "Multi-day cycles" },
      ],
      [
        { title: "Storage Testing", subtitle: "RAID+Btrfs stress" },
        { title: "Cross-Platform Testing", subtitle: "Linux/Mac/Windows" },
        { title: "Stability Validation", subtitle: "Issue discovery" },
      ],
      2.3
    );

    // RESULT
    addSARPanel(pres, slide, "result", "Result", null, 5.6, 1.5);
    addMetricBoxes(pres, slide, [
      { number: "Issues Found", label: "Discovered" },
      { number: "Multi-day", label: "Validation" },
      { number: "6", label: "Product Stability" },
    ], 5.95);

    slide.addNotes(
      "**Stability Gap Analysis:** Identified gaps in storage stress testing \u2014 no multi-day endurance tests, no cross-platform client validation.\n" +
      "**Test Draft:** Designed test matrix covering RAID levels, filesystem operations, and hardware stress scenarios.\n" +
      "**Human Resource Allocation:** Partnered with SQA team to share test infrastructure and execution bandwidth.\n" +
      "**Test Finalization:** Finalized multi-day test cycles with automated log collection and health monitoring.\n" +
      "**Storage Testing:** RAID rebuild under I/O, Btrfs snapshot stress, subvolume deletion under load, scrub during write.\n" +
      "**Cross-Platform Testing:** SMB/NFS access from Linux, macOS, and Windows clients simultaneously.\n" +
      "**Stability Validation:** Discovered OOM under concurrent operations, snapshot leak, and RAID resync stall."
    );
    addSlideNumber(slide, 7, 11);
  }

  // ========== SLIDE 8: Case Study 3 — Samba Performance ==========
  {
    const slide = pres.addSlide();
    slide.background = { color: C.darkBg };

    slide.addText("Case Study 3: Samba Performance", {
      x: 0.7, y: 0.2, w: 11, h: 0.6,
      fontFace: FONT, fontSize: 32, color: C.white, bold: true,
    });
    addAccentLine(pres, slide, 0.8, 4);

    // SITUATION with bar chart
    addSARPanel(pres, slide, "situation", "Situation", null, 1.0, 1.5);
    slide.addText("Samba throughput limited to 544/592 MB/s despite 1050/1025 MB/s network capacity, 951/1850 MB/s storage capacity.", {
      x: 0.75, y: 1.35, w: 6.5, h: 0.9,
      fontFace: FONT, fontSize: 13, color: C.lightGray, valign: "top",
    });

    // Bar chart visual (proportional heights using rectangles)
    const barData = [
      { value: 544, category: "Samba Write" },
      { value: 592, category: "Samba Read" },
      { value: 951, category: "Local Write" },
      { value: 1850, category: "Local Read" },
    ];
    const maxVal = 1850;
    const maxBarH = 1.0;
    const barW = 0.8;
    const barGap = 0.25;
    const barBaseY = 2.35;
    const barStartX = 7.8;

    barData.forEach((b, i) => {
      const bh = (b.value / maxVal) * maxBarH;
      const bx = barStartX + i * (barW + barGap);
      const by = barBaseY - bh;
      const barColor = i < 2 ? C.red : C.green;

      slide.addShape(pres.shapes.RECTANGLE, {
        x: bx, y: by, w: barW, h: bh,
        fill: { color: barColor },
      });
      // Value above bar
      slide.addText(String(b.value), {
        x: bx - 0.1, y: by - 0.28, w: barW + 0.2, h: 0.28,
        fontFace: FONT, fontSize: 12, color: C.white, bold: true, align: "center",
      });
      // Category label below
      slide.addText(b.category, {
        x: bx - 0.15, y: barBaseY + 0.02, w: barW + 0.3, h: 0.25,
        fontFace: FONT, fontSize: 9, color: C.medGray, align: "center",
      });
    });

    // ACTION
    addSARPanel(pres, slide, "action", "Action", null, 2.65, 3.0);
    addFlowchartBoxes(pres, slide,
      { title: "Benchmark Baseline Analysis" },
      [
        { title: "IRQ Isolation", subtitle: "Exclusive core dedication" },
        { title: "IRQ Optimization", subtitle: "RX coalescing+adaptive" },
        { title: "Network Tuning", subtitle: "CUBIC+fq queuing" },
      ],
      [
        { title: "TCP Socket", subtitle: "quickack+nodelay" },
        { title: "TCP Buffer Scaling", subtitle: "rw mem" },
        { title: "Samba Tuning", subtitle: "Zero-copy+async I/O" },
      ],
      2.9
    );

    // RESULT
    addSARPanel(pres, slide, "result", "Result", null, 5.75, 1.4);
    addMetricBoxes(pres, slide, [
      { number: "544\u2192830", label: "Read MB/s" },
      { number: "592\u2192930", label: "Write MB/s" },
      { number: "-30%", label: "CPU Utilization" },
    ], 6.05);

    slide.addNotes(
      "**Benchmark Baseline Analysis:** Used fio sequential read/write benchmarks to establish baseline. Network bottleneck identified: Samba CPU-bound at ~50% single-core utilization.\n" +
      "**IRQ Isolation:** Pinned network IRQs to dedicated CPU core, isolated from Samba worker threads. `echo 2 > /proc/irq/XX/smp_affinity`\n" +
      "**IRQ Optimization:** Enabled adaptive RX coalescing: `ethtool -C eth0 adaptive-rx on rx-usecs 60`. Reduced interrupt rate by 40%.\n" +
      "**Network Tuning:** Switched from default pfifo_fast to fq qdisc: `tc qdisc replace dev eth0 root fq`. Set CUBIC congestion control.\n" +
      "**TCP Socket:** Enabled tcp_quickack and tcp_nodelay for Samba connections. Reduced per-packet latency.\n" +
      "**TCP Buffer Scaling:** Increased tcp_rmem/tcp_wmem: `sysctl net.ipv4.tcp_rmem=\"4096 1048576 16777216\"`. Allowed larger in-flight windows.\n" +
      "**Samba Tuning:** Enabled zero-copy with `use sendfile = yes`, async I/O with `aio read size = 1` and `aio write size = 1`."
    );
    addSlideNumber(slide, 8, 11);
  }

  // ========== SLIDE 9: Additional Achievements ==========
  {
    const slide = pres.addSlide();
    slide.background = { color: C.darkBg };

    slide.addText("Additional Achievements", {
      x: 0.7, y: 0.4, w: 10, h: 0.7,
      fontFace: FONT, fontSize: 36, color: C.white, bold: true,
    });
    addAccentLine(pres, slide, 1.1);

    const cardW = 5.8;
    const cardGap = 0.4;
    const startX = (W - 2 * cardW - cardGap) / 2;
    const cardY = 1.5;
    const cardH = 5.5;

    // Card 1: Innovation & Business Impact
    const c1x = startX;
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: c1x, y: cardY, w: cardW, h: cardH,
      fill: { color: C.cardBg }, rectRadius: 0.1,
      line: { color: "3A3A55", width: 1 },
    });
    slide.addText("Innovation & Business Impact", {
      x: c1x + 0.3, y: cardY + 0.2, w: cardW - 0.6, h: 0.5,
      fontFace: FONT, fontSize: 15, color: C.orange, bold: true,
    });
    slide.addText([
      { text: "Build System Upgrade", options: { bullet: true, breakLine: true } },
      { text: "ZFS Filesystem Support (245 commits, 8 PRs)", options: { bullet: true, breakLine: true } },
      { text: "Debian Trixie Migration (6+ packages)", options: { bullet: true, breakLine: true } },
      { text: "Support Excellence (180 bundles, 60+ issues)", options: { bullet: true, breakLine: true } },
      { text: "Extensible Architecture (NFS/Samba/Drive integration)", options: { bullet: true } },
    ], {
      x: c1x + 0.3, y: cardY + 0.8, w: cardW - 0.6, h: cardH - 1.0,
      fontFace: FONT, fontSize: 13, color: C.lightGray,
      paraSpaceAfter: 8, valign: "top",
    });

    // Card 2: Product Reliability & Performance
    const c2x = startX + cardW + cardGap;
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: c2x, y: cardY, w: cardW, h: cardH,
      fill: { color: C.cardBg }, rectRadius: 0.1,
      line: { color: "3A3A55", width: 1 },
    });
    slide.addText("Product Reliability & Performance", {
      x: c2x + 0.3, y: cardY + 0.2, w: cardW - 0.6, h: 0.5,
      fontFace: FONT, fontSize: 15, color: C.cyan, bold: true,
    });
    slide.addText([
      { text: "NAS Performance Testing Platform (3,787 lines, 11 AI skills)", options: { bullet: true, breakLine: true } },
      { text: "NAS Performance Engineering (iperf 1.9\u21922.3 Gb/s, +21%)", options: { bullet: true, breakLine: true } },
      { text: "gRPC Event Streamer (65% CPU reduction)", options: { bullet: true, breakLine: true } },
      { text: "Metadata Performance (+300% improvement)", options: { bullet: true, breakLine: true } },
      { text: "Memory Optimization (93% buffer waste reduction)", options: { bullet: true, breakLine: true } },
      { text: "Latency Optimization (22s\u21921s deletion, 36% latency cut)", options: { bullet: true } },
    ], {
      x: c2x + 0.3, y: cardY + 0.8, w: cardW - 0.6, h: cardH - 1.0,
      fontFace: FONT, fontSize: 13, color: C.lightGray,
      paraSpaceAfter: 8, valign: "top",
    });
    addSlideNumber(slide, 9, 11);
  }

  // ========== SLIDE 10: Summary ==========
  {
    const slide = pres.addSlide();
    slide.background = { color: C.darkBg };

    slide.addText("Summary", {
      x: 0.7, y: 0.4, w: 10, h: 0.7,
      fontFace: FONT, fontSize: 36, color: C.white, bold: true,
    });
    addAccentLine(pres, slide, 1.1);

    // Tagline
    slide.addText("OS Engineer \u2014 Linux Development, Performance & Storage Infrastructure", {
      x: 0.5, y: 2.2, w: W - 1, h: 0.6,
      fontFace: FONT, fontSize: 24, color: C.blue,
      align: "center", valign: "middle",
    });

    // 3 strengths
    slide.addText("Performance  |  Reliability  |  Scalability", {
      x: 0.5, y: 3.5, w: W - 1, h: 0.5,
      fontFace: FONT, fontSize: 20, color: C.white,
      align: "center", valign: "middle",
    });

    // 4 metric boxes
    addMetricBoxes(pres, slide, [
      { number: "8 Years", label: "Linux Development" },
      { number: "2M+", label: "Users Served" },
      { number: "180", label: "Support Cases" },
      { number: "6", label: "Product Variants" },
    ], 4.8, 2.2);
    addSlideNumber(slide, 10, 11);
  }

  // ========== SLIDE 11: Q&A ==========
  {
    const slide = pres.addSlide();
    slide.background = { color: C.darkBg };

    slide.addText("Questions & Discussion", {
      x: 0.5, y: 2.2, w: W - 1, h: 1,
      fontFace: FONT, fontSize: 48, color: C.white,
      bold: true, align: "center", valign: "middle",
    });

    // Accent line centered
    const lineW = 3.5;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: (W - lineW) / 2, y: 3.4, w: lineW, h: 0.04,
      fill: { color: C.blue },
    });

    slide.addText("Ready to explore how I can contribute to your team", {
      x: 0.5, y: 3.8, w: W - 1, h: 0.5,
      fontFace: FONT, fontSize: 18, color: C.medGray,
      align: "center", valign: "middle",
    });

    // Contact row
    slide.addText("Email: hookey.chiang@gmail.com  |  GitHub: ui-HookeyChiang  |  LinkedIn: hookey-chiang", {
      x: 0.5, y: 5.0, w: W - 1, h: 0.5,
      fontFace: FONT, fontSize: 14, color: C.medGray,
      align: "center", valign: "middle",
    });
    addSlideNumber(slide, 11, 11);
  }

  // Write file
  const outputPath = __dirname + "/interview-presentation.pptx";
  await pres.writeFile({ fileName: outputPath });
  console.log("Generated: " + outputPath);
}

generate().catch((err) => {
  console.error("Generation failed:", err);
  process.exit(1);
});
