import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadBrands } from '../store/searchSlice';

const DEBOUNCE_MS = 700;
const MIN_LEN = 2;
const VALID_RE = /^[A-Za-z0-9\-/]+$/;

export default function SearchForm() {
  const dispatch = useDispatch();
  const { number } = useSelector((s) => s.search);
  const [value, setValue] = useState(number);
  const [hint, setHint] = useState('');
  const timer = useRef(null);

  // Дебаунс, чтобы не жечь квоту API
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    const v = value.trim();

    if (v.length === 0) { setHint(''); return; }
    if (v.length < MIN_LEN) { setHint(`Введите минимум ${MIN_LEN} символа.`); return; }
    if (!VALID_RE.test(v)) { setHint('Допустимы только буквы, цифры, «-» и «/».'); return; }

    setHint('');
    timer.current = setTimeout(() => dispatch(loadBrands(v)), DEBOUNCE_MS);
    
    return () => clearTimeout(timer.current);
  }, [value, dispatch]);

  const onSubmit = (e) => {
    e.preventDefault();
    const v = value.trim();
    if (v.length < MIN_LEN || !VALID_RE.test(v)) return;
    dispatch(loadBrands(v));
  };

  return (
    <form className="my-3" onSubmit={onSubmit}>
      <div className="d-flex gap-2">
        <input
          className="form-control"
          placeholder="Артикул детали, например 01898"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">Найти</button>
      </div>
      {hint && <div className="form-text text-warning mt-1">{hint}</div>}
    </form>
  );
}