'use client';

import { useState } from 'react';
import type { CellSelection } from '../ExcelShell';

// Table columns:
// 0=row#  1=A(filler,30)  2=B(180)  3=C(220)  4=D(180)  5=E(130)  6=F(60)  7=G(60)  8=H(60)
const COLS = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const COL_WIDTHS = [36, 30, 180, 220, 180, 130, 60, 60, 60];
const BORDER = '1px solid #d0d7de';

type Cell = {
  value: string;
  bold?: boolean;
  color?: string;
  bg?: string;
  italic?: boolean;
  link?: string;
  align?: 'left' | 'center' | 'right';
};

const G = '#217346';
const LG = '#e9f5ee';
const MG = '#107c41';
const W = '#ffffff';

function e(): Cell { return { value: '' }; }
function hdr(v: string): Cell { return { value: v, bold: true, bg: G, color: W }; }
function sect(v: string): Cell { return { value: v, bold: true, bg: MG, color: W }; }
function lbl(v: string): Cell { return { value: v, bold: true, color: '#1a1a1a' }; }
function plain(v: string): Cell { return { value: v, color: '#222' }; }
function tag(v: string): Cell { return { value: v, color: '#217346', bg: LG }; }
function lnk(v: string, href: string): Cell { return { value: v, color: '#0563c1', link: href }; }

// Each row has 4 content cells: [B, C, D, E] — all rendered individually (no merged spans for projects)
type Row = {
  cells: [Cell, Cell, Cell, Cell]; // B C D E
  height?: number;
  ref: string;
  formula: string;
  spanAll?: boolean; // B spans all 4 cols (header rows)
};

function srow(ref: string, formula: string, b: Cell, height?: number): Row {
  return { ref, formula, spanAll: true, cells: [b, e(), e(), e()], height };
}

const rows: Row[] = [
  srow('B1', '="Projects"', hdr('PROJECTS')),
  { ref: '', formula: '=""', cells: [e(), e(), e(), e()], height: 6 },

  // Project table header
  { ref: 'B3', formula: '=XLOOKUP("project_header",Projects!A:A,Projects!B:B)', cells: [sect('Project'), sect('Description'), sect('Technologies'), sect('Status')] },
  // Project row
  {
    ref: 'B4', formula: '=XLOOKUP("home_calc",Projects!A:A,Projects!B:B)',
    cells: [
      lnk('Home Affordability Calculator', 'https://mortgagecalc.abbyramadan.com'),
      plain('Comprehensive tool for understanding home affordability. Features mortgage calculations, interactive visualizations, and personalized analysis based on income, debts, and financial goals.'),
      tag('React · TypeScript · Chart.js · Tailwind CSS'),
      { value: '✅ Live', color: G, bold: true },
    ],
    height: 42,
  },
  { ref: '', formula: '=""', cells: [e(), e(), e(), e()], height: 6 },
  { ref: 'B6', formula: '=XLOOKUP("more_projects",Projects!A:A,Projects!B:B)', cells: [{ value: 'More projects coming soon...', italic: true, color: '#555' }, e(), e(), e()] },
  { ref: '', formula: '=""', cells: [e(), e(), e(), e()], height: 14 },

  srow('B8', '="Skills"', hdr('SKILLS')),
  { ref: '', formula: '=""', cells: [e(), e(), e(), e()], height: 6 },

  // Skills table header
  { ref: 'B10', formula: '=XLOOKUP("skill_header",Skills!A:A,Skills!B:B)', cells: [sect('Skill'), sect('Category'), sect('Proficiency'), e()] },
  { ref: 'B11', formula: '=XLOOKUP("excel",Skills!A:A,Skills!B:B)',         cells: [lbl('Excel'),         plain('Finance / Reporting'), { value: '★★★★★  Advanced',    color: G,     bold: true }, e()] },
  { ref: 'B12', formula: '=XLOOKUP("sql",Skills!A:A,Skills!B:B)',           cells: [lbl('SQL'),           plain('Data / Reporting'),    { value: '★★★★☆  Advanced',    color: G,     bold: true }, e()] },
  { ref: 'B13', formula: '=XLOOKUP("forecasting",Skills!A:A,Skills!B:B)',   cells: [lbl('Forecasting'),   plain('Finance'),             { value: '★★★★☆  Advanced',    color: G,     bold: true }, e()] },
  { ref: 'B14', formula: '=XLOOKUP("python",Skills!A:A,Skills!B:B)',        cells: [lbl('Python'),        plain('Analytics'),           { value: '★★★☆☆  Intermediate', color: '#555'           }, e()] },
  { ref: 'B15', formula: '=XLOOKUP("r",Skills!A:A,Skills!B:B)',             cells: [lbl('R'),             plain('Analytics'),           { value: '★★★☆☆  Intermediate', color: '#555'           }, e()] },
  { ref: 'B16', formula: '=XLOOKUP("tableau",Skills!A:A,Skills!B:B)',       cells: [lbl('Tableau'),       plain('Visualization'),       { value: '★★★☆☆  Intermediate', color: '#555'           }, e()] },
  { ref: 'B17', formula: '=XLOOKUP("powerbi",Skills!A:A,Skills!B:B)',       cells: [lbl('PowerBI'),       plain('Visualization'),       { value: '★★★☆☆  Intermediate', color: '#555'           }, e()] },
  { ref: 'B18', formula: '=XLOOKUP("power_automate",Skills!A:A,Skills!B:B)',cells: [lbl('Power Automate'),plain('Automation'),          { value: '★★★☆☆  Intermediate', color: '#555'           }, e()] },
  { ref: '', formula: '=""', cells: [e(), e(), e(), e()], height: 20 },
];

