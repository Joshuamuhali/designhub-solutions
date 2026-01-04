import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ProjectConsultation from "./ProjectConsultation";
import { Phone, Mail, MapPin, Clock, MessageCircle, LogIn, ArrowRight, CheckCircle, Star, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const contactInfo = [
  {
    icon: Phone,
    title: "Phone / WhatsApp",
    value: "0974 399 695",
    href: "tel:+260974399695",
  },
  {
    icon: Mail,
    title: "Email",
    value: "info@designhub.co.zm",
    href: "mailto:info@designhub.co.zm",
  },
  {
    icon: MapPin,
    title: "Location",
    value: "Kamwala South, Lusaka, Zambia",
  },
  {
    icon: Clock,
    title: "Working Hours",
    value: "Mon - Fri: 8:00 AM - 5:00 PM",
  },
];

const Contact = () => {
  const benefits = [
    {
      icon: Zap,
      title: "Quick Response",
      description: "Get replies within 24 hours"
    },
    {
      icon: Shield,
      title: "Expert Guidance",
      description: "Professional consultation every step"
    },
    {
      icon: Star,
      title: "Tailored Solutions",
      description: "Customized for your specific needs"
    }
  ];

  return (
    <Layout>
      {/* Enhanced Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/50 to-accent/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
        <div className="section-container relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Free Project Consultation</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-foreground mb-6 leading-tight">
              Let's Build Your <span className="text-primary">Dream Project</span> Together
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
              Tell us about your vision and we'll create a tailored solution that fits your needs and budget. 
              Our expert team will review your requirements and get back to you within 24 hours.
            </p>
            
            {/* Benefits Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-border/50">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-foreground text-sm">{benefit.title}</h3>
                    <p className="text-xs text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Project Consultation Form */}
      <ProjectConsultation />

      {/* Trust Indicators */}
      <section className="py-16 bg-gradient-to-b from-background to-secondary/30">
        <div className="section-container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Designhub?</h2>
              <p className="text-lg text-muted-foreground">Trusted by businesses across Zambia for digital excellence</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="bg-primary/10 p-6 rounded-2xl mb-4 group-hover:bg-primary/20 transition-colors">
                  <Star className="w-12 h-12 text-primary mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Expert Team</h3>
                <p className="text-muted-foreground">Skilled professionals with years of experience</p>
              </div>
              
              <div className="text-center group">
                <div className="bg-primary/10 p-6 rounded-2xl mb-4 group-hover:bg-primary/20 transition-colors">
                  <Zap className="w-12 h-12 text-primary mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Fast Delivery</h3>
                <p className="text-muted-foreground">Quick turnaround without compromising quality</p>
              </div>
              
              <div className="text-center group">
                <div className="bg-primary/10 p-6 rounded-2xl mb-4 group-hover:bg-primary/20 transition-colors">
                  <Shield className="w-12 h-12 text-primary mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Satisfaction Guaranteed</h3>
                <p className="text-muted-foreground">We work until you're 100% satisfied</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Contact Info */}
      <section className="py-20 bg-background">
        <div className="section-container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Get in Touch Directly</h2>
              <p className="text-lg text-muted-foreground">Multiple ways to reach us - choose what works best for you</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((item, index) => (
                <a 
                  key={index} 
                  href={item.href || '#'}
                  className="group bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300"
                >
                  <div className="bg-primary/10 p-4 rounded-full text-primary mx-auto mb-4 w-fit group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 text-center">{item.title}</h3>
                  <p className="text-muted-foreground text-center text-sm group-hover:text-primary transition-colors">
                    {item.value}
                  </p>
                </a>
              ))}
            </div>

            {/* Enhanced WhatsApp CTA */}
            <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 max-w-md mx-auto text-center group hover:shadow-lg transition-all">
              <div className="flex items-center justify-center gap-3 mb-4">
                <MessageCircle className="text-green-500 group-hover:scale-110 transition-transform" size={28} />
                <h3 className="font-semibold text-foreground text-lg">Prefer WhatsApp?</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Get instant responses! Chat with our team directly on WhatsApp for quick questions and immediate assistance.
              </p>
              <a 
                href="https://wa.me/260974399695" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all group-hover:scale-105"
              >
                <MessageCircle className="w-5 h-5" />
                Start WhatsApp Chat
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map */}
      <section className="py-12 bg-secondary/50">
        <div className="section-container">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Visit Our Office</h2>
            <p className="text-muted-foreground">Find us at Kamwala South, Lusaka, Zambia</p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-border h-[400px] shadow-xl hover:shadow-2xl transition-shadow">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30696.565642247347!2d28.267683!3d-15.417699!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1940f4417b5e4fdb%3A0x8c8c8c8c8c8c8c8c!2sKamwala%2C%20Lusaka%2C%20Zambia!5e0!3m2!1sen!2sus!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Designhub Location"
            />
          </div>
        </div>
      </section>

      {/* Enhanced Account CTA */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/30">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-2xl p-12 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors">
                  <LogIn className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Transform Your Business?</h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Create an account to access our full range of services, track your projects, and manage your digital presence all in one place.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button size="lg" asChild className="group-hover:scale-105 transition-transform">
                    <Link to="/signup" className="gap-2">
                      Create Free Account
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild className="group-hover:scale-105 transition-transform">
                    <Link to="/login">
                      Already have an account? Log In
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
