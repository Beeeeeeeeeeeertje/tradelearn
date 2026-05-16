import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import './App.css';

const ADMIN_EMAIL = 'louisvaast@icloud.com';

const METALEN_CONFIG = [
  { id: 'goud', naam: 'Goud', icoon: '🥇', kleur: '#f0b429', startprijs: 3200 },
  { id: 'zilver', naam: 'Zilver', icoon: '🥈', kleur: '#a8b2bf', startprijs: 32 },
  { id: 'koper', naam: 'Koper', icoon: '🥉', kleur: '#e07b54', startprijs: 4.8 },
  { id: 'platinum', naam: 'Platinum', icoon: '💎', kleur: '#58a6ff', startprijs: 980 },
];

const BEURZEN_CONFIG = [
  { id: 'sp500', naam: 'S&P 500', icoon: '🇺🇸', kleur: '#3fb950', startprijs: 5200 },
  { id: 'aex', naam: 'AEX', icoon: '🇳🇱', kleur: '#f0b429', startprijs: 890 },
  { id: 'dax', naam: 'DAX', icoon: '🇩🇪', kleur: '#e07b54', startprijs: 18200 },
  { id: 'bel20', naam: 'BEL 20', icoon: '🇧🇪', kleur: '#a8b2bf', startprijs: 4100 },
];

const CRYPTO_CONFIG = [
  { id: 'bitcoin', naam: 'Bitcoin', icoon: '₿', kleur: '#f7931a', startprijs: 62000 },
  { id: 'ethereum', naam: 'Ethereum', icoon: '⟠', kleur: '#627eea', startprijs: 3100 },
  { id: 'solana', naam: 'Solana', icoon: '◎', kleur: '#9945ff', startprijs: 145 },
  { id: 'bnb', naam: 'BNB', icoon: '🔶', kleur: '#f3ba2f', startprijs: 580 },
  { id: 'xrp', naam: 'XRP', icoon: '✕', kleur: '#00aae4', startprijs: 0.52 },
  { id: 'cardano', naam: 'Cardano', icoon: '₳', kleur: '#0033ad', startprijs: 0.45 },
  { id: 'dogecoin', naam: 'Dogecoin', icoon: '🐕', kleur: '#c2a633', startprijs: 0.15 },
  { id: 'polkadot', naam: 'Polkadot', icoon: '●', kleur: '#e6007a', startprijs: 7.2 },
];

const NIEUWS = [
  { titel: 'Goudprijs bereikt nieuw record door onzekerheid op markten', bron: 'Financial Times', tijd: '2 uur geleden', tag: 'Goud', kleur: '#f0b429', inhoud: 'De goudprijs heeft vandaag een nieuw record bereikt van meer dan $3.200 per troy ounce. Analisten wijzen op toenemende geopolitieke spanningen en inflatiezorgen als voornaamste oorzaken.' },
  { titel: 'Centrale banken verhogen goudreserves tot hoogste niveau ooit', bron: 'Bloomberg', tijd: '4 uur geleden', tag: 'Goud', kleur: '#f0b429', inhoud: 'Centrale banken wereldwijd hebben hun goudreserves verhoogd tot het hoogste niveau in 50 jaar. China en India leiden de lijst van kopers.' },
  { titel: 'Zilverprijs stijgt door groeiende vraag uit zonne-energiesector', bron: 'Reuters', tijd: '5 uur geleden', tag: 'Zilver', kleur: '#a8b2bf', inhoud: 'De vraag naar zilver voor zonnepanelen groeit explosief. Experts verwachten dat de zilverprijs de komende jaren sterk zal stijgen.' },
  { titel: 'Kopermarkt onder druk door vertraging Chinese industrie', bron: 'Wall Street Journal', tijd: '6 uur geleden', tag: 'Koper', kleur: '#e07b54', inhoud: 'De koperprijs staat onder druk na tegenvallende industriecijfers uit China.' },
  { titel: 'ECB houdt rente stabiel — euro versterkt tegenover dollar', bron: 'De Tijd', tijd: '7 uur geleden', tag: 'Economie', kleur: '#58a6ff', inhoud: 'De Europese Centrale Bank heeft besloten de rente ongewijzigd te laten op 3.5%.' },
  { titel: 'BEL 20 sluit week positief af ondanks internationale onrust', bron: 'De Standaard', tijd: '8 uur geleden', tag: 'Beurs', kleur: '#3fb950', inhoud: 'De Belgische beurs sloot de week positief af met een winst van 1.2%.' },
  { titel: 'Bitcoin doorbreekt $65.000 grens na ETF goedkeuring', bron: 'CoinDesk', tijd: '3 uur geleden', tag: 'Crypto', kleur: '#f7931a', inhoud: 'Bitcoin heeft de $65.000 grens doorbroken na positief nieuws over ETF goedkeuringen.' },
  { titel: 'Ethereum upgrade maakt netwerk 30% sneller', bron: 'The Block', tijd: '6 uur geleden', tag: 'Crypto', kleur: '#627eea', inhoud: 'De laatste Ethereum upgrade heeft het netwerk significant sneller gemaakt.' },
];

const VALUTA = [
  { code: 'EUR', symbool: '€', naam: 'Euro', koers: 1 },
  { code: 'USD', symbool: '$', naam: 'Dollar', koers: 1.09 },
  { code: 'GBP', symbool: '£', naam: 'Pond', koers: 0.86 },
  { code: 'JPY', symbool: '¥', naam: 'Yen', koers: 163 },
];

