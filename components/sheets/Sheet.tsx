'use client';

import { useState, useRef, useLayoutEffect, type CSSProperties } from 'react';
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
  const gridRef = useRef<HTMLDivElement | null>(null);

  // Overlay rect measured from the actual DOM (handles rows that grew taller from wrapped text)
  const [overlayRect, setOverlayRect] = useState<{ left: number; top: number; width: number; height: number } | null>(null);

  useLayoutEffect(() => {
    if (!sel || !gridRef.current) { setOverlayRect(null); return; }
    const grid = gridRef.current;
    const gridBox = grid.getBoundingClientRect();

    function rectFor(ri: number, tci: number) {
      const el = grid.querySelector<HTMLElement>(`[data-ri="${ri}"][data-tci="${tci}"]`);
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { left: b.left - gridBox.left, top: b.top - gridBox.top, width: b.width, height: b.height };
    }

    if (sel.type === 'cell') {
      setOverlayRect(rectFor(sel.ri, sel.tci));
    } else if (sel.type === 'col') {
      // Full column: top of first body cell in this column to bottom of last body cell
      const first = rectFor(0, sel.tci);
      const last  = rectFor(totalRows - 1, sel.tci);
      if (first && last) {
        setOverlayRect({
          left: first.left, top: first.top,
          width: first.width, height: (last.top + last.height) - first.top,
        });
      }
    } else if (sel.type === 'row') {
      // Full content row: left of B to right of E in this row
      const b = rectFor(sel.ri, FIRST_CONTENT_COL);
      const e = rectFor(sel.ri, LAST_CONTENT_COL);
      if (b && e) {
        setOverlayRect({
          left: b.left, top: b.top,
          width: (e.left + e.width) - b.left, height: b.height,
        });
      }
    }
  }, [sel]);

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
      <div ref={gridRef} style={{
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

                // Helper to read a content cell by its column index
                const cellAt = (col: number): Cell | null => !row ? null
                  : col === 2 ? row.b : col === 3 ? row.c : col === 4 ? row.d : col === 5 ? row.e : null;

                // "Bleed run": any cell that's part of a contiguous run starting from a bleeding cell
                // (B–E with text, non-right-aligned) and extending through empty cells to its right.
                // For all cells in such a run we hide internal vertical dividers.
                // Find the nearest bleeding source to my left (inclusive of me); empty cells from that
                // source up to (but not past) the next non-empty cell are part of the run.
                let inBleedRun = false;
                let isBleedRunSource = false;
                let isBleedRunEnd = false; // last cell in the run (border-right stays)
                if (isContent && row) {
                  // Walk left from me to find a bleeding source. Stop at any other text cell.
                  let sourceCol = -1;
                  for (let c = tci; c >= FIRST_CONTENT_COL; c--) {
                    const lc = cellAt(c)!;
                    if (lc.value && lc.align !== 'right') {
                      // Bleeding source found at column c. Run is valid only if every cell strictly
                      // between c and me is empty.
                      let runOk = true;
                      for (let m = c + 1; m < tci; m++) {
                        const mc = cellAt(m)!;
                        if (mc.value) { runOk = false; break; }
                      }
                      if (runOk) { sourceCol = c; }
                      break;
                    }
                    if (lc.value) break; // non-bleeding text cell to my left blocks the run
                  }
                  if (sourceCol >= 0) {
                    inBleedRun = true;
                    isBleedRunSource = sourceCol === tci;
                    // Run ends at last empty cell before the next non-empty cell (or LAST_CONTENT_COL).
                    let endCol = tci;
                    for (let c = tci + 1; c <= LAST_CONTENT_COL; c++) {
                      const nc = cellAt(c)!;
                      if (nc.value) break;
                      endCol = c;
                    }
                    isBleedRunEnd = tci === endCol;
                  }
                }

                // Right border: hide between cells inside a bleed run; keep at the run's right edge.
                // Also hide between same-bg neighbors (section headers).
                const nextCell = cellAt(tci + 1);
                const nextBg = nextCell?.bg ?? '#fff';
                const matchesNeighbor = !!cell?.bg && cell.bg !== '#fff' && cell.bg === nextBg;
                const rightBorderColor = matchesNeighbor
                  ? cell!.bg!
                  : (inBleedRun && !isBleedRunEnd)
                    ? bg
                    : BORDER_COLOR;

                // Left border: hide for non-source cells in the run (their left divider would slash the text).
                const leftBorderColor = (inBleedRun && !isBleedRunSource) ? bg : undefined;

                const cellStyle: CSSProperties = {
                  gridColumn: tci + 1, gridRow,
                  background: bg,
                  borderRight: `1px solid ${rightBorderColor}`,
                  borderBottom: `1px solid ${BORDER_COLOR}`,
                  ...(leftBorderColor ? { borderLeft: `1px solid ${leftBorderColor}` } : {}),
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
                    data-ri={ri}
                    data-tci={tci}
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

        {/* === Selection overlay === */}
        {overlayRect && (
          <div style={{
            position: 'absolute',
            left: overlayRect.left,
            top: overlayRect.top,
            width: overlayRect.width,
            height: overlayRect.height,
            border: `2px solid ${SEL}`,
            pointerEvents: 'none',
            zIndex: 3,
          }} />
        )}
      </div>
    </div>
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
