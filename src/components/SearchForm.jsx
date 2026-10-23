import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadBrands } from '../store/searchSlice';

const DEBOUNCE_MS = 500;

export default function SearchForm() {
  const dispatch = useDispatch();
  const { number } = useSelector((s) => s.search);
  const [value, setValue] = useState(number);
  const timer = useRef(null);

  // Дебаунс, чтобы не жечь квоту API
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    const v = value.trim();
    if (v.length < 3) return; // короткие артикулы не ищем
    timer.current = setTimeout(() => dispatch(loadBrands(v)), DEBOUNCE_MS);
    
    return () => clearTimeout(timer.current);
  }, [value, dispatch]);

  const onSubmit = (e) => {
    e.preventDefault();
    const v = value.trim();
    if (v) dispatch(loadBrands(v));
  };

  return (
    <form className="d-flex gap-2 my-3" onSubmit={onSubmit}>
      <input
        className="form-control"
        placeholder="Артикул детали, например 01898"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button className="btn btn-primary" type="submit">Найти</button>
    </form>
  );
}