export default function ProjectsSheet({ onSelect }: { onSelect: (s: CellSelection) => void }) {
  const [sel, setSel] = useState<
    | { type: 'cell'; ri: number; tci: number }
    | { type: 'col'; tci: number }
    | { type: 'row'; ri: number }
    | null
  >(null);

  const hlCol = sel?.type === 'col' ? sel.tci : -1;
  const hlRow = sel?.type === 'row' ? sel.ri : -1;

  function onColHeaderClick(tci: number) {
    setSel({ type: 'col', tci });
    onSelect({ ref: `${COLS[tci]}`, formula: `=COLUMN(${COLS[tci]}:${COLS[tci]})` });
  }
  function onRowNumClick(ri: number, ev: React.MouseEvent) {
    ev.stopPropagation();
    setSel({ type: 'row', ri });
    onSelect({ ref: `${ri + 1}:${ri + 1}`, formula: `=ROW(${ri + 1}:${ri + 1})` });
  }
  function onCellClick(ri: number, tci: number, ev: React.MouseEvent, link?: string) {
    ev.stopPropagation();
    setSel({ type: 'cell', ri, tci });
    const colLetter = COLS[tci] ?? 'B';
    onSelect({ ref: `${colLetter}${ri + 1}`, formula: rows[ri]?.formula ?? '=""' });
    if (link) window.open(link, '_blank');
  }

  function thBg(tci: number) {
    if (hlCol === tci) return '#e2efda';
    if (sel?.type === 'cell' && sel.tci === tci) return '#e2efda';
    return '#f0f0f0';
  }
  function rnBg(ri: number) {
    if (hlRow === ri) return '#e2efda';
    if (sel?.type === 'cell' && sel.ri === ri) return '#e2efda';
    return '#f0f0f0';
  }
  function isCellSel(ri: number, tci: number) {
    return sel?.type === 'cell' && sel.ri === ri && sel.tci === tci;
  }
  function bodyBg(tci: number, baseBg?: string) {
    if (hlCol === tci) return baseBg === G || baseBg === MG ? baseBg : (baseBg === LG ? '#daf0e3' : '#e2efda');
    return baseBg ?? '#fff';
  }

  // content col tci values: B=2, C=3, D=4, E=5
  const CONTENT_TCIS = [2, 3, 4, 5];

  return (
    <div className="h-full overflow-auto" style={{ background: '#fff' }}>
      <table className="border-collapse" style={{ tableLayout: 'fixed', width: '100%', minWidth: 860, borderSpacing: 0 }}>
        <colgroup>
          {COL_WIDTHS.map((w, i) => <col key={i} style={{ width: w }} />)}
        </colgroup>

        <thead>
          <tr>
            <th style={{ ...thStyle(36), background: sel ? '#e2efda' : '#f0f0f0', cursor: 'default' }} />
            {COLS.slice(1).map((label, i) => {
              const tci = i + 1;
              const active = hlCol === tci || (sel?.type === 'cell' && sel.tci === tci);
              return (
                <th key={i}
                  style={{ ...thStyle(COL_WIDTHS[i + 1]), background: thBg(tci), color: active ? '#217346' : '#555', fontWeight: active ? 700 : 600, cursor: 'pointer' }}
                  onClick={() => onColHeaderClick(tci)}>
                  {label}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {rows.map((r, ri) => {
            const [cellB, cellC, cellD, cellE] = r.cells;
            const h = r.height ?? 20;

            return (
              <tr key={ri} style={{ height: h }}>
                <td style={{ ...rowNumStyle, background: rnBg(ri), color: hlRow === ri || (sel?.type === 'cell' && sel.ri === ri) ? '#217346' : '#555', fontWeight: hlRow === ri ? 700 : 400 }}
                  onClick={(ev) => onRowNumClick(ri, ev)}>
                  {ri + 1}
                </td>

                {/* A filler */}
                <td style={{ ...bodyCell(h, bodyBg(1)), cursor: 'cell' }} onClick={(ev) => onCellClick(ri, 1, ev)} />

                {r.spanAll ? (
                  <td colSpan={4} style={{
                    ...bodyCell(h, cellB.bg ?? '#fff'),
                    fontWeight: cellB.bold ? 700 : 400,
                    color: cellB.color ?? '#212121',
                    fontStyle: cellB.italic ? 'italic' : 'normal',
                    paddingLeft: 8,
                    whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: '1.35', verticalAlign: 'middle',
                    outline: isCellSel(ri, 2) ? '2px solid #217346' : undefined,
                    outlineOffset: '-2px', position: 'relative', zIndex: isCellSel(ri, 2) ? 2 : undefined,
                  }} onClick={(ev) => onCellClick(ri, 2, ev)}>
                    {cellB.value}
                  </td>
                ) : (
                  <>
                    {([cellB, cellC, cellD, cellE] as Cell[]).map((cell, ci) => {
                      const tci = CONTENT_TCIS[ci];
                      return (
                        <td key={tci} style={{
                          ...bodyCell(h, bodyBg(tci, cell.bg)),
                          fontWeight: cell.bold ? 700 : 400,
                          color: cell.color ?? '#212121',
                          fontStyle: cell.italic ? 'italic' : 'normal',
                          textDecoration: cell.link ? 'underline' : undefined,
                          cursor: cell.link ? 'pointer' : 'cell',
                          whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: '1.35', verticalAlign: 'middle',
                          outline: isCellSel(ri, tci) ? '2px solid #217346' : undefined,
                          outlineOffset: '-2px', position: 'relative', zIndex: isCellSel(ri, tci) ? 2 : undefined,
                        }} onClick={(ev) => onCellClick(ri, tci, ev, cell.link)}>
                          {cell.value}
                        </td>
                      );
                    })}
                  </>
                )}

                {/* F G H filler */}
                <td style={{ ...bodyCell(h, bodyBg(6)), cursor: 'cell' }} onClick={(ev) => onCellClick(ri, 6, ev)} />
                <td style={{ ...bodyCell(h, bodyBg(7)), cursor: 'cell' }} onClick={(ev) => onCellClick(ri, 7, ev)} />
                <td style={{ ...bodyCell(h, bodyBg(8)), cursor: 'cell' }} onClick={(ev) => onCellClick(ri, 8, ev)} />
              </tr>
            );
          })}

          {Array.from({ length: 20 }).map((_, i) => {
            const ri = rows.length + i;
            return (
              <tr key={`e${i}`} style={{ height: 20 }}>
                <td style={{ ...rowNumStyle, color: '#aaa', background: rnBg(ri) }} onClick={(ev) => onRowNumClick(ri, ev)}>{ri + 1}</td>
                {Array.from({ length: 8 }).map((_, ci) => (
                  <td key={ci} style={{ ...bodyCell(20, bodyBg(ci + 1)), cursor: 'cell' }} onClick={(ev) => onCellClick(ri, ci + 1, ev)} />
                ))}
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

function bodyCell(height: number, bg: string): React.CSSProperties {
  return {
    height, background: bg,
    border: BORDER, borderLeft: 'none', borderTop: 'none',
    fontSize: 12, padding: '2px 8px',
    cursor: 'cell', userSelect: 'none',
    fontFamily: "'Calibri','Segoe UI',Arial,sans-serif",
    overflow: 'hidden',
  };
}
