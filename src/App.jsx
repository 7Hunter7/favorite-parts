import { useSelector } from 'react-redux';
import SearchForm from './components/SearchForm';
import BrandList from './components/BrandList';
import ResultsTable from './components/ResultsTable';
import Loader from './components/Loader';
import ErrorBox from './components/ErrorBox';

const MIN_LEN = 2;

export default function App() {
  const { brandsLoading, error, brands, number } = useSelector((s) => s.search);
  // Показываем подсказку, если пользователь ещё ничего не вводил
  const showHint = !brandsLoading && !error && number === '';
  // Показываем «не найдено», если запрос был и вернул пусто
  const showEmpty = !brandsLoading && !error && number !== '' && brands.length === 0;

  return (
    <div className="container py-4">
      <h1 className="h1 text-center mb-4">Автозапчасти Favorit-Parts</h1>
      <h2 className="h2">
        Поиск по артикулу
      </h2>
      <SearchForm />
      <ErrorBox message={error} />
      {brandsLoading && <Loader label="Ищем производителей..." />}
      {showHint && (
        <div className="text-muted">
          Введите артикул (от {MIN_LEN} символов) или нажмите «Найти».
        </div>
      )}
      {showEmpty && (
        <div className="alert alert-warning">
          По артикулу «{number}» производители не найдены.
        </div>
      )}
      <BrandList />
      <ResultsTable />
    </div>
  );
}