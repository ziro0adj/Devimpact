import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { pricingCards } from '@/lib/constants'

import clsx from 'clsx'
import { Check } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Home(){
  return (
      <>
       <section className="h-full w-full pt-36 relative 
       flex items-center justify-center flex-col  ">
      {/* grid */}

      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      <br />
      <br />
      <div className="relative w-full pl-10 ml-24 ">
        <h1 id='one' className=" text-9xl  md:text-[100px] bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text to-blue-600 ">
          StudyVerse
        </h1>

        <div className= 'flex'>

              <p  id='two' className='ml-10 font-serif font-semibold ml-5 text-balance  text-xl '> <br></br>studyverse is a collaborative study platform designed to <br></br> bring students and universities together.
Each university creates <br></br>  its own space where admins invite students to join study groups, 
<br></br> share resources,  and grow together.Our mission is to foster teamwork,<br></br> knowledge-sharing,
and academic success in asupportive community.<br></br>  Join us and redefine learning through collaboration!</p>
    <div className='ml-32 -mt-40 '>

      <Image className=''
        src="/assets/pic1.png"
        alt="image"
        width={500}
        height={600}
      />
    </div>
        </div>

      </div>
      </section>

      <section className="flex justify-center items-center flex-col gap-4 md:!mt-20 mt-[-60px]">
      
      <p className="text-muted-foreground text-center">
       Use our platform for collaborative studying with affordable <br></br> monthly plans tailored to your needs. 
        <br />
      </p>
      <div className="flex justify-center gap-4 flex-wrap mb-60">
        {pricingCards
          .filter((card) => card.title === "Unlimited Saas")
          .map((card) => (
            <Card
              key={card.title}
              id='three' className="w-full max-w-7xl flex flex-row justify-between border-2 border-primary shadow-lg"
            >
              <CardHeader className="p-8 w-1/3">
                <CardTitle className="text-3xl font-bold">{card.title}</CardTitle>
                <CardDescription className="text-lg mt-2">{card.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-8 w-1/3 flex flex-col justify-center">
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-bold">{card.price}</span>
                  <span className="text-muted-foreground text-2xl">/m</span>
                </div>
              </CardContent>
              <CardFooter className="p-8 w-1/3 flex flex-col items-start gap-4">
                <div>
                  {card.features.map((feature) => (
                    <div key={feature} className="flex gap-4 items-center">
                      <Check className="text-muted-foreground" />
                      <p className="text-lg">{feature}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href={`/agency?plan=${card.priceId}`}
                  className="w-full text-center bg-primary text-white p-3 rounded-lg text-lg font-semibold"
                >
                  Get Started
                </Link>
              </CardFooter>
            </Card>
          ))}
      </div>
    </section>

    <footer id='four' className="bg-blue-600 text-white py-8">
      <div className="container mx-auto text-center">
        <h2 className="text-2xl font-bold">Contact Us</h2>
        <p className="mt-4">Email: contact@studyverse.com</p>
        <p>Phone: +123 456 7890</p>
        <p>Address: 123 StudyVerse Lane, Learning City, 45678</p>
      </div>
    </footer>
</>
  )
}


