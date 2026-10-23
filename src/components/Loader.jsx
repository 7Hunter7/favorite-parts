export default function Loader({ label = 'Загрузка...' }) {
  return (
    <div className="d-flex align-items-center gap-2 text-secondary my-3">
      <div className="spinner-border spinner-border-sm" role="status" />
      <span>{label}</span>
    </div>
  );
}