import { asset } from '../asset.js';

export const initials = (name) => {
  const w = name.replace(/^(Shri|Smt\.|Mrs\.)\s+/, '').split(/\s+/).filter(Boolean);
  return (w[0][0] + (w.length > 1 ? w[w.length - 1][0] : '')).toUpperCase();
};

/** Office-bearer card: photo if we have one, otherwise initials. */
export default function PersonCard({ person, lead = false }) {
  return (
    <div className={`person ${lead ? 'lead' : ''}`}>
      {person.photo ? (
        <img className="avatar" src={asset(person.photo)} alt={person.name} loading="lazy" />
      ) : (
        <span className="avatar monogram" aria-hidden="true">{initials(person.name)}</span>
      )}
      <h3>{person.name}</h3>
      <p>{person.designation}</p>
    </div>
  );
}
