export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'lost-contact-lens-solution-punta-cana-vacation',
  title: 'Ran Out of Contact Lens Solution in Punta Cana? Here\'s What To Do',
  h1: 'Ran out of contact lens solution while on vacation? Here\'s what to do',
  description: 'It happens to almost every traveler eventually — your contact lens solution runs out mid-trip. Here are your real options in Punta Cana, Bávaro, and the rest of the DR.',
  publishedAt: '2026-09-08',
  readMinutes: 5,
  category: 'Para turistas',
  faq: [
    { q: 'Can hotel front desks help with contact lens solution?', a: 'Some larger all-inclusive resorts have a small pharmacy or gift shop that stocks basic toiletries, but selection and stock vary a lot — don\'t count on it as your only plan.' },
    { q: 'Is tap water safe to rinse contact lenses in an emergency?', a: 'No — never use tap water on contact lenses anywhere, including at home. It can contain microorganisms that cause serious eye infections. If you have no solution, it\'s safer to switch to glasses temporarily or discard daily lenses.' },
    { q: 'How fast can I get solution delivered to my resort?', a: 'Typically 2-3 days to Punta Cana, Bávaro, and La Romana — plan ahead if you know you\'re running low, rather than waiting until you\'re completely out.' },
  ],
  relatedSlugs: [
    'contact-lenses-dominican-republic-tourist-guide',
    'agua-lentes-contacto-viaje-hoteles-rd',
    'solucion-limpieza-lentes-contacto',
    'opti-free-puremoist-precio-republica-dominicana',
  ],
}

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `https://www.contactgo.net/blog/${meta.slug}` },
  openGraph: { title: meta.h1, description: meta.description, url: `https://www.contactgo.net/blog/${meta.slug}`, type: 'article', locale: 'es_DO', siteName: 'ContactGo' },
  keywords: 'contact lens solution punta cana, ran out of contact solution vacation, contact lens solution bavaro, saline solution punta cana',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>You’re halfway through your Punta Cana trip and you realize your contact lens solution bottle is nearly empty — or worse, already dry. It’s one of the most common travel mishaps for contact lens wearers, and there’s no need to panic. Here’s what actually works.</p>

      <h2>First: what NOT to do</h2>
      <p>Never rinse or store your lenses in tap water, bottled water, or saliva, even temporarily. Tap water — anywhere in the world, not just here — can carry microorganisms that cause serious corneal infections. If you have zero solution and no way to get more today, it’s safer to switch to glasses (if you have them) or discard daily lenses than to improvise with water.</p>

      <h2>Your realistic options in Punta Cana / Bávaro</h2>

      <h3>1. Check your resort’s shop or pharmacy</h3>
      <p>Larger all-inclusive resorts sometimes stock basic toiletries including small solution bottles, but this is hit-or-miss — some have it, many don’t, and the selection is usually limited to whatever brand they happen to carry.</p>

      <h3>2. Local pharmacies (farmacias)</h3>
      <p>Pharmacies in the Punta Cana/Bávaro tourist zone often carry basic multipurpose solution. You may need to ask for “solución para lentes de contacto” if the staff doesn’t speak English — worth writing that phrase down before you go looking.</p>

      <h3>3. Order online for delivery to your resort</h3>
      <p>If you’d rather not spend vacation time hunting for a pharmacy, ordering online with delivery straight to your hotel is the most reliable option — typically 2-3 days to Punta Cana and Bávaro. Order as soon as you notice you’re running low, not after you’re already out.</p>

      <h2>A tip for the rest of your trip</h2>
      <p>If you switch to daily disposable lenses for the remainder of your stay, you eliminate the solution problem entirely — no cleaning, no storage, no risk of running out again. It’s a common workaround travelers use once they’ve had this happen once.</p>

      <h2>Planning ahead for next time</h2>
      <p>Pack more solution than you think you’ll need (TSA/airport liquid rules allow up to 100ml containers in carry-on) and consider a spare pair of daily lenses as backup — small enough to pack, and a real problem-solver if something goes wrong mid-trip.</p>

      <p>Need solution or lenses delivered to your Punta Cana or Bávaro hotel today? Message us on WhatsApp at <strong>+1 (809) 694-2268</strong> — we can confirm delivery timing to your specific resort.</p>
    </BlogArticle>
  )
}
