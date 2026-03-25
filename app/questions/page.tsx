import { Metadata } from 'next'
import QuestionsPageClient from './QuestionsPageClient'

export const metadata: Metadata = {
  title: 'Practice Questions | PreRegExamPrep',
  description: 'Practice GPhC exam questions by topic, difficulty, and exam section. Access calculations, clinical knowledge, and specialized question areas.',
  keywords: 'GPhC practice questions, exam practice, pharmaceutical calculations, clinical questions, practice dashboard',
  openGraph: {
    title: 'Practice Questions | PreRegExamPrep',
    description: 'Comprehensive question practice organized by GPhC exam structure and topics.',
    url: 'https://preregexamprep.com/questions',
  },
  alternates: {
    canonical: '/questions',
  },
}

export default function QuestionsPage() {
  return <QuestionsPageClient />
}
