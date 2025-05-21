import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/login');
  // Este return no se ejecuta debido a la redirección, pero es necesario para TypeScript.
  return null;
} 