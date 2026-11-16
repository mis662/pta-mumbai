import { useMemo, useState } from 'react';
import { useApi, Loader, ErrorBox } from '../api.jsx';
import PageBanner from '../components/PageBanner.jsx';

const initials = (name) => name.replace(/^(Shri|Smt\.)\s+/, '').split(' ').map((w) => w[0]).join('');

export default function Members() {
  const { data, loading, error } = useApi('/api/members');
  const [q, setQ] = useState('');

  // One numbered list, same order as the original site
  const rows = useMemo(() => {
    if (!data) return [];
    const list = data.office.map((m) => ({ name: m.name, designation: m.designation }));
    data.groups.forEach((g) => g.names.forEach((n) => list.push({ name: n, designation: g.label })));
    return list.map((r, i) => ({ ...r, sr: i + 1 }));
  }, [data]);

  const filtered = rows.filter((r) => (r.name + r.designation).toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <PageBanner title="Members" subtitle="Managing Committee, Sub-Committees and Women's Wing of PTA Mumbai" />

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
                {data.office.map((m) => (
                  <div className="person" key={m.name}>
                    <span className="monogram">{initials(m.name)}</span>
                    <h3>{m.name}</h3>
                    <p>{m.designation}</p>
                  </div>
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
                  <p className="kicker">{rows.length} members</p>
                  <h2 className="display">Managing Committee</h2>
                </div>
                <input
                  type="search"
                  className="search"
                  placeholder="Search by name or role"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  aria-label="Search members"
                />
              </div>
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr><th>Sr. No.</th><th>Name</th><th>Designation</th></tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => (
                      <tr key={r.sr}>
                        <td>{r.sr}</td>
                        <td>{r.name}</td>
                        <td>{r.designation}</td>
                      </tr>
                    ))}
                    {!filtered.length && <tr><td colSpan={3} className="center">No members match “{q}”.</td></tr>}
                  </tbody>
                </table>
              </div>
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
