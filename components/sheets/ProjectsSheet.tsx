'use client';

import { useState } from 'react';
import type { CellSelection } from '../ExcelShell';

const COLS = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const COL_WIDTHS = [36, 30, 200, 320, 180, 120, 60, 60, 60];

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

type Row = {
  cells: [Cell, Cell, Cell, Cell, Cell];
  height?: number;
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
  row('C1', '="Projects"',
    e(), hdr('PROJECTS'), e(), e(), e()),
  row('C2', '=""', e(), e(), e(), e(), e(), 6),

  row('C3', '=XLOOKUP("project_header",Projects!A:A,Projects!B:B)',
    e(), sect('Project'), sect('Description'), sect('Technologies'), sect('Status')),
  row('C4', '=XLOOKUP("home_calc",Projects!A:A,Projects!B:B)',
    e(),
    lnk('Home Affordability Calculator', 'https://mortgagecalc.abbyramadan.com'),
    plain('Comprehensive tool for understanding home affordability. Features mortgage calculations, interactive visualizations, and personalized analysis based on income, debts, and financial goals.'),
    tag('React · TypeScript · Chart.js · Tailwind CSS'),
    { value: '✅ Live', color: G, bold: true },
    42),
  row('C5', '=""', e(), e(), e(), e(), e(), 6),
  row('C6', '=XLOOKUP("more_projects",Projects!A:A,Projects!B:B)',
    e(), { value: 'More projects coming soon...', italic: true, color: '#555' }, e(), e(), e()),
  row('C7', '=""', e(), e(), e(), e(), e(), 14),

  row('C8', '="Skills"',
    e(), hdr('SKILLS'), e(), e(), e()),
  row('C9', '=""', e(), e(), e(), e(), e(), 6),
  row('C10', '=XLOOKUP("skill_header",Skills!A:A,Skills!B:B)',
    e(), sect('Skill'), sect('Category'), sect('Proficiency'), e()),
  row('C11', '=XLOOKUP("excel",Skills!A:A,Skills!B:B)',
    e(), lbl('Excel'), plain('Finance / Reporting'), { value: '★★★★★  Advanced', color: G, bold: true }, e()),
  row('C12', '=XLOOKUP("sql",Skills!A:A,Skills!B:B)',
    e(), lbl('SQL'), plain('Data / Reporting'), { value: '★★★★☆  Advanced', color: G, bold: true }, e()),
  row('C13', '=XLOOKUP("forecasting",Skills!A:A,Skills!B:B)',
    e(), lbl('Forecasting'), plain('Finance'), { value: '★★★★☆  Advanced', color: G, bold: true }, e()),
  row('C14', '=XLOOKUP("python",Skills!A:A,Skills!B:B)',
    e(), lbl('Python'), plain('Analytics'), { value: '★★★☆☆  Intermediate', color: '#555' }, e()),
  row('C15', '=XLOOKUP("r",Skills!A:A,Skills!B:B)',
    e(), lbl('R'), plain('Analytics'), { value: '★★★☆☆  Intermediate', color: '#555' }, e()),
  row('C16', '=XLOOKUP("tableau",Skills!A:A,Skills!B:B)',
    e(), lbl('Tableau'), plain('Visualization'), { value: '★★★☆☆  Intermediate', color: '#555' }, e()),
  row('C17', '=XLOOKUP("powerbi",Skills!A:A,Skills!B:B)',
    e(), lbl('PowerBI'), plain('Visualization'), { value: '★★★☆☆  Intermediate', color: '#555' }, e()),
  row('C18', '=XLOOKUP("power_automate",Skills!A:A,Skills!B:B)',
    e(), lbl('Power Automate'), plain('Automation'), { value: '★★★☆☆  Intermediate', color: '#555' }, e()),
  row('C19', '=""', e(), e(), e(), e(), e(), 20),
];

export default function ProjectsSheet({ onSelect }: { onSelect: (s: CellSelection) => void }) {
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
                    textDecoration: cellC.link ? 'underline' : undefined,
                    cursor: cellC.link ? 'pointer' : 'cell',
                    whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: '1.35', verticalAlign: 'middle',
                  }}
                    onClick={cellC.link ? (ev) => { ev.stopPropagation(); window.open(cellC.link, '_blank'); } : undefined}
                  >
                    {cellC.value}
                  </td>
                ) : (
                  <>
                    {([cellC, cellD, cellE, cellF] as Cell[]).map((cell, ci) => (
                      <td key={ci} style={{
                        ...contentCell(h),
                        fontWeight: cell.bold ? 700 : 400,
                        color: isSelected ? (cell.bg ? cell.color : '#1565c0') : (cell.color ?? '#212121'),
                        background: isSelected ? (cell.bg ?? '#e8f0fe') : (cell.bg ?? '#fff'),
                        fontStyle: cell.italic ? 'italic' : 'normal',
                        textAlign: cell.align ?? 'left',
                        textDecoration: cell.link ? 'underline' : undefined,
                        cursor: cell.link ? 'pointer' : 'cell',
                        whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: '1.35', verticalAlign: 'middle',
                      }}
                        onClick={cell.link ? (ev) => { ev.stopPropagation(); window.open(cell.link, '_blank'); } : undefined}
                      >
                        {cell.value}
                      </td>
                    ))}
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
