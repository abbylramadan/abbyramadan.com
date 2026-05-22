'use client';

import Sheet, { type Cell, type Row, G, LG, MG, W } from './Sheet';
import type { CellSelection } from '../ExcelShell';

// Desktop layout: content lives in D..G (Sheet.tsx FIRST/LAST_CONTENT_COL).
// A, B, C are leading filler; H, I, J, K are trailing filler.
// Order: row# | A | B | C | D | E | F | G | H | I | J | K
const COL_WIDTHS = [36, 150, 150, 150, 220, 200, 200, 170, 150, 100, 100, 100];

function ec(): Cell { return { value: '' }; }
function filled(v: string, bg: string, bold?: boolean, italic?: boolean, color?: string): Cell {
  return { value: v, bg, bold, italic, color: color ?? W };
}
function txt(v: string, color?: string, bold?: boolean, italic?: boolean, indent?: number, align?: Cell['align']): Cell {
  return { value: v, color: color ?? '#222', bold, italic, indent, align };
}

function sectionRow(ref: string, formula: string, label: string, bg: string, height?: number): Row {
  return { ref, formula, height,
    b: filled(label, bg, true), c: filled('', bg), d: filled('', bg), e: filled('', bg) };
}
function spacer(height = 6): Row {
  return { ref: '', formula: '', height, b: ec(), c: ec(), d: ec(), e: ec() };
}
// Each helper returns one or more rows.
// Desktop: company/role/plain rows have B (label) + E (location/period) side-by-side.
// Mobile: emits an extra row underneath with the location/period in B, left-aligned.
function companyRow(ref: string, formula: string, name: string, location: string): Row[] {
  return [
    { ref, formula,
      b: txt(name, '#1a1a1a', true), c: ec(), d: ec(),
      e: txt(location, '#555', false, false, 0, 'right'),
      desktopOnly: true },
    { ref, formula, height: 18,
      b: txt(name, '#1a1a1a', true), c: ec(), d: ec(), e: ec(),
      mobileOnly: true },
    { ref: '', formula: '', height: 16,
      b: txt(location, '#555', false, true), c: ec(), d: ec(), e: ec(),
      mobileOnly: true },
  ];
}
function roleRow(ref: string, formula: string, role: string, period: string): Row[] {
  return [
    { ref, formula,
      b: txt(role, '#333', false, true), c: ec(), d: ec(),
      e: txt(period, '#555', false, true, 0, 'right'),
      desktopOnly: true },
    { ref, formula, height: 18,
      b: txt(role, '#333', false, true), c: ec(), d: ec(), e: ec(),
      mobileOnly: true },
    { ref: '', formula: '', height: 16,
      b: txt(period, '#555', false, true), c: ec(), d: ec(), e: ec(),
      mobileOnly: true },
  ];
}
function bulletRow(ref: string, formula: string, text: string, height?: number): Row {
  return { ref, formula, height,
    b: txt('•  ' + text, '#222'), c: ec(), d: ec(), e: ec() };
}
function plainRow(ref: string, formula: string, text: string, period: string, height?: number): Row[] {
  return [
    { ref, formula, height,
      b: txt(text, '#222'), c: ec(), d: ec(),
      e: txt(period, '#555', false, true, 0, 'right'),
      desktopOnly: true },
    { ref, formula, height: 18,
      b: txt(text, '#222'), c: ec(), d: ec(), e: ec(),
      mobileOnly: true },
    { ref: '', formula: '', height: 16,
      b: txt(period, '#555', false, true), c: ec(), d: ec(), e: ec(),
      mobileOnly: true },
  ];
}
function skillsRow(ref: string, formula: string, text: string): Row {
  return { ref, formula, height: 28,
    b: { value: text, color: '#222', bg: LG },
    c: { value: '', bg: LG }, d: { value: '', bg: LG }, e: { value: '', bg: LG } };
}

const rows: Row[] = ([
  sectionRow('B1', '="Abby Ramadan"', 'ABBY RAMADAN', G),
  { ref: 'B2', formula: '=XLOOKUP("title",Info!A:A,Info!B:B)',
    b: filled('Capital Markets Associate  ·  Financial Analyst  ·  Structured Finance', G, false, true),
    c: filled('', G), d: filled('', G), e: filled('', G) },
  { ref: 'B3', formula: '=XLOOKUP("contact",Info!A:A,Info!B:B)',
    b: { ...filled('Chicago, IL  (open to relocation to Bay Area)  ·  abbyramadan98@gmail.com  ·  linkedin.com/in/abby-ramadan/', G, false, true),
         inlineLinks: {
           'abbyramadan98@gmail.com': 'mailto:abbyramadan98@gmail.com',
           'linkedin.com/in/abby-ramadan/': 'https://linkedin.com/in/abby-ramadan/',
         } },
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
] as (Row | Row[])[]).flat();

export default function ResumeSheet({ onSelect }: { onSelect: (s: CellSelection) => void }) {
  return <Sheet rows={rows} colWidths={COL_WIDTHS} onSelect={onSelect} />;
}
