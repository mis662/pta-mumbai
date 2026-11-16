import { useMemo, useState } from 'react';
import { useApi, Loader, ErrorBox } from '../api.jsx';
import PageBanner from '../components/PageBanner.jsx';
import PersonCard, { initials } from '../components/PersonCard.jsx';


export default function Members() {
  const { data, loading, error } = useApi('/api/members');
  const [q, setQ] = useState('');

  const total = useMemo(
    () => (data ? data.office.length + data.groups.reduce((n, g) => n + g.names.length, 0) : 0),
    [data],
  );
  const term = q.trim().toLowerCase();
  const groups = (data?.groups ?? [])
    .map((g) => ({
      ...g,
      names: g.names.filter((n) => !term || (n + ' ' + g.label).toLowerCase().includes(term)),
    }))
    .filter((g) => g.names.length);

  return (
    <>
      <PageBanner title="Members" subtitle="Managing Committee, Sub-Committees and Women's Wing of PTA Mumbai" image="/images/about1.jpg" />

      {loading && <Loader />}
      {error && <ErrorBox error={error} />}

      {data && (
        <>
          <section className="section">
            <div className="container">
              <div className="row-head">
                <div>
                  <p className="kicker">Office Bearers</p>
                  <h2 className="display">Our Leadership</h2>
                </div>
              </div>
              <div className="people">
                {data.office.map((m, i) => (
                  <PersonCard key={m.name} person={m} lead={i === 0} />
                ))}
              </div>
            </div>
          </section>

          {data.womensWing && (
            <section className="section womens-wing">
              <div className="container split">
                <div className="split-head">
                  <p className="kicker light">Since {data.womensWing.since}</p>
                  <h2 className="display light">Women's Wing</h2>
                  <p>{data.womensWing.intro}</p>
                </div>
                <ul className="wing-list">
                  {data.womensWing.members.map((m) => (
                    <li key={m.name}>
                      <span className="monogram light">{initials(m.name)}</span>
                      <div><h3>{m.name}</h3><p>{m.firm}</p></div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          <section className="section">
            <div className="container">
              <div className="row-head">
                <div>
                  <p className="kicker">{total} members incl. office bearers</p>
                  <h2 className="display">Managing Committee</h2>
                </div>
                <input
                  type="search"
                  className="search"
                  placeholder="Search a member by name"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  aria-label="Search members"
                />
              </div>
              {groups.map((g) => (
                <div className="member-group" key={g.label}>
                  <h3 className="group-title">{g.label} <span>{g.names.length}</span></h3>
                  <ul className="name-grid">
                    {g.names.map((n) => (
                      <li key={n}>
                        <span className="mini-mono">{initials(n)}</span>
                        {n}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {!groups.length && <p className="center muted">No members match “{q}”.</p>}
            </div>
          </section>

          <section className="section tint">
            <div className="container">
              <div className="row-head">
                <div>
                  <p className="kicker">Working groups</p>
                  <h2 className="display">Sub-Committees</h2>
                </div>
              </div>
              <div className="committees">
                {data.subCommittees.map((s, i) => (
                  <div className="committee" key={s.name}>
                    <span className="num">{String(i + 1).padStart(2, '0')}</span>
                    <h3>{s.name}</h3>
                    <p><span className="label">Convenor</span> {s.convenor}</p>
                    {s.members.length > 0 && <p><span className="label">Members</span> {s.members.join(', ')}</p>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
