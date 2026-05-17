'use client';

import { useState, type CSSProperties } from 'react';
import type { CellSelection } from '../ExcelShell';

// ---------- shared types ----------

export type Cell = {
  value: string;
  bold?: boolean;
  italic?: boolean;
  color?: string;
  bg?: string;
  indent?: number;
  align?: 'left' | 'center' | 'right';
  link?: string;
};

export type Row = {
  ref: string;
  formula: string;
  height?: number;
  b: Cell; c: Cell; d: Cell; e: Cell;
};

export type Sel =
  | { type: 'cell'; ri: number; tci: number }
  | { type: 'col';  tci: number }
  | { type: 'row';  ri: number }
  | null;

// ---------- palette ----------

export const G = '#217346';
export const LG = '#e9f5ee';
export const MG = '#107c41';
export const W = '#ffffff';
export const SEL = '#217346';
export const SEL_BG = '#e2efda';
export const BORDER_COLOR = '#d0d7de';

const COLS = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const TOTAL_COLS = 9; // row# + A..H
const FIRST_CONTENT_COL = 2; // B
const LAST_CONTENT_COL  = 5; // E
const HEADER_HEIGHT = 22;
const ROW_NUM_WIDTH = 36;
const EMPTY_TAIL_ROWS = 20;
const EMPTY_ROW_HEIGHT = 20;

// Bullet rows: B's content visually overflows into C/D
function isBullet(r: Row) {
  return r.b.value.startsWith('•') && !r.c.value && !r.d.value && !r.e.value;
}

// ---------- props ----------

export type SheetProps = {
  rows: Row[];
  colWidths: number[];        // length 9: row#, A, B, C, D, E, F, G, H
  onSelect: (s: CellSelection) => void;
  initialFormulaForB?: (r: Row) => string;
};

// ---------- component ----------

