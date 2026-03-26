---
name: interview-presentation
description: Structure, styling, and content guidelines for the interactive HTML interview presentation (interview-presentation.html). Use when creating, editing, or customizing the interview slideshow. Also use when generating presentations for job applications, updating case studies, modifying slide content, or when the tailor-resume skill needs presentation rules. Covers SAR framework, visual design, and slide structure.
---

# Interview Presentation Rules

Use this skill when creating or editing `interview-presentation.html`. This defines the structure, styling, and content guidelines for the interactive HTML interview presentation.

## HTML Presentation Generation
The interview presentation (`interview-presentation.html`) is a professional, interactive HTML slideshow created from resume content and milestone documentation.

## Universal 11-Slide Structure (12-15 minutes total)
1. **Cover Slide (30s)**: Name, position, tagline, contact information, key metrics overview
2. **Self Introduction (1min)**: Educational background as bullet points, core expertise with highlighted technical terms
3. **Core Technical Expertise (1-2min)**: Technical capabilities organized in 2x2 grid layout
4. **Current Role Career Highlights (1-2min)**: Role description above metrics, quantified achievements without redundant bullet points
5. **Previous Role Career Highlights (1-2min)**: Role description above metrics, performance improvements and scale achievements
6. **Case Study 1 (2-3min)**: Primary technical domain using SAR framework with interactive flowchart
7. **Case Study 2 (2-3min)**: Secondary technical domain using SAR framework with interactive flowchart
8. **Case Study 3 (2-3min)**: Tertiary technical domain using SAR framework with interactive flowchart
9. **Additional Achievements (1-2min)**: Most contributing items excluding case study overlaps, organized into 4 categories
10. **Summary (1min)**: Professional tagline, three key strengths, and quantified metrics
11. **Q&A (open)**: Interactive discussion with contact information and growth potential metrics

> For Storage & System Engineering experience-specific content (slide mapping, case study domains, metrics), read `references/storage-engineering.md`.

## SAR Framework for Case Studies
Each major project follows the enhanced visual SAR structure presented in Situation -> Action -> Result order:

### Situation (Problem Identification)
- **Format**: 1-2 concise sentences with key terms highlighted in blue
- **Content**: Brief problem description identifying technical limitations or gaps
- **Visual**: Red border with light red gradient background + comparison charts only when meaningful numbers exist
- **Charts**: Use thin bar charts (35px width) with proportional heights when comparing specific performance metrics
- **Chart Guidelines**:
  - Only include charts for concrete comparable numbers (e.g., 544 MB/s vs 1850 MB/s)
  - Remove charts for qualitative descriptions (Basic/Limited/None)
  - Use solid color backgrounds with text shadows for number visibility
  - One number per bar for clear individual comparisons
- **Highlighting**: Technical terms marked with `color: var(--primary-color)` blue spans
- **Goal**: Quickly establish context with highlighted technical focus areas, supported by data visualizations only when they add meaningful value

### Action (Solution Implementation)
- **Format**: Interactive enlarged flowchart boxes (160x80px) replacing bullet points + enhanced two-tier layout
- **Content**: Self-contained technical solutions with clickable cheat sheet access
- **Structure**:
  - **Preparation Box**: Purple gradient (180x80px) showing initial analysis/baseline
  - **Top Tier**: Core system-level optimizations (3 boxes horizontal)
  - **Bottom Tier**: Application/validation-level optimizations (3 boxes horizontal)
- **Visual**: Blue border with light blue gradient background + color-coded gradients per optimization stage
- **Box Content**:
  - Main title (0.9rem)
  - Subtitle (0.9rem)
  - Key detail summary (0.7rem, opacity 0.9)
- **Goal**: Provide comprehensive technical methodology through visual workflow with deep-dive technical access via cheat sheets

### Result (Impact Demonstration)
- **Format**: Before/after bar charts + prominent percentage improvement metrics
- **Content**: Quantified outcomes with visual before/after comparison plus impact metric boxes
- **Visual**: Green border (`var(--success-color)`) with light green gradient background + dual chart/metrics layout
- **Design**: Side-by-side performance comparison with percentage improvements prominently displayed
- **Goal**: Make achievements visually striking and quantifiably memorable

