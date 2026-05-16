'use client';

import { useState } from 'react';

const COL_WIDTHS = [40, 50, 240, 180, 200, 160, 120];
const COL_LABELS = ['', 'A', 'B', 'C', 'D', 'E', 'F'];

type Cell = {
  value: string;
  bold?: boolean;
  color?: string;
  bg?: string;
  italic?: boolean;
  link?: string;
};

function hdr(value: string): Cell { return { value, bold: true, color: '#fff', bg: '#217346' }; }
function sub(value: string): Cell { return { value, bold: true, color: '#fff', bg: '#107c41' }; }
function tag(value: string): Cell { return { value, color: '#217346', bg: '#e9f5ee' }; }
function meta(value: string): Cell { return { value, italic: true, color: '#555' }; }
function lnk(value: string, link: string): Cell { return { value, color: '#0563c1', link }; }
function e(bg?: string): Cell { return { value: '', bg }; }

const rows: [number, Cell, Cell, Cell, Cell, Cell, Cell][] = [
  [1, hdr('PROJECTS'), e('#217346'), e('#217346'), e('#217346'), e('#217346'), e('#217346')],
  [2, e(), e(), e(), e(), e(), e()],
  [3, sub('#'), sub('Project'), sub('Description'), sub('Technologies'), sub('Link'), sub('Status')],
  [4, e('#e9f5ee'), { value: 'Home Affordability Calculator', bold: true, bg: '#e9f5ee', color: '#1a1a1a' }, { value: 'Helps users understand how much home they can afford with mortgage calculations, interactive visualizations, and personalized analysis.', bg: '#e9f5ee', color: '#333' }, tag('React · TypeScript · Chart.js · Tailwind'), lnk('mortgagecalc.abbyramadan.com', 'https://mortgagecalc.abbyramadan.com'), { value: '✅ Live', color: '#217346', bold: true }],
  [5, e(), e(), e(), e(), e(), e()],
  [6, e(), e(), meta('More projects coming soon...'), e(), e(), e()],
  [7, e(), e(), e(), e(), e(), e()],
  [8, hdr('TOOLS & SKILLS'), e('#217346'), e('#217346'), e('#217346'), e('#217346'), e('#217346')],
  [9, e(), e(), e(), e(), e(), e()],
  [10, sub('Tool'), sub('Proficiency'), sub('Years'), sub('Notes'), e('#107c41'), e('#107c41')],
  [11, { value: 'Excel', bold: true, bg: '#e9f5ee', color: '#217346' }, { value: '████████░░  Advanced', bg: '#e9f5ee', color: '#217346' }, { value: '7+', bg: '#e9f5ee', color: '#333' }, { value: 'Pivot tables, VBA, financial modeling', bg: '#e9f5ee', color: '#555' }, e('#e9f5ee'), e('#e9f5ee')],
  [12, { value: 'Python', bold: true, bg: '#f7fbf9', color: '#217346' }, { value: '██████░░░░  Intermediate', bg: '#f7fbf9', color: '#217346' }, { value: '3+', bg: '#f7fbf9', color: '#333' }, { value: 'pandas, data analysis, automation', bg: '#f7fbf9', color: '#555' }, e('#f7fbf9'), e('#f7fbf9')],
  [13, { value: 'R', bold: true, bg: '#e9f5ee', color: '#217346' }, { value: '██████░░░░  Intermediate', bg: '#e9f5ee', color: '#217346' }, { value: '3+', bg: '#e9f5ee', color: '#333' }, { value: 'Statistical analysis, ggplot2, tidyverse', bg: '#e9f5ee', color: '#555' }, e('#e9f5ee'), e('#e9f5ee')],
  [14, { value: 'SQL', bold: true, bg: '#f7fbf9', color: '#217346' }, { value: '███████░░░  Advanced', bg: '#f7fbf9', color: '#217346' }, { value: '4+', bg: '#f7fbf9', color: '#333' }, { value: 'Queries, reporting, optimization', bg: '#f7fbf9', color: '#555' }, e('#f7fbf9'), e('#f7fbf9')],
  [15, { value: 'Tableau', bold: true, bg: '#e9f5ee', color: '#217346' }, { value: '█████░░░░░  Intermediate', bg: '#e9f5ee', color: '#217346' }, { value: '2+', bg: '#e9f5ee', color: '#333' }, { value: 'Dashboards, data visualization', bg: '#e9f5ee', color: '#555' }, e('#e9f5ee'), e('#e9f5ee')],
  [16, { value: 'PowerBI', bold: true, bg: '#f7fbf9', color: '#217346' }, { value: '█████░░░░░  Intermediate', bg: '#f7fbf9', color: '#217346' }, { value: '2+', bg: '#f7fbf9', color: '#333' }, { value: 'Business intelligence, reporting', bg: '#f7fbf9', color: '#555' }, e('#f7fbf9'), e('#f7fbf9')],
  [17, e(), e(), e(), e(), e(), e()],
];

export default function ProjectsSheet() {
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
          {rows.map(([rowNum, a, b, c, d, e2, f]) => {
            const cells = [a, b, c, d, e2, f];
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
                      color: isSelected ? (cell.bg ? cell.color : '#1565c0') : (cell.color ?? '#212121'),
                      background: isSelected
                        ? (cell.bg ? cell.bg : '#e8f0fe')
                        : (cell.bg ?? 'transparent'),
                      fontStyle: cell.italic ? 'italic' : 'normal',
                      fontSize: 12,
                      padding: '1px 6px',
                      cursor: cell.link ? 'pointer' : 'cell',
                      userSelect: 'none',
                      textDecoration: cell.link ? 'underline' : undefined,
                    }}
                    onClick={cell.link ? (ev) => { ev.stopPropagation(); window.open(cell.link, '_blank'); } : undefined}
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
