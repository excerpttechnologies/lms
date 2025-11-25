'use client'
import Breadcrumb from "../../components/layout/Breadcrumb";

export default function about() {
  return (
    <>
     <div className="flex jz3o6 items-center gap-4 mt-3">
            <h1 className="text-2xl font-bold ">Services</h1>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "services" }
            ]}
          />
    
          
        </div>

   <div className="bg-base-100 i3xre sm:py-16 lg:py-10">
    <div className="wpaot owca9 j2be9 sm:px-6 lg:px-8">
      <div className="fr5x1 hqh7v rdi5h sm:mb-16 lg:mb-24">
        <p className="text-primary text-sm font-medium vxiam">About Us</p>
        <h2 className="text-base-content waiii t3mfo md:text-3xl lg:text-4xl">
          A Shared Vision, Strong Values, and a Team
          <br />
          Committed to Meaningful Impact
        </h2>
        <p className="text-base-content/80 bk5oo">
          Our achievement story stands as a powerful testament to teamwork and perseverance. United,
          <br />
          we have faced challenges, celebrated victories, and woven a narrative of growth and success.
        </p>
      </div>
      <div className="kztr2 dpzny wfsyj hdi2c md:grid-cols-3 xl:grid-cols-5">
       
        <div className="xdzim md:col-span-1">
          <div className="flex jz3o6 xsnjp">
            <span className="ijn5q bxh1m pze98 text-base-content mqon5 rounded-full text-base">
              Discovery & Strategy
            </span>
            <span className="ijn5q bxh1m pze98 text-base-content mqon5 rounded-full text-base">
              Branding & Strategy
            </span>
            <span className="ijn5q bxh1m pze98 text-base-content mqon5 rounded-full text-base">
              Consultancy
            </span>
            <span className="ijn5q bxh1m pze98 text-base-content mqon5 rounded-full text-base">
              Ideation & Consultancy
            </span>
          </div>
          <div
            className="ylqpi hover:border-primary rounded-box nxpwg border m233p p-4 u2n5x duration-300"
          >
            <div className="er88f">
              <h5 className="text-base-content ay6fz font-medium">123+</h5>
            </div>
            <div className="hgzwk text-sm">Qualified Workers</div>
          </div>
          <a href="#" className="btn btn-primary y1dss">
            Read more
            <span className="icon-[tabler--arrow-right] size-5 rtl:rotate-180"></span>
          </a>
        </div>

       
        <div className="uxkpc md:col-span-2 xl:col-span-2">
          <div>
            <img
              src="https://cdn.flyonui.com/fy-assets/blocks/marketing-ui/about/about-10.png"
              alt="Our Mission"
              className="clao4 w-full tnh37 c7ys3"
            />
          </div>
          <div className="zq390 bg-primary relative tnh37 nwdq3">
            <div className="l7s0y flex justify-between">
              <h5 className="siqxi waiii t3mfo">Meet Our Expert</h5>
              <span className="icon-[tabler--arrow-right] siqxi size-8 rtl:rotate-180"></span>
            </div>
            <div className="hh5ac zbfzs rukzz fyl79">
              <a href="#" className="btn g2v48 siqxi btn-sm rounded-full text-xs [--btn-color:#fff]">
                View All Details
              </a>
            </div>
            <div className="absolute q4lav o4bwf">
              
            </div>
            <div className="absolute q4lav o4bwf">
              
            </div>
          </div>
        </div>

       
        <div className="relative md:col-span-3 xl:col-span-2">
          <img
            src="https://cdn.flyonui.com/fy-assets/blocks/marketing-ui/about/about-27.png"
            alt="Our Mission"
            className="bo43t w-full tnh37 c7ys3"
          />
         
          <div className="text-base-content bg-base-100 absolute ld2xa o4bwf hidden rounded-full p-4 xl:block">
            <img
              src="https://cdn.flyonui.com/fy-assets/blocks/marketing-ui/hero/circle-float.png"
              alt="flyonui circle"
              className="lgfgd"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  </>
  )}