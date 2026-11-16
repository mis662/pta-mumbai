import { useMemo, useState } from 'react';
import { useApi, Loader, ErrorBox } from '../api.jsx';
import PageBanner from '../components/PageBanner.jsx';
import { UserIcon } from '../components/Icons.jsx';

export default function Members() {
  const { data, loading, error } = useApi('/api/members');
  const [q, setQ] = useState('');

  // Flatten into one numbered list, the same order as the original site
  const rows = useMemo(() => {
    if (!data) return [];
    const list = data.office.map((m) => ({ name: m.name, designation: m.designation }));
    data.groups.forEach((g) => g.names.forEach((n) => list.push({ name: n, designation: g.label })));
    return list.map((r, i) => ({ ...r, sr: i + 1 }));
  }, [data]);

  const filtered = rows.filter((r) => (r.name + r.designation).toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <PageBanner title="Members" subtitle="Managing Committee & Sub-Committees of PTA Mumbai" />

      {loading && <Loader />}
      {error && <ErrorBox error={error} />}

      {data && (
        <>
          <section className="section">
            <div className="container">
              <div className="section-head center">
                <span className="eyebrow">Office Bearers</span>
                <h2 className="section-title">Our <em>Leadership</em></h2>
              </div>
              <div className="leader-grid">
                {data.office.map((m) => (
                  <div className="leader-card" key={m.name}>
                    <div className="leader-avatar"><UserIcon width={40} height={40} /></div>
                    <h3>{m.name}</h3>
                    <p>{m.designation}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {data.womensWing && (
            <section className="section womens-wing">
              <div className="paper-lines" aria-hidden="true" />
              <div className="container">
                <div className="section-head center">
                  <span className="eyebrow light">Since {data.womensWing.since}</span>
                  <h2 className="section-title light">Women's <em>Wing</em></h2>
                  <p className="section-lead">{data.womensWing.intro}</p>
                </div>
                <div className="wing-grid">
                  {data.womensWing.members.map((m) => (
                    <div className="wing-card" key={m.name}>
                      <div className="wing-initials">{m.name.replace('Smt. ', '').split(' ').map((w) => w[0]).join('')}</div>
                      <h3>{m.name}</h3>
                      <p>{m.firm}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="section alt">
            <div className="container">
              <div className="table-head">
                <h2 className="section-title small">Managing <em>Committee</em></h2>
                <input
                  type="search"
                  className="search"
                  placeholder="Search members…"
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
                        <td><span className="pill">{r.designation}</span></td>
                      </tr>
                    ))}
                    {!filtered.length && <tr><td colSpan={3} className="center">No members match “{q}”.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="container">
              <h2 className="section-title small">Sub-<em>Committees</em></h2>
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr><th>Sr. No.</th><th>Sub-Committee</th><th>Convenor</th><th>Members</th></tr>
                  </thead>
                  <tbody>
                    {data.subCommittees.map((s, i) => (
                      <tr key={s.name}>
                        <td>{i + 1}</td>
                        <td><strong>{s.name}</strong></td>
                        <td>{s.convenor}</td>
                        <td>{s.members.join(', ') || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
