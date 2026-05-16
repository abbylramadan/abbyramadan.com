'use client';

import { useState } from 'react';
import type { CellSelection } from '../ExcelShell';

// Table columns:
// idx 0 = row number header
// idx 1 = A  (30px  filler left)
// idx 2 = B  (200px company/bullet text)
// idx 3 = C  (180px overflow / empty)
// idx 4 = D  (180px overflow / empty)
// idx 5 = E  (160px location / period — right edge of content)
// idx 6 = F  (60px  filler right)
// idx 7 = G  (60px  filler right)
// idx 8 = H  (60px  filler right)
const COLS = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const COL_WIDTHS = [36, 30, 200, 180, 180, 160, 60, 60, 60];
const BORDER = '1px solid #d0d7de';

type Cell = {
  value: string;
  bold?: boolean;
  color?: string;
  bg?: string;
  italic?: boolean;
  indent?: number;
  align?: 'left' | 'center' | 'right';
};

const G = '#217346';
const LG = '#e9f5ee';
const MG = '#107c41';
const W = '#ffffff';

function e(): Cell { return { value: '' }; }
function hdr(v: string): Cell { return { value: v, bold: true, bg: G, color: W }; }
function sect(v: string): Cell { return { value: v, bold: true, bg: MG, color: W }; }
function company(v: string): Cell { return { value: v, bold: true, color: '#1a1a1a' }; }
function role(v: string): Cell { return { value: v, italic: true, color: '#333' }; }
function period(v: string): Cell { return { value: v, color: '#555', align: 'right' as const }; }
function bullet(v: string): Cell { return { value: '•  ' + v, color: '#222', indent: 1 }; }
function plain(v: string): Cell { return { value: v, color: '#222' }; }
function loc(v: string): Cell { return { value: v, color: '#555', align: 'right' as const }; }

// Each row has 5 cell slots: [B, C, D, E, filler-F]
// B = main content (company name, bullet, section header)
// C, D = overflow / empty
// E = location or period (right-aligned, always its own cell)
// filler-F = always empty
type Row = {
  cells: [Cell, Cell, Cell, Cell, Cell]; // [B, C, D, E, F]
  height?: number;
  ref: string;
  formula: string;
  // how cols B-D are spanned: 'all' = B spans B+C+D+E (section headers), 'text' = B spans B+C+D, 'split' = individual
  span: 'all' | 'text' | 'split';
};

function mkrow(
  ref: string, formula: string, span: Row['span'],
  b: Cell, c: Cell, d: Cell, ef: Cell, f: Cell,
  height?: number
): Row {
  return { ref, formula, span, cells: [b, c, d, ef, f], height };
}

// Helpers
function srow(ref: string, formula: string, b: Cell, height?: number): Row {
  return mkrow(ref, formula, 'all', b, e(), e(), e(), e(), height);
}
function trow(ref: string, formula: string, b: Cell, eCell: Cell, height?: number): Row {
  return mkrow(ref, formula, 'text', b, e(), e(), eCell, e(), height);
}
function brow(ref: string, formula: string, b: Cell, height?: number): Row {
  return mkrow(ref, formula, 'text', b, e(), e(), e(), e(), height);
}
function erow(height?: number): Row {
  return mkrow('', '=""', 'all', e(), e(), e(), e(), e(), height);
}

