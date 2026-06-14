import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import api from './services/api';
import './style.css';

function Navbar({ user, setUser }) {
  const logout = () => { localStorage.clear(); setUser(null); };
  return <nav><Link to="/">DevHire</Link><Link to="/jobs">Jobs</Link>{user?.role === 'company' && <Link to="/post-job">Post Job</Link>}<Link to="/dashboard">Dashboard</Link>{user ? <button onClick={logout}>Logout</button> : <Link to="/login">Login</Link>}</nav>;
}

function Home() { return <section className="hero"><h1>DevHire</h1><p>A full-stack job board with JWT authentication, role-based dashboards, job posting, and applications.</p><Link className="btn" to="/jobs">Browse Jobs</Link></section>; }

function Register({ setUser }) {
  const [form,setForm]=useState({name:'',email:'',password:'',role:'candidate',company_name:''});
  const submit=async(e)=>{e.preventDefault(); const {data}=await api.post('/auth/register',form); localStorage.setItem('token',data.access_token); localStorage.setItem('user',JSON.stringify(data.user)); setUser(data.user);};
  return <form onSubmit={submit} className="card"><h2>Create account</h2>{['name','email','password'].map(x=><input key={x} type={x==='password'?'password':'text'} placeholder={x} onChange={e=>setForm({...form,[x]:e.target.value})}/>) }<select onChange={e=>setForm({...form,role:e.target.value})}><option value="candidate">Candidate</option><option value="company">Company</option></select>{form.role==='company'&&<input placeholder="Company name" onChange={e=>setForm({...form,company_name:e.target.value})}/>}<button>Register</button><p><Link to="/login">Already have an account?</Link></p></form>;
}

function Login({ setUser }) {
  const [form,setForm]=useState({email:'',password:''});
  const submit=async(e)=>{e.preventDefault(); const {data}=await api.post('/auth/login',form); localStorage.setItem('token',data.access_token); localStorage.setItem('user',JSON.stringify(data.user)); setUser(data.user);};
  return <form onSubmit={submit} className="card"><h2>Login</h2><input placeholder="email" onChange={e=>setForm({...form,email:e.target.value})}/><input type="password" placeholder="password" onChange={e=>setForm({...form,password:e.target.value})}/><button>Login</button><p><Link to="/register">Create account</Link></p></form>;
}

function Jobs({ user }) {
  const [jobs,setJobs]=useState([]); const [search,setSearch]=useState(''); const [cover,setCover]=useState('');
  const load=async()=>{const {data}=await api.get('/jobs',{params:{search}}); setJobs(data);};
  useEffect(()=>{load();},[]);
  const apply=async(job_id)=>{await api.post('/applications',{job_id,cover_letter:cover}); alert('Application submitted');};
  return <main><h2>Jobs</h2><div className="search"><input placeholder="Search by title" onChange={e=>setSearch(e.target.value)}/><button onClick={load}>Search</button></div>{jobs.map(job=><article className="card" key={job.id}><h3>{job.title}</h3><p>{job.company_name} • {job.location} • {job.job_type}</p><p>{job.description}</p><small>{job.salary_range}</small>{user?.role==='candidate'&&<><textarea placeholder="Cover letter" onChange={e=>setCover(e.target.value)}></textarea><button onClick={()=>apply(job.id)}>Apply</button></>}</article>)}</main>;
}

function PostJob() {
  const [form,setForm]=useState({title:'',location:'',job_type:'Full-time',description:'',salary_range:''});
  const submit=async(e)=>{e.preventDefault(); await api.post('/jobs',form); alert('Job posted');};
  return <form onSubmit={submit} className="card"><h2>Post a job</h2>{['title','location','salary_range'].map(x=><input key={x} placeholder={x} onChange={e=>setForm({...form,[x]:e.target.value})}/>) }<select onChange={e=>setForm({...form,job_type:e.target.value})}><option>Full-time</option><option>Part-time</option><option>Internship</option><option>Remote</option></select><textarea placeholder="description" onChange={e=>setForm({...form,description:e.target.value})}></textarea><button>Create</button></form>;
}

function Dashboard({ user }) {
  const [apps,setApps]=useState([]); useEffect(()=>{api.get('/applications/mine').then(r=>setApps(r.data)).catch(()=>{});},[]);
  if(!user) return <Navigate to="/login" />;
  return <main><h2>{user.role === 'company' ? 'Company Dashboard' : 'Candidate Dashboard'}</h2>{apps.map(a=><article className="card" key={a.id}><b>Status: {a.status}</b><p>Job ID: {a.job_id}</p><p>{a.cover_letter}</p></article>)}</main>;
}

function App(){ const [user,setUser]=useState(JSON.parse(localStorage.getItem('user')||'null')); return <BrowserRouter><Navbar user={user} setUser={setUser}/><Routes><Route path="/" element={<Home/>}/><Route path="/register" element={<Register setUser={setUser}/>}/><Route path="/login" element={<Login setUser={setUser}/>}/><Route path="/jobs" element={<Jobs user={user}/>}/><Route path="/post-job" element={<PostJob/>}/><Route path="/dashboard" element={<Dashboard user={user}/>}/></Routes></BrowserRouter>;}
createRoot(document.getElementById('root')).render(<App/>);
