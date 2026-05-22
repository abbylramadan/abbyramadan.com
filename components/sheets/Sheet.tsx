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
  // Inline links: substring → href. Each match in `value` is rendered as <a href={href}>.
  inlineLinks?: Record<string, string>;
};

export type Row = {
  ref: string;
  formula: string;
  height?: number;
  b: Cell; c: Cell; d: Cell; e: Cell;
  // Viewport visibility — used for company/role rows that emit a separate mobile-only
  // sub-row with the location/period left-aligned underneath the main label.
  mobileOnly?: boolean;
  desktopOnly?: boolean;
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

const COLS = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
// Content lives in D..G (tci 4..7). A, B, C are leading fillers; H, I, J, K are trailing fillers.
// Mobile CSS collapses everything except D.
const FIRST_CONTENT_COL = 4; // D
const LAST_CONTENT_COL  = 7; // G
const HEADER_HEIGHT = 22;
const ROW_NUM_WIDTH = 36;
const EMPTY_TAIL_ROWS = 20;
const EMPTY_ROW_HEIGHT = 20;

// Bullet rows: B's content visually overflows into C/D
function isBullet(r: Row) {
  return r.b.value.startsWith('•') && !r.c.value && !r.d.value && !r.e.value;
}

// Render a cell's value, replacing any `inlineLinks` substrings with <a> tags.
// If no inlineLinks, returns the raw string. Anchors stop propagation so they don't
// also trigger the cell's onClick handler.
function renderCellValue(cell: Cell | null) {
  if (!cell) return null;
  const links = cell.inlineLinks;
  const value = cell.value;
  if (!links || Object.keys(links).length === 0) return value;
  // Build a regex that matches any link substring, in order they appear in the value.
  // Escape regex metacharacters in the keys.
  const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(Object.keys(links).map(escapeRe).join('|'), 'g');
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(value)) !== null) {
    if (match.index > lastIndex) parts.push(value.slice(lastIndex, match.index));
    const text = match[0];
    const href = links[text];
    parts.push(
      <a
        key={`lnk-${match.index}`}
        href={href}
        target={href.startsWith('mailto:') ? undefined : '_blank'}
        rel="noopener noreferrer"
        onClick={(ev) => ev.stopPropagation()}
        style={{ color: 'inherit', textDecoration: 'underline' }}
      >
        {text}
      </a>
    );
    lastIndex = match.index + text.length;
  }
  if (lastIndex < value.length) parts.push(value.slice(lastIndex));
  return <>{parts}</>;
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
  // Build grid-template-columns:
  //   - row# (col 0): fixed pixel width
  //   - content columns (FIRST_CONTENT_COL..LAST_CONTENT_COL): fixed pixel widths
  //   - filler columns: 1fr so they flex equally
  const gridTemplateColumns = colWidths.map((w, i) => {
    if (i === 0) return `${w}px`; // row#
    if (i >= FIRST_CONTENT_COL && i <= LAST_CONTENT_COL) return `${w}px`;
    return '1fr';
  }).join(' ');
  // Per-row track sizing:
  //   - mobileOnly / desktopOnly rows: minmax(0, auto) → collapse to 0 when their cells are
  //     display:none in the current viewport, expand to fit content when visible.
  //   - other rows: minmax(Hpx, auto) → keep the explicit min height as a floor.
  const gridTemplateRows = [
    `${HEADER_HEIGHT}px`,
    ...rowHeights.map((h, i) => {
      const r = i < rows.length ? rows[i] : null;
      const collapsible = r && (r.mobileOnly || r.desktopOnly);
      return collapsible ? `minmax(0, auto)` : `minmax(${h}px, auto)`;
    }),
  ].join(' ');
  const totalWidth = colWidths.reduce((a, b) => a + b, 0);

  // Cumulative column left edges, for computing bleed widths.
  const colLeft: number[] = [0];
  for (let i = 0; i < colWidths.length; i++) colLeft.push(colLeft[i] + colWidths[i]);
  const leftEdge  = colLeft[FIRST_CONTENT_COL];      // left edge of B
  const rightEdge = colLeft[LAST_CONTENT_COL + 1];   // right edge of E
  // Width available for text bleeding rightward from column tci (stops at end of E).
  const bleedWidthRight = (tci: number) => rightEdge - colLeft[tci];
  // Width available for text bleeding leftward from the right edge of column tci (stops at start of B).
  const bleedWidthLeft  = (tci: number) => colLeft[tci + 1] - leftEdge;

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
      const cell = tci === 4 ? row.b : tci === 5 ? row.c : tci === 6 ? row.d : tci === 7 ? row.e : null;
      if (tci === 2 && row.b.value)      formula = row.formula;
      else if (cell && cell.value)        formula = cell.value;
    }
    onSelect({ ref: `${COLS[tci] ?? 'B'}${ri + 1}`, formula });
    // Follow links on cell content
    const cell = row && (tci === 4 ? row.b : tci === 5 ? row.c : tci === 6 ? row.d : tci === 7 ? row.e : null);
    if (cell?.link) window.open(cell.link, '_blank');
  }

  // ---------- render ----------

  return (
    <div className="h-full overflow-auto xl-sheet-scroll" style={{ background: '#fff', fontFamily: "'Calibri','Carlito','Segoe UI',Arial,sans-serif" }}>
      <div ref={gridRef} className="xl-sheet-grid" style={{
        display: 'grid',
        gridTemplateColumns,
        gridTemplateRows,
        width: '100%',
        minWidth: totalWidth,
        position: 'relative',
      }}>
        {/* === Column headers === */}
        <div className="xl-col-header xl-col-header-corner" style={{
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
              className="xl-col-header"
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
          const visibilityClass = row?.mobileOnly ? 'xl-mobile-only' : row?.desktopOnly ? 'xl-desktop-only' : '';

          return (
            <div key={`row-${ri}`} style={{ display: 'contents' }}>
              {/* Row number */}
              <div
                onClick={() => onRowNum(ri)}
                className={`xl-row-num ${visibilityClass}`}
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

              {/* Filler columns + content cells (driven by colWidths length) */}
              {Array.from({ length: colWidths.length - 1 }).map((_, ci) => {
                const tci = ci + 1; // 1..8 — A..H
                const cell: Cell | null = row
                  ? (tci === 4 ? row.b
                    : tci === 5 ? row.c
                    : tci === 6 ? row.d
                    : tci === 7 ? row.e
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

                const padLeft = 8 + (cell?.indent ?? 0) * 16;
                const cellAt = (col: number): Cell | null => !row ? null
                  : col === 4 ? row.b : col === 5 ? row.c : col === 6 ? row.d : col === 7 ? row.e : null;

                // A cell bleeds if it has text. Direction is determined by alignment:
                // right-aligned → leftward; otherwise → rightward.
                // Find the nearest bleeding source in the opposite direction, then verify the
                // intervening cells are empty.
                //   dir = +1 → text bleeds rightward (source is to my left)
                //   dir = -1 → text bleeds leftward  (source is to my right)
                function findRun(dir: 1 | -1): { source: number; end: number } | null {
                  if (!isContent || !row) return null;
                  const sourceAlign = dir === 1 ? 'left' : 'right';
                  const isSource = (c: Cell) => !!c.value && (sourceAlign === 'right' ? c.align === 'right' : c.align !== 'right');
                  // Walk opposite to dir from me, looking for a source.
                  let sourceCol = -1;
                  for (let c = tci; dir === 1 ? c >= FIRST_CONTENT_COL : c <= LAST_CONTENT_COL; c -= dir) {
                    const lc = cellAt(c)!;
                    if (isSource(lc)) {
                      // Validate every cell strictly between source and me is empty.
                      // Walk from min(c,tci)+1 to max(c,tci)-1.
                      const lo = Math.min(c, tci), hi = Math.max(c, tci);
                      let ok = true;
                      for (let m = lo + 1; m < hi; m++) {
                        if (cellAt(m)!.value) { ok = false; break; }
                      }
                      if (ok) sourceCol = c;
                      break;
                    }
                    if (lc.value) break; // any other text cell blocks the run
                  }
                  if (sourceCol < 0) return null;
                  // Walk in dir from me to find the run's far edge (last empty cell before next text cell)
                  let endCol = tci;
                  for (let c = tci + dir; dir === 1 ? c <= LAST_CONTENT_COL : c >= FIRST_CONTENT_COL; c += dir) {
                    if (cellAt(c)!.value) break;
                    endCol = c;
                  }
                  return { source: sourceCol, end: endCol };
                }

                const runR = findRun(1);
                const runL = findRun(-1);
                const inRunR = runR !== null;
                const inRunL = runL !== null;
                const isSourceR = inRunR && runR!.source === tci;
                const isSourceL = inRunL && runL!.source === tci;
                const isEndR    = inRunR && runR!.end === tci;
                const isEndL    = inRunL && runL!.end === tci;

                const shouldBleed = isContent && hasOwnText && (isSourceR || isSourceL);
                const bleedDir: 1 | -1 = isSourceL ? -1 : 1;

                // Right border: hide if I'm inside a rightward run (not the right end) or inside a
                // leftward run (not the source — leftward source still keeps its right edge).
                // Also hide between same-bg neighbors (section headers).
                const nextCell = cellAt(tci + 1);
                const nextBg = nextCell?.bg ?? '#fff';
                const matchesNeighbor = !!cell?.bg && cell.bg !== '#fff' && cell.bg === nextBg;
                const hideRight =
                  (inRunR && !isEndR) ||
                  (inRunL && !isSourceL);
                const rightBorderColor = matchesNeighbor ? cell!.bg! : hideRight ? bg : BORDER_COLOR;

                // Left border: hide if I'm inside a rightward run (not the source) or inside a
                // leftward run (not the left end).
                const hideLeft =
                  (inRunR && !isSourceR) ||
                  (inRunL && !isEndL);
                const leftBorderColor = hideLeft ? bg : undefined;

                const cellStyle: CSSProperties = {
                  gridColumn: tci + 1, gridRow,
                  background: bg,
                  borderRight: `1px solid ${rightBorderColor}`,
                  borderBottom: `1px solid ${BORDER_COLOR}`,
                  ...(leftBorderColor ? { borderLeft: `1px solid ${leftBorderColor}` } : {}),
                  fontSize: 18,
                  cursor: cell?.link ? 'pointer' : 'cell',
                  userSelect: 'none',
                  overflow: isContent ? 'visible' : 'hidden',
                  position: 'relative',
                  // Cells with text paint above empty neighbors (and above column-highlight bg at z=1).
                  zIndex: hasOwnText ? 2 : 1,
                };

                if (shouldBleed) {
                  // Bleeding cells: flex container so inner text div is vertically centered.
                  // For rightward bleed, anchor at left padding. For leftward bleed, anchor at right.
                  cellStyle.display = 'flex';
                  cellStyle.alignItems = 'center';
                  cellStyle.justifyContent = bleedDir === -1 ? 'flex-end' : 'flex-start';
                  cellStyle.padding = '3px 0';
                  if (bleedDir === 1) cellStyle.paddingLeft = padLeft;
                  else                 cellStyle.paddingRight = 8;
                } else {
                  // Non-bleeding cells: flex centering on the cell itself
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

                // Inner text div for bleeding cells: sized to the run's bleed width so text wraps
                // at the run's far edge. Stays in normal flow so the row grows for wrapped text.
                const innerWidth = bleedDir === 1
                  ? bleedWidthRight(tci) - padLeft
                  : bleedWidthLeft(tci) - 8;
                const textStyle: CSSProperties | undefined = shouldBleed && cell ? {
                  width: innerWidth,
                  flexShrink: 0,
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  lineHeight: 1.35,
                  textAlign: bleedDir === -1 ? 'right' : 'left',
                  fontWeight: cell.bold ? 700 : undefined,
                  fontStyle: cell.italic ? 'italic' : undefined,
                  color: cell.color,
                  textDecoration: cell.link ? 'underline' : undefined,
                  pointerEvents: 'none',
                } : undefined;

                // "Paired row" signal: B has short content AND E has content (company+location,
                // role+period, school+location, degree+period). Used by mobile CSS to lay them out
                // side-by-side instead of giving B the full width.
                const isPaired = !!row && !!row.b.value && !!row.e.value && row.e.align === 'right';
                const pairedAttr = isPaired ? { 'data-paired': '1' } : {};

                return (
                  <div
                    key={`c-${ri}-${tci}`}
                    data-ri={ri}
                    data-tci={tci}
                    {...pairedAttr}
                    onClick={(ev) => onCell(ri, tci, ev)}
                    className={visibilityClass}
                    style={cellStyle}
                  >
                    {shouldBleed
                      ? <div className="xl-bleed-text" style={textStyle}>{renderCellValue(cell)}</div>
                      : renderCellValue(cell)}
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
            // Thin white inner line between the green border and the cell content
            boxShadow: 'inset 0 0 0 1px #ffffff',
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
