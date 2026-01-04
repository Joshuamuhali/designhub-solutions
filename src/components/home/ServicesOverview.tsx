import { Link } from "react-router-dom";
import { Globe, Megaphone, Palette, Video, TrendingUp, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const whatsappNumber = "0974399695";

const services = [
  {
    id: "web-design",
    icon: Globe,
    title: "Web Design & Development",
    description: "Beautiful, responsive websites built to attract and retain customers. Your online home, done right.",
    price: "From K5,000",
    image: "https://images.unsplash.com/photo-1545239355-0d5028440b71?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "digital-marketing",
    icon: Megaphone,
    title: "Digital Marketing",
    description: "Social media, ads, SEO, and email campaigns designed to help more people discover your business.",
    price: "From K850/mo",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "branding",
    icon: Palette,
    title: "Branding & Design",
    description: "Logos, brochures, packaging, and business cards that feel authentically 'you'.",
    price: "From K500",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "video",
    icon: Video,
    title: "Video Production",
    description: "Short skits, promos, and voiceovers that tell your story in a fun, engaging way.",
    price: "From K2,500",
    image: "https://images.unsplash.com/photo-1567493794049-09751156c92d?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "sales-leads",
    icon: TrendingUp,
    title: "Sales & Lead Generation",
    description: "We don't just bring leads; we help you turn them into happy, paying customers.",
    price: "From K5,000/mo",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "strategy",
    icon: BarChart3,
    title: "Strategy & Consulting",
    description: "Comprehensive marketing strategies and consulting to help your business grow sustainably.",
    price: "From K1,000",
    image: "https://images.unsplash.com/photo-1573497019940-1c286886d56a?q=80&w=800&auto=format&fit=crop",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function ServicesOverview() {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
      </div>

      {/* Decorative floating images */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute top-10 left-10 w-32 h-32 rounded-2xl overflow-hidden shadow-2xl"
      >
        <img 
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop" 
          alt="Decorative"
          className="w-full h-full object-cover"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.12, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute bottom-10 right-10 w-40 h-40 rounded-3xl overflow-hidden shadow-2xl"
      >
        <img 
          src="https://images.unsplash.com/photo-1494790108755-2616b332c1ca?q=80&w=400&auto=format&fit=crop" 
          alt="Decorative"
          className="w-full h-full object-cover"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="absolute top-1/2 right-20 w-24 h-24 rounded-full overflow-hidden shadow-2xl"
      >
        <img 
          src="https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=400&auto=format&fit=crop" 
          alt="Decorative"
          className="w-full h-full object-cover"
        />
      </motion.div>
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            What We Can Do <span className="text-primary">For You</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            From your first website to your latest marketing campaign, we're here to help. And don't worry—we explain everything in plain language.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              whileHover={{ y: -12, transition: { duration: 0.3 } }}
              className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
            >
              {/* Service Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop";
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-xl font-bold text-white">{service.title}</h3>
                  <p className="text-green-400 font-semibold">{service.price}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex-1">
                  <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-xl mb-4">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-muted-foreground mb-6">{service.description}</p>
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-auto"
                >
                  <Button
                    asChild
                    size="lg"
                    className="w-full bg-green-500 hover:bg-green-600 text-white shadow-lg transition-all"
                  >
                    <a 
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi Designhub! I\'m interested in your service: ' + service.title)}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      Get Started
                      <ArrowRight size={18} />
                    </a>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View all services button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Button size="lg" asChild>
            <Link to="/services" className="flex items-center gap-2">
              View All Services
              <ArrowRight size={18} />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}


