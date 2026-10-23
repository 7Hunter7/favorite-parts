import { useSelector } from 'react-redux';

export default function ResultsTable() {
  const { analogues, analoguesLoading, selectedBrand } = useSelector((s) => s.search);
  if (analoguesLoading || !selectedBrand) return null;
  if (!analogues.length) return <div className="alert alert-warning">Аналоги не найдены.</div>;

  return (
    <div className="table-responsive">
      <table className="table table-sm table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Производитель</th>
            <th>Артикул</th>
            <th>Наименование</th>
            <th className="text-end">Цена, ₽</th>
            <th className="text-end">Остаток</th>
          </tr>
        </thead>
        <tbody>
          {analogues.map((p) => (
            <tr key={p.id}>
              <td>{p.brand}</td>
              <td>{p.number}</td>
              <td>{p.name}</td>
              <td className="text-end">{p.price.toLocaleString('ru-RU')}</td>
              <td className="text-end">{p.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}