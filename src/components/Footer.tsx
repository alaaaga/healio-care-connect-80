import { Heart, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container-narrow section-padding pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-hero-bg flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl">
                Medi<span className="text-primary">Care</span>
              </span>
            </Link>
            <p className="text-background/60 text-sm leading-relaxed">
              Your trusted partner in health. Modern medical care with compassion and cutting-edge technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-background/60">
              {["Home", "Doctors", "Book Appointment", "Articles", "Contact"].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-primary transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-background/60">
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> +1 (555) 000-1234</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> hello@medicare.com</li>
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 text-primary mt-0.5" /> 123 Health Avenue, Medical City, MC 10001</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-background/60 mb-4">Stay updated with the latest health tips and news.</p>
            <div className="flex gap-2">
              <Input placeholder="Your email" className="bg-background/10 border-background/20 text-background placeholder:text-background/40" />
              <Button size="sm" className="gradient-hero-bg text-primary-foreground border-0 shrink-0">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 text-center text-sm text-background/40">
          © 2026 MediCare. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
