'use client';

import Sheet, { type Cell, type Row, G, LG, MG, W } from './Sheet';
import type { CellSelection } from '../ExcelShell';

// Desktop layout: content lives in D..G (Sheet.tsx FIRST/LAST_CONTENT_COL).
// A, B, C are leading filler; H, I, J, K are trailing filler.
// Order: row# | A | B | C | D | E | F | G | H | I | J | K
const COL_WIDTHS = [36, 150, 150, 150, 200, 260, 200, 150, 150, 100, 100, 100];

function ec(): Cell { return { value: '' }; }
function hdr(v: string): Cell { return { value: v, bold: true, bg: G, color: W }; }
function sect(v: string): Cell { return { value: v, bold: true, bg: MG, color: W }; }
function lbl(v: string): Cell { return { value: v, bold: true, color: '#1a1a1a' }; }
function plain(v: string): Cell { return { value: v, color: '#222' }; }
function tag(v: string): Cell { return { value: v, color: G, bg: LG }; }
function lnk(v: string, href: string): Cell { return { value: v, color: '#0563c1', link: href }; }

function sectionRow(ref: string, formula: string, b: Cell, height?: number): Row {
  return { ref, formula, height, b, c: { value: '', bg: b.bg }, d: { value: '', bg: b.bg }, e: { value: '', bg: b.bg } };
}
function spacer(height = 6): Row {
  return { ref: '', formula: '', height, b: ec(), c: ec(), d: ec(), e: ec() };
}

// Build a skill row: desktop = skill | category | proficiency, mobile = "Skill — proficiency"
function skillRow(ref: string, formula: string, name: string, category: string, prof: Cell): Row[] {
  return [
    { ref, formula,
      b: lbl(name), c: plain(category), d: prof, e: ec(),
      desktopOnly: true },
    { ref, formula, height: 22,
      b: { value: `${name} — ${prof.value}`, color: prof.color ?? '#222', bold: !!prof.bold },
      c: ec(), d: ec(), e: ec(),
      mobileOnly: true },
  ];
}

const rows: Row[] = ([
  sectionRow('B1', '="Projects"', hdr('PROJECTS')),
  spacer(6),

  // Desktop: table header (Project / Description / Technologies / Status) — hidden on mobile
  { ref: 'B3', formula: '=XLOOKUP("project_header",Projects!A:A,Projects!B:B)',
    b: sect('Project'), c: sect('Description'), d: sect('Technologies'), e: sect('Status'),
    desktopOnly: true },

  // Desktop: single project row with all columns
  { ref: 'B4', formula: '=XLOOKUP("home_calc",Projects!A:A,Projects!B:B)', height: 42,
    b: lnk('Home Affordability Calculator', 'https://mortgagecalc.abbyramadan.com'),
    c: plain('Comprehensive tool for understanding home affordability. Features mortgage calculations, interactive visualizations, and personalized analysis based on income, debts, and financial goals.'),
    d: tag('React · TypeScript · Chart.js · Tailwind CSS'),
    e: { value: '✅ Live', color: G, bold: true },
    desktopOnly: true },

  // Mobile: same project as a card — link, status, description, tech stack stacked
  { ref: 'B4', formula: '=XLOOKUP("home_calc",Projects!A:A,Projects!B:B)', height: 22,
    b: lnk('Home Affordability Calculator', 'https://mortgagecalc.abbyramadan.com'),
    c: ec(), d: ec(), e: ec(),
    mobileOnly: true },
  { ref: '', formula: '', height: 18,
    b: { value: '✅ Live', color: G, bold: true }, c: ec(), d: ec(), e: ec(),
    mobileOnly: true },
  { ref: '', formula: '', height: 60,
    b: plain('Comprehensive tool for understanding home affordability. Features mortgage calculations, interactive visualizations, and personalized analysis based on income, debts, and financial goals.'),
    c: ec(), d: ec(), e: ec(),
    mobileOnly: true },
  { ref: '', formula: '', height: 22,
    b: tag('React · TypeScript · Chart.js · Tailwind CSS'), c: ec(), d: ec(), e: ec(),
    mobileOnly: true },

  spacer(6),
  { ref: 'B6', formula: '=XLOOKUP("more_projects",Projects!A:A,Projects!B:B)',
    b: { value: 'More projects coming soon...', italic: true, color: '#555' }, c: ec(), d: ec(), e: ec() },
  spacer(14),

  sectionRow('B8', '="Skills"', hdr('SKILLS')),
  spacer(6),

  // Desktop: skill table header — hidden on mobile
  { ref: 'B10', formula: '=XLOOKUP("skill_header",Skills!A:A,Skills!B:B)',
    b: sect('Skill'), c: sect('Category'), d: sect('Proficiency'), e: ec(),
    desktopOnly: true },

  skillRow('B11', '=XLOOKUP("excel",Skills!A:A,Skills!B:B)', 'Excel', 'Finance / Reporting', { value: '★★★★★  Advanced', color: G, bold: true }),
  skillRow('B12', '=XLOOKUP("sql",Skills!A:A,Skills!B:B)', 'SQL', 'Data / Reporting', { value: '★★★★☆  Advanced', color: G, bold: true }),
  skillRow('B13', '=XLOOKUP("forecasting",Skills!A:A,Skills!B:B)', 'Forecasting', 'Finance', { value: '★★★★☆  Advanced', color: G, bold: true }),
  skillRow('B14', '=XLOOKUP("python",Skills!A:A,Skills!B:B)', 'Python', 'Analytics', { value: '★★★☆☆  Intermediate', color: '#555' }),
  skillRow('B15', '=XLOOKUP("r",Skills!A:A,Skills!B:B)', 'R', 'Analytics', { value: '★★★☆☆  Intermediate', color: '#555' }),
  skillRow('B16', '=XLOOKUP("tableau",Skills!A:A,Skills!B:B)', 'Tableau', 'Visualization', { value: '★★★☆☆  Intermediate', color: '#555' }),
  skillRow('B17', '=XLOOKUP("powerbi",Skills!A:A,Skills!B:B)', 'PowerBI', 'Visualization', { value: '★★★☆☆  Intermediate', color: '#555' }),
  skillRow('B18', '=XLOOKUP("power_automate",Skills!A:A,Skills!B:B)', 'Power Automate', 'Automation', { value: '★★★☆☆  Intermediate', color: '#555' }),
  spacer(20),
] as (Row | Row[])[]).flat();

export default function ProjectsSheet({ onSelect }: { onSelect: (s: CellSelection) => void }) {
  return <Sheet rows={rows} colWidths={COL_WIDTHS} onSelect={onSelect} />;
}