const MODULES = [
  { id: 1, titel: 'Wat is traden?', icoon: '📚', duur: '5 min', niveau: 'Beginner', kleur: '#3fb950', inhoud: `Traden betekent het kopen en verkopen van financiële activa.\n\nSoorten traders:\n• Day traders: kopen en verkopen binnen één dag\n• Swing traders: dagen tot weken\n• Long-term investors: maanden tot jaren` },
  { id: 2, titel: 'Hoe werkt een portfolio?', icoon: '📊', duur: '7 min', niveau: 'Beginner', kleur: '#58a6ff', inhoud: `Een portfolio is een verzameling van al je investeringen.\n\nDiversificatie is het sleutelwoord: investeer in verschillende activa om risico te spreiden.` },
  { id: 3, titel: 'Technische analyse basics', icoon: '📈', duur: '10 min', niveau: 'Gemiddeld', kleur: '#f0b429', inhoud: `Technische analyse bestudeert prijsgrafieken.\n\nBelangrijke concepten:\n• Support & Resistance\n• Trend\n• Volume\n• Moving Average` },
  { id: 4, titel: 'Risicobeheer & Stop-Loss', icoon: '🛡️', duur: '8 min', niveau: 'Gemiddeld', kleur: '#e07b54', inhoud: `De 1% regel: risikeer nooit meer dan 1-2% per trade.\n\nStop-Loss: automatische verkooporder die verlies beperkt.` },
  { id: 5, titel: 'Fundamentele analyse', icoon: '🔍', duur: '12 min', niveau: 'Gevorderd', kleur: '#a8b2bf', inhoud: `Fundamentele analyse kijkt naar de werkelijke waarde van een actief.\n\nVoor aandelen: winst, groei, marktpositie.\nVoor crypto: adoptie, technologie, team.` },
  { id: 6, titel: 'Psychologie van traden', icoon: '🧠', duur: '6 min', niveau: 'Alle niveaus', kleur: '#9945ff', inhoud: `FOMO en panic selling zijn de grootste vijanden.\n\nGouden regels:\n• Maak een plan\n• Accepteer verliezen\n• Trade nooit met geld dat je niet kan missen` },
];

function genereerHistoriek(startprijs: number, punten = 24) {
  const data = [];
  let prijs = startprijs;
  for (let i = punten; i >= 0; i--) {
    prijs = Math.round(prijs * (1 + (Math.random() - 0.5) * 0.015) * 100) / 100;
    data.push({ tijd: `${i}u`, prijs });
  }
  return data;
}

function converteer(prijs: number, valuta: any) {
  return Math.round(prijs * valuta.koers * 100) / 100;
}

function Navbar({ valuta, setValuta, isAdmin }: any) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">⚡ TradeLearn</div>
      {[
        ['/', 'Dashboard'],
        ['/metalen', 'Metalen'],
        ['/beurzen', 'Beurzen'],
        ['/crypto', '₿ Crypto'],
        ['/nieuws', 'Nieuws'],
        ['/leren', '🎓 Leren'],
        ['/portfolio', '📊 Portfolio'],
        ['/competitie', '🏆 Competitie'],
      ].map(([path, label]) => (
        <NavLink key={path} to={path} end={path === '/'} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          {label}
        </NavLink>
      ))}
      {isAdmin && (
        <NavLink to="/admin" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          ⚙️ Admin
        </NavLink>
      )}
      <div className="valuta-switcher">
        {VALUTA.map(v => (
          <button key={v.code} onClick={() => setValuta(v)} className={`valuta-btn${valuta.code === v.code ? ' active' : ''}`}>
            {v.symbool} {v.code}
          </button>
        ))}
      </div>
    </nav>
  );
}

function PrijsKaart({ item, prijs, vorigeprijs, valuta, onClick = null, geselecteerd = false }: any) {
  const conv = converteer(prijs, valuta);
  const stijging = vorigeprijs > 0 && prijs > vorigeprijs;
  const daling = vorigeprijs > 0 && prijs < vorigeprijs;
  const pct = vorigeprijs > 0 ? ((prijs - vorigeprijs) / vorigeprijs * 100).toFixed(2) : null;

  return (
    <div className={`prijs-kaart${geselecteerd ? ' geselecteerd' : ''}`} onClick={onClick} style={{ borderLeftColor: item.kleur }}>
      <div className="kaart-header">
        <div className="kaart-naam" style={{ color: item.kleur }}>
          <div className="kaart-icoon" style={{ background: `${item.kleur}18` }}>{item.icoon}</div>
          {item.naam}
        </div>
        {pct && (
          <span className={`kaart-indicator ${stijging ? 'stijging' : daling ? 'daling' : 'neutraal'}`}>
            {stijging ? '▲' : daling ? '▼' : '—'} {Math.abs(Number(pct))}%
          </span>
        )}
      </div>
      <div className="kaart-prijs" style={{ color: item.kleur }}>{valuta.symbool} {conv.toLocaleString()}</div>
      {!pct && <span className="kaart-indicator neutraal">— laden</span>}
    </div>
  );
}

