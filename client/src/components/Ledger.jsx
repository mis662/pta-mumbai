/** A row of key figures separated by thin rules, like an old ledger. */
export default function Ledger({ items }) {
  if (!items) return null;
  return (
    <dl className="ledger">
      {items.map((s) => (
        <div key={s.label}>
          <dt>{s.value}</dt>
          <dd>
            {s.label}
            {s.note && <small>{s.note}</small>}
          </dd>
        </div>
      ))}
    </dl>
  );
}
