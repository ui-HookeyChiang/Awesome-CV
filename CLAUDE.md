# Awesome-CV LaTeX Resume & Interview Presentation Project

## Project Overview
This project uses the Awesome-CV LaTeX template to generate professional resumes and CVs, enhanced with an interactive HTML interview presentation system. The main working files are in `src/` with milestone documentation in `milestone/` and a comprehensive interview presentation (`interview-presentation.html`).

## File Structure
- `src/resume.tex` - Main resume document
- `src/resume/` - Individual resume sections (summary, experience, education, etc.)
- `milestone/` - Career milestone documentation (summary.md, qnap.md, ubiquiti.md)
- `interview-presentation.html` - Interactive HTML slideshow for technical interviews
- `examples/` - Template examples and generated outputs

## Build Commands
```bash
# Build resume from src/ directory
cd src && xelatex resume.tex

# Build all examples using Makefile
make examples

# Clean generated files
make clean
```

## Key Files
- `src/resume.tex` - Main resume file with personal information and section imports
- `src/resume/experience.tex` - Professional experience section
- `src/resume/summary.tex` - Professional summary
- `src/resume/education.tex` - Education background
- `src/resume/scholar.tex` - Scholarly activities
- `src/resume/leadership.tex` - Leadership experience

## Content and Formatting Guidelines

### Line Length Requirements
To prevent hyphenated word breaks, maintain these character limits per complete item of continuous text.
Count only the rendered display text, excluding LaTeX markup, indentation, and line numbers.

#### Environment-Specific Character Limits

- **cvparagraph environment**: 95-102, 190-204, or 285-306 characters per complete item
  - Used in: `resume/summary.tex`
  - Purpose: Professional summary paragraphs and first impression
  - Target: Aim for lower multiples (95-102 preferred over 190-204 over 285-306)
  - Maximum: Total paragraph should not exceed 510 characters (approximately 5 lines)
  - Measurement: Count all text within `\cvparagraph{}` that appears in final output

- **cvitems environment**: 95-100, 190-200, or 285-300 characters per complete item
  - Used in: `experience.tex`, `education.tex`, `scholar.tex`, `leadership.tex`
  - Purpose: Main bullet points summarizing roles, achievements, or milestones
  - Target: Aim for lower multiples (95-102 preferred over 190-204 over 285-306)
  - Measurement: Count all text within `\item{}` braces that appears in final output
  - Line breaks: Use natural word boundaries, maintain proper indentation

- **itemize environment**: 91-96, 182-192, or 273-288 characters per complete item
  - Used within: cvitems blocks for detailed sub-points
  - Purpose: Specific achievements, technical details, or supporting evidence
  - Target: Aim for lower multiples (91-96 preferred over 182-192 over
    273-288)
  - Measurement: Count all text within nested `\item{}` braces that appears in final output
  - Line breaks: Maintain proper indentation and break at natural word boundaries

#### Character Counting Methodology
- **Include**: All letters, numbers, spaces, punctuation marks, special characters (%, \, /)
- **Exclude**: LaTeX commands (`\item`, `\cvparagraph`, `\begin`, `\end`), all braces (`{}`), indentation spaces, line numbers
- **Validation**: Each complete item must fall within one of the specified character ranges
- **Preference**: Choose the lowest suitable multiple that accommodates the content appropriately

#### Quality Guidelines
- **Conciseness**: Shorter content within range is preferred over longer content
- **Natural breaks**: Line breaks should occur at natural word boundaries
- **Content density**: Pack meaningful information efficiently within character limits
- **Technical accuracy**: Maintain precision while respecting character constraints

### Content Structure
- **cvparagraph**: Overall summarizing.
- **cvitems**: Focus on impact and results (what you achieved)
- **itemize**: Provide specific details and evidence (how you achieved it)

### Formatting Rules
1. Break lines at natural word boundaries when approaching character limits
2. Never let LaTeX hyphenate words across lines
3. Maintain consistent indentation within each environment type
4. Use action verbs and quantifiable results where possible

