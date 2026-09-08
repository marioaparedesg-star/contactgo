export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'emergency-contact-lenses-dominican-republic-forgot-prescription',
  title: 'Forgot Your Contacts or Prescription in the Dominican Republic? Here\'s What To Do',
  h1: 'Forgot your contact lenses or prescription while traveling? Here\'s the fix',
  description: 'Left your contacts at home, or don\'t remember your exact prescription? Here are your real options for getting sorted out during your trip to the DR.',
  publishedAt: '2026-09-08',
  readMinutes: 6,
  category: 'Para turistas',
  faq: [
    { q: 'What if I don\'t remember my prescription at all?', a: 'Check your phone for old messages or emails from your eye doctor, check an old contact lens box if you packed one by mistake (the prescription is often printed on it), or call your eye doctor\'s office back home — most can look it up and send it same-day.' },
    { q: 'Can I get an eye exam while visiting the Dominican Republic?', a: 'Yes, private ophthalmology clinics exist in major cities and tourist areas, though this typically takes more time and costs more than simply retrieving your existing prescription from home.' },
    { q: 'Is it safe to wear my old, expired contacts if that\'s all I have?', a: 'Contact lenses themselves don\'t have a strict "use-by" once opened in the way food does, but never use lenses that have been sitting dry, damaged, or improperly stored — when in doubt, it\'s safer to get a fresh pair.' },
  ],
  relatedSlugs: [
    'contact-lenses-dominican-republic-tourist-guide',
    'como-leer-receta-optica-rd',
    'examen-visual-antes-de-comprar-lentes-contacto-rd',
    'lista-empacar-lentes-contacto-viaje-republica-dominicana',
  ],
}

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `https://www.contactgo.net/blog/${meta.slug}` },
  openGraph: { title: meta.h1, description: meta.description, url: `https://www.contactgo.net/blog/${meta.slug}`, type: 'article', locale: 'es_DO', siteName: 'ContactGo' },
  keywords: 'forgot contacts dominican republic, forgot contact lens prescription vacation, emergency contact lenses DR, lost glasses punta cana',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>You’re unpacking at your hotel and realize you left your contacts — or worse, both your contacts and your backup glasses — at home. Or maybe you know you need lenses but genuinely can’t remember your exact prescription numbers. Either way, this is fixable, and it happens to travelers more often than you’d think.</p>

      <h2>Step 1: Try to recover your prescription first</h2>
      <p>Before assuming you need a whole new eye exam, check these places — most people find their prescription faster than expected:</p>
      <ul>
        <li><strong>Email</strong> — search your inbox for your eye doctor’s office name, or “prescription,” or the brand of lens you use</li>
        <li><strong>An old lens box</strong> — if you packed even one old box by mistake, the prescription is often printed directly on it</li>
        <li><strong>Call your eye doctor’s office</strong> — most can pull up your file and text or email you the numbers same-day, even internationally</li>
        <li><strong>A patient portal app</strong> — many eye care practices now use apps where your prescription is stored and viewable anytime</li>
      </ul>

      <h2>Step 2: If you genuinely can’t recover it</h2>
      <p>Private ophthalmology and optometry clinics exist in Santo Domingo, Santiago, and major tourist areas, and can perform a full eye exam if needed. This takes more time and costs more than simply retrieving an existing prescription, so it’s worth exhausting Step 1 first — but it’s a real, available option if nothing else works.</p>

      <h2>Once you have your prescription (recovered or new)</h2>
      <p>You can order contact lenses online with delivery to your hotel — typically 24 hours in Santo Domingo, 24-48 hours in Santiago, and 2-3 days in Punta Cana/Bávaro/La Romana. No need to track down a specific optical retailer in person.</p>

      <h2>If you have old, possibly outdated lenses with you</h2>
      <p>If you happened to find an old pair while searching your bags, and they’re still sealed and undamaged, they can work as a temporary bridge until new ones arrive — but if your vision has changed significantly since that prescription, or the lenses were stored improperly, it’s safer to wait for a correct, fresh pair rather than risk discomfort or blurry vision for the rest of your trip.</p>

      <h2>A tip for next time</h2>
      <p>Take a photo of your prescription (or the box) with your phone before every trip — it takes 10 seconds and solves this exact problem completely if it happens again.</p>

      <p>Stuck without your prescription and need help sorting it out? Message us on WhatsApp at <strong>+1 (809) 694-2268</strong> — we can help you figure out next steps, in English, even before you know your exact numbers.</p>
    </BlogArticle>
  )
}
