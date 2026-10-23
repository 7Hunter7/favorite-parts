import { useSelector } from 'react-redux';
import SearchForm from './components/SearchForm';
import BrandList from './components/BrandList';
import ResultsTable from './components/ResultsTable';
import Loader from './components/Loader';
import ErrorBox from './components/ErrorBox';

export default function App() {
  const { brandsLoading, error, brands } = useSelector((s) => s.search);
  return (
    <div className="container py-4">
      <h1 className="h4 mb-1">Поиск автозапчастей Favorit-Parts</h1>
      <p className="text-muted small">Шаг 1: артикул → бренд. Шаг 2: аналоги и предложения.</p>
      <SearchForm />
      <ErrorBox message={error} />
      {brandsLoading && <Loader label="Ищем производителей..." />}
      {!brandsLoading && brands.length === 0 && !error && (
        <div className="text-muted">Введите артикул (от 3 символов) или нажмите «Найти».</div>
      )}
      <BrandList />
      <ResultsTable />
    </div>
  );
}