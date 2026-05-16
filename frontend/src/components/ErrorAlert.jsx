export default function ErrorAlert({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="mb-4 flex items-start justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <span>{message}</span>
      {onClose && (
        <button type="button" onClick={onClose} className="ml-4 font-medium hover:underline">
          Dismiss
        </button>
      )}
    </div>
  );
}
