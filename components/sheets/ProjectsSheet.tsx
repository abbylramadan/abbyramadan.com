'use client';

import { useState } from 'react';
import type { CellSelection } from '../ExcelShell';

const COLS = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const COL_WIDTHS = [36, 30, 180, 220, 180, 130, 60, 60, 60];
const BORDER = '1px solid #d0d7de';

const G = '#217346';
const LG = '#e9f5ee';
const MG = '#107c41';
const W = '#ffffff';
const SEL = '#217346';
const SEL_BG = '#e2efda';

const FIRST_COL = 2;
const LAST_COL = 5;

type Cell = {
  value: string;
  bold?: boolean;
  color?: string;
  bg?: string;
  italic?: boolean;
  link?: string;
  align?: 'left' | 'center' | 'right';
};

type Row = {
  b: Cell; c: Cell; d: Cell; e: Cell;
  height?: number;
  ref: string;
  formula: string;
};

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
  return { ref: '', formula: '=""', height, b: ec(), c: ec(), d: ec(), e: ec() };
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

const TOTAL_ROWS = rows.length;

type Sel =
  | { type: 'cell'; ri: number; tci: number }
  | { type: 'col';  tci: number }
  | { type: 'row';  ri: number }
  | null;

function selBoxShadow(sel: Sel, ri: number, tci: number, totalRows: number): string | undefined {
  if (!sel) return undefined;
  if (sel.type === 'cell' && sel.ri === ri && sel.tci === tci) {
    return `inset 0 0 0 2px ${SEL}`;
  }
  if (sel.type === 'col' && sel.tci === tci) {
    const top    = ri === 0             ? `inset 0 2px 0 0 ${SEL}` : undefined;
    const bottom = ri === totalRows - 1 ? `inset 0 -2px 0 0 ${SEL}` : undefined;
    const sides  = `inset 2px 0 0 0 ${SEL}, inset -2px 0 0 0 ${SEL}`;
    return [sides, top, bottom].filter(Boolean).join(', ');
  }
  if (sel.type === 'row' && sel.ri === ri) {
    const topBottom  = `inset 0 2px 0 0 ${SEL}, inset 0 -2px 0 0 ${SEL}`;
    const left  = tci === FIRST_COL ? `inset 2px 0 0 0 ${SEL}` : undefined;
    const right = tci === LAST_COL  ? `inset -2px 0 0 0 ${SEL}` : undefined;
    return [topBottom, left, right].filter(Boolean).join(', ');
  }
  return undefined;
}

function cellBg(sel: Sel, ri: number, tci: number, baseBg?: string): string {
  const colHL = sel?.type === 'col' && sel.tci === tci;
  const rowHL = sel?.type === 'row' && sel.ri === ri;
  if (colHL || rowHL) {
    if (baseBg === G || baseBg === MG) return baseBg;
    if (baseBg === LG) return '#c6e8d1';
    return SEL_BG;
  }
  return baseBg ?? '#fff';
}

