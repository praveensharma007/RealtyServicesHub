import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  Home,
  Wrench,
  Building,
  Users
} from "lucide-react";

export default function Footer() {
  const serviceLinks = [
    { name: "Plumbing Services", href: "#plumbing" },
    { name: "Electrical Services", href: "#electrical" },
    { name: "Medical Services", href: "#medical" },
    { name: "Transportation", href: "#transportation" },
    { name: "Grocery Delivery", href: "#grocery" },
    { name: "Property Management", href: "#property" },
  ];

  const companyLinks = [
    { name: "About Us", href: "#about" },
    { name: "Our Mission", href: "#mission" },
    { name: "Careers", href: "#careers" },
    { name: "Press & Media", href: "#press" },
    { name: "Partner With Us", href: "#partners" },
    { name: "Investor Relations", href: "#investors" },
  ];

  const supportLinks = [
    { name: "Help Center", href: "#help" },
    { name: "Contact Support", href: "#support" },
    { name: "Service Guidelines", href: "#guidelines" },
    { name: "Safety Standards", href: "#safety" },
    { name: "Dispute Resolution", href: "#disputes" },
    { name: "Report Issues", href: "#report" },
  ];

  const legalLinks = [
    { name: "Terms of Service", href: "#terms" },
    { name: "Privacy Policy", href: "#privacy" },
    { name: "Cookie Policy", href: "#cookies" },
    { name: "Data Protection", href: "#data-protection" },
    { name: "Accessibility", href: "#accessibility" },
  ];

  const socialLinks = [
    { 
      name: "Facebook", 
      icon: <Facebook className="h-5 w-5" />, 
      href: "https://facebook.com/propserve",
      color: "hover:text-blue-600"
    },
    { 
      name: "Twitter", 
      icon: <Twitter className="h-5 w-5" />, 
      href: "https://twitter.com/propserve",
      color: "hover:text-sky-500"
    },
    { 
      name: "Instagram", 
      icon: <Instagram className="h-5 w-5" />, 
      href: "https://instagram.com/propserve",
      color: "hover:text-pink-600"
    },
    { 
      name: "LinkedIn", 
      icon: <Linkedin className="h-5 w-5" />, 
      href: "https://linkedin.com/company/propserve",
      color: "hover:text-blue-700"
    },
    { 
      name: "YouTube", 
      icon: <Youtube className="h-5 w-5" />, 
      href: "https://youtube.com/@propserve",
      color: "hover:text-red-600"
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4" data-testid="text-newsletter-title">
              Stay Updated with PropServe
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto" data-testid="text-newsletter-description">
              Get the latest property listings, service updates, and exclusive offers delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 bg-white text-gray-900"
                data-testid="input-newsletter-email"
              />
              <Button 
                className="bg-blue-600 hover:bg-blue-700 px-8"
                data-testid="button-newsletter-subscribe"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Home className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold" data-testid="text-company-name">PropServe</h3>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed" data-testid="text-company-description">
                Your trusted platform for premium real estate services and professional service providers. 
                Connecting property seekers with quality homes and reliable services since 2023.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3" data-testid="contact-address">
                  <MapPin className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-300">123 Business Center, Metro City, MC 12345</span>
                </div>
                <div className="flex items-center gap-3" data-testid="contact-phone">
                  <Phone className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-300">+1 (555) 123-PROP</span>
                </div>
                <div className="flex items-center gap-3" data-testid="contact-email">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-300">hello@propserve.com</span>
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-6 flex items-center gap-2" data-testid="text-services-title">
                <Wrench className="h-5 w-5 text-blue-400" />
                Our Services
              </h4>
              <ul className="space-y-3">
                {serviceLinks.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href}
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
                      data-testid={`link-service-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-lg font-semibold mb-6 flex items-center gap-2" data-testid="text-company-title">
                <Building className="h-5 w-5 text-blue-400" />
                Company
              </h4>
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href}
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
                      data-testid={`link-company-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold mb-6 flex items-center gap-2" data-testid="text-support-title">
                <Users className="h-5 w-5 text-blue-400" />
                Support
              </h4>
              <ul className="space-y-3">
                {supportLinks.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href}
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
                      data-testid={`link-support-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-700" />

      {/* Bottom Footer */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <p className="text-gray-300 text-sm" data-testid="text-copyright">
                © 2024 PropServe. All rights reserved.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                {legalLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                    data-testid={`link-legal-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm mr-2" data-testid="text-follow-us">Follow us:</span>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 ${social.color} transition-colors duration-200 transform hover:scale-110`}
                  aria-label={social.name}
                  data-testid={`link-social-${social.name.toLowerCase()}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}