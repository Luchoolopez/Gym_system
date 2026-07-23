import { Spinner, EmptyState } from '../ui';

export interface Column<T> {
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  emptyMessage?: string;
  keyExtractor: (row: T) => string | number;
}

// Tabla genérica reutilizable (Open/Closed: se extiende vía columns, no se modifica)
export function DataTable<T>({ columns, rows, loading, emptyMessage = 'Sin resultados.', keyExtractor }: DataTableProps<T>) {
  if (loading) return <Spinner />;
  if (rows.length === 0) return <EmptyState>{emptyMessage}</EmptyState>;

  return (
    <div className="overflow-x-auto border border-outline">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-outline bg-graphite">
            {columns.map((col, i) => (
              <th
                key={i}
                className={`px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.14em] text-muted ${col.className ?? ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={keyExtractor(row)} className="border-b border-outline last:border-0 hover:bg-surface-card/50 transition-colors">
              {columns.map((col, i) => (
                <td key={i} className={`px-4 py-3 ${col.className ?? ''}`}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
