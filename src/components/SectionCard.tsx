import type { CSSProperties } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { StorefrontSection } from '@/data/storefrontSections';
export default function SectionCard({section,ar,count,large=false}: {section:StorefrontSection;ar:boolean;count?:number;large?:boolean}) {
 const Arrow=ar?ArrowLeft:ArrowRight;
 return <Link to={`/shop?category=${section.slug}`} aria-label={`${ar?'تصفح':'Browse'} ${ar?section.ar:section.en}`} className={`section-frame section-frame--${section.motif} group ${large?'section-frame--large':''}`} style={{'--section-accent':section.accent} as CSSProperties}>
  <div className="section-frame__rail" aria-hidden="true"><span /><span /><span /></div>
  <div className="section-frame__art"><img src={section.image} alt={ar?section.ar:section.en} width={1672} height={941} loading="lazy" decoding="async" className="aspect-video w-full object-contain" /></div>
  <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5">
   <div><h2 className="font-black text-slate-950">{ar?section.ar:section.en}</h2><p className="mt-1 text-xs text-slate-500">{count?`${count} ${ar?'منتج':'products'}`:(ar?'شاهد محتويات القسم':'Explore this section')}</p></div>
   <span className="section-frame__browse inline-flex min-h-11 items-center gap-2 rounded-xl px-5 text-sm font-black text-white">{ar?'تصفح':'Browse'}<Arrow className="h-4 w-4" /></span>
  </div>
 </Link>;
}