## Interactive Features

### Interactive Cheat Sheets (20 total)
- **Modal overlays** with comprehensive technical detail accessible via click interactions
- **Two Format Types**:
  - **Technical Cheat Sheets**: Command-line examples with syntax highlighting for flowchart boxes
  - **Summary Cheat Sheets**: Clean bullet-point lists for result metric boxes (no commands)
- **Navigation**: ESC key and click-outside closing, proper focus management
- **Clickable Elements**: Both flowchart boxes and result metric boxes support cheat sheet interaction

### Action Flowchart Cheat Sheet Rules
- **Interactive Elements**: Each flowchart box clickable with `data-cheat` attributes linking to detailed technical cheat sheets
- **Technical Cheat Sheets**: Modal overlays containing:
  - Professional command-line examples with syntax highlighting
  - Technical explanations and context for each optimization
  - Production-ready Linux commands and configuration details
- **Content Structure**: Step-by-step technical implementation with practical examples
- **Code Examples**: Real commands and configurations used in production environments

### Result Box Cheat Sheet Rules
- **Summary Cheat Sheets**: Clean bullet-point lists without command-line examples
- **Content Focus**: Simple lists of items/capabilities/issues without technical details
- **Format**: Large font (1.2rem), good line spacing (line-height: 2), disc bullet points

## Generic Presentation Guidelines

### Universal Presentation Standards
- **Time Control**: 12-15 minutes optimal presentation length with 5-10 minutes for Q&A
- **Navigation**: Arrow keys only (left/right), ESC for fullscreen, no automatic slide changes
- **Language**: English only for professional presentation with technical depth
- **Story Structure**: Three comprehensive case studies demonstrating different technical domains

