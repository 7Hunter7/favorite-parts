import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadBrands } from '../store/searchSlice';

export default function SearchForm() {
  const dispatch = useDispatch();
  const { number } = useSelector((s) => s.search);
  const [value, setValue] = useState(number);

  const onSubmit = (e) => {
    e.preventDefault();
    const v = value.trim();
    if (!v) return;
    dispatch(loadBrands(v));
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