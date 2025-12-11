import { Heart, MessageCircle, Target, Handshake, Award } from "lucide-react";
import { motion } from "framer-motion";

const reasons = [
  {
    icon: Heart,
    title: "Friendly & Human",
    description: "We communicate clearly, without jargon. Marketing doesn't have to feel cold or impersonal.",
  },
  {
    icon: MessageCircle,
    title: "We Keep It Simple",
    description: "No confusing tech talk. Just clear, easy-to-understand solutions that make sense.",
  },
  {
    icon: Target,
    title: "Results-Focused",
    description: "We track progress and optimize for growth. Your success is how we measure ours.",
  },
  {
    icon: Handshake,
    title: "Partnership Over Transactions",
    description: "We stick with you every step of the way. Your business is treated like our own.",
  },
  {
    icon: Award,
    title: "Local & Trusted",
    description: "Based in Lusaka, serving businesses across Zambia with personal care and attention.",
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
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 },
  },
};

export function WhyChooseUs() {
  return (
    <section className="py-24 bg-secondary/50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Why Businesses <span className="text-primary">Love Working</span> with Designhub
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              At Designhub, we believe business should feel personal. We're not just about websites and ads—we're about helping people like you tell your story, connect with your customers, and grow your dreams.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border"
            >
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">👋</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">Founded by Joshua Muhali</p>
                <p className="text-sm text-muted-foreground">With a vision to make digital marketing simple and accessible</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="space-y-4"
          >
            {reasons.map((reason, index) => (
              <motion.div
                key={reason.title}
                variants={itemVariants}
                whileHover={{ x: 8, transition: { duration: 0.2 } }}
                className="flex gap-4 p-5 rounded-xl bg-card border border-border hover:shadow-md transition-shadow cursor-default"
              >
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"
                >
                  <reason.icon size={24} className="text-primary" />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{reason.title}</h3>
                  <p className="text-sm text-muted-foreground">{reason.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
