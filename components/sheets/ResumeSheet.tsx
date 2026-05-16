'use client';

import { useState } from 'react';

// Column definitions - centered layout with wide middle columns
const COLS = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const COL_WIDTHS = [36, 30, 160, 220, 220, 160, 60, 60, 60];
// A=row#, B=padding, C=left content, D=left content cont, E=right content, F=period, G-H=filler

type Cell = {
  value: string;
  bold?: boolean;
  color?: string;
  bg?: string;
  italic?: boolean;
  indent?: number;
  align?: 'left' | 'center' | 'right';
};

const G = '#217346'; // dark green
const LG = '#e9f5ee'; // light green bg
const MG = '#107c41'; // mid green
const W = '#ffffff';
const EMPTY: Cell = { value: '' };
function e(): Cell { return { value: '' }; }
function hdr(v: string): Cell { return { value: v, bold: true, bg: G, color: W }; }
function sect(v: string): Cell { return { value: v, bold: true, bg: MG, color: W }; }
function company(v: string): Cell { return { value: v, bold: true, color: '#1a1a1a' }; }
function role(v: string): Cell { return { value: v, italic: true, color: '#333' }; }
function period(v: string): Cell { return { value: v, color: '#555', align: 'right' }; }
function bullet(v: string): Cell { return { value: '•  ' + v, color: '#222', indent: 1 }; }
function plain(v: string): Cell { return { value: v, color: '#222' }; }
function loc(v: string): Cell { return { value: v, color: '#555', align: 'right' }; }

// Each row: [B, C, D, E, F] — columns B–F, rendered centered
// Row height is 20px standard
type Row = {
  cells: [Cell, Cell, Cell, Cell, Cell];
  height?: number;
};

function row(b: Cell, c: Cell, d: Cell, e: Cell, f: Cell, height?: number): Row {
  return { cells: [b, c, d, e, f], height };
}

