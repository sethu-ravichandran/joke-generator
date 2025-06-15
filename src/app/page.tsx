'use client'

import Footer from '@/components/HomePage/components/Footer'
import Header from '@/components/HomePage/components/Header'
import JokeSection from '@/components/HomePage/components/JokeSection'

const Home = () => {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-black text-purple-800 dark:text-white transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-4xl min-h-screen flex flex-col">
    
        <Header/>

          <JokeSection/>

        <Footer/>
        
      </div>
    </div>
  )
}

export default Home
