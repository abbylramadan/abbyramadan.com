'use client';

const COL_WIDTHS = [40, 180, 300, 200, 160];
const COL_LABELS = ['', 'A', 'B', 'C', 'D'];
const ROW_COUNT = 30;

const data: Record<string, { value: string; bold?: boolean; color?: string; bg?: string; align?: string; italic?: boolean; colspan?: number }> = {
  'A1': { value: 'Abby Ramadan', bold: true, color: '#217346', bg: '#e9f5ee' },
  'B1': { value: 'Capital Markets Associate', bold: true, color: '#217346', bg: '#e9f5ee' },
  'C1': { value: 'Chicago, IL', color: '#217346', bg: '#e9f5ee' },
  'A2': { value: '', bg: '#e9f5ee' },
  'B2': { value: 'abbyramadan98@gmail.com', color: '#0563c1', bg: '#e9f5ee' },
  'C2': { value: 'linkedin.com/in/abby-ramadan/', color: '#0563c1', bg: '#e9f5ee' },
  'A3': { value: '' },
  'A4': { value: 'Summary', bold: true, bg: '#217346', color: '#fff' },
  'B4': { value: 'Capital markets professional with expertise in structured finance, regulatory compliance, and data-driven decision making.', bg: '#217346', color: '#fff' },
  'A5': { value: '' },
  'A6': { value: 'Skills', bold: true, color: '#fff', bg: '#107c41' },
  'B6': { value: 'Excel', bg: '#e9f5ee', bold: true, color: '#217346' },
  'C6': { value: 'R', bg: '#e9f5ee', bold: true, color: '#217346' },
  'D6': { value: 'Python', bg: '#e9f5ee', bold: true, color: '#217346' },
  'A7': { value: '', bg: '#f7fbf9' },
  'B7': { value: 'Java', bg: '#f7fbf9', color: '#217346' },
  'C7': { value: 'Tableau', bg: '#f7fbf9', color: '#217346' },
  'D7': { value: 'PowerBI', bg: '#f7fbf9', color: '#217346' },
  'A8': { value: '', bg: '#e9f5ee' },
  'B8': { value: 'Power Automate', bg: '#e9f5ee', color: '#217346' },
  'C8': { value: 'Data Analysis', bg: '#e9f5ee', color: '#217346' },
  'D8': { value: 'SQL', bg: '#e9f5ee', color: '#217346' },
  'A9': { value: '' },
  'A10': { value: 'Interests', bold: true, color: '#fff', bg: '#107c41' },
  'B10': { value: 'Illustration' },
  'C10': { value: 'Animation' },
  'D10': { value: 'Flute' },
  'A11': { value: '' },
  'B11': { value: 'Volunteering' },
  'C11': { value: 'Running' },
  'A12': { value: '' },
  'A13': { value: 'Contact', bold: true, color: '#fff', bg: '#107c41' },
  'B13': { value: '📧 abbyramadan98@gmail.com', color: '#0563c1' },
  'A14': { value: '' },
  'B14': { value: '🔗 linkedin.com/in/abby-ramadan/', color: '#0563c1' },
};

export default function AboutSheet() {
  const rows = Array.from({ length: ROW_COUNT }, (_, i) => i + 1);
  const cols = ['A', 'B', 'C', 'D'];

  return (
    <div className="h-full overflow-auto bg-white">
      <table className="border-collapse" style={{ tableLayout: 'fixed', width: '100%' }}>
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
          {rows.map(row => (
            <tr key={row} style={{ height: 22 }}>
              <td className="xl-cell-header" style={{ width: 40, textAlign: 'center', fontSize: 11 }}>
                {row}
              </td>
              {cols.map(col => {
                const key = `${col}${row}`;
                const cell = data[key];
                return (
                  <td
                    key={col}
                    className="xl-cell"
                    style={{
                      width: COL_WIDTHS[cols.indexOf(col) + 1],
                      fontWeight: cell?.bold ? 700 : 400,
                      color: cell?.color ?? '#212121',
                      background: cell?.bg ?? 'transparent',
                      textAlign: (cell?.align as 'left' | 'center' | 'right') ?? 'left',
                      fontStyle: cell?.italic ? 'italic' : 'normal',
                      fontSize: 12,
                      padding: '1px 6px',
                      cursor: 'cell',
                      userSelect: 'none',
                    }}
                  >
                    {cell?.value ?? ''}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
