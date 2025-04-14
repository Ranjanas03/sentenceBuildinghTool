// src/pages/Home.tsx
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-black dark:to-zinc-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Card className="w-full max-w-md shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold text-slate-800 dark:text-white">
              Sentence Construction Tool
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button
              className="w-full mt-2 text-lg"
              onClick={() => navigate('/quiz')}
            >
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default Home