const rows: Row[] = [
  // Header banner — spans all
  srow('B1', '="Abby Ramadan"',         hdr('ABBY RAMADAN')),
  srow('B2', '=XLOOKUP("title",Info!A:A,Info!B:B)', { value: 'Capital Markets Associate  ·  Financial Analyst  ·  Structured Finance', italic: true, color: W, bg: G }),
  srow('B3', '=XLOOKUP("contact",Info!A:A,Info!B:B)', { value: 'Chicago, IL  (open to relocation to Bay Area)  ·  abbyramadan98@gmail.com  ·  linkedin.com/in/abby-ramadan/', color: W, bg: G, italic: true }),
  erow(6),

  // Summary
  srow('B5', '=XLOOKUP("summary",Resume!A:A,Resume!B:B)', sect('SUMMARY')),
  srow('B6', '=XLOOKUP("summary_text",Resume!A:A,Resume!B:B)', { value: 'Financial analyst specializing in forecasting, financial modeling, and data-driven analysis across $300MM+ portfolios. Skilled in financial modeling, cash flow forecasting, and interpreting credit agreements to support regulatory compliance, risk management, and funding strategy.', color: '#222', bg: LG }, 46),
  erow(6),

  // Experience
  srow('B8', '=XLOOKUP("experience",Resume!A:A,Resume!B:B)', sect('EXPERIENCE')),
  erow(4),

  // Above Lending — split row: company B, location E
  trow('B10', '=XLOOKUP("above_lending",Employers!A:A,Employers!B:B)', company('Above Lending'), loc('Chicago, IL')),
  trow('B11', '=XLOOKUP("capital_markets_assoc",Roles!A:A,Roles!B:B)', role('Capital Markets Associate'), period('January 2025 – Present')),
  brow('B12', '=XLOOKUP("al_bullet1",Bullets!A:A,Bullets!B:B)', bullet('Built and enhanced financial models and SQL-driven reporting to forecast loan performance and cash flows for $300MM+ portfolios to support capital allocation and funding decisions'), 34),
  brow('B13', '=XLOOKUP("al_bullet2",Bullets!A:A,Bullets!B:B)', bullet('Performed variance analysis on forecasted vs. actual cash flows to hone forecast accuracy')),
  brow('B14', '=XLOOKUP("al_bullet3",Bullets!A:A,Bullets!B:B)', bullet('Streamlined reporting processes by consolidating redundant workbooks and improving SQL code clarity, reducing reporting preparation time by 30%'), 28),
  brow('B15', '=XLOOKUP("al_bullet4",Bullets!A:A,Bullets!B:B)', bullet('Analyzed credit agreements and corrected report logic, unlocking $500,000+ in additional borrowing capacity under warehouse facilities'), 28),
  brow('B16', '=XLOOKUP("al_bullet5",Bullets!A:A,Bullets!B:B)', bullet('Enhanced loan allocation tools and aligned processes with legal documents to ensure regulatory compliance')),
  brow('B17', '=XLOOKUP("al_bullet6",Bullets!A:A,Bullets!B:B)', bullet('Collaborated cross-functionally to support strategic initiatives across Capital Markets and other teams')),
  erow(6),

  // Golub Capital
  trow('B19', '=XLOOKUP("golub_capital",Employers!A:A,Employers!B:B)', company('Golub Capital'), loc('Chicago, IL')),
  trow('B20', '=XLOOKUP("sfa",Roles!A:A,Roles!B:B)', role('Structured Finance Analyst'), period('September 2022 – December 2024')),
  brow('B21', '=XLOOKUP("gc_bullet1",Bullets!A:A,Bullets!B:B)', bullet('Monitored and analyzed 10+ multi-million dollar asset-backed securities to ensure compliance with covenants')),
  brow('B22', '=XLOOKUP("gc_bullet2",Bullets!A:A,Bullets!B:B)', bullet('Modeled projected asset performance and recommended portfolio trades to optimize returns')),
  brow('B23', '=XLOOKUP("gc_bullet3",Bullets!A:A,Bullets!B:B)', bullet('Interpreted indentures and advised stakeholders on compliance, supporting treasury activities')),
  brow('B24', '=XLOOKUP("gc_bullet4",Bullets!A:A,Bullets!B:B)', bullet('Collaborated with rating agencies and presented financial analyses to support transaction outcomes')),
  erow(6),

  // CME Group
  trow('B26', '=XLOOKUP("cme_group",Employers!A:A,Employers!B:B)', company('CME Group'), loc('Chicago, IL')),
  trow('B27', '=XLOOKUP("examiner",Roles!A:A,Roles!B:B)', role('Examiner'), period('January 2022 – September 2022')),
  brow('B28', '=XLOOKUP("cme_bullet1",Bullets!A:A,Bullets!B:B)', bullet('Reconciled firm financials and third-party documentation to validate accuracy and regulatory compliance')),
  brow('B29', '=XLOOKUP("cme_bullet2",Bullets!A:A,Bullets!B:B)', bullet('Conducted testing and analysis of financial data in accordance with CFTC regulations')),
  brow('B30', '=XLOOKUP("cme_bullet3",Bullets!A:A,Bullets!B:B)', bullet('Assisted in testing judgmentally selected samples and researching regulations as part of examination team')),
  erow(4),
  trow('B32', '=XLOOKUP("examiner_intern",Roles!A:A,Roles!B:B)', role('Examiner Intern'), period('May 2021 – July 2021')),
  brow('B33', '=XLOOKUP("cmei_bullet1",Bullets!A:A,Bullets!B:B)', bullet('Prepared workpapers for examinations under guidance of senior examiners')),
  brow('B34', '=XLOOKUP("cmei_bullet2",Bullets!A:A,Bullets!B:B)', bullet('Researched relevant CFTC rules for FCMs to support examinations')),
  erow(6),

  // EY
  trow('B36', '=XLOOKUP("ey",Employers!A:A,Employers!B:B)', company('EY'), loc('Chicago, IL')),
  trow('B37', '=XLOOKUP("regional_tax_intern",Roles!A:A,Roles!B:B)', role('Regional Tax Intern'), period('January 2020 – March 2020')),
  brow('B38', '=XLOOKUP("ey_bullet1",Bullets!A:A,Bullets!B:B)', bullet('Fulfilled client needs by documenting international tax rules for the Global Compliance & Reporting tax team')),
  brow('B39', '=XLOOKUP("ey_bullet2",Bullets!A:A,Bullets!B:B)', bullet('Prepared and organized client workpapers and performed substantive analytical procedures')),
  brow('B40', '=XLOOKUP("ey_bullet3",Bullets!A:A,Bullets!B:B)', bullet('Received training regarding corporate tax return preparation and computation of tax liability for different entities')),
  erow(6),

  // RJO
  trow('B42', '=XLOOKUP("rjo",Employers!A:A,Employers!B:B)', company("R.J. O'Brien & Associates LLC"), loc('Chicago, IL')),
  trow('B43', '=XLOOKUP("accounting_intern",Roles!A:A,Roles!B:B)', role('Accounting Intern'), period('June 2019 – August 2019')),
  brow('B44', '=XLOOKUP("rjo_bullet1",Bullets!A:A,Bullets!B:B)', bullet('Monitored internal controls and utilized XML schema to streamline reporting of monthly regulatory reports')),
  brow('B45', '=XLOOKUP("rjo_bullet2",Bullets!A:A,Bullets!B:B)', bullet('Created and analyzed rolling charts in Excel for tracking trends of account balances and ratios')),
  erow(8),

  // Education
  srow('B47', '=XLOOKUP("education",Resume!A:A,Resume!B:B)', sect('EDUCATION')),
  erow(4),
  trow('B49', '=XLOOKUP("cwru",Schools!A:A,Schools!B:B)', company('Case Western Reserve University'), loc('Cleveland, OH')),
  trow('B50', '=XLOOKUP("macc",Degrees!A:A,Degrees!B:B)', plain('Master of Accountancy'), period('January 2021 – December 2021')),
  trow('B51', '=XLOOKUP("bsacc",Degrees!A:A,Degrees!B:B)', plain('Bachelor of Science in Accounting, Applied Data Science Minor'), period('August 2017 – December 2021'), 28),
  erow(8),

  // Skills
  srow('B53', '=XLOOKUP("skills",Resume!A:A,Resume!B:B)', sect('SKILLS')),
  erow(4),
  srow('B55', '=XLOOKUP("skills_text",Resume!A:A,Resume!B:B)', { value: 'Excel (advanced)  ·  SQL  ·  Tableau  ·  PowerBI  ·  Power Automate  ·  R  ·  Python  ·  Forecasting  ·  Treasury & Liquidity Management  ·  Structured Finance', color: '#222', bg: LG }, 28),
  erow(20),
];

