'use client';

import { useState } from 'react';

const COL_WIDTHS = [40, 60, 200, 260, 160, 340];
const COL_LABELS = ['', 'A', 'B', 'C', 'D', 'E'];

type CellStyle = {
  value: string;
  bold?: boolean;
  color?: string;
  bg?: string;
  italic?: boolean;
  indent?: number;
};

function sectionHeader(value: string) {
  return { value, bold: true, color: '#ffffff', bg: '#217346' };
}

function subHeader(value: string) {
  return { value, bold: true, color: '#ffffff', bg: '#107c41' };
}

function roleRow(value: string) {
  return { value, bold: true, color: '#1a1a1a', bg: '#e9f5ee' };
}

function metaRow(value: string) {
  return { value, italic: true, color: '#555', bg: '#f7fbf9' };
}

function bullet(value: string) {
  return { value: `• ${value}`, color: '#333', indent: 1 };
}

function empty(bg?: string): CellStyle {
  return { value: '', bg };
}

// Each row: [rowNum, A, B, C, D, E]
const rows: [number, CellStyle, CellStyle, CellStyle, CellStyle, CellStyle][] = [
  [1, sectionHeader('EXPERIENCE'), empty('#217346'), empty('#217346'), empty('#217346'), empty('#217346')],
  [2, empty(), empty(), empty(), empty(), empty()],
  // Above Lending
  [3, subHeader('1'), subHeader('Role'), subHeader('Company'), subHeader('Location'), subHeader('Period')],
  [4, empty('#e9f5ee'), roleRow('Capital Markets Associate'), roleRow('Above Lending'), roleRow('Chicago, IL'), roleRow('Jan 2025 – Present')],
  [5, empty(), bullet('Streamlined reporting by consolidating workbooks & improving SQL; cut prep time 30%'), empty(), empty(), empty()],
  [6, empty(), bullet('Visualized loss curves & forecasted vintage performance for $100MM+ loan portfolios'), empty(), empty(), empty()],
  [7, empty(), bullet('Interpreted credit agreements, corrected report logic → $500K in leverage at credit facility'), empty(), empty(), empty()],
  [8, empty(), bullet('Enhanced loan allocation tools & aligned with legal documents for regulatory compliance'), empty(), empty(), empty()],
  [9, empty(), bullet('Collaborated cross-functionally across Capital Markets and other teams'), empty(), empty(), empty()],
  [10, empty(), empty(), empty(), empty(), empty()],
  // Golub Capital
  [11, subHeader('2'), subHeader('Role'), subHeader('Company'), subHeader('Location'), subHeader('Period')],
  [12, empty('#e9f5ee'), roleRow('Structured Finance Analyst'), roleRow('Golub Capital'), roleRow('Chicago, IL'), roleRow('Sep 2022 – Dec 2024')],
  [13, empty(), bullet('Monitored 10+ multi-million dollar ABS for covenant compliance'), empty(), empty(), empty()],
  [14, empty(), bullet('Proposed trades after modeling forecasted performance and risks of underlying assets'), empty(), empty(), empty()],
  [15, empty(), bullet('Advised external teams on compliance by interpreting governing indentures and laws'), empty(), empty(), empty()],
  [16, empty(), bullet('Negotiated with rating agencies and presented financial data to bolster firm\'s position'), empty(), empty(), empty()],
  [17, empty(), empty(), empty(), empty(), empty()],
  // CME Examiner
  [18, subHeader('3'), subHeader('Role'), subHeader('Company'), subHeader('Location'), subHeader('Period')],
  [19, empty('#e9f5ee'), roleRow('Examiner'), roleRow('CME Group'), roleRow('Chicago, IL'), roleRow('Jan 2022 – Sep 2022')],
  [20, empty(), bullet('Reconciled firm-produced and third-party docs to confirm accuracy of financial statements'), empty(), empty(), empty()],
  [21, empty(), bullet('Organized examinations and abided by CFTC regulations'), empty(), empty(), empty()],
  [22, empty(), bullet('Tested judgmentally selected samples and researched regulations for exam team'), empty(), empty(), empty()],
  [23, empty(), empty(), empty(), empty(), empty()],
  // CME Intern
  [24, subHeader('4'), subHeader('Role'), subHeader('Company'), subHeader('Location'), subHeader('Period')],
  [25, empty('#e9f5ee'), roleRow('Examiner Intern'), roleRow('CME Group'), roleRow('Chicago, IL'), roleRow('May 2021 – Jul 2021')],
  [26, empty(), bullet('Prepared workpapers under guidance of senior examiners'), empty(), empty(), empty()],
  [27, empty(), bullet('Researched relevant CFTC rules for FCMs to support examinations'), empty(), empty(), empty()],
  [28, empty(), bullet('Participated in educational events across CME Group functions'), empty(), empty(), empty()],
  [29, empty(), empty(), empty(), empty(), empty()],
  // EY
  [30, subHeader('5'), subHeader('Role'), subHeader('Company'), subHeader('Location'), subHeader('Period')],
  [31, empty('#e9f5ee'), roleRow('Regional Tax Intern'), roleRow('EY'), roleRow('Chicago, IL'), roleRow('Jan 2020 – Mar 2020')],
  [32, empty(), bullet('Documented international tax rules for Global Compliance & Reporting tax team'), empty(), empty(), empty()],
  [33, empty(), bullet('Prepared and organized client workpapers; performed substantive analytical procedures'), empty(), empty(), empty()],
  [34, empty(), bullet('Received training on corporate tax return preparation and tax liability computation'), empty(), empty(), empty()],
  [35, empty(), empty(), empty(), empty(), empty()],
  // RJO
  [36, subHeader('6'), subHeader('Role'), subHeader('Company'), subHeader('Location'), subHeader('Period')],
  [37, empty('#e9f5ee'), roleRow('Accounting Intern'), roleRow("R.J. O'Brien & Associates"), roleRow('Chicago, IL'), roleRow('Jun 2019 – Aug 2019')],
  [38, empty(), bullet('Monitored internal controls; used XML schema to streamline monthly regulatory reports'), empty(), empty(), empty()],
  [39, empty(), bullet('Created and analyzed rolling Excel charts for account balance and ratio trend tracking'), empty(), empty(), empty()],
  [40, empty(), empty(), empty(), empty(), empty()],
  // Education
  [41, sectionHeader('EDUCATION'), empty('#217346'), empty('#217346'), empty('#217346'), empty('#217346')],
  [42, empty(), empty(), empty(), empty(), empty()],
  [43, subHeader('Degree'), subHeader('Field'), subHeader('Institution'), subHeader('Location'), subHeader('Period')],
  [44, empty('#e9f5ee'), roleRow('Master of Accountancy'), roleRow('Case Western Reserve University'), roleRow('Cleveland, OH'), roleRow('Jan 2021 – Dec 2021')],
  [45, empty('#e9f5ee'), roleRow('BS in Accounting'), roleRow('Case Western Reserve University'), roleRow('Cleveland, OH'), roleRow('Aug 2017 – Dec 2021')],
  [46, empty(), { value: 'Applied Data Science Minor', italic: true, color: '#555' }, empty(), empty(), empty()],
  [47, empty(), empty(), empty(), empty(), empty()],
  // Skills
  [48, sectionHeader('SKILLS'), empty('#217346'), empty('#217346'), empty('#217346'), empty('#217346')],
  [49, empty(), empty(), empty(), empty(), empty()],
  [50, subHeader('Category'), subHeader('Skill 1'), subHeader('Skill 2'), subHeader('Skill 3'), subHeader('Skill 4')],
  [51, { value: 'Finance', bold: true, bg: '#e9f5ee', color: '#217346' }, { value: 'Excel', bg: '#f0faf4', color: '#333' }, { value: 'SQL', bg: '#f0faf4', color: '#333' }, { value: 'Financial Modeling', bg: '#f0faf4', color: '#333' }, { value: 'Data Analysis', bg: '#f0faf4', color: '#333' }],
  [52, { value: 'Analytics', bold: true, bg: '#e9f5ee', color: '#217346' }, { value: 'R', bg: '#f7fbf9', color: '#333' }, { value: 'Python', bg: '#f7fbf9', color: '#333' }, { value: 'Tableau', bg: '#f7fbf9', color: '#333' }, { value: 'PowerBI', bg: '#f7fbf9', color: '#333' }],
  [53, { value: 'Automation', bold: true, bg: '#e9f5ee', color: '#217346' }, { value: 'Power Automate', bg: '#f0faf4', color: '#333' }, { value: 'Java', bg: '#f0faf4', color: '#333' }, empty('#f0faf4'), empty('#f0faf4')],
];

