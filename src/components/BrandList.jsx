import { useDispatch, useSelector } from 'react-redux';
import { loadAnalogues } from '../store/searchSlice';

export default function BrandList() {
  const dispatch = useDispatch();
  const { brands, number, selectedBrand } = useSelector((s) => s.search);
  if (!brands.length) return null;

  return (
    <div className="mb-3">
      <h6>Производители ({brands.length})</h6>
      <div className="d-flex flex-wrap gap-2">
        {brands.map((b) => (
          <button
            key={b.brand}
            className={`btn btn-sm ${selectedBrand === b.brand ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => dispatch(loadAnalogues({ number, brand: b.brand }))}
          >
            {b.brand}
          </button>
        ))}
      </div>
    </div>
  );
}