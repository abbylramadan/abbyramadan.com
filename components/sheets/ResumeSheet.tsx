'use client';

import { useState } from 'react';
import type { CellSelection } from '../ExcelShell';

// col indices: 0=row#  1=A(filler)  2=B  3=C  4=D  5=E  6=F  7=G  8=H
const COLS = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const COL_WIDTHS = [36, 30, 200, 180, 180, 150, 60, 60, 60];
const BORDER = '1px solid #d0d7de';

const G = '#217346';
const LG = '#e9f5ee';
const MG = '#107c41';
const W = '#ffffff';

type Cell = {
  value: string;
  bold?: boolean;
  color?: string;
  bg?: string;
  italic?: boolean;
  indent?: number;
  align?: 'left' | 'center' | 'right';
};

// Every row has exactly 5 content cells: B C D E F(filler)
// No colSpan ever. Text wraps within its column.
type Row = {
  b: Cell; c: Cell; d: Cell; e: Cell; // content cols
  height?: number;
  ref: string;
  formula: string;
};

function ec(): Cell { return { value: '' }; }
function filled(v: string, bg: string, bold?: boolean, italic?: boolean, color?: string): Cell {
  return { value: v, bg, bold, italic, color: color ?? W };
}
function txt(v: string, color?: string, bold?: boolean, italic?: boolean, indent?: number, align?: Cell['align']): Cell {
  return { value: v, color: color ?? '#222', bold, italic, indent, align };
}

// Section header: same bg across all 4 content cells, text only in B
function sectionRow(ref: string, formula: string, label: string, bg: string, height?: number): Row {
  return { ref, formula, height,
    b: filled(label, bg, true), c: filled('', bg), d: filled('', bg), e: filled('', bg) };
}
// Empty spacer row
function spacer(height = 6): Row {
  return { ref: '', formula: '=""', height, b: ec(), c: ec(), d: ec(), e: ec() };
}
// Company row: bold name in B, location right-aligned in E, C/D empty
function companyRow(ref: string, formula: string, name: string, location: string): Row {
  return { ref, formula,
    b: txt(name, '#1a1a1a', true), c: ec(), d: ec(),
    e: txt(location, '#555', false, false, 0, 'right') };
}
// Role row: italic role in B, period right-aligned in E
function roleRow(ref: string, formula: string, role: string, period: string): Row {
  return { ref, formula,
    b: txt(role, '#333', false, true), c: ec(), d: ec(),
    e: txt(period, '#555', false, true, 0, 'right') };
}
// Bullet: text in B (overflow visible into C/D visually but each cell is its own td)
function bulletRow(ref: string, formula: string, text: string, height?: number): Row {
  return { ref, formula, height,
    b: txt('•  ' + text, '#222', false, false, 0), c: ec(), d: ec(), e: ec() };
}
// Plain text row (education degree etc)
function plainRow(ref: string, formula: string, text: string, period: string, height?: number): Row {
  return { ref, formula, height,
    b: txt(text, '#222'), c: ec(), d: ec(),
    e: txt(period, '#555', false, true, 0, 'right') };
}
// Skills text (full width, light green bg)
function skillsRow(ref: string, formula: string, text: string): Row {
  return { ref, formula, height: 28,
    b: { value: text, color: '#222', bg: LG },
    c: { value: '', bg: LG }, d: { value: '', bg: LG }, e: { value: '', bg: LG } };
}