export default function Sheet({ rows, colWidths, onSelect }: SheetProps) {
  const [sel, setSel] = useState<Sel>(null);

  // Derived geometry
  const totalRows = rows.length + EMPTY_TAIL_ROWS;
  const rowHeights: number[] = [];
  for (let i = 0; i < totalRows; i++) {
    rowHeights.push(i < rows.length ? (rows[i].height ?? EMPTY_ROW_HEIGHT) : EMPTY_ROW_HEIGHT);
  }
  const gridTemplateColumns = colWidths.map(w => `${w}px`).join(' ');
  // Use minmax(h, auto) so rows grow when wrapped text needs more height,
  // without affecting column widths (max-content would expand the columns too).
  const gridTemplateRows = [`${HEADER_HEIGHT}px`, ...rowHeights.map(h => `minmax(${h}px, auto)`)].join(' ');
  const totalWidth = colWidths.reduce((a, b) => a + b, 0);

  // Bleed width per content column: distance from this column's left edge to E's right edge.
  // Text inside a content cell wraps within this width — so it extends past the cell's own column
  // but stops at the end of E.
  const colLeft: number[] = [0];
  for (let i = 0; i < colWidths.length; i++) colLeft.push(colLeft[i] + colWidths[i]);
  const rightEdge = colLeft[LAST_CONTENT_COL + 1]; // right edge of E
  const bleedWidth = (tci: number) => rightEdge - colLeft[tci];

  // Selection helpers
  const activeCol = sel?.type === 'col' ? sel.tci : sel?.type === 'cell' ? sel.tci : -1;
  const activeRow = sel?.type === 'row' ? sel.ri  : sel?.type === 'cell' ? sel.ri  : -1;

  function onColHeader(tci: number) {
    setSel({ type: 'col', tci });
    onSelect({ ref: `${COLS[tci]}:${COLS[tci]}`, formula: `=COLUMN(${COLS[tci]}:${COLS[tci]})` });
  }
  function onRowNum(ri: number) {
    setSel({ type: 'row', ri });
    onSelect({ ref: `${ri + 1}:${ri + 1}`, formula: `=ROW(${ri + 1}:${ri + 1})` });
  }
  function onCell(ri: number, tci: number, ev: React.MouseEvent) {
    ev.stopPropagation();
    setSel({ type: 'cell', ri, tci });
    const row = rows[ri];
    let formula = '';
    if (row) {
      const cell = tci === 2 ? row.b : tci === 3 ? row.c : tci === 4 ? row.d : tci === 5 ? row.e : null;
      if (tci === 2 && row.b.value)      formula = row.formula;
      else if (cell && cell.value)        formula = cell.value;
    }
    onSelect({ ref: `${COLS[tci] ?? 'B'}${ri + 1}`, formula });
    // Follow links on cell content
    const cell = row && (tci === 2 ? row.b : tci === 3 ? row.c : tci === 4 ? row.d : tci === 5 ? row.e : null);
    if (cell?.link) window.open(cell.link, '_blank');
  }

  // ---------- render ----------

  return (
    <div className="h-full overflow-auto" style={{ background: '#fff', fontFamily: "'Calibri','Carlito','Segoe UI',Arial,sans-serif" }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns,
        gridTemplateRows,
        minWidth: totalWidth,
        position: 'relative',
      }}>
        {/* === Column headers === */}
        <div style={{
          ...headerCellStyle,
          gridColumn: 1, gridRow: 1,
          background: sel ? SEL_BG : '#f0f0f0',
        }} />
        {COLS.slice(1).map((label, i) => {
          const tci = i + 1;
          const isActive = activeCol === tci;
          const isColSel = sel?.type === 'col' && sel.tci === tci;
          return (
            <div
              key={`th-${tci}`}
              onClick={() => onColHeader(tci)}
              style={{
                ...headerCellStyle,
                gridColumn: tci + 1, gridRow: 1,
                background: isActive ? SEL_BG : '#f0f0f0',
                color: isActive ? SEL : '#555',
                fontWeight: isActive ? 700 : 600,
                cursor: 'pointer',
                boxShadow: isColSel
                  ? `inset 0 2px 0 0 ${SEL}, inset 2px 0 0 0 ${SEL}, inset -2px 0 0 0 ${SEL}`
                  : undefined,
              }}
            >
              {label}
            </div>
          );
        })}

        {/* === Body cells === */}
        {Array.from({ length: totalRows }).map((_, ri) => {
          const row: Row | undefined = rows[ri];
          const bullet = row ? isBullet(row) : false;
          const gridRow = ri + 2; // +1 for header, +1 for 1-indexed grid

          return (
            <div key={`row-${ri}`} style={{ display: 'contents' }}>
              {/* Row number */}
              <div
                onClick={() => onRowNum(ri)}
                style={{
                  ...rowNumStyle,
                  gridColumn: 1, gridRow,
                  background: activeRow === ri ? SEL_BG : '#f0f0f0',
                  color: activeRow === ri ? SEL : (row ? '#555' : '#aaa'),
                  fontWeight: sel?.type === 'row' && sel.ri === ri ? 700 : 400,
                }}
              >
                {ri + 1}
              </div>

              {/* A filler + B, C, D, E + F, G, H fillers */}
              {Array.from({ length: 8 }).map((_, ci) => {
                const tci = ci + 1; // 1..8 — A..H
                const cell: Cell | null = row
                  ? (tci === 2 ? row.b
                    : tci === 3 ? row.c
                    : tci === 4 ? row.d
                    : tci === 5 ? row.e
                    : null)
                  : null;

                const isContent = tci >= FIRST_CONTENT_COL && tci <= LAST_CONTENT_COL;
                const hasOwnText = !!cell?.value;

                // Background — paint highlight for col or row selection
                let bg = cell?.bg ?? '#fff';
                const colHL = sel?.type === 'col' && sel.tci === tci;
                const rowHL = sel?.type === 'row' && sel.ri === ri;
                if (colHL || rowHL) {
                  if (bg === G || bg === MG) {
                    // dark green stays dark green
                  } else if (bg === LG) {
                    bg = '#c6e8d1';
                  } else {
                    bg = SEL_BG;
                  }
                }

                // Right-aligned cells (location, period) don't bleed — they sit at their own right edge.
                const shouldBleed = isContent && hasOwnText && cell?.align !== 'right';
                const padLeft = 8 + (cell?.indent ?? 0) * 16;

                const cellStyle: CSSProperties = {
                  gridColumn: tci + 1, gridRow,
                  background: bg,
                  borderRight: `1px solid ${BORDER_COLOR}`,
                  borderBottom: `1px solid ${BORDER_COLOR}`,
                  fontSize: 14,
                  cursor: cell?.link ? 'pointer' : 'cell',
                  userSelect: 'none',
                  overflow: isContent ? 'visible' : 'hidden',
                  position: 'relative',
                  // Cells with text paint above empty neighbors (and above column-highlight bg at z=1).
                  zIndex: hasOwnText ? 2 : 1,
                };

                if (shouldBleed) {
                  // Bleeding cells: flex container so inner text div is vertically centered.
                  // Cell grows vertically to fit the wrapped text inside the inner div.
                  cellStyle.display = 'flex';
                  cellStyle.alignItems = 'center';
                  cellStyle.padding = '3px 0';
                  cellStyle.paddingLeft = padLeft;
                }

                // Right-aligned, non-bleeding, and empty cells use flex centering on the cell itself
                if (!shouldBleed) {
                  cellStyle.display = 'flex';
                  cellStyle.alignItems = 'center';
                  cellStyle.justifyContent = cell?.align === 'right' ? 'flex-end' : cell?.align === 'center' ? 'center' : 'flex-start';
                  cellStyle.padding = '3px 8px';
                  cellStyle.paddingLeft = padLeft;
                  cellStyle.textAlign = cell?.align ?? 'left';
                  cellStyle.lineHeight = 1.35;
                  cellStyle.whiteSpace = 'normal';
                  cellStyle.wordBreak = 'break-word';
                  if (cell?.bold)   cellStyle.fontWeight = 700;
                  if (cell?.italic) cellStyle.fontStyle = 'italic';
                  if (cell?.color)  cellStyle.color = cell.color;
                  if (cell?.link)   cellStyle.textDecoration = 'underline';
                }

                // Inner text div for bleeding cells: constrained to the bleed width so it wraps at E.
                // Stays in normal flow so the cell (and therefore the grid row) grows to fit wrapped text.
                const textStyle: CSSProperties | undefined = shouldBleed && cell ? {
                  width: bleedWidth(tci) - padLeft,
                  flexShrink: 0,         // don't let flex shrink it back to cell width
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  lineHeight: 1.35,
                  fontWeight: cell.bold ? 700 : undefined,
                  fontStyle: cell.italic ? 'italic' : undefined,
                  color: cell.color,
                  textDecoration: cell.link ? 'underline' : undefined,
                  pointerEvents: 'none',
                } : undefined;

                return (
                  <div
                    key={`c-${ri}-${tci}`}
                    onClick={(ev) => onCell(ri, tci, ev)}
                    style={cellStyle}
                  >
                    {shouldBleed
                      ? <div style={textStyle}>{cell?.value}</div>
                      : cell?.value}
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* === Selection overlays === */}
        {sel && <SelectionOverlay sel={sel} colWidths={colWidths} rowHeights={rowHeights} />}
      </div>
    </div>
  );
}

// ---------- selection overlay ----------

function SelectionOverlay({
  sel, colWidths, rowHeights,
}: { sel: Exclude<Sel, null>; colWidths: number[]; rowHeights: number[] }) {
  // Compute pixel positions
  const colLeft: number[] = [0];
  for (let i = 0; i < colWidths.length; i++) colLeft.push(colLeft[i] + colWidths[i]);
  const rowTop: number[] = [HEADER_HEIGHT];
  for (let i = 0; i < rowHeights.length; i++) rowTop.push(rowTop[i] + rowHeights[i]);

  const totalHeight = rowTop[rowTop.length - 1];

  let left = 0, top = 0, width = 0, height = 0;

  if (sel.type === 'col') {
    left = colLeft[sel.tci];
    top = HEADER_HEIGHT;
    width = colWidths[sel.tci];
    height = totalHeight - HEADER_HEIGHT;
  } else if (sel.type === 'row') {
    left = colLeft[FIRST_CONTENT_COL];
    top = rowTop[sel.ri];
    width = colLeft[LAST_CONTENT_COL + 1] - colLeft[FIRST_CONTENT_COL];
    height = rowHeights[sel.ri];
  } else {
    // cell
    left = colLeft[sel.tci];
    top = rowTop[sel.ri];
    width = colWidths[sel.tci];
    height = rowHeights[sel.ri];
  }

  return (
    <div
      style={{
        position: 'absolute',
        left, top, width, height,
        border: `2px solid ${SEL}`,
        pointerEvents: 'none',
        // Overlay sits above cell backgrounds but below B's overflowing text (z=2) on bullet rows.
        // For col/row selection that's fine — the outline is what matters, not the fill.
        zIndex: 3,
      }}
    />
  );
}

// ---------- shared cell styles ----------

const headerCellStyle: CSSProperties = {
  borderRight: `1px solid ${BORDER_COLOR}`,
  borderBottom: `1px solid ${BORDER_COLOR}`,
  fontSize: 11,
  fontWeight: 600,
  color: '#555',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'sticky',
  top: 0,
  zIndex: 10,
  userSelect: 'none',
  fontFamily: "'Calibri','Carlito','Segoe UI',Arial,sans-serif",
  background: '#f0f0f0',
};

const rowNumStyle: CSSProperties = {
  borderRight: `1px solid ${BORDER_COLOR}`,
  borderBottom: `1px solid ${BORDER_COLOR}`,
  fontSize: 11,
  color: '#555',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  userSelect: 'none',
  cursor: 'pointer',
  fontFamily: "'Calibri','Carlito','Segoe UI',Arial,sans-serif",
};

// re-export for callers
export { ROW_NUM_WIDTH };
