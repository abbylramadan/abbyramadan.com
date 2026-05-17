'use client';

import { useState } from 'react';
import ResumeSheet from './sheets/ResumeSheet';
import ProjectsSheet from './sheets/ProjectsSheet';

const tabs = [
  { id: 'resume', label: 'Resume' },
  { id: 'projects', label: 'Projects' },
];

const ribbonGroups: Record<string, { label: string; buttons: { icon: string; label: string; style?: string }[] }[]> = {
  home: [
    {
      label: 'Clipboard',
      buttons: [
        { icon: '📋', label: 'Paste' },
        { icon: '✂️', label: 'Cut' },
        { icon: '📄', label: 'Copy' },
      ],
    },
    {
      label: 'Font',
      buttons: [
        { icon: 'B', label: 'Bold', style: 'font-bold text-base' },
        { icon: 'I', label: 'Italic', style: 'italic text-base' },
        { icon: 'U', label: 'Underline', style: 'underline text-base' },
      ],
    },
    {
      label: 'Alignment',
      buttons: [
        { icon: '≡', label: 'Left', style: 'text-base' },
        { icon: '≡', label: 'Center', style: 'text-base' },
        { icon: '≡', label: 'Right', style: 'text-base' },
        { icon: '↵', label: 'Wrap' },
        { icon: '⊞', label: 'Merge' },
      ],
    },
    {
      label: 'Number',
      buttons: [
        { icon: '$', label: 'Currency' },
        { icon: '%', label: 'Percent' },
        { icon: ',', label: 'Comma' },
      ],
    },
    {
      label: 'Styles',
      buttons: [
        { icon: '🎨', label: 'Cond. Format' },
        { icon: '📊', label: 'Table' },
        { icon: '🖌️', label: 'Cell Styles' },
      ],
    },
    {
      label: 'Cells',
      buttons: [
        { icon: '+', label: 'Insert' },
        { icon: '🗑', label: 'Delete' },
        { icon: '⚙', label: 'Format' },
      ],
    },
    {
      label: 'Editing',
      buttons: [
        { icon: 'Σ', label: 'Sum', style: 'text-base' },
        { icon: '↓', label: 'Fill' },
        { icon: '🔍', label: 'Find' },
        { icon: '⬇', label: 'Sort' },
      ],
    },
  ],
  insert: [
    {
      label: 'Tables',
      buttons: [
        { icon: '📊', label: 'PivotTable' },
        { icon: '⊞', label: 'Table' },
      ],
    },
    {
      label: 'Charts',
      buttons: [
        { icon: '📈', label: 'Line' },
        { icon: '📊', label: 'Bar' },
        { icon: '🥧', label: 'Pie' },
        { icon: '📉', label: 'Area' },
      ],
    },
    {
      label: 'Illustrations',
      buttons: [
        { icon: '🖼️', label: 'Pictures' },
        { icon: '⬡', label: 'Shapes' },
        { icon: '🔣', label: 'Icons' },
      ],
    },
    {
      label: 'Links',
      buttons: [
        { icon: '🔗', label: 'Link' },
        { icon: '🔖', label: 'Bookmark' },
      ],
    },
    {
      label: 'Text',
      buttons: [
        { icon: 'A', label: 'Text Box' },
        { icon: '🔠', label: 'WordArt' },
        { icon: '=', label: 'Equation' },
        { icon: 'Ω', label: 'Symbol' },
      ],
    },
    {
      label: 'Sparklines',
      buttons: [
        { icon: '📉', label: 'Line' },
        { icon: '█', label: 'Column' },
        { icon: '±', label: 'Win/Loss' },
      ],
    },
  ],
  'Page Layout': [
    {
      label: 'Themes',
      buttons: [
        { icon: '🎨', label: 'Themes' },
        { icon: '🖌️', label: 'Colors' },
        { icon: 'Aa', label: 'Fonts' },
        { icon: '✨', label: 'Effects' },
      ],
    },
    {
      label: 'Page Setup',
      buttons: [
        { icon: '📄', label: 'Margins' },
        { icon: '↔️', label: 'Orientation' },
        { icon: '📐', label: 'Size' },
        { icon: '⬜', label: 'Print Area' },
        { icon: '—', label: 'Breaks' },
        { icon: '🖼️', label: 'Background' },
        { icon: '🖨️', label: 'Print Titles' },
      ],
    },
    {
      label: 'Scale to Fit',
      buttons: [
        { icon: '↕', label: 'Width' },
        { icon: '↔', label: 'Height' },
        { icon: '%', label: 'Scale' },
      ],
    },
    {
      label: 'Sheet Options',
      buttons: [
        { icon: '#', label: 'Gridlines' },
        { icon: '1', label: 'Headings' },
      ],
    },
    {
      label: 'Arrange',
      buttons: [
        { icon: '⬆', label: 'Bring Fwd' },
        { icon: '⬇', label: 'Send Back' },
        { icon: '▣', label: 'Sel. Pane' },
        { icon: '⇔', label: 'Align' },
        { icon: '⧉', label: 'Group' },
        { icon: '↻', label: 'Rotate' },
      ],
    },
  ],
  Formulas: [
    {
      label: 'Function Library',
      buttons: [
        { icon: 'fx', label: 'Insert Fn' },
        { icon: 'Σ', label: 'AutoSum' },
        { icon: '📅', label: 'Date/Time' },
        { icon: '🔍', label: 'Lookup' },
        { icon: '📐', label: 'Math/Trig' },
        { icon: '···', label: 'More Fns' },
      ],
    },
    {
      label: 'Defined Names',
      buttons: [
        { icon: '🏷️', label: 'Name Mgr' },
        { icon: '+', label: 'Define' },
        { icon: '→', label: 'Use In' },
        { icon: '⬤', label: 'Create' },
      ],
    },
    {
      label: 'Formula Auditing',
      buttons: [
        { icon: '→', label: 'Trace Pre.' },
        { icon: '←', label: 'Trace Dep.' },
        { icon: '✕', label: 'Remove Arr.' },
        { icon: '⚠', label: 'Error Check' },
        { icon: '👁', label: 'Watch Win.' },
      ],
    },
    {
      label: 'Calculation',
      buttons: [
        { icon: '⚙', label: 'Calc Opts' },
        { icon: '▶', label: 'Calc Now' },
        { icon: '📄', label: 'Calc Sheet' },
      ],
    },
  ],
  Data: [
    {
      label: 'Get & Transform',
      buttons: [
        { icon: '📥', label: 'Get Data' },
        { icon: '🔄', label: 'Refresh All' },
        { icon: '🔗', label: 'Connections' },
        { icon: '⚙', label: 'Properties' },
      ],
    },
    {
      label: 'Queries & Connections',
      buttons: [
        { icon: '🔗', label: 'Queries' },
        { icon: '⚙', label: 'Data Types' },
      ],
    },
    {
      label: 'Sort & Filter',
      buttons: [
        { icon: '⬆', label: 'Sort A–Z' },
        { icon: '⬇', label: 'Sort Z–A' },
        { icon: '⚙', label: 'Sort' },
        { icon: '🔽', label: 'Filter' },
        { icon: '✕', label: 'Clear' },
        { icon: '↻', label: 'Reapply' },
        { icon: '✦', label: 'Advanced' },
      ],
    },
    {
      label: 'Data Tools',
      buttons: [
        { icon: '✂️', label: 'Text to Col' },
        { icon: '⚡', label: 'Flash Fill' },
        { icon: '🗑', label: 'Remove Dup' },
        { icon: '✔', label: 'Validation' },
        { icon: '🔗', label: 'Consolidate' },
        { icon: '❓', label: 'What-If' },
      ],
    },
    {
      label: 'Forecast',
      buttons: [
        { icon: '📈', label: 'Forecast Sht' },
      ],
    },
    {
      label: 'Outline',
      buttons: [
        { icon: '↔', label: 'Group' },
        { icon: '÷', label: 'Ungroup' },
        { icon: '≡', label: 'Subtotal' },
      ],
    },
  ],
  Review: [
    {
      label: 'Proofing',
      buttons: [
        { icon: '✓', label: 'Spelling' },
        { icon: '📖', label: 'Thesaurus' },
        { icon: '🌐', label: 'Translate' },
      ],
    },
    {
      label: 'Accessibility',
      buttons: [
        { icon: '♿', label: 'Check Acc.' },
      ],
    },
    {
      label: 'Insights',
      buttons: [
        { icon: '💡', label: 'Smart Look.' },
      ],
    },
    {
      label: 'Language',
      buttons: [
        { icon: '🌐', label: 'Translate' },
      ],
    },
    {
      label: 'Comments',
      buttons: [
        { icon: '💬', label: 'New Cmt' },
        { icon: '🗑', label: 'Delete' },
        { icon: '◀', label: 'Previous' },
        { icon: '▶', label: 'Next' },
        { icon: '👁', label: 'Show All' },
      ],
    },
    {
      label: 'Notes',
      buttons: [
        { icon: '📝', label: 'Notes' },
        { icon: '👁', label: 'Show Notes' },
      ],
    },
    {
      label: 'Protect',
      buttons: [
        { icon: '🔒', label: 'Protect Sht' },
        { icon: '📗', label: 'Protect Wbk' },
        { icon: '🔗', label: 'Share Wbk' },
        { icon: '✏️', label: 'Allow Edit' },
      ],
    },
  ],
  View: [
    {
      label: 'Workbook Views',
      buttons: [
        { icon: '📄', label: 'Normal' },
        { icon: '📏', label: 'Page Break' },
        { icon: '📐', label: 'Page Layout' },
        { icon: '🖥️', label: 'Custom Views' },
      ],
    },
    {
      label: 'Show',
      buttons: [
        { icon: '#', label: 'Ruler' },
        { icon: '⊞', label: 'Gridlines' },
        { icon: '≡', label: 'Formula Bar' },
        { icon: '1', label: 'Headings' },
      ],
    },
    {
      label: 'Zoom',
      buttons: [
        { icon: '🔍', label: 'Zoom' },
        { icon: '1', label: '100%' },
        { icon: '⊡', label: 'Zoom Sel.' },
      ],
    },
    {
      label: 'Window',
      buttons: [
        { icon: '🪟', label: 'New Win.' },
        { icon: '⊞', label: 'Arrange' },
        { icon: '❄️', label: 'Freeze Panes' },
        { icon: '⊟', label: 'Split' },
        { icon: '👁', label: 'Hide' },
        { icon: '↔', label: 'Side by Side' },
      ],
    },
    {
      label: 'Macros',
      buttons: [
        { icon: '⏺', label: 'Macros' },
      ],
    },
  ],
};

