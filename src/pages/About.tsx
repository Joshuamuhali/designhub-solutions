// AboutPage.jsx
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, Target, Users, Award, ArrowRight, CheckCircle, Play, Zap, Globe, Shield, TrendingUp, Code, Palette, BarChart } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useState, useEffect } from 'react';

// Interactive Stats Component
const StatsCounter = ({ target, suffix = "", duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration, isVisible]);

  return (
    <span className="text-4xl font-bold text-primary">
      {count}{suffix}
    </span>
  );
};

// Interactive Service Card
const ServiceCard = ({ icon: Icon, title, description, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`p-6 rounded-2xl bg-card border border-border transition-all duration-300 cursor-pointer ${
        isHovered ? 'transform -translate-y-2 shadow-xl border-primary/50' : 'hover:shadow-lg'
      }`}
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 transition-transform duration-300 ${
        isHovered ? 'transform scale-110' : ''
      }`}>
        <Icon size={28} className="text-primary" />
      </div>
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

const values = [
  {
    icon: Heart,
    title: "Friendly & Approachable",
    description: "Business should be human. We communicate warmly and clearly, without jargon.",
  },
  {
    icon: Target,
    title: "Results-Oriented",
    description: "Every service is designed to help your business grow with measurable outcomes.",
  },
  {
    icon: Users,
    title: "Partnership Over Transactions",
    description: "We don't just complete projects; we walk with you every step of the way.",
  },
  {
    icon: Award,
    title: "Transparent & Honest",
    description: "We don't hide behind buzzwords. You'll always know what we're doing and why.",
  },
];

const services = [
  {
    icon: Code,
    title: "Web design & development",
    description: "Custom websites that convert visitors into customers",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: BarChart,
    title: "Digital marketing & SEO",
    description: "Data-driven strategies to boost your online visibility",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Palette,
    title: "Branding & graphic design",
    description: "Memorable brands that stand out in the crowd",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Play,
    title: "Video production",
    description: "Compelling video content that tells your story",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: TrendingUp,
    title: "Sales & lead generation",
    description: "Strategic approaches to grow your customer base",
    color: "from-indigo-500 to-purple-500"
  },
];

const stats = [
  { value: 50, suffix: "+", label: "Happy Clients", icon: Users },
  { value: 100, suffix: "+", label: "Projects Completed", icon: Target },
  { value: 5, suffix: "+", label: "Years Experience", icon: Award },
  { value: 4, suffix: "", label: "AI Products Built", icon: Zap },
];

const timeline = [
  {
    year: "2018",
    event: "Gained hands-on tech experience at Kay's Internet Cafe, building foundational IT and digital skills."
  },
  {
    year: "2020",
    event: "Worked as Assistant Manager at OK Restaurant in Mongu, managing operations and social media strategies."
  },
  {
    year: "2021",
    event: "Joined My Helping Hand Foundation remotely as Admin Assistant (Media & IT), supporting social media and IT infrastructure."
  },
  {
    year: "2022",
    event: "Founded Designhub Marketing Agency in Lusaka and served first 5 clients."
  },
  {
    year: "2023",
    event: "Expanded services to branding, graphic design, and social media management."
  },
  {
    year: "2024",
    event: "Started offering CRM systems, analytics dashboards, and sales outsourcing."
  },
  {
    year: "2025",
    event: "Became a trusted partner for 50+ businesses while developing AI-powered platforms.",
    subEvents: [
      "Bizmate – AI-powered B2B matchmaking & CRM for SMEs",
      "Superlink – URL management & C2C matchmaking tool",
      "Zendo – AI task manager & scheduler for neurodivergent users",
      "Pocket Pal – AI-powered financial planning app"
    ]
  },
  {
    year: "2026",
    event: "Pioneering Zambia's national blockchain trust infrastructure development.",
    subEvents: [
      "Building secure digital backbone for government services",
      "Implementing verifiable identity and asset management systems",
      "Creating tamper-proof public service records",
      "Developing smart automated governance processes"
    ]
  }
];

const AboutPage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-secondary/50 to-background">
        <div className="section-container text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Your Partners in <span className="text-primary">Growth</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            At Designhub, we believe business should feel personal. We’re not just about websites and ads—we’re about helping you tell your story, connect with your customers, and grow your dreams.
          </p>
        </div>
      </section>

      {/* Interactive Stats Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/20">
        <div className="section-container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Impact by the Numbers</h2>
            <p className="text-muted-foreground">
              Real results that speak for themselves
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center group">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-brand-blue flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon size={32} className="text-primary-foreground" />
                </div>
                <StatsCounter target={stat.value} suffix={stat.suffix} />
                <p className="text-muted-foreground mt-2 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About the Business & Founder */}
      <section className="py-20 bg-background">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Business Info */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground mb-6">About Designhub</h2>
              <p className="text-muted-foreground leading-relaxed">
                Designhub Marketing Agency Limited is a full-service digital marketing and web solutions company based in Lusaka, Zambia. We are more than just a marketing agency—we are your partner in growth.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                From building beautiful, functional websites to crafting memorable brands and running smart digital campaigns, our goal is simple: to help businesses shine online and reach their customers effectively.
              </p>
              
              {/* Our Expertise */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Our Expertise</h3>
                <p className="text-muted-foreground leading-relaxed">
                  With years of experience in the digital landscape, we've developed a deep understanding of what works in the Zambian market and beyond. Our team combines creative excellence with technical expertise to deliver solutions that not only look great but drive real results.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-2">
                  We specialize in creating comprehensive digital ecosystems that integrate seamlessly with your business operations, ensuring that every touchpoint with your customers is consistent, compelling, and conversion-focused.
                </p>
              </div>

              {/* Our Approach */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Our Approach</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We believe in a collaborative approach where we become an extension of your team. By taking the time to understand your unique challenges, goals, and vision, we craft tailored strategies that align perfectly with your business objectives.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-2">
                  Every project we undertake is backed by data-driven insights, creative innovation, and a commitment to excellence. We don't just deliver services—we build lasting partnerships that grow with your business.
                </p>
              </div>

              {/* Interactive Services */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Our Services</h3>
                <div className="space-y-3">
                  {services.map((service, index) => (
                    <div key={service.title} className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                      <service.icon size={20} className="text-primary flex-shrink-0" />
                      <div>
                        <p className="text-foreground font-medium">{service.title}</p>
                        <p className="text-muted-foreground text-sm">{service.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
                <p className="text-foreground font-medium mb-2">
                  Ready to transform your digital presence?
                </p>
                <p className="text-muted-foreground">
                  Let's discuss how we can help your business thrive in the digital age.
                </p>
              </div>
            </div>

            {/* Founder Info */}
            <div className="bg-gradient-to-br from-primary to-brand-blue-dark rounded-2xl p-8 text-primary-foreground">
              <h3 className="text-2xl font-bold mb-4">About the Founder</h3>
              <div className="space-y-4">
                <p className="text-primary-foreground/90 leading-relaxed">
                  Joshua Muhali, Founder of Designhub, grew up in Mongu, Zambia, witnessing how small businesses struggled to gain visibility in a market where digital marketing was often undervalued. This early experience sparked his passion to empower businesses and individuals with practical, results-driven solutions that make them seen, heard, and remembered.
                </p>
                <p className="text-primary-foreground/90 leading-relaxed">
                  After moving to Lusaka, Joshua honed his expertise in web development, digital marketing, automation, and AI-powered systems. His work evolved beyond client services into building technology products that solve real, lived problems. Over the years, he has developed:
                </p>
                <div className="space-y-3">
                  <div className="bg-primary-foreground/10 rounded-lg p-3">
                    <p className="font-semibold">BizMate — AI-powered B2B business matchmaking platform connecting companies with the right partners, suppliers, and opportunities.</p>
                  </div>
                  <div className="bg-primary-foreground/10 rounded-lg p-3">
                    <p className="font-semibold">Superlink — AI-powered C2C multi-vendor e-commerce platform enabling individuals and small traders to buy and sell digitally with ease.</p>
                  </div>
                  <div className="bg-primary-foreground/10 rounded-lg p-3">
                    <p className="font-semibold">Zendo — AI-powered to-do list tailored for the ADHD and neurodivergent mind, designed to help users organize tasks in alignment with how they think and function.</p>
                  </div>
                  <div className="bg-primary-foreground/10 rounded-lg p-3">
                    <p className="font-semibold">Pocket Pal — AI-powered budgeting and savings app that helps individuals manage money intentionally and consistently.</p>
                  </div>
                </div>
                <p className="text-primary-foreground/90 leading-relaxed">
                  Through these ventures, Joshua has scaled Designhub into a trusted digital partner for over 50 businesses across Zambia, delivering each project with strategic clarity, hands-on execution, and a commitment to tangible results.
                </p>
                <p className="text-primary-foreground/90 leading-relaxed">
                  Today, Joshua and his team are channeling their experience into building Zambia's next-generation national blockchain trust infrastructure — a secure, unified digital backbone connecting citizens, assets, and public services in a single interoperable system.
                </p>
                <div className="border-t border-primary-foreground/20 pt-4 mt-4">
                  <h4 className="font-bold mb-2">Our Vision:</h4>
                  <p className="text-primary-foreground/80 mb-3">A transparent, accountable, and efficient digital Zambia where government, businesses, and citizens can interact securely and fairly.</p>
                  <h4 className="font-bold mb-2">Our Mission:</h4>
                  <p className="text-primary-foreground/80 mb-3">To empower institutions and individuals with verifiable, tamper-proof records, smart automated processes, and inclusive access, ensuring that every asset, identity, and transaction is trusted and traceable.</p>
                  <h4 className="font-bold mb-2">We stand for:</h4>
                  <p className="text-primary-foreground/80">integrity, innovation, and impact — leveraging technology to eliminate fraud, reduce inefficiency, and lay the foundation for sustainable economic growth and good governance.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Carousel */}
      <section className="py-20 bg-secondary/50">
        <div className="section-container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Journey</h2>
            <p className="text-muted-foreground">
              From humble beginnings to digital innovation
            </p>
          </div>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-12"
          >
            {timeline.map((milestone, index) => (
              <SwiperSlide key={milestone.year}>
                <div className="bg-background rounded-2xl shadow-lg p-6 h-full flex flex-col justify-between hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-brand-blue text-primary-foreground flex items-center justify-center font-bold mb-4 text-lg">
                      {milestone.year}
                    </div>
                    <p className="text-foreground font-semibold mb-2">{milestone.event}</p>
                    {milestone.subEvents && (
                      <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                        {milestone.subEvents.map((subEvent, idx) => (
                          <li key={idx} className="text-sm">{subEvent}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center text-primary text-sm font-medium">
                      <TrendingUp size={16} className="mr-1" />
                      Milestone {index + 1}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-background">
        <div className="section-container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">What We Stand For</h2>
            <p className="text-muted-foreground">
              Our values define how we work and the kind of partner we are.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <ServiceCard 
                key={value.title}
                icon={value.icon}
                title={value.title}
                description={value.description}
                delay={index * 150}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold mb-4">Let's Build Something Great Together</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Ready to take your business to the next level? We'd love to hear from you.
          </p>
          <Button variant="hero" asChild>
            <Link to="/contact">
              Get in Touch <ArrowRight size={18} />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