### Visual Design System
- **Color Scheme**: Unified blue primary color (`var(--primary-color)` #3E6D9C) for all highlights, metrics, and technical terms
- **List Styling**: Bold list titles use dark gray (`var(--text-dark)` #1f2937) instead of primary blue for better visual hierarchy
- **Spacing Standards**: 20px padding, 30px gaps, 25px clearance for proper element spacing
- **Interactive Elements**:
  - **Hover Effects**: Enhanced visual feedback with transform and shadow changes
  - **Flow Arrows**: Directional indicators showing logical progression between stages
  - **Color Coding**: Distinct gradients per optimization stage for visual hierarchy

### Content Organization Principles
- **Technical Depth**: Balance high-level overview with specific technical examples and quantified results
- **Content Structure**:
  - Self-introduction sections formatted as bullet point lists
  - Career highlights with one-liner responsibility descriptions above metric boxes
  - Technical expertise with brief descriptive words (e.g., "C/C++ system programming")
- **Design Principle**: Self-contained boxes eliminate redundant bullet points while providing deeper technical access

## Technical Features
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Keyboard Navigation**: left/right arrow keys, Space, Page Up/Down, Home, End
- **Fullscreen Mode**: ESC key toggles fullscreen for presentation
- **Interactive Elements**: Hover effects on cards, smooth transitions
- **Print Friendly**: Optimized CSS for printing or PDF export

## Content Sources
- **Resume sections**: All `.tex` files in `src/resume/` directory for professional summary and technical skills
- **Personal details**: Contact information and professional positioning from `src/resume.tex`

## Summary Slide (Slide 10) Structure

The Summary slide uses a clean three-section format: tagline, key strengths, and supporting metrics:

### Professional Tagline Section
A centered, prominent tagline that encapsulates your professional identity:
- **Format**: Single line, centered text with large font (2.0rem)
- **Content**: Concise statement of value delivery or professional approach
- **Example**: "Delivering Stable and Efficient Solutions"
- **Customization**: Adapt to match role requirements and company values

### Three Key Strengths Section
Horizontal display of core competencies with visual separators:
- **Layout**: Three strengths displayed in single line with pipe separators (|)
- **Format**: Emoji + Keyword for each strength
- **Structure**: Performance | Reliability | Scalability
- **Customization**: Select strengths most relevant to job requirements
- **Visual Design**: Centered alignment, consistent spacing, accent color

**Common Strength Categories:**
- **Technical**: Performance, Architecture, Innovation, Automation
- **Quality**: Reliability, Stability, Security, Testing
- **Business**: Scalability, Efficiency, Leadership, Impact

### Quantified Metrics Section
Four key metrics displayed in metric boxes below the strengths:
- **Experience Duration**: Years of relevant experience (e.g., "8 Years Linux Development")
- **Scale/Volume**: Production impact numbers (e.g., "210K+ Users Served", "6 Product Variants")
- **Quality/Efficiency**: Process improvement metrics (e.g., "<20 Support Cases")
- **Technical Achievement**: Specific technical accomplishments (e.g., "120 Test Cases")

### Design Guidelines
- **Clean Layout**: Minimal text, maximum impact through concise messaging
- **Visual Hierarchy**: Tagline to Strengths to Supporting metrics progression
- **Memorable Format**: Simple tagline + three keywords easy for interviewers to recall
- **Professional Appeal**: Clean, centered design with consistent color scheme
- **Job Alignment**: All content should directly address role requirements and demonstrate fit
- **Identity Consistency**: The tagline, metric labels, and framing must match the resume summary identity (e.g., "OS Engineer" not "Firmware Engineer"; "Years Linux Development" not "Years Firmware Experience"). When the resume identity changes, update all presentation references.

## Job Description Customization

When a specific job description is provided, customize the presentation to align with the role requirements:

### Summary Slide (Slide 10) Customization
When job description is explicitly provided, tailor the summary slide elements:

**1. Professional Tagline**
- Craft tagline to reflect key job requirements and company values
- Examples:
  - Test Automation Role: "Delivering Robust and Automated Solutions"
  - Performance Engineering: "Optimizing Systems for Peak Performance"
  - Platform Architecture: "Building Scalable and Reliable Platforms"
  - DevOps Engineering: "Streamlining Development and Operations"

**2. Three Key Strengths Selection**
- Choose three strengths that directly address job requirements:
  - **Technical Skills**: Performance, Architecture, Automation, Security
  - **Quality Focus**: Reliability, Stability, Testing, Validation
  - **Business Impact**: Scalability, Efficiency, Innovation, Leadership
- Match strength keywords to job posting terminology
- Prioritize strengths mentioned multiple times in job description

**3. Quantified Metrics**
- Prioritize metrics most relevant to the role
- Adjust metric labels to match job context:
  - For test automation roles: Emphasize coverage, efficiency, reliability improvements
  - For infrastructure roles: Focus on system scale and performance gains
  - For leadership roles: Highlight team growth and process improvements
  - For firmware roles: Show platform experience and validation expertise

### Content Adaptation Guidelines
- **Technical Keywords**: Incorporate key technologies and methodologies mentioned in job description
- **Experience Level**: Emphasize achievements matching the required experience level
- **Role Focus**: Adjust case study emphasis based on primary job responsibilities
- **Company Context**: Consider company size, industry, and technical challenges when selecting relevant achievements
- **Skills Alignment**: Ensure selected achievements demonstrate required hard and soft skills

### Example Adaptations
**For Senior Infrastructure Engineer Role:**
- Tagline: "Infrastructure Architect - Performance Engineer - System Reliability Expert"
- Emphasis: Kernel upgrades, system optimization, large-scale deployments
- Metrics: Focus on system stability, performance improvements, infrastructure scale

**For Product Engineering Manager Role:**
- Tagline: "Product Engineering Leader - Platform Architect - Team Builder"
- Emphasis: Product development, team leadership, business impact
- Metrics: Highlight product growth, team scaling, user impact numbers

## Navigation Controls
- **Left/Right Arrow Keys**: Primary navigation method
- **Space/Page Down**: Next slide
- **Page Up**: Previous slide
- **Home**: First slide
- **End**: Last slide
- **ESC**: Toggle fullscreen mode
- **No Auto-advance**: Manual control only to prevent accidental slide changes
