export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'how-much-do-contact-lenses-cost-dominican-republic',
  title: 'How Much Do Contact Lenses Cost in the Dominican Republic?',
  h1: 'How much do contact lenses cost in the Dominican Republic?',
  description: 'A real pricing breakdown by lens type, so you know what to expect before you order — no surprises.',
  publishedAt: '2026-09-10',
  readMinutes: 5,
  category: 'Para turistas',
  faq: [
    { q: 'What currency are prices listed in?', a: 'Dominican pesos (RD$/DOP). If you\u2019re paying with a foreign card, your bank will convert at the current exchange rate at checkout.' },
    { q: 'Are prices per box or per pair?', a: 'Prices are per box, which typically contains multiple lenses (30 for dailies, 6 for biweekly/monthly) — enough for one or more months of use depending on your prescription.' },
    { q: 'Does delivery cost extra?', a: 'Yes, delivery is calculated separately based on your location — typically a flat fee added at checkout, with faster delivery in Santo Domingo and Santiago.' },
  ],
  relatedSlugs: [
    'contact-lenses-dominican-republic-tourist-guide',
    'cuanto-cuesta-usar-lentes-contacto-al-ano-rd',
    'best-contact-lens-brands-dominican-republic-guide',
  ],
}

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `https://www.contactgo.net/blog/${meta.slug}` },
  openGraph: { title: meta.h1, description: meta.description, url: `https://www.contactgo.net/blog/${meta.slug}`, type: 'article', locale: 'es_DO', siteName: 'ContactGo' },
  keywords: 'contact lens prices dominican republic, how much are contacts DR, contact lens cost punta cana',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>If you\u2019re trying to budget for contact lenses while visiting or living in the Dominican Republic, here\u2019s a real pricing breakdown by category, based on current catalog prices — no guessing required.</p>

      <h2>Daily disposable lenses</h2>
      <p>A box of 30 (roughly one month of daily wear per eye) typically runs <strong>RD$3,000\u20133,350</strong>, depending on brand. Popular options in this range include PRECISION1, clariti 1 day, and 1-DAY ACUVUE Moist.</p>

      <h2>Biweekly lenses</h2>
      <p>A box of 6 (about 3 months of wear with biweekly replacement) typically runs <strong>RD$3,350</strong> for standard spherical prescriptions, such as ACUVUE Oasys.</p>

      <h2>Monthly lenses</h2>
      <p>A box of 6 (about 3 months of wear with monthly replacement) ranges from <strong>RD$3,000 to RD$4,200</strong> depending on brand — Avaira Vitality on the lower end, Biofinity XR on the higher end.</p>

      <h2>Astigmatism (toric) lenses</h2>
      <p>These run higher than standard spherical lenses due to more complex manufacturing — typically <strong>RD$3,900 to RD$9,400</strong> depending on brand, modality, and whether your cylinder/axis combination is a standard stock parameter or requires special-order fabrication.</p>

      <h2>Multifocal lenses (for presbyopia)</h2>
      <p>Similarly priced above standard spherical, typically <strong>RD$5,400 to RD$12,550</strong> depending on brand and whether it\u2019s combined with astigmatism correction.</p>

      <h2>Cosmetic color lenses</h2>
      <p>AIR OPTIX Colors, available with or without prescription, typically runs around <strong>RD$2,000</strong> per box.</p>

      <h2>Solution and accessories</h2>
      <p>A bottle of multipurpose solution (enough for roughly 3-4 weeks of daily use) typically costs around <strong>RD$650</strong>.</p>

      <h2>Delivery</h2>
      <p>Delivery is calculated separately based on your location, added at checkout — generally fastest and most affordable within Santo Domingo and Santiago.</p>

      <p>Want an exact quote for your specific prescription and brand preference? Message us on WhatsApp at <strong>+1 (809) 694-2268</strong> or browse the <Link href="/catalogo">full catalog</Link> with live pricing.</p>
    </BlogArticle>
  )
}
