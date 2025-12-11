// AboutPage.jsx
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, Target, Users, Award, ArrowRight, CheckCircle } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
  "Web design & development",
  "Digital marketing & SEO",
  "Branding & graphic design",
  "Video production",
  "Sales & lead generation",
];

const timeline = [
  {
    year: "2018",
    event: "Gained hands-on tech experience at Kay’s Internet Cafe, building foundational IT and digital skills."
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

      {/* About the Business & Founder */}
      <section className="py-20 bg-background">
        <div className="section-container grid lg:grid-cols-2 gap-16 items-center">
          {/* Business Info */}
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">About Designhub</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Designhub Marketing Agency Limited is a full-service digital marketing and web solutions company based in Lusaka, Zambia. We are more than just a marketing agency—we are your partner in growth.
            </p>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              From building beautiful, functional websites to crafting memorable brands and running smart digital campaigns, our goal is simple: to help businesses shine online and reach their customers effectively.
            </p>
            <div className="space-y-3">
              {services.map((service) => (
                <div key={service} className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-accent" />
                  <span className="text-foreground">{service}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Founder Info */}
          <div className="bg-gradient-to-br from-primary to-brand-blue-dark rounded-2xl p-8 text-primary-foreground">
            <h3 className="text-2xl font-bold mb-4">About the Founder</h3>
            <p className="text-primary-foreground/90 mb-4 leading-relaxed">
              Joshua Muhali, founder of <strong>Designhub</strong>, grew up in <strong>Mongu, Zambia</strong>, witnessing how small businesses struggled to gain visibility in a market where digital marketing was often undervalued. This experience ignited his passion to empower businesses with creative solutions and strategies that make them seen, heard, and remembered.
            </p>
            <p className="text-primary-foreground/80 leading-relaxed">
              Moving to <strong>Lusaka</strong>, Joshua honed his skills in web development, digital marketing, and AI-powered business solutions, building platforms like <strong>Bizmate</strong>, <strong>Superlink</strong>, <strong>Zendo</strong>, and <strong>Pocket Pal</strong>. He scaled Designhub into a trusted partner for over 50 businesses across Zambia, delivering every project with a personal touch and unwavering commitment.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Carousel */}
      <section className="py-20 bg-secondary/50">
        <div className="section-container">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Our Journey</h2>
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {timeline.map((milestone) => (
              <SwiperSlide key={milestone.year}>
                <div className="bg-background rounded-2xl shadow-lg p-6 h-full flex flex-col justify-between hover:shadow-xl transition-shadow">
                  <div>
                    <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-4">
                      {milestone.year}
                    </div>
                    <p className="text-foreground font-semibold mb-2">{milestone.event}</p>
                    {milestone.subEvents && (
                      <ul className="list-disc list-inside text-muted-foreground mt-2">
                        {milestone.subEvents.map((subEvent, idx) => (
                          <li key={idx}>{subEvent}</li>
                        ))}
                      </ul>
                    )}
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
            {values.map((value) => (
              <div key={value.title} className="p-6 rounded-2xl bg-card border border-border text-center card-hover">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon size={28} className="text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
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