function Grafiek({ item, historiek, valuta }: any) {
  const [periode, setPeriode] = useState('24u');
  const data = historiek.map((d: any) => ({ ...d, prijs: converteer(d.prijs, valuta) }));
  return (
    <div className="grafiek-container">
      <div className="grafiek-header">
        <div className="grafiek-titel" style={{ color: item.kleur }}>{item.icoon} {item.naam} — Prijshistoriek</div>
        <div className="grafiek-periode">
          {['1u', '24u', '7d', '1m'].map(p => (
            <button key={p} onClick={() => setPeriode(p)} className={`periode-btn${periode === p ? ' active' : ''}`}>{p}</button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <defs>
            <linearGradient id={`grad-${item.id}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={item.kleur} stopOpacity={0.6} />
              <stop offset="100%" stopColor={item.kleur} stopOpacity={1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="tijd" stroke="#7d8590" fontSize={11} interval={4} tick={{ fill: '#7d8590' }} />
          <YAxis stroke="#7d8590" fontSize={11} domain={['auto', 'auto']} tick={{ fill: '#7d8590' }} width={70} />
          <Tooltip contentStyle={{ background: 'rgba(13,17,23,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#e6edf3', fontSize: '13px' }} formatter={(val: any) => [`${valuta.symbool} ${val}`, item.naam]} />
          <Line type="monotone" dataKey="prijs" stroke={`url(#grad-${item.id})`} strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: item.kleur }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function NieuwsKaart({ artikel, onClick }: any) {
  return (
    <div className="nieuws-kaart" onClick={() => onClick(artikel)}>
      <div className="nieuws-tag" style={{ background: `${artikel.kleur}18`, color: artikel.kleur, border: `1px solid ${artikel.kleur}33` }}>{artikel.tag}</div>
      <div className="nieuws-titel">{artikel.titel}</div>
      <div className="nieuws-meta">
        <span style={{ color: '#58a6ff', fontWeight: 600 }}>{artikel.bron}</span>
        <span style={{ color: '#7d8590' }}>{artikel.tijd}</span>
      </div>
    </div>
  );
}

function ArtikelDetail({ artikel, onTerug }: any) {
  return (
    <div className="artikel-container">
      <button className="terug-btn" onClick={onTerug}>← Terug naar nieuws</button>
      <div className="nieuws-tag" style={{ background: `${artikel.kleur}18`, color: artikel.kleur, border: `1px solid ${artikel.kleur}33`, marginBottom: '16px' }}>{artikel.tag}</div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px', lineHeight: 1.4 }}>{artikel.titel}</h1>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', fontSize: '13px' }}>
        <span style={{ color: '#58a6ff', fontWeight: 600 }}>{artikel.bron}</span>
        <span style={{ color: '#7d8590' }}>{artikel.tijd}</span>
      </div>
      <div className="artikel-inhoud">{artikel.inhoud}</div>
    </div>
  );
}

function Dashboard({ prijzen, vorigePrijzen, lastUpdate, verversPrijzen, valuta, historiek }: any) {
  return (
    <div>
      <div className="hero">
        <h1>Welkom bij <span>TradeLearn</span></h1>
        <p>Leer traden met virtueel geld — metalen, beurzen & crypto</p>
      </div>
      <button className="refresh-btn" onClick={verversPrijzen}>🔄 Verversen</button>
      {lastUpdate && <p className="last-update">Laatste update: {lastUpdate}</p>}
      <div className="section-title">🥇 Metalen</div>
      <div className="cards-grid">
        {METALEN_CONFIG.map(m => <PrijsKaart key={m.id} item={m} prijs={prijzen[m.id]} vorigeprijs={vorigePrijzen[m.id]} valuta={valuta} />)}
      </div>
      <Grafiek item={METALEN_CONFIG[0]} historiek={historiek['goud'] || []} valuta={valuta} />
      <div className="section-title">📈 Beurzen</div>
      <div className="cards-grid">
        {BEURZEN_CONFIG.map(m => <PrijsKaart key={m.id} item={m} prijs={prijzen[m.id]} vorigeprijs={vorigePrijzen[m.id]} valuta={valuta} />)}
      </div>
      <Grafiek item={BEURZEN_CONFIG[0]} historiek={historiek['sp500'] || []} valuta={valuta} />
      <div className="section-title">₿ Crypto</div>
      <div className="cards-grid">
        {CRYPTO_CONFIG.slice(0, 4).map(m => <PrijsKaart key={m.id} item={m} prijs={prijzen[m.id]} vorigeprijs={vorigePrijzen[m.id]} valuta={valuta} />)}
      </div>
      <div className="section-title">📰 Laatste nieuws</div>
      {NIEUWS.slice(0, 3).map((a, i) => (
        <div key={i} className="nieuws-kaart" style={{ cursor: 'default' }}>
          <div className="nieuws-tag" style={{ background: `${a.kleur}18`, color: a.kleur, border: `1px solid ${a.kleur}33` }}>{a.tag}</div>
          <div className="nieuws-titel">{a.titel}</div>
          <div className="nieuws-meta">
            <span style={{ color: '#58a6ff', fontWeight: 600 }}>{a.bron}</span>
            <span style={{ color: '#7d8590' }}>{a.tijd}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function MetalenPagina({ prijzen, vorigePrijzen, valuta, historiek }: any) {
  const [geselecteerd, setGeselecteerd] = useState(METALEN_CONFIG[0]);
  return (
    <div>
      <div className="hero"><h1>🥇 <span>Metalen</span></h1><p>Klik op een metaal om de grafiek te bekijken</p></div>
      <div className="cards-grid">
        {METALEN_CONFIG.map(m => <PrijsKaart key={m.id} item={m} prijs={prijzen[m.id]} vorigeprijs={vorigePrijzen[m.id]} valuta={valuta} onClick={() => setGeselecteerd(m)} geselecteerd={geselecteerd.id === m.id} />)}
      </div>
      <Grafiek item={geselecteerd} historiek={historiek[geselecteerd.id] || []} valuta={valuta} />
    </div>
  );
}

function BeurzenPagina({ prijzen, vorigePrijzen, valuta, historiek }: any) {
  const [geselecteerd, setGeselecteerd] = useState(BEURZEN_CONFIG[0]);
  return (
    <div>
      <div className="hero"><h1>📈 <span>Beurzen</span></h1><p>Klik op een index om de grafiek te bekijken</p></div>
      <div className="cards-grid">
        {BEURZEN_CONFIG.map(m => <PrijsKaart key={m.id} item={m} prijs={prijzen[m.id]} vorigeprijs={vorigePrijzen[m.id]} valuta={valuta} onClick={() => setGeselecteerd(m)} geselecteerd={geselecteerd.id === m.id} />)}
      </div>
      <Grafiek item={geselecteerd} historiek={historiek[geselecteerd.id] || []} valuta={valuta} />
    </div>
  );
}

function CryptoPagina({ prijzen, vorigePrijzen, valuta, historiek }: any) {
  const [geselecteerd, setGeselecteerd] = useState(CRYPTO_CONFIG[0]);
  const [filter, setFilter] = useState('alle');
  const gefilterd = filter === 'alle' ? CRYPTO_CONFIG : filter === 'top' ? CRYPTO_CONFIG.slice(0, 4) : CRYPTO_CONFIG.filter(c => converteer(prijzen[c.id] || c.startprijs, valuta) > 100);
  return (
    <div>
      <div className="hero"><h1>₿ <span>Crypto</span></h1><p>Live cryptocurrency prijzen</p></div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {[['alle', 'Alle coins'], ['top', 'Top 4'], ['groot', 'Grote coins']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)} style={{ padding: '6px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: filter === val ? 'linear-gradient(135deg, #f0b429, #e08e00)' : 'rgba(255,255,255,0.06)', color: filter === val ? '#000' : '#7d8590', fontSize: '13px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>{label}</button>
        ))}
      </div>
      <div className="cards-grid" style={{ marginBottom: '28px' }}>
        {[{ label: 'Totale marktcap', waarde: '€ 2.1T', kleur: '#f0b429', icoon: '📊' }, { label: '24u volume', waarde: '€ 84.2B', kleur: '#3fb950', icoon: '📈' }, { label: 'BTC dominantie', waarde: '52.4%', kleur: '#f7931a', icoon: '₿' }, { label: 'Actieve coins', waarde: '8.000+', kleur: '#58a6ff', icoon: '🪙' }].map(s => (
          <div key={s.label} className="stat-kaart"><div className="stat-label">{s.icoon} {s.label}</div><div className="stat-waarde" style={{ color: s.kleur, fontSize: '20px' }}>{s.waarde}</div></div>
        ))}
      </div>
      <div className="section-title">Live prijzen</div>
      <div className="cards-grid" style={{ marginBottom: '24px' }}>
        {gefilterd.map(c => <PrijsKaart key={c.id} item={c} prijs={prijzen[c.id] || c.startprijs} vorigeprijs={vorigePrijzen[c.id] || 0} valuta={valuta} onClick={() => setGeselecteerd(c)} geselecteerd={geselecteerd.id === c.id} />)}
      </div>
      <Grafiek item={geselecteerd} historiek={historiek[geselecteerd.id] || genereerHistoriek(geselecteerd.startprijs)} valuta={valuta} />
      <div className="section-title" style={{ marginTop: '32px' }}>📊 Markt overzicht</div>
      <div style={{ background: 'rgba(22,27,34,0.6)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '11px', fontWeight: 700, color: '#7d8590', textTransform: 'uppercase' as const }}>
          <span>Coin</span><span style={{ textAlign: 'right' as const }}>Prijs</span><span style={{ textAlign: 'right' as const }}>24u %</span><span style={{ textAlign: 'right' as const }}>Marktcap</span>
        </div>
        {CRYPTO_CONFIG.map((c, i) => {
          const prijs = converteer(prijzen[c.id] || c.startprijs, valuta);
          const vorige = vorigePrijzen[c.id] || 0;
          const pct = vorige > 0 ? (((prijzen[c.id] || c.startprijs) - vorige) / vorige * 100).toFixed(2) : (Math.random() * 6 - 3).toFixed(2);
          const positief = Number(pct) >= 0;
          return (
            <div key={c.id} onClick={() => setGeselecteerd(c)} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', alignItems: 'center' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `${c.kleur}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: c.kleur }}>{c.icoon}</div>
                <div><div style={{ fontWeight: 600 }}>{c.naam}</div><div style={{ fontSize: '11px', color: '#7d8590' }}>#{i + 1}</div></div>
              </div>
              <div style={{ textAlign: 'right' as const, fontWeight: 600 }}>{valuta.symbool} {prijs.toLocaleString()}</div>
              <div style={{ textAlign: 'right' as const }}><span style={{ color: positief ? '#3fb950' : '#f85149', fontWeight: 600, fontSize: '13px', background: positief ? 'rgba(63,185,80,0.1)' : 'rgba(248,81,73,0.1)', padding: '3px 8px', borderRadius: '6px' }}>{positief ? '+' : ''}{pct}%</span></div>
              <div style={{ textAlign: 'right' as const, color: '#7d8590', fontSize: '13px' }}>{valuta.symbool} {Math.round(prijs * (1000000 + i * 500000) / 1000000000)}B</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NieuwsPagina() {
  const [geselecteerd, setGeselecteerd] = useState<any>(null);
  if (geselecteerd) return <ArtikelDetail artikel={geselecteerd} onTerug={() => setGeselecteerd(null)} />;
  return (
    <div>
      <div className="hero"><h1>📰 Financieel <span>Nieuws</span></h1><p>Klik op een artikel om het volledig te lezen</p></div>
      {NIEUWS.map((a, i) => <NieuwsKaart key={i} artikel={a} onClick={setGeselecteerd} />)}
    </div>
  );
}

function LeerModulesPagina() {
  const [geselecteerd, setGeselecteerd] = useState<any>(null);
  const [voltooid, setVoltooid] = useState<number[]>(() => {
    const op = localStorage.getItem('voltooidModules');
    return op ? JSON.parse(op) : [];
  });

  function markeerVoltooid(id: number) {
    const nieuw = [...voltooid, id];
    setVoltooid(nieuw);
    localStorage.setItem('voltooidModules', JSON.stringify(nieuw));
    setGeselecteerd(null);
  }

  if (geselecteerd) {
    return (
      <div className="artikel-container" style={{ maxWidth: '800px' }}>
        <button className="terug-btn" onClick={() => setGeselecteerd(null)}>← Terug naar modules</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <span style={{ fontSize: '32px' }}>{geselecteerd.icoon}</span>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: geselecteerd.kleur, textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '4px' }}>{geselecteerd.niveau} · {geselecteerd.duur}</div>
            <h1 style={{ fontSize: '24px', fontWeight: 700 }}>{geselecteerd.titel}</h1>
          </div>
        </div>
        <div className="artikel-inhoud" style={{ whiteSpace: 'pre-line' }}>{geselecteerd.inhoud}</div>
        {!voltooid.includes(geselecteerd.id) && (
          <button className="refresh-btn" style={{ marginTop: '24px' }} onClick={() => markeerVoltooid(geselecteerd.id)}>✅ Module voltooid</button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="hero"><h1>🎓 <span>Leer Traden</span></h1><p>Van beginner tot gevorderde trader</p></div>
      <div className="cards-grid" style={{ marginBottom: '32px' }}>
        {[{ label: 'Modules', waarde: `${MODULES.length}`, kleur: '#f0b429' }, { label: 'Voltooid', waarde: `${voltooid.length}/${MODULES.length}`, kleur: '#3fb950' }, { label: 'Voortgang', waarde: `${Math.round(voltooid.length / MODULES.length * 100)}%`, kleur: '#58a6ff' }].map(s => (
          <div key={s.label} className="stat-kaart"><div className="stat-label">{s.label}</div><div className="stat-waarde" style={{ color: s.kleur }}>{s.waarde}</div></div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
        {MODULES.map(m => (
          <div key={m.id} className="competitie-kaart" onClick={() => setGeselecteerd(m)} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${m.kleur}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>{m.icoon}</div>
                <div><div style={{ fontWeight: 700, fontSize: '15px' }}>{m.titel}</div><div style={{ fontSize: '12px', color: '#7d8590' }}>{m.duur} · {m.niveau}</div></div>
              </div>
              <span style={{ background: voltooid.includes(m.id) ? 'rgba(63,185,80,0.15)' : `${m.kleur}15`, color: voltooid.includes(m.id) ? '#3fb950' : m.kleur, fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', border: `1px solid ${voltooid.includes(m.id) ? 'rgba(63,185,80,0.3)' : m.kleur + '30'}`, whiteSpace: 'nowrap' as const }}>
                {voltooid.includes(m.id) ? '✅ Voltooid' : m.niveau}
              </span>
            </div>
            <div style={{ fontSize: '13px', color: '#7d8590', lineHeight: 1.5 }}>{m.inhoud.substring(0, 100)}...</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PortfolioPagina({ prijzen, valuta, portfolio, setPortfolio, virtueelGeld, setVirtueelGeld }: any) {
  const [boodschap, setBoodschap] = useState('');
  const alleItems = [...METALEN_CONFIG, ...BEURZEN_CONFIG, ...CRYPTO_CONFIG];

  function toonBoodschap(msg: string) { setBoodschap(msg); setTimeout(() => setBoodschap(''), 3000); }

  function koop(item: any) {
    const prijs = converteer(prijzen[item.id] || item.startprijs, valuta);
    if (virtueelGeld < prijs) { toonBoodschap('❌ Niet genoeg virtueel geld!'); return; }
    setVirtueelGeld((prev: number) => Math.round((prev - prijs) * 100) / 100);
    setPortfolio((prev: any[]) => {
      const b = prev.find(p => p.id === item.id);
      if (b) return prev.map(p => p.id === item.id ? { ...p, aantal: p.aantal + 1, aankoopprijs: prijs } : p);
      return [...prev, { ...item, aantal: 1, aankoopprijs: prijs }];
    });
    toonBoodschap(`✅ ${item.naam} gekocht voor ${valuta.symbool} ${prijs}!`);
  }

  function verkoop(item: any) {
    const prijs = converteer(prijzen[item.id] || item.startprijs, valuta);
    setVirtueelGeld((prev: number) => Math.round((prev + prijs) * 100) / 100);
    setPortfolio((prev: any[]) => {
      const b = prev.find(p => p.id === item.id);
      if (!b) return prev;
      if (b.aantal <= 1) return prev.filter(p => p.id !== item.id);
      return prev.map(p => p.id === item.id ? { ...p, aantal: p.aantal - 1 } : p);
    });
    toonBoodschap(`💰 ${item.naam} verkocht voor ${valuta.symbool} ${prijs}!`);
  }

  const portfolioWaarde = portfolio.reduce((sum: number, p: any) => sum + converteer(prijzen[p.id] || p.startprijs, valuta) * p.aantal, 0);
  const totaal = virtueelGeld + portfolioWaarde;
  const totalePnL = totaal - 10000;

  return (
    <div>
      <div className="hero"><h1>📊 Mijn <span>Portfolio</span></h1><p>Leer traden met virtueel geld!</p></div>
      {boodschap && <div className="boodschap">{boodschap}</div>}
      <div className="cards-grid" style={{ marginBottom: '32px' }}>
        {[{ label: 'Virtueel geld', waarde: `${valuta.symbool} ${virtueelGeld.toLocaleString()}`, kleur: '#3fb950' }, { label: 'Portfolio waarde', waarde: `${valuta.symbool} ${Math.round(portfolioWaarde).toLocaleString()}`, kleur: '#f0b429' }, { label: 'Totale P&L', waarde: `${totalePnL >= 0 ? '+' : ''}${valuta.symbool} ${Math.round(totalePnL).toLocaleString()}`, kleur: totalePnL >= 0 ? '#3fb950' : '#f85149' }].map(s => (
          <div key={s.label} className="stat-kaart"><div className="stat-label">{s.label}</div><div className="stat-waarde" style={{ color: s.kleur }}>{s.waarde}</div></div>
        ))}
      </div>
      {portfolio.length > 0 && (
        <>
          <div className="section-title">Mijn posities</div>
          {portfolio.map((p: any) => {
            const huidig = converteer(prijzen[p.id] || p.startprijs, valuta);
            const winst = Math.round((huidig - p.aankoopprijs) * p.aantal * 100) / 100;
            return (
              <div key={p.id} className="positie-kaart">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '22px' }}>{p.icoon}</span>
                  <div><div style={{ color: p.kleur, fontWeight: 700 }}>{p.naam}</div><div style={{ color: '#7d8590', fontSize: '12px' }}>{p.aantal}x @ {valuta.symbool} {p.aankoopprijs}</div></div>
                </div>
                <div style={{ textAlign: 'right' as const }}>
                  <div style={{ fontWeight: 700 }}>{valuta.symbool} {Math.round(huidig * p.aantal).toLocaleString()}</div>
                  <div style={{ color: winst >= 0 ? '#3fb950' : '#f85149', fontSize: '13px', fontWeight: 600 }}>{winst >= 0 ? '+' : ''}{valuta.symbool} {winst}</div>
                </div>
                <button className="verkoop-btn" onClick={() => verkoop(p)}>Verkoop</button>
              </div>
            );
          })}
        </>
      )}
      <div className="section-title" style={{ marginTop: '32px' }}>Koop een positie</div>
      <div className="cards-grid">
        {alleItems.map(item => (
          <div key={item.id} className="koop-kaart">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '20px' }}>{item.icoon}</span>
              <span style={{ color: item.kleur, fontWeight: 700, fontSize: '14px' }}>{item.naam}</span>
            </div>
            <div style={{ color: '#e6edf3', fontSize: '20px', fontWeight: 700, marginBottom: '14px' }}>{valuta.symbool} {converteer(prijzen[item.id] || item.startprijs, valuta).toLocaleString()}</div>
            <button className="koop-btn" onClick={() => koop(item)} style={{ background: `linear-gradient(135deg, ${item.kleur}, ${item.kleur}aa)`, color: '#000' }}>Koop 1 eenheid</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompetitiePagina() {
  const [toonNieuw, setToonNieuw] = useState(false);
  const [nieuwNaam, setNieuwNaam] = useState('');
  const [competities, setCompetities] = useState([
    { id: 1, naam: 'Liga van Vrienden', deelnemers: ['Jij', 'Thomas', 'Lena', 'Sander'], startdatum: '1 mei', einddatum: '31 mei', actief: true, scores: [{ naam: 'Lena', waarde: 11240, winst: 12.4 }, { naam: 'Jij', waarde: 10820, winst: 8.2 }, { naam: 'Thomas', waarde: 10340, winst: 3.4 }, { naam: 'Sander', waarde: 9820, winst: -1.8 }] },
  ]);

  function maakCompetitie() {
    if (!nieuwNaam.trim()) return;
    setCompetities(prev => [...prev, { id: Date.now(), naam: nieuwNaam, deelnemers: ['Jij'], startdatum: new Date().toLocaleDateString('nl-BE'), einddatum: '1 maand', actief: true, scores: [{ naam: 'Jij', waarde: 10000, winst: 0 }] }]);
    setNieuwNaam(''); setToonNieuw(false);
  }

  const rankKleur = (i: number) => i === 0 ? '#f0b429' : i === 1 ? '#a8b2bf' : i === 2 ? '#e07b54' : '#7d8590';
  const rankEmoji = (i: number) => i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`;

  return (
    <div>
      <div className="hero"><h1>🏆 <span>Competitie</span></h1><p>Compete met vrienden!</p></div>
      <button className="refresh-btn" onClick={() => setToonNieuw(!toonNieuw)} style={{ marginBottom: '20px' }}>+ Nieuwe competitie</button>
      {toonNieuw && (
        <div className="competitie-kaart" style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>🆕 Nieuwe competitie</div>
          <input value={nieuwNaam} onChange={e => setNieuwNaam(e.target.value)} placeholder="Naam..." style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 16px', color: '#e6edf3', fontSize: '14px', marginBottom: '12px', fontFamily: 'Inter, sans-serif', outline: 'none' }} />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="refresh-btn" onClick={maakCompetitie}>Aanmaken</button>
            <button className="terug-btn" onClick={() => setToonNieuw(false)}>Annuleer</button>
          </div>
        </div>
      )}
      {competities.map(comp => (
        <div key={comp.id} className="competitie-kaart">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap' as const, gap: '8px' }}>
            <div><div style={{ fontSize: '17px', fontWeight: 700, marginBottom: '4px' }}>{comp.naam}</div><div style={{ fontSize: '12px', color: '#7d8590' }}>{comp.startdatum} → {comp.einddatum} · {comp.deelnemers.length} deelnemers</div></div>
            <span style={{ background: 'rgba(63,185,80,0.15)', color: '#3fb950', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(63,185,80,0.3)' }}>ACTIEF</span>
          </div>
          <div className="section-title">Ranglijst</div>
          {[...comp.scores].sort((a, b) => b.waarde - a.waarde).map((s, i) => (
            <div key={s.naam} className="leaderboard-item">
              <div className="rank-badge" style={{ background: `${rankKleur(i)}20`, color: rankKleur(i) }}>{rankEmoji(i)}</div>
              <div style={{ flex: 1 }}><div style={{ fontWeight: s.naam === 'Jij' ? 700 : 500, color: s.naam === 'Jij' ? '#f0b429' : '#e6edf3' }}>{s.naam} {s.naam === 'Jij' && '👈'}</div></div>
              <div style={{ textAlign: 'right' as const }}><div style={{ fontWeight: 700 }}>€ {s.waarde.toLocaleString()}</div><div style={{ fontSize: '12px', fontWeight: 600, color: s.winst >= 0 ? '#3fb950' : '#f85149' }}>{s.winst >= 0 ? '+' : ''}{s.winst}%</div></div>
            </div>
          ))}
          <div style={{ marginTop: '20px', padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', fontSize: '13px', color: '#7d8590' }}>
            📨 Nodig vrienden uit: <span style={{ color: '#58a6ff' }}>tradelearn-platform.netlify.app/join/{comp.id}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminPagina() {
  const [actieveTab, setActieveTab] = useState('overzicht');
  return (
    <div>
      <div className="hero"><h1>⚙️ <span>Admin Dashboard</span></h1><p>Beheer je platform</p></div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '4px', width: 'fit-content', flexWrap: 'wrap' as const }}>
        {[['overzicht', '📊 Overzicht'], ['gebruikers', '👥 Gebruikers'], ['inkomsten', '💰 Inkomsten'], ['instellingen', '⚙️ Instellingen']].map(([tab, label]) => (
          <button key={tab} onClick={() => setActieveTab(tab)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: actieveTab === tab ? 'rgba(255,255,255,0.1)' : 'transparent', color: actieveTab === tab ? '#e6edf3' : '#7d8590', fontSize: '13px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>{label}</button>
        ))}
      </div>
      {actieveTab === 'overzicht' && (
        <div>
          <div className="cards-grid" style={{ marginBottom: '28px' }}>
            {[{ label: 'Totale gebruikers', waarde: '1.247', groei: '+12%', kleur: '#3fb950' }, { label: 'Premium gebruikers', waarde: '89', groei: '+5%', kleur: '#f0b429' }, { label: 'Actieve competities', waarde: '34', groei: '+8%', kleur: '#58a6ff' }, { label: 'Maandelijkse omzet', waarde: '€ 445', groei: '+5%', kleur: '#9945ff' }].map(s => (
              <div key={s.label} className="stat-kaart"><div className="stat-label">{s.label}</div><div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}><div className="stat-waarde" style={{ color: s.kleur }}>{s.waarde}</div><div style={{ color: '#3fb950', fontSize: '12px', fontWeight: 600, marginBottom: '3px' }}>{s.groei}</div></div></div>
            ))}
          </div>
          <div className="section-title">Recente activiteit</div>
          {[{ tekst: 'Nieuwe premium gebruiker: Thomas V.', tijd: '2 min geleden', kleur: '#f0b429' }, { tekst: 'Nieuwe competitie: "Vrienden Liga"', tijd: '15 min geleden', kleur: '#58a6ff' }, { tekst: 'Nieuwe gratis gebruiker: Julie P.', tijd: '1 uur geleden', kleur: '#3fb950' }, { tekst: 'Premium betaling: € 4,99', tijd: '2 uur geleden', kleur: '#9945ff' }].map((a, i) => (
            <div key={i} className="nieuws-kaart" style={{ cursor: 'default' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: a.kleur }}></div>
                  <span style={{ fontSize: '14px' }}>{a.tekst}</span>
                </div>
                <span style={{ color: '#7d8590', fontSize: '12px', whiteSpace: 'nowrap' as const, marginLeft: '16px' }}>{a.tijd}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {actieveTab === 'gebruikers' && (
        <div>
          <div className="section-title">Alle gebruikers</div>
          <div style={{ background: 'rgba(22,27,34,0.6)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '11px', fontWeight: 700, color: '#7d8590', textTransform: 'uppercase' as const }}>
              <span>Naam</span><span>Email</span><span>Plan</span><span>Lid sinds</span><span>Status</span>
            </div>
            {[{ naam: 'Thomas V.', email: 'thomas@gmail.com', plan: 'Premium', datum: '1 mei', actief: true }, { naam: 'Lena M.', email: 'lena@hotmail.com', plan: 'Premium', datum: '3 mei', actief: true }, { naam: 'Sander K.', email: 'sander@gmail.com', plan: 'Gratis', datum: '5 mei', actief: true }, { naam: 'Julie P.', email: 'julie@outlook.com', plan: 'Gratis', datum: '8 mei', actief: false }].map((g, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'center' }}>
                <span style={{ fontWeight: 600 }}>{g.naam}</span>
                <span style={{ color: '#7d8590', fontSize: '13px' }}>{g.email}</span>
                <span><span style={{ background: g.plan === 'Premium' ? 'rgba(240,180,41,0.15)' : 'rgba(255,255,255,0.06)', color: g.plan === 'Premium' ? '#f0b429' : '#7d8590', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>{g.plan}</span></span>
                <span style={{ color: '#7d8590', fontSize: '13px' }}>{g.datum}</span>
                <span><span style={{ background: g.actief ? 'rgba(63,185,80,0.15)' : 'rgba(248,81,73,0.15)', color: g.actief ? '#3fb950' : '#f85149', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>{g.actief ? 'Actief' : 'Inactief'}</span></span>
              </div>
            ))}
          </div>
        </div>
      )}
      {actieveTab === 'inkomsten' && (
        <div>
          <div className="cards-grid" style={{ marginBottom: '28px' }}>
            {[{ label: 'Deze maand', waarde: '€ 445', kleur: '#3fb950' }, { label: 'Vorige maand', waarde: '€ 389', kleur: '#f0b429' }, { label: 'Totaal ooit', waarde: '€ 1.204', kleur: '#58a6ff' }].map(s => (
              <div key={s.label} className="stat-kaart"><div className="stat-label">{s.label}</div><div className="stat-waarde" style={{ color: s.kleur }}>{s.waarde}</div></div>
            ))}
          </div>
        </div>
      )}
      {actieveTab === 'instellingen' && (
        <div>
          <div className="section-title">Platform instellingen</div>
          {[{ label: 'Gratis: max virtueel geld', waarde: '€ 10.000' }, { label: 'Premium: max virtueel geld', waarde: '€ 100.000' }, { label: 'Premium per maand', waarde: '€ 4,99' }, { label: 'Premium per jaar', waarde: '€ 39,00' }].map((s, i) => (
            <div key={i} className="positie-kaart"><span style={{ color: '#7d8590' }}>{s.label}</span><span style={{ fontWeight: 600, color: '#f0b429' }}>{s.waarde}</span></div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const alleItems = [...METALEN_CONFIG, ...BEURZEN_CONFIG, ...CRYPTO_CONFIG];
  const initPrijzen = Object.fromEntries(alleItems.map(m => [m.id, m.startprijs]));

  const [prijzen, setPrijzen] = useState(initPrijzen);
  const [vorigePrijzen, setVorigePrijzen] = useState(Object.fromEntries(alleItems.map(m => [m.id, 0])));
  const [lastUpdate, setLastUpdate] = useState('');
  const [valuta, setValuta] = useState(VALUTA[0]);
  const [historiek, setHistoriek] = useState(() => Object.fromEntries(alleItems.map(m => [m.id, genereerHistoriek(m.startprijs)])));

  // Portfolio state in hoofdApp — wordt bewaard bij navigeren
  const [portfolio, setPortfolio] = useState<any[]>(() => {
    try {
      const op = localStorage.getItem('tl_portfolio');
      return op ? JSON.parse(op) : [];
    } catch { return []; }
  });
  const [virtueelGeld, setVirtueelGeld] = useState<number>(() => {
    try {
      const op = localStorage.getItem('tl_geld');
      return op ? parseFloat(op) : 10000;
    } catch { return 10000; }
  });

  // Sla portfolio op bij elke wijziging
  useEffect(() => {
    localStorage.setItem('tl_portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  useEffect(() => {
    localStorage.setItem('tl_geld', virtueelGeld.toString());
  }, [virtueelGeld]);

  // Admin check — alleen jouw email
  const isAdmin = true; // Later vervangen door Firebase auth check

  function verversPrijzen() {
    setVorigePrijzen({ ...prijzen });
    setPrijzen(prev => {
      const nieuw = { ...prev };
      alleItems.forEach(m => { nieuw[m.id] = Math.round(prev[m.id] * (1 + (Math.random() - 0.5) * 0.02) * 100) / 100; });
      return nieuw;
    });
    setHistoriek(prev => {
      const nieuw = { ...prev };
      alleItems.forEach(m => {
        const lijst = [...prev[m.id]];
        lijst.shift();
        lijst.push({ tijd: 'nu', prijs: Math.round(prijzen[m.id] * (1 + (Math.random() - 0.5) * 0.01) * 100) / 100 });
        nieuw[m.id] = lijst;
      });
      return nieuw;
    });
    setLastUpdate(new Date().toLocaleTimeString('nl-BE'));
  }

  useEffect(() => {
    verversPrijzen();
    const interval = setInterval(verversPrijzen, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <div className="app-bg">
        <Navbar valuta={valuta} setValuta={setValuta} isAdmin={isAdmin} />
        <div className="page">
          <Routes>
            <Route path="/" element={<Dashboard prijzen={prijzen} vorigePrijzen={vorigePrijzen} lastUpdate={lastUpdate} verversPrijzen={verversPrijzen} valuta={valuta} historiek={historiek} />} />
            <Route path="/metalen" element={<MetalenPagina prijzen={prijzen} vorigePrijzen={vorigePrijzen} valuta={valuta} historiek={historiek} />} />
            <Route path="/beurzen" element={<BeurzenPagina prijzen={prijzen} vorigePrijzen={vorigePrijzen} valuta={valuta} historiek={historiek} />} />
            <Route path="/crypto" element={<CryptoPagina prijzen={prijzen} vorigePrijzen={vorigePrijzen} valuta={valuta} historiek={historiek} />} />
            <Route path="/nieuws" element={<NieuwsPagina />} />
            <Route path="/leren" element={<LeerModulesPagina />} />
            <Route path="/portfolio" element={<PortfolioPagina prijzen={prijzen} valuta={valuta} portfolio={portfolio} setPortfolio={setPortfolio} virtueelGeld={virtueelGeld} setVirtueelGeld={setVirtueelGeld} />} />
            <Route path="/competitie" element={<CompetitiePagina />} />
            {isAdmin && <Route path="/admin" element={<AdminPagina />} />}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