const rows: Row[] = [
  // Summary header
  row(e(), hdr('ABBY RAMADAN'), e(), e(), e()),
  row(e(), { value: 'Financial Analyst · Capital Markets · Structured Finance', italic: true, color: W, bg: G }, e(), e(), e()),
  row(e(), { value: 'Chicago, IL  ·  abbyramadan98@gmail.com  ·  linkedin.com/in/abby-ramadan/', color: W, bg: G, italic: true }, e(), e(), e()),
  row(e(), e(), e(), e(), e(), 6),

  // Summary
  row(e(), sect('SUMMARY'), e(), e(), e()),
  row(e(), { value: 'Financial analyst specializing in forecasting, financial modeling, and data-driven analysis across $300MM+ portfolios. Skilled in financial modeling, cash flow forecasting, and interpreting credit agreements to support regulatory compliance, risk management, and funding strategy.', color: '#222', bg: LG }, e(), e(), e(), 46),
  row(e(), e(), e(), e(), e(), 6),

  // Experience header
  row(e(), sect('EXPERIENCE'), e(), e(), e()),
  row(e(), e(), e(), e(), e(), 4),

  // Above Lending
  row(e(), company('Above Lending'), e(), loc('Chicago, IL'), e()),
  row(e(), role('Capital Markets Associate'), e(), period('January 2025 – Present'), e()),
  row(e(), bullet('Built and enhanced financial models and SQL-driven reporting to forecast loan performance and cash flows for $300MM+ portfolios to support capital allocation and funding decisions'), e(), e(), e(), 34),
  row(e(), bullet('Performed variance analysis on forecasted vs. actual cash flows to hone forecast accuracy'), e(), e(), e(), 22),
  row(e(), bullet('Streamlined reporting processes by consolidating redundant workbooks and improving SQL code clarity, reducing reporting preparation time by 30%'), e(), e(), e(), 28),
  row(e(), bullet('Analyzed credit agreements and corrected report logic, unlocking $500,000+ in additional borrowing capacity under warehouse facilities'), e(), e(), e(), 28),
  row(e(), bullet('Enhanced loan allocation tools and aligned processes with legal documents to ensure regulatory compliance'), e(), e(), e(), 22),
  row(e(), bullet('Collaborated cross-functionally to support strategic initiatives across Capital Markets and other teams'), e(), e(), e(), 22),
  row(e(), e(), e(), e(), e(), 6),

  // Golub Capital
  row(e(), company('Golub Capital'), e(), loc('Chicago, IL'), e()),
  row(e(), role('Structured Finance Analyst'), e(), period('September 2022 – December 2024'), e()),
  row(e(), bullet('Monitored and analyzed 10+ multi-million dollar asset-backed securities to ensure compliance with covenants'), e(), e(), e(), 22),
  row(e(), bullet('Modeled projected asset performance and recommended portfolio trades to optimize returns'), e(), e(), e(), 22),
  row(e(), bullet('Interpreted indentures and advised stakeholders on compliance, supporting treasury activities'), e(), e(), e(), 22),
  row(e(), bullet('Collaborated with rating agencies and presented financial analyses to support transaction outcomes'), e(), e(), e(), 22),
  row(e(), e(), e(), e(), e(), 6),

  // CME Group
  row(e(), company('CME Group'), e(), loc('Chicago, IL'), e()),
  row(e(), role('Examiner'), e(), period('January 2022 – September 2022'), e()),
  row(e(), bullet('Reconciled firm financials and third-party documentation to validate accuracy and regulatory compliance'), e(), e(), e(), 22),
  row(e(), bullet('Conducted testing and analysis of financial data in accordance with CFTC regulations'), e(), e(), e(), 22),
  row(e(), bullet('Assisted in testing judgmentally selected samples and researching regulations as part of examination team'), e(), e(), e(), 22),
  row(e(), e(), e(), e(), e(), 4),
  row(e(), role('Examiner Intern'), e(), period('May 2021 – July 2021'), e()),
  row(e(), bullet('Prepared workpapers for examinations under guidance of senior examiners'), e(), e(), e(), 22),
  row(e(), bullet('Researched relevant CFTC rules for FCMs to support examinations'), e(), e(), e(), 22),
  row(e(), e(), e(), e(), e(), 6),

  // EY
  row(e(), company('EY'), e(), loc('Chicago, IL'), e()),
  row(e(), role('Regional Tax Intern'), e(), period('January 2020 – March 2020'), e()),
  row(e(), bullet('Fulfilled client needs by documenting international tax rules for the Global Compliance & Reporting tax team'), e(), e(), e(), 22),
  row(e(), bullet('Prepared and organized client workpapers and performed substantive analytical procedures'), e(), e(), e(), 22),
  row(e(), bullet('Received training regarding corporate tax return preparation and computation of tax liability for different entities'), e(), e(), e(), 22),
  row(e(), e(), e(), e(), e(), 6),

  // RJO
  row(e(), company("R.J. O'Brien & Associates LLC"), e(), loc('Chicago, IL'), e()),
  row(e(), role('Accounting Intern'), e(), period('June 2019 – August 2019'), e()),
  row(e(), bullet('Monitored internal controls and utilized XML schema to streamline reporting of monthly regulatory reports'), e(), e(), e(), 22),
  row(e(), bullet('Created and analyzed rolling charts in Excel for tracking trends of account balances and ratios'), e(), e(), e(), 22),
  row(e(), e(), e(), e(), e(), 8),

  // Education header
  row(e(), sect('EDUCATION'), e(), e(), e()),
  row(e(), e(), e(), e(), e(), 4),
  row(e(), company('Case Western Reserve University'), e(), loc('Cleveland, OH'), e()),
  row(e(), plain('Master of Accountancy'), e(), period('January 2021 – December 2021'), e()),
  row(e(), plain('Bachelor of Science in Accounting, Applied Data Science Minor'), e(), period('August 2017 – December 2021'), e()),
  row(e(), e(), e(), e(), e(), 8),

  // Skills header
  row(e(), sect('SKILLS'), e(), e(), e()),
  row(e(), e(), e(), e(), e(), 4),
  row(e(), { value: 'Excel (advanced)  ·  SQL  ·  Tableau  ·  PowerBI  ·  Power Automate  ·  R  ·  Python  ·  Forecasting  ·  Treasury & Liquidity Management  ·  Structured Finance', color: '#222', bg: LG }, e(), e(), e(), 28),
  row(e(), e(), e(), e(), e(), 20),
];