const rows: Row[] = [
  sectionRow('B1', '="Abby Ramadan"', 'ABBY RAMADAN', G),
  { ref: 'B2', formula: '=XLOOKUP("title",Info!A:A,Info!B:B)',
    b: filled('Capital Markets Associate  ·  Financial Analyst  ·  Structured Finance', G, false, true),
    c: filled('', G), d: filled('', G), e: filled('', G) },
  { ref: 'B3', formula: '=XLOOKUP("contact",Info!A:A,Info!B:B)',
    b: filled('Chicago, IL  (open to relocation to Bay Area)  ·  abbyramadan98@gmail.com  ·  linkedin.com/in/abby-ramadan/', G, false, true),
    c: filled('', G), d: filled('', G), e: filled('', G) },
  spacer(6),

  sectionRow('B5', '=XLOOKUP("summary",Resume!A:A,Resume!B:B)', 'SUMMARY', MG),
  { ref: 'B6', formula: '=XLOOKUP("summary_text",Resume!A:A,Resume!B:B)', height: 46,
    b: { value: 'Financial analyst specializing in forecasting, financial modeling, and data-driven analysis across $300MM+ portfolios. Skilled in financial modeling, cash flow forecasting, and interpreting credit agreements to support regulatory compliance, risk management, and funding strategy.', color: '#222', bg: LG },
    c: { value: '', bg: LG }, d: { value: '', bg: LG }, e: { value: '', bg: LG } },
  spacer(6),

  sectionRow('B8', '=XLOOKUP("experience",Resume!A:A,Resume!B:B)', 'EXPERIENCE', MG),
  spacer(4),

  companyRow('B10', '=XLOOKUP("above_lending",Employers!A:A,Employers!B:B)', 'Above Lending', 'Chicago, IL'),
  roleRow('B11', '=XLOOKUP("capital_markets_assoc",Roles!A:A,Roles!B:B)', 'Capital Markets Associate', 'January 2025 – Present'),
  bulletRow('B12', '=XLOOKUP("al_bullet1",Bullets!A:A,Bullets!B:B)', 'Built and enhanced financial models and SQL-driven reporting to forecast loan performance and cash flows for $300MM+ portfolios to support capital allocation and funding decisions', 34),
  bulletRow('B13', '=XLOOKUP("al_bullet2",Bullets!A:A,Bullets!B:B)', 'Performed variance analysis on forecasted vs. actual cash flows to hone forecast accuracy'),
  bulletRow('B14', '=XLOOKUP("al_bullet3",Bullets!A:A,Bullets!B:B)', 'Streamlined reporting processes by consolidating redundant workbooks and improving SQL code clarity, reducing reporting preparation time by 30%', 28),
  bulletRow('B15', '=XLOOKUP("al_bullet4",Bullets!A:A,Bullets!B:B)', 'Analyzed credit agreements and corrected report logic, unlocking $500,000+ in additional borrowing capacity under warehouse facilities', 28),
  bulletRow('B16', '=XLOOKUP("al_bullet5",Bullets!A:A,Bullets!B:B)', 'Enhanced loan allocation tools and aligned processes with legal documents to ensure regulatory compliance'),
  bulletRow('B17', '=XLOOKUP("al_bullet6",Bullets!A:A,Bullets!B:B)', 'Collaborated cross-functionally to support strategic initiatives across Capital Markets and other teams'),
  spacer(6),

  companyRow('B19', '=XLOOKUP("golub_capital",Employers!A:A,Employers!B:B)', 'Golub Capital', 'Chicago, IL'),
  roleRow('B20', '=XLOOKUP("sfa",Roles!A:A,Roles!B:B)', 'Structured Finance Analyst', 'September 2022 – December 2024'),
  bulletRow('B21', '=XLOOKUP("gc_bullet1",Bullets!A:A,Bullets!B:B)', 'Monitored and analyzed 10+ multi-million dollar asset-backed securities to ensure compliance with covenants'),
  bulletRow('B22', '=XLOOKUP("gc_bullet2",Bullets!A:A,Bullets!B:B)', 'Modeled projected asset performance and recommended portfolio trades to optimize returns'),
  bulletRow('B23', '=XLOOKUP("gc_bullet3",Bullets!A:A,Bullets!B:B)', 'Interpreted indentures and advised stakeholders on compliance, supporting treasury activities'),
  bulletRow('B24', '=XLOOKUP("gc_bullet4",Bullets!A:A,Bullets!B:B)', 'Collaborated with rating agencies and presented financial analyses to support transaction outcomes'),
  spacer(6),

  companyRow('B26', '=XLOOKUP("cme_group",Employers!A:A,Employers!B:B)', 'CME Group', 'Chicago, IL'),
  roleRow('B27', '=XLOOKUP("examiner",Roles!A:A,Roles!B:B)', 'Examiner', 'January 2022 – September 2022'),
  bulletRow('B28', '=XLOOKUP("cme_bullet1",Bullets!A:A,Bullets!B:B)', 'Reconciled firm financials and third-party documentation to validate accuracy and regulatory compliance'),
  bulletRow('B29', '=XLOOKUP("cme_bullet2",Bullets!A:A,Bullets!B:B)', 'Conducted testing and analysis of financial data in accordance with CFTC regulations'),
  bulletRow('B30', '=XLOOKUP("cme_bullet3",Bullets!A:A,Bullets!B:B)', 'Assisted in testing judgmentally selected samples and researching regulations as part of examination team'),
  spacer(4),
  roleRow('B32', '=XLOOKUP("examiner_intern",Roles!A:A,Roles!B:B)', 'Examiner Intern', 'May 2021 – July 2021'),
  bulletRow('B33', '=XLOOKUP("cmei_bullet1",Bullets!A:A,Bullets!B:B)', 'Prepared workpapers for examinations under guidance of senior examiners'),
  bulletRow('B34', '=XLOOKUP("cmei_bullet2",Bullets!A:A,Bullets!B:B)', 'Researched relevant CFTC rules for FCMs to support examinations'),
  spacer(6),

  companyRow('B36', '=XLOOKUP("ey",Employers!A:A,Employers!B:B)', 'EY', 'Chicago, IL'),
  roleRow('B37', '=XLOOKUP("regional_tax_intern",Roles!A:A,Roles!B:B)', 'Regional Tax Intern', 'January 2020 – March 2020'),
  bulletRow('B38', '=XLOOKUP("ey_bullet1",Bullets!A:A,Bullets!B:B)', 'Fulfilled client needs by documenting international tax rules for the Global Compliance & Reporting tax team'),
  bulletRow('B39', '=XLOOKUP("ey_bullet2",Bullets!A:A,Bullets!B:B)', 'Prepared and organized client workpapers and performed substantive analytical procedures'),
  bulletRow('B40', '=XLOOKUP("ey_bullet3",Bullets!A:A,Bullets!B:B)', 'Received training regarding corporate tax return preparation and computation of tax liability for different entities'),
  spacer(6),

  companyRow('B42', '=XLOOKUP("rjo",Employers!A:A,Employers!B:B)', "R.J. O'Brien & Associates LLC", 'Chicago, IL'),
  roleRow('B43', '=XLOOKUP("accounting_intern",Roles!A:A,Roles!B:B)', 'Accounting Intern', 'June 2019 – August 2019'),
  bulletRow('B44', '=XLOOKUP("rjo_bullet1",Bullets!A:A,Bullets!B:B)', 'Monitored internal controls and utilized XML schema to streamline reporting of monthly regulatory reports'),
  bulletRow('B45', '=XLOOKUP("rjo_bullet2",Bullets!A:A,Bullets!B:B)', 'Created and analyzed rolling charts in Excel for tracking trends of account balances and ratios'),
  spacer(8),

  sectionRow('B47', '=XLOOKUP("education",Resume!A:A,Resume!B:B)', 'EDUCATION', MG),
  spacer(4),
  companyRow('B49', '=XLOOKUP("cwru",Schools!A:A,Schools!B:B)', 'Case Western Reserve University', 'Cleveland, OH'),
  plainRow('B50', '=XLOOKUP("macc",Degrees!A:A,Degrees!B:B)', 'Master of Accountancy', 'January 2021 – December 2021'),
  plainRow('B51', '=XLOOKUP("bsacc",Degrees!A:A,Degrees!B:B)', 'Bachelor of Science in Accounting, Applied Data Science Minor', 'August 2017 – December 2021', 28),
  spacer(8),

  sectionRow('B53', '=XLOOKUP("skills",Resume!A:A,Resume!B:B)', 'SKILLS', MG),
  spacer(4),
  skillsRow('B55', '=XLOOKUP("skills_text",Resume!A:A,Resume!B:B)', 'Excel (advanced)  ·  SQL  ·  Tableau  ·  PowerBI  ·  Power Automate  ·  R  ·  Python  ·  Forecasting  ·  Treasury & Liquidity Management  ·  Structured Finance'),
  spacer(20),
];

