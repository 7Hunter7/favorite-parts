import { useSelector } from 'react-redux';
import Loader from './Loader';

export default function ResultsTable() {
  const { analogues, analoguesLoading, selectedBrand } = useSelector((s) => s.search);

  if (!selectedBrand) return null;
  if (analoguesLoading) return <Loader label={`Загружаем аналоги ${selectedBrand}...`} />;
  if (!analogues.length) {
    return <div className="alert alert-warning">Аналоги не найдены.</div>;
  }

  return (
    <div className="table-responsive">
      <h6>Предложения ({analogues.length})</h6>
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
              <td>
                {p.name}
                {p.notRefund && <span className="badge bg-warning text-dark ms-2">невозврат</span>}
              </td>
              <td className="text-end">{p.price.toLocaleString('ru-RU')}</td>
              <td className="text-end">{p.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}