// Total content width for centering
const CONTENT_WIDTH = 160 + 220 + 220 + 160; // cols C+D+E+F = 760px

export default function ResumeSheet() {
  const [selectedRowIdx, setSelectedRowIdx] = useState<number | null>(null);

  // We'll render a proper spreadsheet: visible grid everywhere,
  // with the resume content occupying columns C–F, centered on the sheet.
  // Left filler (cols A–B) and right filler (cols G–H) are empty grid cells.

  return (
    <div className="h-full overflow-auto" style={{ background: '#fff' }}>
      <table
        className="border-collapse"
        style={{ tableLayout: 'fixed', width: '100%', minWidth: 860, borderSpacing: 0 }}
      >
        <colgroup>
          {/* Row number col */}
          <col style={{ width: 36 }} />
          {/* Left filler */}
          <col style={{ width: 30 }} />
          {/* Content cols C D E F */}
          <col style={{ width: 160 }} />
          <col style={{ width: 220 }} />
          <col style={{ width: 220 }} />
          <col style={{ width: 160 }} />
          {/* Right filler */}
          <col style={{ width: 60 }} />
          <col style={{ width: 60 }} />
          <col style={{ width: 60 }} />
        </colgroup>

        {/* Column header row */}
        <thead>
          <tr>
            <th style={thStyle(36)} />
            {COLS.slice(1).map((label, i) => (
              <th key={i} style={thStyle(COL_WIDTHS[i + 1])}>
                {label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((r, ri) => {
            const [cellB, cellC, cellD, cellE, cellF] = r.cells;
            const h = r.height ?? 20;
            const isSelected = selectedRowIdx === ri;

            // For section/header rows that span C–F, we use the C cell value
            // and detect if D/E/F are empty to decide on spanning
            const cSpansAll = (cellD.value === '' && cellE.value === '' && cellF.value === '');

            return (
              <tr key={ri} style={{ height: h }} onClick={() => setSelectedRowIdx(ri)}>
                {/* Row number */}
                <td style={{
                  ...rowNumStyle,
                  background: isSelected ? '#bdd7ee' : '#f0f0f0',
                  fontWeight: isSelected ? 700 : 400,
                }}>
                  {ri + 1}
                </td>

                {/* Left filler col B */}
                <td style={gridCell(h, isSelected ? '#e8f0fe' : '#fff')} />

                {/* Content: C spans C–F when D/E/F are empty, otherwise individual */}
                {cSpansAll ? (
                  <td
                    colSpan={4}
                    style={{
                      ...contentCell(h),
                      fontWeight: cellC.bold ? 700 : 400,
                      color: cellC.color ?? '#212121',
                      background: isSelected
                        ? (cellC.bg ?? '#e8f0fe')
                        : (cellC.bg ?? '#fff'),
                      fontStyle: cellC.italic ? 'italic' : 'normal',
                      paddingLeft: 8 + (cellC.indent ?? 0) * 16,
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                      lineHeight: '1.35',
                      verticalAlign: 'middle',
                    }}
                  >
                    {cellC.value}
                  </td>
                ) : (
                  <>
                    <td style={{
                      ...contentCell(h),
                      fontWeight: cellC.bold ? 700 : 400,
                      color: cellC.color ?? '#212121',
                      background: isSelected ? '#e8f0fe' : (cellC.bg ?? '#fff'),
                      fontStyle: cellC.italic ? 'italic' : 'normal',
                      paddingLeft: 8 + (cellC.indent ?? 0) * 16,
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                      lineHeight: '1.35',
                      verticalAlign: 'middle',
                    }}>
                      {cellC.value}
                    </td>
                    <td style={{
                      ...contentCell(h),
                      fontWeight: cellD.bold ? 700 : 400,
                      color: cellD.color ?? '#212121',
                      background: isSelected ? '#e8f0fe' : (cellD.bg ?? '#fff'),
                      fontStyle: cellD.italic ? 'italic' : 'normal',
                    }}>
                      {cellD.value}
                    </td>
                    <td style={{
                      ...contentCell(h),
                      fontWeight: cellE.bold ? 700 : 400,
                      color: cellE.color ?? '#212121',
                      background: isSelected ? '#e8f0fe' : (cellE.bg ?? '#fff'),
                      fontStyle: cellE.italic ? 'italic' : 'normal',
                      textAlign: cellE.align ?? 'left',
                    }}>
                      {cellE.value}
                    </td>
                    <td style={{
                      ...contentCell(h),
                      fontWeight: cellF.bold ? 700 : 400,
                      color: cellF.color ?? '#212121',
                      background: isSelected ? '#e8f0fe' : (cellF.bg ?? '#fff'),
                      fontStyle: cellF.italic ? 'italic' : 'normal',
                      textAlign: cellF.align ?? 'left',
                    }}>
                      {cellF.value}
                    </td>
                  </>
                )}

                {/* Right filler cols G H I */}
                <td style={gridCell(h, isSelected ? '#e8f0fe' : '#fff')} />
                <td style={gridCell(h, isSelected ? '#e8f0fe' : '#fff')} />
                <td style={gridCell(h, isSelected ? '#e8f0fe' : '#fff')} />
              </tr>
            );
          })}

          {/* Extra empty rows to fill the sheet */}
          {Array.from({ length: 20 }).map((_, i) => (
            <tr key={`empty-${i}`} style={{ height: 20 }}>
              <td style={{ ...rowNumStyle, color: '#aaa' }}>{rows.length + i + 1}</td>
              {Array.from({ length: 8 }).map((_, ci) => (
                <td key={ci} style={gridCell(20, '#fff')} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const BORDER = '1px solid #d0d7de';

function thStyle(width: number): React.CSSProperties {
  return {
    width,
    height: 22,
    background: '#f0f0f0',
    border: BORDER,
    borderTop: 'none',
    borderLeft: 'none',
    fontSize: 11,
    fontWeight: 600,
    color: '#666',
    textAlign: 'center',
    padding: 0,
    position: 'sticky',
    top: 0,
    zIndex: 10,
    fontFamily: "'Calibri', 'Segoe UI', Arial, sans-serif",
  };
}

const rowNumStyle: React.CSSProperties = {
  width: 36,
  background: '#f0f0f0',
  border: BORDER,
  borderLeft: 'none',
  fontSize: 11,
  color: '#666',
  textAlign: 'center',
  padding: 0,
  userSelect: 'none',
  cursor: 'pointer',
  fontFamily: "'Calibri', 'Segoe UI', Arial, sans-serif",
};

function gridCell(height: number, bg: string): React.CSSProperties {
  return {
    height,
    background: bg,
    border: BORDER,
    borderLeft: 'none',
    borderTop: 'none',
    padding: 0,
  };
}

function contentCell(height: number): React.CSSProperties {
  return {
    height,
    border: BORDER,
    borderLeft: 'none',
    borderTop: 'none',
    fontSize: 12,
    padding: '2px 8px',
    cursor: 'cell',
    userSelect: 'none',
    fontFamily: "'Calibri', 'Segoe UI', Arial, sans-serif",
    overflow: 'hidden',
  };
}
