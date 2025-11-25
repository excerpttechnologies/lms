
import Hero from '../components/home/Hero'
import Teachers from '../components/home/Teachers'
import Testimonials from "../components/home/Testimonials"
import Feature from "../components/home/Feature"
import Faq from '../components/home/Faq'

export default function Home() {
  return (
    <div className="min-h-screen ">
       
        <Hero/>
        <Feature/>
        <Teachers/>
        <Testimonials/>
        <Faq/>
    </div>
  );
}
