'use client';

import { useState } from 'react';
import type { CellSelection } from '../ExcelShell';

const COLS = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const COL_WIDTHS = [36, 30, 160, 220, 220, 160, 60, 60, 60];

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
function note(v: string): Cell { return { value: v, italic: true, color: '#217346', bg: '#f0faf4' }; }

type Row = {
  cells: [Cell, Cell, Cell, Cell, Cell];
  height?: number;
  // what to show in formula bar when this row is selected
  ref: string;
  formula: string;
};

function row(
  ref: string, formula: string,
  b: Cell, c: Cell, d: Cell, ef: Cell, f: Cell,
  height?: number
): Row {
  return { ref, formula, cells: [b, c, d, ef, f], height };
}

const rows: Row[] = [
  // Header
  row('C1', '="Abby Ramadan"',
    e(), hdr('ABBY RAMADAN'), e(), e(), e()),
  row('C2', '=XLOOKUP("title",Info!A:A,Info!B:B)',
    e(), { value: 'Capital Markets Associate  ·  Financial Analyst  ·  Structured Finance', italic: true, color: W, bg: G }, e(), e(), e()),
  row('C3', '=XLOOKUP("contact",Info!A:A,Info!B:B)',
    e(), { value: 'Chicago, IL  (open to relocation to Bay Area)  ·  abbyramadan98@gmail.com  ·  linkedin.com/in/abby-ramadan/', color: W, bg: G, italic: true }, e(), e(), e()),
  row('C4', '=""', e(), e(), e(), e(), e(), 6),

  // Summary
  row('C5', '=XLOOKUP("summary",Resume!A:A,Resume!B:B)',
    e(), sect('SUMMARY'), e(), e(), e()),
  row('C6', '=XLOOKUP("summary_text",Resume!A:A,Resume!B:B)',
    e(), { value: 'Financial analyst specializing in forecasting, financial modeling, and data-driven analysis across $300MM+ portfolios. Skilled in financial modeling, cash flow forecasting, and interpreting credit agreements to support regulatory compliance, risk management, and funding strategy.', color: '#222', bg: LG }, e(), e(), e(), 46),
  row('C7', '=""', e(), e(), e(), e(), e(), 6),

  // Experience
  row('C8', '=XLOOKUP("experience",Resume!A:A,Resume!B:B)',
    e(), sect('EXPERIENCE'), e(), e(), e()),
  row('C9', '=""', e(), e(), e(), e(), e(), 4),

  // Above Lending
  row('C10', '=XLOOKUP("above_lending",Employers!A:A,Employers!B:B)',
    e(), company('Above Lending'), e(), loc('Chicago, IL'), e()),
  row('C11', '=XLOOKUP("capital_markets_assoc",Roles!A:A,Roles!B:B)',
    e(), role('Capital Markets Associate'), e(), period('January 2025 – Present'), e()),
  row('C12', '=XLOOKUP("al_bullet1",Bullets!A:A,Bullets!B:B)',
    e(), bullet('Built and enhanced financial models and SQL-driven reporting to forecast loan performance and cash flows for $300MM+ portfolios to support capital allocation and funding decisions'), e(), e(), e(), 34),
  row('C13', '=XLOOKUP("al_bullet2",Bullets!A:A,Bullets!B:B)',
    e(), bullet('Performed variance analysis on forecasted vs. actual cash flows to hone forecast accuracy'), e(), e(), e()),
  row('C14', '=XLOOKUP("al_bullet3",Bullets!A:A,Bullets!B:B)',
    e(), bullet('Streamlined reporting processes by consolidating redundant workbooks and improving SQL code clarity, reducing reporting preparation time by 30%'), e(), e(), e(), 28),
  row('C15', '=XLOOKUP("al_bullet4",Bullets!A:A,Bullets!B:B)',
    e(), bullet('Analyzed credit agreements and corrected report logic, unlocking $500,000+ in additional borrowing capacity under warehouse facilities'), e(), e(), e(), 28),
  row('C16', '=XLOOKUP("al_bullet5",Bullets!A:A,Bullets!B:B)',
    e(), bullet('Enhanced loan allocation tools and aligned processes with legal documents to ensure regulatory compliance'), e(), e(), e()),
  row('C17', '=XLOOKUP("al_bullet6",Bullets!A:A,Bullets!B:B)',
    e(), bullet('Collaborated cross-functionally to support strategic initiatives across Capital Markets and other teams'), e(), e(), e()),
  row('C18', '=""', e(), e(), e(), e(), e(), 6),

  // Golub Capital
  row('C19', '=XLOOKUP("golub_capital",Employers!A:A,Employers!B:B)',
    e(), company('Golub Capital'), e(), loc('Chicago, IL'), e()),
  row('C20', '=XLOOKUP("sfa",Roles!A:A,Roles!B:B)',
    e(), role('Structured Finance Analyst'), e(), period('September 2022 – December 2024'), e()),
  row('C21', '=XLOOKUP("gc_bullet1",Bullets!A:A,Bullets!B:B)',
    e(), bullet('Monitored and analyzed 10+ multi-million dollar asset-backed securities to ensure compliance with covenants'), e(), e(), e()),
  row('C22', '=XLOOKUP("gc_bullet2",Bullets!A:A,Bullets!B:B)',
    e(), bullet('Modeled projected asset performance and recommended portfolio trades to optimize returns'), e(), e(), e()),
  row('C23', '=XLOOKUP("gc_bullet3",Bullets!A:A,Bullets!B:B)',
    e(), bullet('Interpreted indentures and advised stakeholders on compliance, supporting treasury activities'), e(), e(), e()),
  row('C24', '=XLOOKUP("gc_bullet4",Bullets!A:A,Bullets!B:B)',
    e(), bullet('Collaborated with rating agencies and presented financial analyses to support transaction outcomes'), e(), e(), e()),
  row('C25', '=""', e(), e(), e(), e(), e(), 6),

  // CME Group
  row('C26', '=XLOOKUP("cme_group",Employers!A:A,Employers!B:B)',
    e(), company('CME Group'), e(), loc('Chicago, IL'), e()),
  row('C27', '=XLOOKUP("examiner",Roles!A:A,Roles!B:B)',
    e(), role('Examiner'), e(), period('January 2022 – September 2022'), e()),
  row('C28', '=XLOOKUP("cme_bullet1",Bullets!A:A,Bullets!B:B)',
    e(), bullet('Reconciled firm financials and third-party documentation to validate accuracy and regulatory compliance'), e(), e(), e()),
  row('C29', '=XLOOKUP("cme_bullet2",Bullets!A:A,Bullets!B:B)',
    e(), bullet('Conducted testing and analysis of financial data in accordance with CFTC regulations'), e(), e(), e()),
  row('C30', '=XLOOKUP("cme_bullet3",Bullets!A:A,Bullets!B:B)',
    e(), bullet('Assisted in testing judgmentally selected samples and researching regulations as part of examination team'), e(), e(), e()),
  row('C31', '=""', e(), e(), e(), e(), e(), 4),
  row('C32', '=XLOOKUP("examiner_intern",Roles!A:A,Roles!B:B)',
    e(), role('Examiner Intern'), e(), period('May 2021 – July 2021'), e()),
  row('C33', '=XLOOKUP("cmei_bullet1",Bullets!A:A,Bullets!B:B)',
    e(), bullet('Prepared workpapers for examinations under guidance of senior examiners'), e(), e(), e()),
  row('C34', '=XLOOKUP("cmei_bullet2",Bullets!A:A,Bullets!B:B)',
    e(), bullet('Researched relevant CFTC rules for FCMs to support examinations'), e(), e(), e()),
  row('C35', '=""', e(), e(), e(), e(), e(), 6),

  // EY
  row('C36', '=XLOOKUP("ey",Employers!A:A,Employers!B:B)',
    e(), company('EY'), e(), loc('Chicago, IL'), e()),
  row('C37', '=XLOOKUP("regional_tax_intern",Roles!A:A,Roles!B:B)',
    e(), role('Regional Tax Intern'), e(), period('January 2020 – March 2020'), e()),
  row('C38', '=XLOOKUP("ey_bullet1",Bullets!A:A,Bullets!B:B)',
    e(), bullet('Fulfilled client needs by documenting international tax rules for the Global Compliance & Reporting tax team'), e(), e(), e()),
  row('C39', '=XLOOKUP("ey_bullet2",Bullets!A:A,Bullets!B:B)',
    e(), bullet('Prepared and organized client workpapers and performed substantive analytical procedures'), e(), e(), e()),
  row('C40', '=XLOOKUP("ey_bullet3",Bullets!A:A,Bullets!B:B)',
    e(), bullet('Received training regarding corporate tax return preparation and computation of tax liability for different entities'), e(), e(), e()),
  row('C41', '=""', e(), e(), e(), e(), e(), 6),

  // RJO
  row('C42', '=XLOOKUP("rjo",Employers!A:A,Employers!B:B)',
    e(), company("R.J. O'Brien & Associates LLC"), e(), loc('Chicago, IL'), e()),
  row('C43', '=XLOOKUP("accounting_intern",Roles!A:A,Roles!B:B)',
    e(), role('Accounting Intern'), e(), period('June 2019 – August 2019'), e()),
  row('C44', '=XLOOKUP("rjo_bullet1",Bullets!A:A,Bullets!B:B)',
    e(), bullet('Monitored internal controls and utilized XML schema to streamline reporting of monthly regulatory reports'), e(), e(), e()),
  row('C45', '=XLOOKUP("rjo_bullet2",Bullets!A:A,Bullets!B:B)',
    e(), bullet('Created and analyzed rolling charts in Excel for tracking trends of account balances and ratios'), e(), e(), e()),
  row('C46', '=""', e(), e(), e(), e(), e(), 8),

  // Education
  row('C47', '=XLOOKUP("education",Resume!A:A,Resume!B:B)',
    e(), sect('EDUCATION'), e(), e(), e()),
  row('C48', '=""', e(), e(), e(), e(), e(), 4),
  row('C49', '=XLOOKUP("cwru",Schools!A:A,Schools!B:B)',
    e(), company('Case Western Reserve University'), e(), loc('Cleveland, OH'), e()),
  row('C50', '=XLOOKUP("macc",Degrees!A:A,Degrees!B:B)',
    e(), plain('Master of Accountancy'), e(), period('January 2021 – December 2021'), e()),
  row('C51', '=XLOOKUP("bsacc",Degrees!A:A,Degrees!B:B)',
    e(), plain('Bachelor of Science in Accounting, Applied Data Science Minor'), e(), period('August 2017 – December 2021'), e()),
  row('C52', '=""', e(), e(), e(), e(), e(), 8),

  // Skills
  row('C53', '=XLOOKUP("skills",Resume!A:A,Resume!B:B)',
    e(), sect('SKILLS'), e(), e(), e()),
  row('C54', '=""', e(), e(), e(), e(), e(), 4),
  row('C55', '=XLOOKUP("skills_text",Resume!A:A,Resume!B:B)',
    e(), { value: 'Excel (advanced)  ·  SQL  ·  Tableau  ·  PowerBI  ·  Power Automate  ·  R  ·  Python  ·  Forecasting  ·  Treasury & Liquidity Management  ·  Structured Finance', color: '#222', bg: LG }, e(), e(), e(), 28),
  row('C56', '=""', e(), e(), e(), e(), e(), 20),
];