export default function ProjectsSheet({ onSelect }: { onSelect: (s: CellSelection) => void }) {
  const [sel, setSel] = useState<Sel>(null);

  function onColHeaderClick(tci: number) {
    setSel({ type: 'col', tci });
    onSelect({ ref: `${COLS[tci]}:${COLS[tci]}`, formula: `=COLUMN(${COLS[tci]}:${COLS[tci]})` });
  }
  function onRowNumClick(ri: number, ev: React.MouseEvent) {
    ev.stopPropagation();
    setSel({ type: 'row', ri });
    onSelect({ ref: `${ri + 1}:${ri + 1}`, formula: `=ROW(${ri + 1}:${ri + 1})` });
  }
  function onCellClick(ri: number, tci: number, ev: React.MouseEvent, link?: string) {
    ev.stopPropagation();
    setSel({ type: 'cell', ri, tci });
    onSelect({ ref: `${COLS[tci] ?? 'B'}${ri + 1}`, formula: rows[ri]?.formula ?? '=""' });
    if (link) window.open(link, '_blank');
  }

  const activeCol = sel?.type === 'col' ? sel.tci : sel?.type === 'cell' ? sel.tci : -1;
  const activeRow = sel?.type === 'row' ? sel.ri  : sel?.type === 'cell' ? sel.ri  : -1;

  function thBg(tci: number) { return activeCol === tci ? SEL_BG : '#f0f0f0'; }
  function rnBg(ri: number)  { return activeRow === ri  ? SEL_BG : '#f0f0f0'; }

  return (
    <div className="h-full overflow-auto" style={{ background: '#fff' }}>
      <table className="border-collapse" style={{ tableLayout: 'fixed', width: '100%', minWidth: 860, borderSpacing: 0 }}>
        <colgroup>
          {COL_WIDTHS.map((w, i) => <col key={i} style={{ width: w }} />)}
        </colgroup>

        <thead>
          <tr>
            <th style={{ ...thStyle(36), background: sel ? SEL_BG : '#f0f0f0', cursor: 'default' }} />
            {COLS.slice(1).map((label, i) => {
              const tci = i + 1;
              return (
                <th key={tci} onClick={() => onColHeaderClick(tci)}
                  style={{ ...thStyle(COL_WIDTHS[tci]), background: thBg(tci), color: activeCol === tci ? G : '#555', fontWeight: activeCol === tci ? 700 : 600, cursor: 'pointer' }}>
                  {label}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {rows.map((r, ri) => {
            const h = r.height ?? 20;
            const cells: { tci: number; cell: Cell }[] = [
              { tci: 2, cell: r.b },
              { tci: 3, cell: r.c },
              { tci: 4, cell: r.d },
              { tci: 5, cell: r.e },
            ];
            return (
              <tr key={ri} style={{ height: h }}>
                <td onClick={(ev) => onRowNumClick(ri, ev)}
                  style={{ ...rowNumStyle, background: rnBg(ri), color: activeRow === ri ? G : '#555', fontWeight: sel?.type === 'row' && sel.ri === ri ? 700 : 400 }}>
                  {ri + 1}
                </td>
                <td onClick={(ev) => onCellClick(ri, 1, ev)}
                  style={{ ...tdStyle(h, cellBg(sel, ri, 1)), cursor: 'cell' }} />
                {cells.map(({ tci, cell }) => (
                  <td key={tci} onClick={(ev) => onCellClick(ri, tci, ev, cell.link)}
                    style={{
                      ...tdStyle(h, cellBg(sel, ri, tci, cell.bg)),
                      boxShadow: selBoxShadow(sel, ri, tci, TOTAL_ROWS),
                      fontWeight: cell.bold ? 700 : 400,
                      color: cell.color ?? '#212121',
                      fontStyle: cell.italic ? 'italic' : 'normal',
                      textDecoration: cell.link ? 'underline' : undefined,
                      cursor: cell.link ? 'pointer' : 'cell',
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                      lineHeight: '1.35',
                      verticalAlign: 'middle',
                      overflow: 'hidden',
                      position: 'relative',
                    }}>
                    {cell.value}
                  </td>
                ))}
                {[6, 7, 8].map(tci => (
                  <td key={tci} onClick={(ev) => onCellClick(ri, tci, ev)}
                    style={{ ...tdStyle(h, cellBg(sel, ri, tci)), cursor: 'cell' }} />
                ))}
              </tr>
            );
          })}

          {Array.from({ length: 20 }).map((_, i) => {
            const ri = rows.length + i;
            return (
              <tr key={`e${i}`} style={{ height: 20 }}>
                <td onClick={(ev) => onRowNumClick(ri, ev)}
                  style={{ ...rowNumStyle, background: rnBg(ri), color: activeRow === ri ? G : '#aaa', fontWeight: sel?.type === 'row' && sel.ri === ri ? 700 : 400 }}>
                  {ri + 1}
                </td>
                {Array.from({ length: 8 }).map((_, ci) => {
                  const tci = ci + 1;
                  return (
                    <td key={tci} onClick={(ev) => onCellClick(ri, tci, ev)}
                      style={{ ...tdStyle(20, cellBg(sel, ri, tci)), cursor: 'cell' }} />
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function thStyle(width: number): React.CSSProperties {
  return {
    width, height: 22,
    background: '#f0f0f0',
    border: BORDER, borderTop: 'none', borderLeft: 'none',
    fontSize: 11, fontWeight: 600, color: '#555',
    textAlign: 'center', padding: 0,
    position: 'sticky', top: 0, zIndex: 10,
    fontFamily: "'Calibri','Segoe UI',Arial,sans-serif",
  };
}

const rowNumStyle: React.CSSProperties = {
  width: 36,
  background: '#f0f0f0',
  border: BORDER, borderLeft: 'none',
  fontSize: 11, color: '#555',
  textAlign: 'center', padding: 0,
  userSelect: 'none', cursor: 'pointer',
  fontFamily: "'Calibri','Segoe UI',Arial,sans-serif",
};

function tdStyle(height: number, bg: string): React.CSSProperties {
  return {
    height, background: bg,
    border: BORDER, borderLeft: 'none', borderTop: 'none',
    fontSize: 12, padding: '2px 8px',
    userSelect: 'none',
    fontFamily: "'Calibri','Segoe UI',Arial,sans-serif",
  };
}
