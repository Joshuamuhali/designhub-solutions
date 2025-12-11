import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Do I need technical knowledge to work with Designhub?",
    answer: "Not at all! We explain everything in plain language and guide you step by step. Our goal is to make digital marketing approachable and stress-free for you.",
  },
  {
    question: "Can I customize my package?",
    answer: "Absolutely! Our packages are flexible, so you can mix & match services to create the perfect solution for your business needs and budget.",
  },
  {
    question: "How long does a website take to complete?",
    answer: "It depends on the package and complexity. Basic websites typically take 1-2 weeks, standard websites 2-3 weeks, and premium websites with e-commerce or custom features can take 4-6 weeks.",
  },
  {
    question: "Do you manage social media content for me?",
    answer: "Yes! Our social media management packages include content creation, posting, and engagement with your audience. You can choose from our Starter Spark, Elevate Edge, or Prestige Pulse packages.",
  },
  {
    question: "Can you help me sell more with my website?",
    answer: "Definitely! Our sales outsourcing and lead management services help turn visitors into customers. We handle everything from lead capture to nurturing and closing.",
  },
  {
    question: "What if I already have a website?",
    answer: "We can help! We offer website maintenance, redesign services, and SEO optimization to improve your existing site's performance and appearance.",
  },
  {
    question: "Do you work with small businesses?",
    answer: "Yes, we love working with businesses of all sizes! Whether you're a startup or an established company, we tailor our services to fit your needs and budget.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept mobile money, bank transfers, and cash payments. Payment terms are typically 50% upfront and 50% upon completion for project-based work.",
  },
  {
    question: "Do you offer ongoing support after the project?",
    answer: "Absolutely! We offer website maintenance packages starting at K2,500/month, and we're always available for questions and support even after your project is completed.",
  },
  {
    question: "How do I get started?",
    answer: "Simply reach out to us via our contact form, WhatsApp, or phone. We'll schedule a free consultation to discuss your goals and recommend the best solution for your business.",
  },
];

const FAQ = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-secondary/50 to-background">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Frequently Asked <span className="text-primary">Questions</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Got questions? We've got answers. Here are some common questions we receive from our clients.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 bg-background">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="text-left text-foreground font-medium py-5 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-secondary/50">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Still Have Questions?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            We're here to help! Reach out and we'll get back to you as soon as possible.
          </p>
          <Button size="lg" asChild>
            <Link to="/contact">
              Contact Us
              <ArrowRight size={18} />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default FAQ;