export default function ResumeSheet({ onSelect }: { onSelect: (s: CellSelection) => void }) {
  const [selectedRowIdx, setSelectedRowIdx] = useState<number | null>(null);

  function handleRowClick(ri: number) {
    setSelectedRowIdx(ri);
    onSelect({ ref: rows[ri].ref, formula: rows[ri].formula });
  }

  return (
    <div className="h-full overflow-auto" style={{ background: '#fff' }}>
      <table
        className="border-collapse"
        style={{ tableLayout: 'fixed', width: '100%', minWidth: 860, borderSpacing: 0 }}
      >
        <colgroup>
          {COL_WIDTHS.map((w, i) => <col key={i} style={{ width: w }} />)}
        </colgroup>

        <thead>
          <tr>
            <th style={thStyle(36)} />
            {COLS.slice(1).map((label, i) => (
              <th key={i} style={thStyle(COL_WIDTHS[i + 1])}>{label}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((r, ri) => {
            const [cellB, cellC, cellD, cellE, cellF] = r.cells;
            const h = r.height ?? 20;
            const isSelected = selectedRowIdx === ri;
            const cSpansAll = cellD.value === '' && cellE.value === '' && cellF.value === '';

            return (
              <tr key={ri} style={{ height: h }} onClick={() => handleRowClick(ri)}>
                <td style={{ ...rowNumStyle, background: isSelected ? '#bdd7ee' : '#f0f0f0', fontWeight: isSelected ? 700 : 400 }}>
                  {ri + 1}
                </td>
                <td style={gridCell(h, isSelected ? '#e8f0fe' : '#fff')} />

                {cSpansAll ? (
                  <td colSpan={4} style={{
                    ...contentCell(h),
                    fontWeight: cellC.bold ? 700 : 400,
                    color: cellC.color ?? '#212121',
                    background: isSelected ? (cellC.bg ?? '#e8f0fe') : (cellC.bg ?? '#fff'),
                    fontStyle: cellC.italic ? 'italic' : 'normal',
                    paddingLeft: 8 + (cellC.indent ?? 0) * 16,
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    lineHeight: '1.35',
                    verticalAlign: 'middle',
                  }}>
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
                      whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: '1.35', verticalAlign: 'middle',
                    }}>{cellC.value}</td>
                    <td style={{
                      ...contentCell(h),
                      fontWeight: cellD.bold ? 700 : 400,
                      color: cellD.color ?? '#212121',
                      background: isSelected ? '#e8f0fe' : (cellD.bg ?? '#fff'),
                      fontStyle: cellD.italic ? 'italic' : 'normal',
                    }}>{cellD.value}</td>
                    <td style={{
                      ...contentCell(h),
                      fontWeight: cellE.bold ? 700 : 400,
                      color: cellE.color ?? '#212121',
                      background: isSelected ? '#e8f0fe' : (cellE.bg ?? '#fff'),
                      fontStyle: cellE.italic ? 'italic' : 'normal',
                      textAlign: cellE.align ?? 'left',
                    }}>{cellE.value}</td>
                    <td style={{
                      ...contentCell(h),
                      fontWeight: cellF.bold ? 700 : 400,
                      color: cellF.color ?? '#212121',
                      background: isSelected ? '#e8f0fe' : (cellF.bg ?? '#fff'),
                      fontStyle: cellF.italic ? 'italic' : 'normal',
                      textAlign: cellF.align ?? 'left',
                    }}>{cellF.value}</td>
                  </>
                )}

                <td style={gridCell(h, isSelected ? '#e8f0fe' : '#fff')} />
                <td style={gridCell(h, isSelected ? '#e8f0fe' : '#fff')} />
                <td style={gridCell(h, isSelected ? '#e8f0fe' : '#fff')} />
              </tr>
            );
          })}

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
    width, height: 22,
    background: '#f0f0f0',
    border: BORDER, borderTop: 'none', borderLeft: 'none',
    fontSize: 11, fontWeight: 600, color: '#666',
    textAlign: 'center', padding: 0,
    position: 'sticky', top: 0, zIndex: 10,
    fontFamily: "'Calibri', 'Segoe UI', Arial, sans-serif",
  };
}

const rowNumStyle: React.CSSProperties = {
  width: 36,
  background: '#f0f0f0',
  border: BORDER, borderLeft: 'none',
  fontSize: 11, color: '#666',
  textAlign: 'center', padding: 0,
  userSelect: 'none', cursor: 'pointer',
  fontFamily: "'Calibri', 'Segoe UI', Arial, sans-serif",
};

function gridCell(height: number, bg: string): React.CSSProperties {
  return {
    height, background: bg,
    border: BORDER, borderLeft: 'none', borderTop: 'none',
    padding: 0,
  };
}

function contentCell(height: number): React.CSSProperties {
  return {
    height,
    border: BORDER, borderLeft: 'none', borderTop: 'none',
    fontSize: 12, padding: '2px 8px',
    cursor: 'cell', userSelect: 'none',
    fontFamily: "'Calibri', 'Segoe UI', Arial, sans-serif",
    overflow: 'hidden',
  };
}
