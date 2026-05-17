'use client';

import Sheet, { type Cell, type Row, G, LG, MG, W } from './Sheet';
import type { CellSelection } from '../ExcelShell';

const COL_WIDTHS = [36, 30, 180, 220, 180, 130, 60, 60, 60];

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

const rows: Row[] = [
  sectionRow('B1', '="Projects"', hdr('PROJECTS')),
  spacer(6),

  { ref: 'B3', formula: '=XLOOKUP("project_header",Projects!A:A,Projects!B:B)',
    b: sect('Project'), c: sect('Description'), d: sect('Technologies'), e: sect('Status') },
  { ref: 'B4', formula: '=XLOOKUP("home_calc",Projects!A:A,Projects!B:B)', height: 42,
    b: lnk('Home Affordability Calculator', 'https://mortgagecalc.abbyramadan.com'),
    c: plain('Comprehensive tool for understanding home affordability. Features mortgage calculations, interactive visualizations, and personalized analysis based on income, debts, and financial goals.'),
    d: tag('React · TypeScript · Chart.js · Tailwind CSS'),
    e: { value: '✅ Live', color: G, bold: true } },
  spacer(6),
  { ref: 'B6', formula: '=XLOOKUP("more_projects",Projects!A:A,Projects!B:B)',
    b: { value: 'More projects coming soon...', italic: true, color: '#555' }, c: ec(), d: ec(), e: ec() },
  spacer(14),

  sectionRow('B8', '="Skills"', hdr('SKILLS')),
  spacer(6),

  { ref: 'B10', formula: '=XLOOKUP("skill_header",Skills!A:A,Skills!B:B)',
    b: sect('Skill'), c: sect('Category'), d: sect('Proficiency'), e: ec() },
  { ref: 'B11', formula: '=XLOOKUP("excel",Skills!A:A,Skills!B:B)',
    b: lbl('Excel'), c: plain('Finance / Reporting'), d: { value: '★★★★★  Advanced', color: G, bold: true }, e: ec() },
  { ref: 'B12', formula: '=XLOOKUP("sql",Skills!A:A,Skills!B:B)',
    b: lbl('SQL'), c: plain('Data / Reporting'), d: { value: '★★★★☆  Advanced', color: G, bold: true }, e: ec() },
  { ref: 'B13', formula: '=XLOOKUP("forecasting",Skills!A:A,Skills!B:B)',
    b: lbl('Forecasting'), c: plain('Finance'), d: { value: '★★★★☆  Advanced', color: G, bold: true }, e: ec() },
  { ref: 'B14', formula: '=XLOOKUP("python",Skills!A:A,Skills!B:B)',
    b: lbl('Python'), c: plain('Analytics'), d: { value: '★★★☆☆  Intermediate', color: '#555' }, e: ec() },
  { ref: 'B15', formula: '=XLOOKUP("r",Skills!A:A,Skills!B:B)',
    b: lbl('R'), c: plain('Analytics'), d: { value: '★★★☆☆  Intermediate', color: '#555' }, e: ec() },
  { ref: 'B16', formula: '=XLOOKUP("tableau",Skills!A:A,Skills!B:B)',
    b: lbl('Tableau'), c: plain('Visualization'), d: { value: '★★★☆☆  Intermediate', color: '#555' }, e: ec() },
  { ref: 'B17', formula: '=XLOOKUP("powerbi",Skills!A:A,Skills!B:B)',
    b: lbl('PowerBI'), c: plain('Visualization'), d: { value: '★★★☆☆  Intermediate', color: '#555' }, e: ec() },
  { ref: 'B18', formula: '=XLOOKUP("power_automate",Skills!A:A,Skills!B:B)',
    b: lbl('Power Automate'), c: plain('Automation'), d: { value: '★★★☆☆  Intermediate', color: '#555' }, e: ec() },
  spacer(20),
];

export default function ProjectsSheet({ onSelect }: { onSelect: (s: CellSelection) => void }) {
  return <Sheet rows={rows} colWidths={COL_WIDTHS} onSelect={onSelect} />;
}