type RibbonTab = 'home' | 'insert' | 'Page Layout' | 'Formulas' | 'Data' | 'Review' | 'View';

export type CellSelection = {
  ref: string;    // e.g. "C4"
  formula: string; // e.g. '=XLOOKUP(...)'
};

export default function ExcelShell() {
  const [activeSheet, setActiveSheet] = useState<string>('resume');
  const [activeRibbon, setActiveRibbon] = useState<RibbonTab>('home');
  const allRibbonTabs: RibbonTab[] = ['home', 'insert', 'Page Layout', 'Formulas', 'Data', 'Review', 'View'];
  const [selection, setSelection] = useState<CellSelection>({
    ref: 'C1',
    formula: '="Abby Ramadan"',
  });

  const groups = ribbonGroups[activeRibbon] ?? ribbonGroups.home;

  function handleSheetChange(id: string) {
    setActiveSheet(id);
    if (id === 'resume') {
      setSelection({ ref: 'C1', formula: '="Abby Ramadan"' });
    } else {
      setSelection({ ref: 'C1', formula: '="Projects"' });
    }
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#f3f3f3]" style={{ fontFamily: "'Calibri', 'Carlito', 'Segoe UI', Arial, sans-serif" }}>

      {/* Title bar */}
      <div className="flex items-center justify-between bg-[#217346] text-white px-3 h-8 text-xs select-none shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-lg leading-none">🟢</span>
          <span className="font-semibold">abbyramadan.com — Excel</span>
        </div>
        <div className="flex items-center gap-1 text-white/80 text-[11px]">
          <span className="px-2 py-0.5 hover:bg-white/20 rounded cursor-pointer">?</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded text-sm">─</button>
          <button className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded text-sm">□</button>
          <button className="w-6 h-6 flex items-center justify-center hover:bg-red-600 rounded text-sm">✕</button>
        </div>
      </div>

      {/* Ribbon tab bar */}
      <div style={{ display: 'flex', alignItems: 'flex-end', background: '#217346', padding: '0 8px', flexShrink: 0 }}>
        {allRibbonTabs.map(rt => (
          <button
            key={rt}
            onClick={() => setActiveRibbon(rt)}
            style={{
              padding: '7px 18px 6px',
              fontSize: 12,
              fontWeight: 500,
              fontFamily: "'Calibri','Carlito','Segoe UI',Arial,sans-serif",
              border: 'none',
              borderRadius: '3px 3px 0 0',
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'background 0.1s',
              background: activeRibbon === rt ? '#ffffff' : 'transparent',
              color: activeRibbon === rt ? '#217346' : 'rgba(255,255,255,0.92)',
              marginRight: 2,
            }}
          >
            {rt.charAt(0).toUpperCase() + rt.slice(1)}
          </button>
        ))}
      </div>

      {/* Ribbon content */}
      <div style={{ display: 'flex', alignItems: 'stretch', background: '#fff', borderBottom: '2px solid #217346', padding: '0 8px', flexShrink: 0, minHeight: 72, overflowX: 'auto' }}>
        {groups.map((group, gi) => (
          <div key={gi} style={{ display: 'flex', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '4px 4px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                {group.buttons.map((btn, bi) => (
                  <button
                    key={bi}
                    title={btn.label}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      gap: 3, padding: '4px 6px', minWidth: 40, borderRadius: 3,
                      border: '1px solid transparent', background: 'none', cursor: 'pointer',
                      fontFamily: "'Calibri','Carlito','Segoe UI',Arial,sans-serif",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#e8e8e8'; (e.currentTarget as HTMLElement).style.borderColor = '#c8c8c8'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; }}
                  >
                    <span style={{ fontSize: 18, lineHeight: 1, color: '#333' }} className={(btn as { style?: string }).style ?? ''}>
                      {btn.icon}
                    </span>
                    <span style={{ fontSize: 10, color: '#444', whiteSpace: 'nowrap' }}>{btn.label}</span>
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 10, color: '#666', textAlign: 'center', borderTop: '1px solid #e0e0e0', padding: '2px 4px 3px', marginTop: 2 }}>
                {group.label}
              </div>
            </div>
            {gi < groups.length - 1 && (
              <div style={{ width: 1, background: '#e0e0e0', margin: '6px 4px' }} />
            )}
          </div>
        ))}
      </div>

      {/* Formula bar */}
      <div className="flex items-center bg-white border-b border-[#c0c0c0] px-2 h-7 shrink-0 gap-1">
        <div className="flex items-center justify-center w-16 h-5 border border-[#c0c0c0] text-xs text-[#333] font-mono px-2 shrink-0 bg-white">
          {selection.ref}
        </div>
        <div className="w-px h-5 bg-[#c0c0c0] shrink-0" />
        <span className="text-[#217346] font-bold text-base leading-none px-1 shrink-0">fx</span>
        <div className="flex-1 h-5 border border-[#c0c0c0] text-xs font-mono px-2 flex items-center bg-white text-[#0563c1] overflow-hidden">
          <span className="truncate">{selection.formula}</span>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        {activeSheet === 'resume' && <ResumeSheet onSelect={setSelection} />}
        {activeSheet === 'projects' && <ProjectsSheet onSelect={setSelection} />}
      </div>

      {/* Sheet tabs + status bar */}
      <div className="shrink-0 bg-[#f3f3f3] border-t border-[#d1d1d1]">
        <div className="flex items-end px-2 pt-1 gap-0.5">
          <button className="w-5 h-5 flex items-center justify-center text-[#888] hover:text-[#333] text-lg leading-none" title="Add sheet">+</button>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleSheetChange(tab.id)}
              className={`xl-sheet-tab ${activeSheet === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Status bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#217346', color: '#fff', fontSize: 12,
          padding: '0 16px', height: 24, userSelect: 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span>Ready</span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>|</span>
            <span>🔒 Sheet protected</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span>Average: –</span>
            <span>Count: –</span>
            <span>Sum: –</span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>|</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