## Build Requirements
- XeLaTeX engine
- Awesome-CV class file (`awesome-cv.cls`)

## Generic Interview Presentation Framework

### HTML Presentation Generation
The interview presentation (`interview-presentation.html`) is a professional, interactive HTML slideshow created from resume content and milestone documentation.

### Universal 11-Slide Structure (12-15 minutes total)
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

## Storage & System Engineering Experience Implementation

### Experience-Specific Slide Content
1. **Cover Slide**: Senior System Engineer & Storage Architect (7+ years, 5K sales, 210K+ users) - *Use milestone/summary.md*
2. **Self Introduction**: Computer Science background, storage/performance/QA expertise - *Use milestone/summary.md*
3. **Technical Expertise**: Tools & DevOps (top-left), Storage & Filesystem (top-right), Programming & System Languages (bottom-left), Frameworks & Protocols (bottom-right) - *Use milestone/summary.md*
4. **Ubiquiti Highlights**: UniFi-OS Storage Software Engineer achievements - *Use milestone/ubiquiti.md*
5. **QNAP Highlights**: Cloud filesystem and performance engineering - *Use milestone/qnap.md*
6. **Case Study 1: NAS Stability Testing**: Cross-team collaboration and platform stability - *Use milestone/ubiquiti.md, no charts (qualitative)*
7. **Case Study 2: Linux Kernel Upgrade**: System infrastructure modernization (4.19 → 5.10) - *Use milestone/ubiquiti.md, no charts (qualitative)*
8. **Case Study 3: Samba Performance**: Full-stack performance engineering - *Use milestone/ubiquiti.md, with performance comparison charts*
9. **Additional Achievements**: Product Innovation & Leadership, Performance Engineering Excellence, Business Impact & Scalability, Technical Architecture & Innovation
10. **Summary**: Customizable based on job requirements - *Align with role-specific needs*

### SAR Framework for Case Studies
Each major project follows the enhanced visual SAR structure presented in Situation → Action → Result order:

#### 🔴 Situation (Problem Identification)
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

#### 🔵 Action (Solution Implementation)
- **Format**: Interactive enlarged flowchart boxes (160×80px) replacing bullet points + enhanced two-tier layout
- **Content**: Self-contained technical solutions with clickable cheat sheet access
- **Structure**:
  - **Preparation Box**: Purple gradient (180×80px) showing initial analysis/baseline (e.g., "FIO Benchmark", "Btrfs Analysis", "Stability Gap Analysis")
  - **Top Tier**: Core system-level optimizations (3 boxes horizontal)
  - **Bottom Tier**: Application/validation-level optimizations (3 boxes horizontal)
- **Visual**: Blue border with light blue gradient background + color-coded gradients per optimization stage
- **Box Content**:
  - Main title (0.9rem)
  - Subtitle (0.9rem)
  - Key detail summary (0.7rem, opacity 0.9)
- **Goal**: Provide comprehensive technical methodology through visual workflow with deep-dive technical access via cheat sheets

#### 🟢 Result (Impact Demonstration)
- **Format**: Before/after bar charts + prominent percentage improvement metrics
- **Content**: Quantified outcomes with visual before/after comparison plus impact metric boxes
- **Visual**: Green border (`var(--success-color)`) with light green gradient background + dual chart/metrics layout
- **Design**: Side-by-side performance comparison with percentage improvements prominently displayed
- **Goal**: Make achievements visually striking and quantifiably memorable

### Interactive Features

#### Interactive Cheat Sheets (20 total)
- **Modal overlays** with comprehensive technical detail accessible via click interactions
- **Two Format Types**:
  - **Technical Cheat Sheets**: Command-line examples with syntax highlighting for flowchart boxes
  - **Summary Cheat Sheets**: Clean bullet-point lists for result metric boxes (no commands)
