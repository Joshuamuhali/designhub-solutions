import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Globe, Megaphone, Palette, Video, TrendingUp, BarChart3, ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    id: "web",
    icon: Globe,
    title: "Web Design & Development",
    description: "Your online home, built just the way you like it. Mobile-friendly, easy to manage, and welcoming to your visitors.",
    packages: [
      { name: "Basic Website", price: "K5,000", features: ["5 pages", "Responsive design", "Basic SEO", "Google Business integration", "1-hour support"] },
      { name: "Standard Website", price: "K7,500", features: ["10 pages", "Custom design", "On-page SEO", "5 blog articles", "3-hour support"] },
      { name: "Premium Website", price: "K15,000", features: ["15+ pages", "CMS/E-commerce", "Advanced SEO & analytics", "Booking integration", "5-hour support"] },
    ],
  },
  {
    id: "marketing",
    icon: Megaphone,
    title: "Digital Marketing",
    description: "Social media, ads, SEO, and email campaigns—all designed to help more people discover your business.",
    packages: [
      { name: "Starter Spark", price: "K850/mo", features: ["8 posts/month", "1 report", "Basic engagement", "Optional ads (+K350/week)"] },
      { name: "Elevate Edge", price: "K1,500/mo", features: ["12-15 posts", "2 videos", "Bi-monthly analytics", "Strategy guidance"] },
      { name: "Prestige Pulse", price: "K2,500+/mo", features: ["20 posts", "5 videos", "Monthly consulting", "Event access"] },
    ],
  },
  {
    id: "branding",
    icon: Palette,
    title: "Branding & Design",
    description: "Logos, brochures, packaging, and business cards that feel authentically 'you'.",
    packages: [
      { name: "Logo & Identity", price: "K1,500", features: ["Logo design", "Brand style guide", "Color palette", "Typography selection"] },
      { name: "Company Profile", price: "K1,500", features: ["Comprehensive design", "Print & digital formats", "Professional layout"] },
      { name: "Full Branding", price: "K3,000+", features: ["Logo & identity", "Brochures", "Business cards", "Packaging design"] },
    ],
  },
  {
    id: "video",
    icon: Video,
    title: "Video Production",
    description: "Short skits, promos, and voiceovers that tell your story in a fun, engaging way.",
    packages: [
      { name: "Voice-over", price: "From K500", features: ["Professional recording", "Script reading", "Multiple formats"] },
      { name: "Short-form Skit", price: "K2,500-5,000", features: ["1-2 minutes", "Social media ready", "Scripting included"] },
      { name: "Promo Video", price: "K4,000+", features: ["1-3 minutes", "Full production", "Post-production editing"] },
    ],
  },
  {
    id: "sales",
    icon: TrendingUp,
    title: "Sales & Lead Generation",
    description: "We don't just bring leads; we help you turn them into happy, paying customers.",
    packages: [
      { name: "Inbound Leads", price: "K5,000/mo", features: ["Lead capture", "Nurturing sequences", "Online source management"] },
      { name: "Sales Team", price: "K10,000+/mo", features: ["Dedicated team", "B2B/B2C support", "Full reporting"] },
      { name: "Full Campaign", price: "K15,000-50,000", features: ["Ads to closing", "Complete funnel", "Performance tracking"] },
    ],
  },
  {
    id: "consulting",
    icon: BarChart3,
    title: "Strategy & Consulting",
    description: "Comprehensive marketing strategies and consulting to help your business grow sustainably.",
    packages: [
      { name: "Strategy Session", price: "K1,000", features: ["1-hour review", "Action plan", "Recommendations"] },
      { name: "Marketing Audit", price: "K5,000", features: ["Comprehensive audit", "Channel analysis", "Growth strategy"] },
      { name: "Training", price: "K6,000+", features: ["Sales training", "Customer service", "Team development"] },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const Services = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-secondary/50 to-background">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Our <span className="text-primary">Services</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At Designhub, we offer a range of services to help your business thrive online. From websites and branding to digital marketing and sales support, we've got you covered—all explained in plain language.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      {services.map((service, index) => (
        <section
          key={service.id}
          id={service.id}
          className={`py-20 ${index % 2 === 0 ? "bg-background" : "bg-secondary/30"}`}
        >
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-4 mb-8"
            >
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center"
              >
                <service.icon size={28} className="text-primary" />
              </motion.div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{service.title}</h2>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {service.packages.map((pkg, pkgIndex) => (
                <motion.div
                  key={pkg.name}
                  variants={itemVariants}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className={`p-6 rounded-2xl border ${pkgIndex === 1 ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"}`}
                >
                  <h3 className={`text-xl font-semibold mb-2 ${pkgIndex === 1 ? "" : "text-foreground"}`}>
                    {pkg.name}
                  </h3>
                  <p className={`text-2xl font-bold mb-4 ${pkgIndex === 1 ? "text-accent" : "text-primary"}`}>
                    {pkg.price}
                  </p>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, featureIndex) => (
                      <motion.li
                        key={feature}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: featureIndex * 0.05 }}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle size={16} className={pkgIndex === 1 ? "text-accent" : "text-accent"} />
                        <span className={pkgIndex === 1 ? "text-primary-foreground/90" : "text-muted-foreground"}>
                          {feature}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant={pkgIndex === 1 ? "accent" : "outline"}
                      className="w-full mt-6"
                      asChild
                    >
                      <Link to="/contact">Get Started</Link>
                    </Button>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">Not Sure Which Service You Need?</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Let's have a friendly chat about your business goals. We'll recommend the best solution for you.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button variant="hero" asChild>
                <Link to="/contact">
                  Book a Free Consultation
                  <ArrowRight size={18} />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
