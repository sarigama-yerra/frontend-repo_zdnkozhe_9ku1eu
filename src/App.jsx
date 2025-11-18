import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from './components/api'

const PILL = 'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 text-slate-700 shadow-sm hover:bg-white transition'

function Dashboard() {
  const [name, setName] = useState('Teman')
  const [range, setRange] = useState('week')
  const [moods, setMoods] = useState([])
  const [mood, setMood] = useState('😊')
  const [anx, setAnx] = useState(5)
  const [triggers, setTriggers] = useState([])
  const [note, setNote] = useState('')
  const navigate = useNavigate()

  const chips = ['tugas','sosial','finansial','tidur','kesehatan','cuaca','lainnya']

  const load = async () => {
    try {
      const data = await api(`/moods?range=${range}`)
      setMoods(data)
    } catch {}
  }
  useEffect(()=>{ load() },[range])

  const save = async () => {
    await api('/moods', { method:'POST', body: { mood_emoji: mood, anxiety_score: anx, triggers, note } })
    setNote(''); setTriggers([]); await load()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Halo, {name} 👋</h1>
        <p className="text-slate-600">Apa kabarmu hari ini? Tidak apa-apa merasa cemas, kita pelan-pelan ya.</p>
      </header>

      <section className="grid md:grid-cols-2 gap-4">
        <div className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow">
          <h3 className="font-semibold text-slate-800 mb-2">Mood & Kecemasan</h3>
          <div className="flex items-center gap-3 mb-3">
            {['😊','😐','😟','😣'].map(e => (
              <button key={e} className={`text-3xl p-2 rounded-xl ${mood===e?'bg-sky-100 ring-2 ring-sky-300':''}`} onClick={()=>setMood(e)} aria-label={`mood ${e}`}>{e}</button>
            ))}
          </div>
          <label className="block text-sm text-slate-600">Tingkat kecemasan: {anx}</label>
          <input type="range" min="1" max="10" value={anx} onChange={e=>setAnx(parseInt(e.target.value))} className="w-full" />
          <div className="flex flex-wrap gap-2 my-3">
            {chips.map(ch => (
              <button key={ch} onClick={()=>setTriggers(t=> t.includes(ch)? t.filter(x=>x!==ch):[...t,ch])} className={`px-3 py-1 rounded-full border ${triggers.includes(ch)?'bg-sky-100 border-sky-300 text-sky-700':'border-slate-200 text-slate-600'}`}>{ch}</button>
            ))}
          </div>
          <input value={note} onChange={e=>setNote(e.target.value)} placeholder="Catatan singkat" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-300" />
          <div className="flex gap-2 mt-3">
            <button onClick={save} className="px-4 py-2 rounded-xl bg-sky-500 text-white hover:bg-sky-600">Simpan</button>
            <button onClick={()=>navigate('/assessment')} className={PILL}>Cek Kecemasan</button>
            <button onClick={()=>navigate('/breath')} className={PILL}>Latihan Tenang</button>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-slate-800">Riwayat</h3>
            <select value={range} onChange={e=>setRange(e.target.value)} className="px-3 py-1 rounded-lg border border-slate-200">
              <option value="week">Mingguan</option>
              <option value="month">Bulanan</option>
            </select>
          </div>
          <div className="space-y-2 max-h-64 overflow-auto pr-1">
            {moods.length===0 && <p className="text-slate-500">Belum ada data. Yuk catat satu.</p>}
            {moods.map(m => (
              <div key={m._id} className="flex items-center justify-between bg-white rounded-xl border border-slate-100 p-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{m.mood_emoji}</span>
                  <div>
                    <div className="text-slate-800 font-medium">Kecemasan {m.anxiety_score}/10</div>
                    <div className="text-slate-500 text-sm">{(m.triggers||[]).join(', ')}</div>
                  </div>
                </div>
                <div className="text-slate-400 text-xs">{(m.date||'').slice(0,10)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4 mt-4">
        <Shortcut title="Jurnal Pikiran" desc="Catat dan susun ulang pikiran" to="/journal"/>
        <Shortcut title="Edukasi" desc="Artikel singkat dan ringan" to="/edu"/>
        <Shortcut title="Kontak Darurat" desc="Hubungi orang kepercayaan" to="/safety"/>
      </section>
    </div>
  )
}

function Shortcut({ title, desc, to }){
  return (
    <Link to={to} className="block bg-white/80 hover:bg-white transition backdrop-blur rounded-2xl p-4 shadow">
      <div className="font-semibold text-slate-800">{title}</div>
      <div className="text-slate-600 text-sm">{desc}</div>
    </Link>
  )
}

function Assessment(){
  const [answers, setAnswers] = useState([0,0,0,0,0,0,0])
  const [result, setResult] = useState(null)
  const submit = async () => {
    const res = await api('/assessments/gad7', { method:'POST', body: { answers } })
    setResult(res)
  }
  return (
    <div className="max-w-xl mx-auto bg-white/80 backdrop-blur rounded-2xl p-5">
      <h3 className="text-xl font-semibold text-slate-800 mb-3">Cek Kecemasan (GAD-7 Sederhana)</h3>
      {answers.map((v,i)=> (
        <div key={i} className="mb-2">
          <div className="text-slate-700 mb-1">Pertanyaan {i+1}</div>
          <input type="range" min="0" max="3" value={v} onChange={e=>setAnswers(a=>{const b=[...a]; b[i]=parseInt(e.target.value); return b})} className="w-full"/>
          <div className="text-slate-500 text-sm">Skor: {v}</div>
        </div>
      ))}
      <button onClick={submit} className="px-4 py-2 rounded-xl bg-sky-500 text-white hover:bg-sky-600">Lihat Hasil</button>
      {result && (
        <div className="mt-3 p-3 rounded-xl bg-sky-50 text-slate-700">
          <div>Skor: <b>{result.score}</b> — Kategori: <b>{result.category}</b></div>
          <div className="text-sm mt-1">{result.recommendation}</div>
        </div>
      )}
    </div>
  )
}

function Breath(){
  const [phase, setPhase] = useState('ready')
  const [dur, setDur] = useState(60)
  const [time, setTime] = useState(0)

  useEffect(()=>{
    if(phase==='run'){
      const start = Date.now()
      const t = setInterval(()=>{
        const s = Math.floor((Date.now()-start)/1000)
        setTime(s)
        if(s>=dur){ clearInterval(t); setPhase('done') }
      }, 200)
      return ()=>clearInterval(t)
    }
  },[phase, dur])

  return (
    <div className="max-w-xl mx-auto bg-white/80 backdrop-blur rounded-2xl p-6 text-center">
      <h3 className="text-xl font-semibold text-slate-800 mb-2">Latihan Napas</h3>
      <p className="text-slate-600 mb-4">Tarik napas – Tahan – Hembuskan (4–4–6). Gerakkan perlahan, tidak perlu sempurna.</p>
      <div className="flex gap-2 justify-center mb-4">
        {[60,180,300].map(s=> (
          <button key={s} className={`px-3 py-1 rounded-full border ${dur===s?'bg-sky-100 border-sky-300 text-sky-700':'border-slate-200 text-slate-600'}`} onClick={()=>setDur(s)}>{s/60} mnt</button>
        ))}
      </div>
      <div className="h-56 flex items-center justify-center">
        <div className={`w-40 h-40 rounded-full bg-sky-300/40 transition-all duration-1000`} style={{ transform: phase==='run' && time%6<3? 'scale(1.15)':'scale(0.9)' }} />
      </div>
      <div className="text-slate-600 mb-3">{phase==='run'? `Waktu: ${time}s / ${dur}s` : phase==='done'? 'Selesai. Terima kasih sudah bernapas pelan-pelan.' : 'Siap ketika kamu siap.'}</div>
      {phase!=='run' ? (
        <button onClick={()=>{ setTime(0); setPhase('run') }} className="px-4 py-2 rounded-xl bg-sky-500 text-white hover:bg-sky-600">Mulai</button>
      ) : (
        <button onClick={()=>setPhase('done')} className="px-4 py-2 rounded-xl bg-slate-500 text-white hover:bg-slate-600">Selesai</button>
      )}
    </div>
  )
}

function Journal(){
  const [form, setForm] = useState({ situation:'', automatic_thought:'', emotion:'', evidence_for:'', evidence_against:'', alternative_thought:'' })
  const [saved, setSaved] = useState(false)
  const save = async () => {
    await api('/thoughts', { method:'POST', body: form })
    setSaved(true); setForm({ situation:'', automatic_thought:'', emotion:'', evidence_for:'', evidence_against:'', alternative_thought:'' })
  }
  return (
    <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur rounded-2xl p-5">
      <h3 className="text-xl font-semibold text-slate-800 mb-3">Jurnal Pikiran (CBT)</h3>
      {Object.keys(form).map(k => (
        <div key={k} className="mb-3">
          <label className="block text-sm text-slate-600 mb-1">{k.replaceAll('_',' ')}</label>
          <textarea value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-300" rows={k==='evidence_for'||k==='evidence_against'?3:2} />
        </div>
      ))}
      <button onClick={save} className="px-4 py-2 rounded-xl bg-sky-500 text-white hover:bg-sky-600">Simpan</button>
      {saved && <div className="mt-3 text-slate-600">Catatan tersimpan. Terima kasih sudah jujur pada diri sendiri.</div>}
    </div>
  )
}

function Edu(){
  const articles = [
    { slug:'anxiety-vs-stress', title:'Memahami Kecemasan vs. Stres', summary:'Perbedaan dan langkah kecil yang bisa kamu lakukan.', tags:['anxiety'], read_time_min:4 },
    { slug:'box-breathing', title:'Box Breathing 4-4-4-4', summary:'Teknik napas sederhana untuk menenangkan sistem saraf.', tags:['coping'], read_time_min:3 },
  ]
  return (
    <div className="max-w-3xl mx-auto">
      <h3 className="text-2xl font-semibold text-slate-800 mb-3">Edukasi</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {articles.map(a=> (
          <Link key={a.slug} to={`/articles/${a.slug}`} className="block bg-white/80 backdrop-blur rounded-2xl p-4 hover:bg-white transition">
            <div className="font-semibold text-slate-800">{a.title}</div>
            <div className="text-slate-600 text-sm">{a.summary}</div>
            <div className="text-slate-400 text-xs mt-1">{a.read_time_min} menit baca</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function Safety(){
  return (
    <div className="max-w-xl mx-auto bg-white/80 backdrop-blur rounded-2xl p-5">
      <h3 className="text-xl font-semibold text-slate-800 mb-2">Kontak Darurat</h3>
      <p className="text-slate-600 mb-3">Jika kamu butuh bantuan, kamu tidak sendirian. Hubungi orang kepercayaan atau layanan berikut.</p>
      <div className="space-y-2">
        <a href="tel:+621500454" className={PILL}>Hotline Kesehatan Jiwa 1500-454</a>
        <a href="https://contoh-konseling-kampus.id" target="_blank" className={PILL}>Layanan Konseling Kampus</a>
      </div>
    </div>
  )
}

function Layout({ children }){
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-slate-50 to-sky-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(14,165,233,0.15),transparent_40%),radial-gradient(circle_at_90%_20%,rgba(56,189,248,0.15),transparent_35%)]"/>
      <nav className="relative max-w-5xl mx-auto flex items-center justify-between p-4">
        <div className="text-sky-700 font-semibold text-lg">Tenang.in</div>
        <div className="flex items-center gap-2">
          <Link to="/breath" className={PILL}>Latihan</Link>
          <Link to="/assessment" className={PILL}>Cek Kecemasan</Link>
          <Link to="/edu" className={PILL}>Edukasi</Link>
        </div>
      </nav>
      <main className="relative p-4 md:p-6">{children}</main>
      <footer className="relative max-w-5xl mx-auto p-4 text-center text-slate-500 text-sm">Dengan empati • Bahasa lembut • Warna biru menenangkan</footer>
    </div>
  )
}

function Hero(){
  return (
    <div className="max-w-3xl mx-auto text-center mb-6">
      <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-3">Apa kabarmu hari ini?</h1>
      <p className="text-slate-600">Tidak apa-apa merasa cemas. Yuk kita lihat apa yang bisa kita lakukan—pelan-pelan, bersama.</p>
    </div>
  )
}

export default function App(){
  return (
    <Layout>
      <Hero />
      <Dashboard />
    </Layout>
  )
}
