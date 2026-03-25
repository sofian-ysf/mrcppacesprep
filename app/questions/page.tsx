import { Metadata } from 'next'
import QuestionsPageClient from './QuestionsPageClient'

export const metadata: Metadata = {
  title: 'Practice Questions | MRCPPACESPREP',
  description: 'Practice MRCP PACES exam questions by topic, difficulty, and exam section. Access calculations, clinical knowledge, and specialized question areas.',
  keywords: 'MRCP PACES practice questions, exam practice, pharmaceutical calculations, clinical questions, practice dashboard',
  openGraph: {
    title: 'Practice Questions | MRCPPACESPREP',
    description: 'Comprehensive question practice organized by MRCP PACES exam structure and topics.',
    url: 'https://mrcppacesprep.com/questions',
  },
  alternates: {
    canonical: '/questions',
  },
}

export default function QuestionsPage() {
  return <QuestionsPageClient />
}
