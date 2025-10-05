import { Building2 } from "lucide-react";

interface ServiceLogoProps {
  serviceName: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const logoMap: Record<string, string> = {
  netflix: "https://logo.clearbit.com/netflix.com",
  shopify: "https://logo.clearbit.com/shopify.com",
  github: "https://logo.clearbit.com/github.com",
  notion: "https://logo.clearbit.com/notion.so",
  figma: "https://logo.clearbit.com/figma.com",
  vercel: "https://logo.clearbit.com/vercel.com",
  slack: "https://logo.clearbit.com/slack.com",
  linear: "https://logo.clearbit.com/linear.app",
  openai: "https://logo.clearbit.com/openai.com",
  adobe: "https://logo.clearbit.com/adobe.com",
  google: "https://logo.clearbit.com/google.com",
  microsoft: "https://logo.clearbit.com/microsoft.com",
  apple: "https://logo.clearbit.com/apple.com",
  spotify: "https://logo.clearbit.com/spotify.com",
  dropbox: "https://logo.clearbit.com/dropbox.com",
  zoom: "https://logo.clearbit.com/zoom.us",
  canva: "https://logo.clearbit.com/canva.com",
  mailchimp: "https://logo.clearbit.com/mailchimp.com",
  hubspot: "https://logo.clearbit.com/hubspot.com",
  salesforce: "https://logo.clearbit.com/salesforce.com",
  asana: "https://logo.clearbit.com/asana.com",
  trello: "https://logo.clearbit.com/trello.com",
  monday: "https://logo.clearbit.com/monday.com",
  clickup: "https://logo.clearbit.com/clickup.com",
  airtable: "https://logo.clearbit.com/airtable.com",
  miro: "https://logo.clearbit.com/miro.com",
  discord: "https://logo.clearbit.com/discord.com",
  twilio: "https://logo.clearbit.com/twilio.com",
  sendgrid: "https://logo.clearbit.com/sendgrid.com",
  stripe: "https://logo.clearbit.com/stripe.com",
  paypal: "https://logo.clearbit.com/paypal.com",
  aws: "https://logo.clearbit.com/aws.amazon.com",
  digitalocean: "https://logo.clearbit.com/digitalocean.com",
  heroku: "https://logo.clearbit.com/heroku.com",
  cloudflare: "https://logo.clearbit.com/cloudflare.com",
};

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-10 w-10",
};

export function ServiceLogo({ serviceName, size = "md", className = "" }: ServiceLogoProps) {
  const normalizedName = serviceName.toLowerCase().replace(/\s+/g, "");
  const logoUrl = logoMap[normalizedName];

  if (!logoUrl) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-lg bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center ${className}`}
      >
        <Building2 className="h-1/2 w-1/2 text-primary" />
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-lg overflow-hidden bg-white shadow-sm ${className}`}>
      <img
        src={logoUrl}
        alt={`${serviceName} logo`}
        className="h-full w-full object-contain p-1"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = "none";
          const parent = target.parentElement;
          if (parent) {
            parent.className = `${sizeClasses[size]} rounded-lg bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center ${className}`;
            parent.innerHTML = `<svg class="h-1/2 w-1/2 text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>`;
          }
        }}
      />
    </div>
  );
}
