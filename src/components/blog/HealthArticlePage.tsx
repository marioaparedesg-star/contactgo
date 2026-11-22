import BlogArticle from '@/components/blog/BlogArticle'
import { getHealthArticle } from '@/lib/blog-salud'
export default function HealthArticlePage({ slug }: { slug: string }) {
 const article = getHealthArticle(slug)
 if (!article) return null
 return <BlogArticle meta={{...article, faq: article.faq, relatedSlugs: article.relatedSlugs}}>
  <p className="text-lg leading-8 text-gray-700">{article.intro}</p>
  <div className="my-6 rounded-xl border-l-4 border-[#01b2b7] bg-[#f0fbfb] p-4 text-sm text-gray-700"><strong>Importante:</strong> Este contenido es educativo y no sustituye una evaluación médica. Ante dolor ocular, ojo rojo intenso, fotofobia, secreción o visión borrosa, retira los lentes y busca atención profesional inmediata.</div>
  {article.sections.map(section => <section key={section.h} className="mt-8"><h2>{section.h}</h2><p>{section.p1}</p><p>{section.p2}</p></section>)}
  <section className="mt-10 rounded-2xl border border-slate-200 p-5"><h2>Fuentes médicas y de seguridad</h2><p>Contenido contrastado con materiales públicos de organismos sanitarios y profesionales. Consulta las fuentes originales para ampliar las recomendaciones.</p><ul>{article.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a></li>)}</ul></section>
  <p className="mt-8 text-sm text-gray-500">Contenido informativo de ContactGo. No constituye diagnóstico ni se presenta como revisión por un oftalmólogo. La adaptación y el tratamiento deben ser individualizados por un profesional de salud visual.</p>
 </BlogArticle>
}
