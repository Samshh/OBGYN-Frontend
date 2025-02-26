interface Column<T> {
  header: string;
  key: string | ((row: T) => string);
}

interface DataTableProps<T> {
  className?: string;
  data: Array<T>;
  columns: Array<Column<T>>;
  onRowClick?: (row: T) => void;
}

export default function DataTable<T>({
  className,
  data,
  columns,
  onRowClick,
}: DataTableProps<T>) {
  if (!data.length) return null;

  const getValue = (
    row: T,
    key: string | ((row: T) => string)
  ) => {
    if (typeof key === "function") {
      return key(row);
    }
    const value = key.split(".").reduce<unknown>((acc, part) => {
      if (acc && typeof acc === "object" && part in acc) {
        return (acc as Record<string, unknown>)[part];
      }
      return undefined;
    }, row) as string | undefined;

 if (key === "StatusID" && value !== undefined) {
      const numericValue = Number(value);
      switch (numericValue) {
        case 1:
          return "Pending";
        case 2:
          return "Done";
        case 3:
          return "Cancelled";
        default:
          return value;
      }
    }

    return value;
  };

  const handleRowClick = (row: T) => {
    if (onRowClick) {
      onRowClick(row);
    }
  };

  return (
    <div className={className}>
      <table className="min-w-full divide-y">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => handleRowClick(row)}
              className="cursor-pointer hover:bg-border rounded-lg"
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className="px-6 py-4 whitespace-wrap text-sm text-black"
                >
                  {getValue(row, column.key) ?? ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}