- **Navigation**: ESC key and click-outside closing, proper focus management
- **Clickable Elements**: Both flowchart boxes and result metric boxes support cheat sheet interaction

#### Action Flowchart Cheat Sheet Rules
- **Interactive Elements**: Each flowchart box clickable with `data-cheat` attributes linking to detailed technical cheat sheets
- **Technical Cheat Sheets**: Modal overlays containing:
  - Professional command-line examples with syntax highlighting
  - Technical explanations and context for each optimization
  - Production-ready Linux commands and configuration details
- **Content Structure**: Step-by-step technical implementation with practical examples
- **Code Examples**: Real commands and configurations used in production environments

#### Result Box Cheat Sheet Rules  
- **Summary Cheat Sheets**: Clean bullet-point lists without command-line examples
- **Content Focus**: Simple lists of items/capabilities/issues without technical details
- **Format**: Large font (1.2rem), good line spacing (line-height: 2), disc bullet points
- **Examples**:
  - **Multi-issue Discovered (Case Study 1)**: Simple list of critical issues found during testing
  - **Product Scalability (Case Study 2)**: Clean list of Linux 5.10 capabilities enabled

#### Result Metric Visualizations
- **Before/after performance comparisons** + percentage improvement metric boxes
- **Case Study 1**: 3-box layout (Multi-issue discovered with clickable list cheat sheet, Multi-day validation, Cross-platform stability)
- **Case Study 2**: 4-box layout (checksum GB/s improvement, +40% SSD IOPS, Zero regressions, Linux 5.10 Capabilities with clickable list cheat sheet)
- **Case Study 3**: 3-box layout (Samba read/write MB/s improvements, CPU utilization reduction)

### Generic Presentation Guidelines

#### Universal Presentation Standards
- **Time Control**: 12-15 minutes optimal presentation length with 5-10 minutes for Q&A
- **Navigation**: Arrow keys only (← →), ESC for fullscreen, no automatic slide changes
- **Language**: English only for professional presentation with technical depth
- **Story Structure**: Three comprehensive case studies demonstrating different technical domains