export default function ResumeSheet({ onSelect }: { onSelect: (s: CellSelection) => void }) {
  // null = nothing selected
  // { type:'cell', ri, tci } = a body cell was clicked
  // { type:'col', tci } = a column header was clicked
  // { type:'row', ri } = a row number was clicked
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

  function onCellClick(ri: number, tci: number, ev: React.MouseEvent) {
    ev.stopPropagation();
    setSel({ type: 'cell', ri, tci });
    const colLetter = COLS[tci] ?? 'B';
    onSelect({ ref: `${colLetter}${ri + 1}`, formula: rows[ri]?.formula ?? '=""' });
  }

  // Background for a column header th
  function thBg(tci: number) {
    if (hlCol === tci) return '#e2efda';
    if (sel?.type === 'cell' && sel.tci === tci) return '#e2efda';
    return '#f0f0f0';
  }
  // Background for a row number td
  function rnBg(ri: number) {
    if (hlRow === ri) return '#e2efda';
    if (sel?.type === 'cell' && sel.ri === ri) return '#e2efda';
    return '#f0f0f0';
  }
  // Whether a cell body is selected (green outline)
  function isCellSel(ri: number, tci: number) {
    return sel?.type === 'cell' && sel.ri === ri && sel.tci === tci;
  }
  // Background for a body cell (col-highlight only when col header was clicked)
  function bodyBg(tci: number, baseBg?: string) {
    if (hlCol === tci) return baseBg === G || baseBg === MG ? baseBg : (baseBg === LG ? '#daf0e3' : '#e2efda');
    return baseBg ?? '#fff';
  }

  return (
    <div className="h-full overflow-auto" style={{ background: '#fff' }}>
      <table className="border-collapse" style={{ tableLayout: 'fixed', width: '100%', minWidth: 860, borderSpacing: 0 }}>
        <colgroup>
          {COL_WIDTHS.map((w, i) => <col key={i} style={{ width: w }} />)}
        </colgroup>

        <thead>
          <tr>
            {/* Corner */}
            <th style={{ ...thStyle(36), background: sel ? '#e2efda' : '#f0f0f0', cursor: 'default' }} />
            {COLS.slice(1).map((label, i) => {
              const tci = i + 1;
              const active = hlCol === tci || (sel?.type === 'cell' && sel.tci === tci);
              return (
                <th key={i}
                  style={{ ...thStyle(COL_WIDTHS[i + 1]), background: thBg(tci), color: active ? '#217346' : '#555', fontWeight: active ? 700 : 600, cursor: 'pointer' }}
                  onClick={() => onColHeaderClick(tci)}
                >
                  {label}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {rows.map((r, ri) => {
            const [cellB, , , cellE] = r.cells;
            const h = r.height ?? 20;

            return (
              <tr key={ri} style={{ height: h }}>
                {/* Row number */}
                <td style={{ ...rowNumStyle, background: rnBg(ri), color: hlRow === ri || (sel?.type === 'cell' && sel.ri === ri) ? '#217346' : '#555', fontWeight: hlRow === ri ? 700 : 400 }}
                  onClick={(ev) => onRowNumClick(ri, ev)}>
                  {ri + 1}
                </td>

                {/* A filler */}
                <td style={{ ...bodyCell(h, bodyBg(1)), cursor: 'cell' }} onClick={(ev) => onCellClick(ri, 1, ev)} />

                {r.span === 'all' ? (
                  // Section/header rows: B spans B+C+D+E
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
                  // text/split rows: B spans B+C+D, E is its own cell
                  <>
                    <td colSpan={3} style={{
                      ...bodyCell(h, bodyBg(2, cellB.bg)),
                      fontWeight: cellB.bold ? 700 : 400,
                      color: cellB.color ?? '#212121',
                      fontStyle: cellB.italic ? 'italic' : 'normal',
                      paddingLeft: 8 + (cellB.indent ?? 0) * 16,
                      whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: '1.35', verticalAlign: 'middle',
                      outline: isCellSel(ri, 2) ? '2px solid #217346' : undefined,
                      outlineOffset: '-2px', position: 'relative', zIndex: isCellSel(ri, 2) ? 2 : undefined,
                    }} onClick={(ev) => onCellClick(ri, 2, ev)}>
                      {cellB.value}
                    </td>
                    {/* E — location / period */}
                    <td style={{
                      ...bodyCell(h, bodyBg(5, cellE.bg)),
                      fontWeight: cellE.bold ? 700 : 400,
                      color: cellE.color ?? '#212121',
                      fontStyle: cellE.italic ? 'italic' : 'normal',
                      textAlign: cellE.align ?? 'left',
                      outline: isCellSel(ri, 5) ? '2px solid #217346' : undefined,
                      outlineOffset: '-2px', position: 'relative', zIndex: isCellSel(ri, 5) ? 2 : undefined,
                    }} onClick={(ev) => onCellClick(ri, 5, ev)}>
                      {cellE.value}
                    </td>
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
                <td style={{ ...rowNumStyle, background: rnBg(ri), color: '#aaa' }} onClick={(ev) => onRowNumClick(ri, ev)}>{ri + 1}</td>
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