// ── Highlight logic ──────────────────────────────────────────────────────────
// sel.type === 'col'  → entire column tci gets green bg + header highlight
// sel.type === 'row'  → entire row ri gets green bg + row-num highlight
// sel.type === 'cell' → single cell outline; its col header and row num get light highlight

type Sel =
  | { type: 'cell'; ri: number; tci: number }
  | { type: 'col';  tci: number }
  | { type: 'row';  ri: number }
  | null;

export default function ResumeSheet({ onSelect }: { onSelect: (s: CellSelection) => void }) {
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
  function onCellClick(ri: number, tci: number, ev: React.MouseEvent) {
    ev.stopPropagation();
    setSel({ type: 'cell', ri, tci });
    onSelect({ ref: `${COLS[tci] ?? 'B'}${ri + 1}`, formula: rows[ri]?.formula ?? '=""' });
  }

  // Is this column highlighted (col selected, or cell in this col selected)
  const activeCol = sel?.type === 'col' ? sel.tci : sel?.type === 'cell' ? sel.tci : -1;
  const activeRow = sel?.type === 'row' ? sel.ri  : sel?.type === 'cell' ? sel.ri  : -1;

  // Header th background
  function thBg(tci: number) { return activeCol === tci ? '#e2efda' : '#f0f0f0'; }
  // Row number background
  function rnBg(ri: number) { return activeRow === ri ? '#e2efda' : '#f0f0f0'; }

  // Body cell background
  function bg(ri: number, tci: number, baseBg?: string): string {
    const colHL = sel?.type === 'col' && sel.tci === tci;
    const rowHL = sel?.type === 'row' && sel.ri === ri;
    if (colHL || rowHL) {
      if (baseBg === G || baseBg === MG) return baseBg; // keep green header rows as-is
      if (baseBg === LG) return '#c6e8d1';              // slightly darker tint on light rows
      return '#e2efda';
    }
    return baseBg ?? '#fff';
  }

  // Green outline on the single selected cell
  function outline(ri: number, tci: number): React.CSSProperties {
    if (sel?.type !== 'cell' || sel.ri !== ri || sel.tci !== tci) return {};
    return { outline: '2px solid #217346', outlineOffset: '-2px', position: 'relative', zIndex: 2 };
  }

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
              return (
                <th key={tci} onClick={() => onColHeaderClick(tci)}
                  style={{ ...thStyle(COL_WIDTHS[tci]), background: thBg(tci), color: activeCol === tci ? '#217346' : '#555', fontWeight: activeCol === tci ? 700 : 600, cursor: 'pointer' }}>
                  {label}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {rows.map((r, ri) => {
            const h = r.height ?? 20;
            // All 4 content cells + 4 filler cells, rendered individually — no colSpan
            const content: { tci: number; cell: Cell }[] = [
              { tci: 2, cell: r.b },
              { tci: 3, cell: r.c },
              { tci: 4, cell: r.d },
              { tci: 5, cell: r.e },
            ];
            return (
              <tr key={ri} style={{ height: h }}>
                {/* Row number */}
                <td onClick={(ev) => onRowNumClick(ri, ev)}
                  style={{ ...rowNumStyle, background: rnBg(ri), color: activeRow === ri ? '#217346' : '#555', fontWeight: sel?.type === 'row' && sel.ri === ri ? 700 : 400 }}>
                  {ri + 1}
                </td>
                {/* A filler */}
                <td onClick={(ev) => onCellClick(ri, 1, ev)}
                  style={{ ...td(h, bg(ri, 1)), cursor: 'cell' }} />
                {/* B C D E — individual cells, no merging */}
                {content.map(({ tci, cell }) => (
                  <td key={tci} onClick={(ev) => onCellClick(ri, tci, ev)}
                    style={{
                      ...td(h, bg(ri, tci, cell.bg)),
                      ...outline(ri, tci),
                      fontWeight: cell.bold ? 700 : 400,
                      color: cell.color ?? '#212121',
                      fontStyle: cell.italic ? 'italic' : 'normal',
                      textAlign: cell.align ?? 'left',
                      paddingLeft: tci === 2 ? 8 + (cell.indent ?? 0) * 16 : 8,
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                      lineHeight: '1.35',
                      verticalAlign: 'middle',
                      cursor: 'cell',
                      overflow: 'hidden',
                    }}>
                    {cell.value}
                  </td>
                ))}
                {/* F G H filler */}
                {[6, 7, 8].map(tci => (
                  <td key={tci} onClick={(ev) => onCellClick(ri, tci, ev)}
                    style={{ ...td(h, bg(ri, tci)), cursor: 'cell' }} />
                ))}
              </tr>
            );
          })}

          {/* Extra empty rows */}
          {Array.from({ length: 20 }).map((_, i) => {
            const ri = rows.length + i;
            return (
              <tr key={`e${i}`} style={{ height: 20 }}>
                <td onClick={(ev) => onRowNumClick(ri, ev)}
                  style={{ ...rowNumStyle, background: rnBg(ri), color: activeRow === ri ? '#217346' : '#aaa', fontWeight: sel?.type === 'row' && sel.ri === ri ? 700 : 400 }}>
                  {ri + 1}
                </td>
                {Array.from({ length: 8 }).map((_, ci) => {
                  const tci = ci + 1;
                  return (
                    <td key={tci} onClick={(ev) => onCellClick(ri, tci, ev)}
                      style={{ ...td(20, bg(ri, tci)), cursor: 'cell' }} />
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

function td(height: number, bg: string): React.CSSProperties {
  return {
    height, background: bg,
    border: BORDER, borderLeft: 'none', borderTop: 'none',
    fontSize: 12, padding: '2px 8px',
    userSelect: 'none',
    fontFamily: "'Calibri','Segoe UI',Arial,sans-serif",
  };
}
