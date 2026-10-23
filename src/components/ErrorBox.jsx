export default function ErrorBox({ message }) {
  if (!message) return null;
  return <div className="alert alert-danger my-3">{message}</div>;
}