#### Visual Design System
- **Color Scheme**: Unified blue primary color (`var(--primary-color)` #3E6D9C) for all highlights, metrics, and technical terms
- **List Styling**: Bold list titles use dark gray (`var(--text-dark)` #1f2937) instead of primary blue for better visual hierarchy
- **Spacing Standards**: 20px padding, 30px gaps, 25px clearance for proper element spacing
- **Interactive Elements**:
  - **Hover Effects**: Enhanced visual feedback with transform and shadow changes
  - **Flow Arrows**: Directional indicators showing logical progression between stages
  - **Color Coding**: Distinct gradients per optimization stage for visual hierarchy

#### Content Organization Principles
- **Technical Depth**: Balance high-level overview with specific technical examples and quantified results
- **Content Structure**:
  - Self-introduction sections formatted as bullet point lists
  - Career highlights with one-liner responsibility descriptions above metric boxes
  - Technical expertise with brief descriptive words (e.g., "C/C++ system programming")
- **Design Principle**: Self-contained boxes eliminate redundant bullet points while providing deeper technical access

### Experience-Specific Guidelines

#### Storage & System Engineering Focus
- **Case Study Domains**: Three technical areas (testing infrastructure, system modernization, performance optimization)
- **Specific Case Studies**: 
  - **NAS Stability Testing**: Cross-team collaboration and platform stability validation
  - **Linux Kernel Upgrade**: System infrastructure modernization (4.19 → 5.10)
  - **Samba Performance**: Full-stack performance engineering optimization
- **Technical Expertise Areas**: Storage architecture, filesystem engineering, performance optimization, quality assurance
- **Key Metrics Integration**: 
  - CI/CD pipeline achievement from QNAP (<20 support cases) properly attributed to QNAP experience
  - Platform scaling (1→6 product variants, 3→5 engineering team growth)
  - Performance improvements (544→730 MB/s Samba, +40% SSD IOPS, 300% metadata boost)

### Technical Features
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Keyboard Navigation**: ← → arrow keys, Space, Page Up/Down, Home, End
- **Fullscreen Mode**: ESC key toggles fullscreen for presentation
- **Interactive Elements**: Hover effects on cards, smooth transitions
- **Print Friendly**: Optimized CSS for printing or PDF export

### Content Sources
- **Resume sections**: All `.tex` files in `src/resume/` directory for professional summary and technical skills
- **Milestone documentation**:
  - `milestone/ubiquiti.md` and `milestone/qnap.md` and `milestone/summary.md` except core expertise sections for achievements and SAR case studies
  - `milestone/summary.md` for: Cover slide, Self Introduction, Core Technical Expertise, and Summary slide
  - **Content Guidelines**:
    - Use `milestone/summary.md` for high-level expertise and capability descriptions
    - Use specific milestone files (`ubiquiti.md`, `qnap.md`) for detailed achievements, case studies, and quantified results
- **Personal details**: Contact information and professional positioning from `src/resume.tex`
- **Technical depth**: Specific case studies from Ubiquiti milestone documentation (Stability Testing, Kernel Upgrade, Performance Optimization)
- **Quantified metrics**: Business impact numbers (190K+ devices, 5K monthly sales, performance improvements, CI/CD automation results)

#### Content Guidelines
- **Focus**: Unique achievements not covered in the three main case studies (NAS Stability Testing, Linux Kernel Upgrade, Samba Performance)
- **Sources**: Highest-impact contributions from both resume and milestone documentation
- **Exclusions**: Academic achievements and content overlapping with case studies
- **Metrics**: Include concrete numbers and business impact where available
- **Organization**: Four balanced categories showcasing different aspects of technical leadership

### Summary Slide (Slide 10) Structure

The Summary slide uses a clean three-section format: tagline, key strengths, and supporting metrics:

#### Professional Tagline Section
A centered, prominent tagline that encapsulates your professional identity:
- **Format**: Single line, centered text with large font (2.0rem)
- **Content**: Concise statement of value delivery or professional approach
- **Example**: "Delivering Stable and Efficient Solutions"
- **Customization**: Adapt to match role requirements and company values

#### Three Key Strengths Section  
Horizontal display of core competencies with visual separators:
- **Layout**: Three strengths displayed in single line with pipe separators (|)
- **Format**: Emoji + Keyword for each strength
- **Structure**: 🚀 Performance | 🔒 Reliability | 📈 Scalability
- **Customization**: Select strengths most relevant to job requirements
- **Visual Design**: Centered alignment, consistent spacing, accent color

**Common Strength Categories:**
- **Technical**: Performance, Architecture, Innovation, Automation
- **Quality**: Reliability, Stability, Security, Testing  
- **Business**: Scalability, Efficiency, Leadership, Impact

#### Quantified Metrics Section
Four key metrics displayed in metric boxes below the strengths:
- **Experience Duration**: Years of relevant experience (e.g., "7+ Years Firmware Experience")
- **Scale/Volume**: Production impact numbers (e.g., "210K+ Users Served", "6 Product Variants")
- **Quality/Efficiency**: Process improvement metrics (e.g., "<20 Support Cases")  
- **Technical Achievement**: Specific technical accomplishments (e.g., "120 Test Cases")

#### Design Guidelines
- **Clean Layout**: Minimal text, maximum impact through concise messaging
- **Visual Hierarchy**: Tagline → Strengths → Supporting metrics progression
- **Memorable Format**: Simple tagline + three keywords easy for interviewers to recall
- **Professional Appeal**: Clean, centered design with consistent color scheme
- **Job Alignment**: All content should directly address role requirements and demonstrate fit

### Job Description Customization

When a specific job description is provided, customize the presentation to align with the role requirements:

#### Summary Slide (Slide 10) Customization
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

#### Content Adaptation Guidelines
- **Technical Keywords**: Incorporate key technologies and methodologies mentioned in job description
- **Experience Level**: Emphasize achievements matching the required experience level
- **Role Focus**: Adjust case study emphasis based on primary job responsibilities
- **Company Context**: Consider company size, industry, and technical challenges when selecting relevant achievements
- **Skills Alignment**: Ensure selected achievements demonstrate required hard and soft skills

#### Example Adaptations
**For Senior Infrastructure Engineer Role:**
- Tagline: "Infrastructure Architect • Performance Engineer • System Reliability Expert"
- Emphasis: Kernel upgrades, system optimization, large-scale deployments
- Metrics: Focus on system stability, performance improvements, infrastructure scale

**For Product Engineering Manager Role:**  
- Tagline: "Product Engineering Leader • Platform Architect • Team Builder"
- Emphasis: Product development, team leadership, business impact
- Metrics: Highlight product growth, team scaling, user impact numbers

### Navigation Controls
- **← → Arrow Keys**: Primary navigation method
- **Space/Page Down**: Next slide
- **Page Up**: Previous slide
- **Home**: First slide
- **End**: Last slide
- **ESC**: Toggle fullscreen mode
- **No Auto-advance**: Manual control only to prevent accidental slide changes

## Interview Speech Script Creation

### Speech Script Generation Process
```bash
# Create interview speech script from presentation content
# The speech script is derived from interview-presentation.md and includes:
# - Structured timing for 12-15 minute presentation
# - Natural speaking transitions between sections
# - Emphasis on quantifiable achievements and technical impact
# - Professional opening and closing statements
# - Clear section breaks for pacing and emphasis
```

### Speech Script Structure
The interview speech script (`interview-speech.md`) includes:
1. **Opening (30 seconds)**: Professional introduction and overview
2. **About Me (1 minute)**: Background, education, and career impact
3. **Core Technical Expertise (2 minutes)**: Four key technical areas with examples
4. **Professional Experience - Ubiquiti (3 minutes)**: Current role achievements
5. **Professional Experience - QNAP (2 minutes)**: Previous role accomplishments
6. **Research and Technical Projects (1 minute)**: Academic and technical contributions
7. **Leadership Experience (1 minute)**: Management and community leadership
8. **Key Accomplishments Summary (1 minute)**: Quantified impact across roles
9. **Closing (30 seconds)**: Professional conclusion and discussion invitation

### Speech Script Features
- **Timing optimized**: 12-15 minute presentation with 5-10 minutes for Q&A
- **Natural flow**: Smooth transitions between technical and business achievements
- **Quantified impact**: Specific numbers and performance improvements
- **Technical depth**: Balance of high-level overview and detailed technical examples
- **Professional tone**: Appropriate for technical interviews and engineering roles
- **Speaking cues**: Clear section breaks and emphasis points for delivery

### Content Sources
- **Base content**: `interview-presentation.html` structured presentation
- **Speaking adaptation**: Natural language flow and timing considerations
- **High-level content**: `milestone/summary.md` core expertise for opening, self-introduction, expertise overview, and closing sections
- **Technical examples**: Specific achievements with quantified results from `milestone/ubiquiti.md` and `milestone/qnap.md`
- **Professional framing**: Interview-appropriate opening and closing using summary expertise descriptions
- **Content Guidelines**: 
  - Use `milestone/summary.md` for capability descriptions in introduction/summary sections
  - Use specific milestone files for detailed case studies and achievements

## Output Files
- **Primary resume**: `src/resume.pdf`
- **Interview presentation**: `interview-presentation.html` (interactive slideshow)
- **Interview speech script**: `interview-speech.md` (speaking notes)
- **Example outputs**: Available in `examples/` directory

## Usage Instructions

### Building Resume
```bash
cd src && xelatex resume.tex
```

### Using Interview Presentation
1. Open `interview-presentation.html` in any modern web browser
2. Use ← → arrow keys to navigate between slides
3. Press ESC for fullscreen presentation mode
4. No automatic slide changes - full manual control for interview safety
