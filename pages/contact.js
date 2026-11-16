import {useRef,useState} from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {MANUAL_ENQUIRY_EMAIL} from '@/lib/manualEnquiry.js';
import {normalize,brief} from '@/lib/freight/enquiry.cjs';
import s from '@/styles/pages/professional-home.module.css';
import formStyles from '@/styles/pages/contact.module.css';
const inputs=[['name','Name',120],['company','Company',160],['email','Email',254],['phone','Phone (optional)',60],['collection','Collection location',200],['delivery','Delivery location',200],['ready','Preferred timing (optional)',100]];
const initial={mode:'Road',urgency:'Standard',dangerousGoods:'Unsure'};
export default function Contact({deliveryEnabled=false}){
 const [data,setData]=useState(initial),[status,setStatus]=useState(null),[busy,setBusy]=useState(false),[prepared,setPrepared]=useState('');
 const requestId=useRef(null),lock=useRef(false);
 const frozen=status?.state==='unconfirmed'||status?.state==='received';
 const submit=async event=>{
  event.preventDefault();if(lock.current)return;
  let values;try{values=normalize(data);}catch(error){setStatus({state:'invalid',message:error.message});return;}
  const text=brief(values);setPrepared(text);
  if(!deliveryEnabled){setStatus({state:'draft',message:'Your enquiry is not submitted until you send the prepared message from your email app.'});try{window.location.assign('mailto:'+MANUAL_ENQUIRY_EMAIL+'?subject='+encodeURIComponent('HaulSmart freight enquiry')+'&body='+encodeURIComponent(text));}catch{setStatus({state:'draft',message:'The email app could not open. Copy the details below into your email. Your enquiry has not been sent.'});}return;}
  lock.current=true;setBusy(true);requestId.current ||= crypto.randomUUID();
  try{
   const response=await fetch('/api/enquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...values,requestId:requestId.current}),signal:AbortSignal.timeout(15000)});
   const result=await response.json();
   if(response.ok&&result.state==='received'&&/^HAUL-[A-F0-9]{32}$/.test(result.reference))setStatus({state:'received',reference:result.reference,message:'Your freight enquiry has been stored. Operations will review it; this is not a confirmed quote, booking, invoice or payment. Please contact operations for urgent freight.'});
   else if([400,415,429].includes(response.status))setStatus({state:'invalid',message:response.status===429?'Too many attempts. Please wait ten minutes before retrying.':'Check the freight details and try again.'});
   else throw Error('Unconfirmed');
  }catch{setStatus({state:'unconfirmed',message:'Receipt could not be confirmed. Keep these details unchanged and retry to recover the same reference. A timed-out request may still have been stored. Contact operations before submitting a replacement.'});}
  finally{lock.current=false;setBusy(false);}
 };
 const reset=()=>{if(busy)return;if(status?.state==='unconfirmed'&&!window.confirm('This enquiry may already be stored. Clearing it prevents receipt recovery here. Contact operations before submitting a replacement. Clear anyway?'))return;requestId.current=null;setData(initial);setPrepared('');setStatus(null);};
 return <main className={s.site}><Head><title>Freight enquiry | HaulSmart</title><meta name="description" content="Share your collection, delivery, freight and contact details with HaulSmart operations."/><link rel="canonical" href="https://www.haulsmart-europe.com/contact/"/></Head><header className={s.header}><Link href="/" className={s.brand}>HAUL<span>SMART</span></Link><nav className={s.nav}><Link href="/contact">Freight enquiry</Link><Link href="/login">Existing customer login</Link></nav></header><section className={formStyles.layout}><div className={formStyles.intro}><h1>Tell us what needs moving.</h1><p>Collection, delivery, goods and timing details help our operations team review your freight requirement.</p><p>This enquiry does not create an automated booking, price, invoice or payment.</p>{!deliveryEnabled&&<p>Online storage is not yet enabled. Prepare an email below and send it from your email app for human review.</p>}</div><form className={formStyles.form} onSubmit={submit}><fieldset disabled={busy||frozen} style={{border:0,padding:0,margin:0}}><div className={formStyles.fieldGrid}>{inputs.map(([key,label,max])=><label key={key}>{label}<input name={key} value={data[key]||''} maxLength={max} required={['name','email','collection','delivery'].includes(key)} type={key==='email'?'email':key==='phone'?'tel':'text'} onChange={e=>{setData({...data,[key]:e.target.value});setPrepared('');}}/></label>)}</div><label>Goods and load details<textarea name="description" rows={5} maxLength={1000} required value={data.description||''} onChange={e=>{setData({...data,description:e.target.value});setPrepared('');}}/></label><label>Dangerous goods<select value={data.dangerousGoods} onChange={e=>setData({...data,dangerousGoods:e.target.value})}>{['Unsure','No','Yes'].map(value=><option key={value}>{value}</option>)}</select></label></fieldset><button disabled={busy||status?.state==='received'} type="submit">{busy?'Checking receipt…':status?.state==='unconfirmed'?'Retry same enquiry':deliveryEnabled?'Submit freight enquiry':'Prepare email enquiry'}</button><p role="status">{status?.message}{status?.reference&&<> Reference: <strong>{status.reference}</strong></>}</p>{prepared&&<label>Copyable enquiry details<textarea readOnly rows={12} value={prepared}/></label>}<p>If no draft opens, email <a href={'mailto:'+MANUAL_ENQUIRY_EMAIL}>{MANUAL_ENQUIRY_EMAIL}</a> directly with the same collection, delivery, goods and timing details. You must send the message yourself.</p><button type="button" disabled={busy} onClick={reset}>Start a new enquiry</button></form></section><footer className={s.footer}><Link href="/">HaulSmart</Link> · <Link href="/privacy">Privacy</Link> · <Link href="/enquiry-terms">Enquiry terms</Link> · <Link href="/operations/enquiries">Operations enquiries</Link></footer></main>;
}
export async function getServerSideProps({res}){const {configured}=require('../lib/server/enquiryCapture.cjs');res.setHeader('Cache-Control','private, no-store');return {props:{deliveryEnabled:configured(process.env)}};}
