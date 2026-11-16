import { asset } from '../asset.js';

export const initials = (name) => name.replace(/^(Shri|Smt\.)\s+/, '').split(' ').map((w) => w[0]).join('');

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
