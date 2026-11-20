import HealthArticlePage from '@/components/blog/HealthArticlePage'
import { HEALTH_ARTICLES, getHealthArticle } from '@/lib/blog-salud'
import type { Metadata } from 'next'
export const revalidate = 86400
export function generateStaticParams() { return HEALTH_ARTICLES.map(article => ({ slug: article.slug })) }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
 const {slug}=await params; const article=getHealthArticle(slug)
 if(!article) return {title:'Artículo no encontrado | ContactGo', robots:{index:false,follow:false}}
 const url='https://www.contactgo.net/blog/'+slug
 return {title: article.title+' | ContactGo', description:article.desc, keywords:[article.keyword,'lentes de contacto','salud ocular','República Dominicana'], alternates:{canonical:url}, robots:{index:true,follow:true,googleBot:{index:true,follow:true,'max-image-preview':'large','max-snippet':-1,'max-video-preview':-1}}, openGraph:{type:'article',title:article.title,description:article.desc,url,siteName:'ContactGo',locale:'es_DO',publishedTime:article.publishedAt,modifiedTime:article.updatedAt??article.publishedAt}, twitter:{card:'summary_large_image',title:article.title,description:article.desc}}
}
export default async function Page({params}:{params:Promise<{slug:string}>}) { const {slug}=await params; return <HealthArticlePage slug={slug}/> }
