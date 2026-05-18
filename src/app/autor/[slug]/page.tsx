import { redirect } from 'next/navigation'

// Redirigir cualquier /autor/* a la página principal del equipo
export default function AutorSlugPage() {
  redirect('/autor/equipo-contactgo')
}
