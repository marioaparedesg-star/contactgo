'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ShoppingBag, Package, Users, BarChart3, Eye, LogOut } from 'lucide-react'
import { Repeat } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const NAV = [
  { href: '/admin',            icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/pedidos',    icon: ShoppingBag,     label: 'Pedidos' },
  { href: '/admin/suscripciones',    icon: Repeat,     label: 'Suscripciones' },