export default function ResumeSheet() {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  return (
    <div className="h-full overflow-auto bg-white">
      <table className="border-collapse" style={{ tableLayout: 'fixed', width: '100%', minWidth: 900 }}>
        <colgroup>
          <col style={{ width: 40 }} />
          {COL_WIDTHS.slice(1).map((w, i) => (
            <col key={i} style={{ width: w }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th className="xl-cell-header sticky top-0 z-10" style={{ width: 40, height: 22 }} />
            {COL_LABELS.slice(1).map((label, i) => (
              <th
                key={i}
                className="xl-cell-header sticky top-0 z-10"
                style={{ width: COL_WIDTHS[i + 1], height: 22 }}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([rowNum, a, b, c, d, e]) => {
            const cells = [a, b, c, d, e];
            const isSelected = selectedRow === rowNum;
            return (
              <tr
                key={rowNum}
                style={{ height: 22 }}
                onClick={() => setSelectedRow(rowNum)}
              >
                <td
                  className="xl-cell-header"
                  style={{
                    width: 40,
                    textAlign: 'center',
                    fontSize: 11,
                    background: isSelected ? '#bdd7ee' : undefined,
                    fontWeight: isSelected ? 700 : undefined,
                    cursor: 'pointer',
                  }}
                >
                  {rowNum}
                </td>
                {cells.map((cell, ci) => (
                  <td
                    key={ci}
                    className="xl-cell"
                    style={{
                      width: COL_WIDTHS[ci + 1],
                      fontWeight: cell.bold ? 700 : 400,
                      color: cell.color ?? '#212121',
                      background: isSelected
                        ? (cell.bg ? cell.bg : '#e8f0fe')
                        : (cell.bg ?? 'transparent'),
                      fontStyle: cell.italic ? 'italic' : 'normal',
                      fontSize: 12,
                      padding: `1px ${6 + (cell.indent ?? 0) * 14}px 1px 6px`,
                      cursor: 'cell',
                      userSelect: 'none',
                      outline: isSelected && ci === 0 ? '2px solid #1565c0' : undefined,
                      outlineOffset: isSelected && ci === 0 ? '-2px' : undefined,
                    }}
                  >
                    {cell.value}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
