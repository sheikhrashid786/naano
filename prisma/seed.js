"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// prisma/seed.ts
var import_client = require("@prisma/client");
var import_bcryptjs = __toESM(require("bcryptjs"));
var prisma = new import_client.PrismaClient();
async function main() {
  console.log("Seeding Naano database...");
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.collaboration.deleteMany();
  await prisma.campaignBrief.deleteMany();
  await prisma.campaignAnalytics.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.creatorAnalytics.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.creator.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();
  const passwordHash = await import_bcryptjs.default.hash("password123", 10);
  const lemlistUser = await prisma.user.create({
    data: {
      email: "company@lemlist.com",
      name: "Guillaume Moubeche",
      passwordHash,
      role: import_client.Role.COMPANY,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      company: {
        create: {
          name: "lemlist",
          website: "https://lemlist.com",
          logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80",
          tagline: "The all-in-one outreach platform that gets you meetings",
          description: "lemlist helps B2B sales teams find buyer leads, personalize multi-channel sequences with AI, and get replies with deliverability boosters.",
          industry: "B2B SaaS & Sales Tech",
          country: "FR",
          targetIndustries: "B2B Outbound,Sales Tech,AI & SaaS,Growth Marketing",
          targetCountries: "FR,US,GB,DE",
          targetRoles: "Founders,Sales leaders,GTM teams",
          plan: "Managed"
        }
      }
    },
    include: { company: true }
  });
  const leadbayUser = await prisma.user.create({
    data: {
      email: "growth@leadbay.ai",
      name: "Thomas Marcelle",
      passwordHash,
      role: import_client.Role.COMPANY,
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      company: {
        create: {
          name: "Leadbay",
          website: "https://leadbay.ai",
          logoUrl: "https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=200&auto=format&fit=crop&q=80",
          tagline: "AI lead qualification and CRM enrichment",
          description: "Automate sales pipeline discovery and research accounts in seconds with our AI research agents.",
          industry: "AI & Data Intelligence",
          country: "FR",
          targetIndustries: "AI & SaaS,GTM Strategy,Sales Engineering",
          targetCountries: "FR,US,GB",
          targetRoles: "RevOps,Founders,Sales leaders",
          plan: "Self-Serve"
        }
      }
    },
    include: { company: true }
  });
  const attioUser = await prisma.user.create({
    data: {
      email: "contact@attio.com",
      name: "Nicolas Vorsteveld",
      passwordHash,
      role: import_client.Role.COMPANY,
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
      company: {
        create: {
          name: "Attio",
          website: "https://attio.com",
          logoUrl: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=200&auto=format&fit=crop&q=80",
          tagline: "The AI-native CRM built for fast-growing companies",
          description: "Attio is a real-time, customizable CRM built for modern tech teams who need powerful automation.",
          industry: "CRM & Cloud",
          country: "GB",
          targetIndustries: "CRM,SaaS,Startup Growth",
          targetCountries: "GB,US,FR,DE",
          targetRoles: "Founders,GTM teams,Product leaders",
          plan: "Managed"
        }
      }
    },
    include: { company: true }
  });
  const creatorsData = [
    {
      email: "eric@creator.io",
      name: "Eric Nowosielski",
      headline: "Helping 50,000+ Founders & SDRs scale B2B Outbound | 150M+ impressions",
      bio: "Ex-VP Sales sharing actionable breakdowns of cold outreach, lead magnets, and LinkedIn organic playbooks for B2B tech companies.",
      niche: "B2B Outbound & Cold Email",
      industry: "Sales Tech",
      country: "FR",
      followersCount: 48500,
      engagementRate: 4.8,
      pricePerPost: 250,
      badge: "Top Creator",
      featured: true,
      avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80"
    },
    {
      email: "robin@creator.io",
      name: "Robin Delaere",
      headline: "AI Agents, LLM workflows & MCP architecture for modern GTM teams",
      bio: "Writing daily about AI workflows, software development, and automation hacks for developers and technical founders.",
      niche: "AI Agents & Automation",
      industry: "AI & SaaS",
      country: "FR",
      followersCount: 26200,
      engagementRate: 5.2,
      pricePerPost: 180,
      badge: "Verified B2B",
      featured: true,
      avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80"
    },
    {
      email: "aya@creator.io",
      name: "Aya Tange",
      headline: "Growth & GTM Strategist | Advisor to Seed to Series B SaaS",
      bio: "Documenting what actually drives ARR growth in B2B SaaS. Founder-led marketing, creator collaboration, and pipeline velocity.",
      niche: "GTM & SaaS Growth",
      industry: "Growth Marketing",
      country: "GB",
      followersCount: 39400,
      engagementRate: 4.5,
      pricePerPost: 220,
      badge: "Top Creator",
      featured: true,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
    },
    {
      email: "marina@creator.io",
      name: "Marina Garmash",
      headline: "Product Marketing & Positioning expert for enterprise software",
      bio: "Helping SaaS products communicate their differentiation so customers actually buy. Deep dive teardowns of landing pages and product hooks.",
      niche: "Product Marketing",
      industry: "B2B Marketing",
      country: "DE",
      followersCount: 16800,
      engagementRate: 6.1,
      pricePerPost: 140,
      badge: "Rising Star",
      featured: false,
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80"
    },
    {
      email: "david@creator.io",
      name: "David Zmirov",
      headline: "CEO Zmirov Communication | Managing \u20AC10M+ influence budgets annually",
      bio: "Veteran influence strategist in B2B and enterprise tech. Keynote speaker on Creator-Led Growth and executive personal branding.",
      niche: "Influence & Brand Strategy",
      industry: "Enterprise Tech",
      country: "FR",
      followersCount: 89e3,
      engagementRate: 3.9,
      pricePerPost: 480,
      badge: "Top Creator",
      featured: true,
      avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80"
    },
    {
      email: "sarah@creator.io",
      name: "Sarah Jenkins",
      headline: "RevOps Leader & Salesforce MVP | Building predictable revenue engines",
      bio: "Bridging marketing, sales, and customer success pipelines. Real case studies on data-driven revenue operations.",
      niche: "RevOps & Sales Engineering",
      industry: "Sales Tech",
      country: "US",
      followersCount: 21500,
      engagementRate: 4.7,
      pricePerPost: 190,
      badge: "Verified B2B",
      featured: false,
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80"
    },
    {
      email: "alexandre@creator.io",
      name: "Alexandre Martin",
      headline: "Bootstrapped 0 to $1M ARR | Sharing the unfiltered playbook",
      bio: "Writing candid post-mortems and growth frameworks for solo founders and small engineering teams scaling B2B micro-SaaS.",
      niche: "Founder-Led Growth",
      industry: "Startup Growth",
      country: "FR",
      followersCount: 32400,
      engagementRate: 4.3,
      pricePerPost: 210,
      badge: "Top Creator",
      featured: false,
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
    },
    {
      email: "elena@creator.io",
      name: "Elena Rostova",
      headline: "B2B Copywriter & Lead Magnet Specialist | 40%+ DM conversion rates",
      bio: "I teach tech companies how to turn LinkedIn comments into pipeline via organic lead magnets and high-intent automated follow-ups.",
      niche: "B2B Copywriting & Lead Magnets",
      industry: "Growth Marketing",
      country: "NL",
      followersCount: 14200,
      engagementRate: 5.7,
      pricePerPost: 130,
      badge: "Rising Star",
      featured: false,
      avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80"
    }
  ];
  const createdCreators = [];
  for (const c of creatorsData) {
    const creatorUser = await prisma.user.create({
      data: {
        email: c.email,
        name: c.name,
        passwordHash,
        role: import_client.Role.CREATOR,
        avatarUrl: c.avatarUrl,
        creator: {
          create: {
            headline: c.headline,
            bio: c.bio,
            niche: c.niche,
            industry: c.industry,
            country: c.country,
            followersCount: c.followersCount,
            engagementRate: c.engagementRate,
            pricePerPost: c.pricePerPost,
            badge: c.badge,
            featured: c.featured,
            avatarUrl: c.avatarUrl,
            linkedinUrl: `https://linkedin.com/in/${c.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`
          }
        }
      },
      include: { creator: true }
    });
    createdCreators.push(creatorUser.creator);
  }
  const lemlistCampaign = await prisma.campaign.create({
    data: {
      companyId: lemlistUser.company.id,
      title: "lemlist AI v5 Launch: Personalization that Converts",
      objective: "Brand Awareness & Lead Generation",
      description: "Highlighting how B2B sales teams can run personalized LinkedIn & email outbound sequences in under 5 minutes without generic AI spam.",
      deliverables: "1 In-depth LinkedIn Post with concrete case study + Lead magnet tracked link in comments",
      targetAudience: "Founders, SDR Managers, Sales Leaders, RevOps",
      budgetPerPost: 250,
      status: import_client.CampaignStatus.ACTIVE,
      startDate: /* @__PURE__ */ new Date(),
      brief: {
        create: {
          angle: "Contrast the old way of generic spam sequences with smart, intent-triggered AI research that sounds authentically human.",
          suggestedHooks: JSON.stringify([
            "99% of AI cold emails get deleted instantly. Here's what the 1% doing $50k/mo do differently:",
            "We audited 1,400 LinkedIn outreach messages last month. The highest-converting one broke every rule:",
            "Stop sending 'quick questions'. Here is how to book enterprise demo meetings without annoying your buyers:"
          ]),
          keyTalkingPoints: "1. Mention hyper-personalization based on recent buyer activity.\n2. Point out deliverability warm-up tools.\n3. Mention our free 14-day trial without credit card.",
          dosAndDonts: "DO: Share personal experience or real screenshots.\nDON'T: Sound like a corporate press release.\nDON'T: Put the link in the main post body (keep it in the 1st comment).",
          trackingUrl: "https://lemlist.com/?utm_source=naano&utm_medium=creator",
          callToAction: 'Comment "OUTBOUND" below and I will DM you our 2026 Cold Email Playbook.'
        }
      }
    }
  });
  const leadbayCampaign = await prisma.campaign.create({
    data: {
      companyId: leadbayUser.company.id,
      title: "Leadbay Claude MCP Integration: Instant Account Research",
      objective: "Product Launch & Trials",
      description: "Showcasing the new Leadbay MCP server that lets Cursor and Claude Code users research prospective B2B accounts directly in their CLI.",
      deliverables: "1 LinkedIn post showing a 30-second screen demo or carousel breakdown",
      targetAudience: "Technical Founders, Engineers, Sales Engineers",
      budgetPerPost: 180,
      status: import_client.CampaignStatus.ACTIVE,
      startDate: /* @__PURE__ */ new Date(),
      brief: {
        create: {
          angle: "AI Agents are useless without real-time company intelligence. Here is how MCP bridges the gap for GTM teams.",
          suggestedHooks: JSON.stringify([
            "I connected Claude Code directly to our company lead database using MCP. The result blew my mind:",
            "Developers are replacing 4 sales tools with 1 Claude prompt. Here is how:"
          ]),
          keyTalkingPoints: "1. Open-source MCP standard compatibility.\n2. Instant enrichment of tech stack and hiring signals.\n3. 100 free credits upon sign up.",
          dosAndDonts: "DO: Keep it practical and dev-friendly.\nDON'T: Overcomplicate technical terms.",
          trackingUrl: "https://leadbay.ai/?ref=naano-creator",
          callToAction: "Get 100 free credits to test the MCP server here."
        }
      }
    }
  });
  const eric = createdCreators.find((c) => c.niche.includes("Outbound"));
  const robin = createdCreators.find((c) => c.niche.includes("AI Agents"));
  const aya = createdCreators.find((c) => c.niche.includes("GTM"));
  const collab1 = await prisma.collaboration.create({
    data: {
      campaignId: lemlistCampaign.id,
      companyId: lemlistUser.company.id,
      creatorId: eric.id,
      status: import_client.CollabStatus.CONTENT_SUBMITTED,
      fixedRate: 250,
      pitchMessage: "Hey Guillaume! I've been using lemlist for 3 years. I have a 12-slide carousel ready breaking down our exact 42% reply rate sequence. Would love to feature you guys.",
      submittedPostUrl: "https://www.linkedin.com/posts/eric-nowosielski_b2b-outbound-cold-email-lemlist-activity-719382910482",
      postProofText: "Published at 08:30 AM CET. Reached 18,400 impressions in the first 4 hours with 124 comments asking for the playbook.",
      publishedAt: /* @__PURE__ */ new Date(),
      clicksCount: 238,
      leadsCount: 42,
      conversation: {
        create: {
          messages: {
            create: [
              {
                senderId: lemlistUser.id,
                content: "Hi Eric! Loved your pitch. The brief is attached. Looking forward to your breakdown post."
              },
              {
                senderId: eric.userId,
                content: "Thanks Guillaume! Post is live now. Link and tracking proof submitted for your review."
              }
            ]
          }
        }
      },
      payment: {
        create: {
          amount: 250,
          currency: "EUR",
          status: import_client.PayoutStatus.PENDING
        }
      }
    }
  });
  const collab2 = await prisma.collaboration.create({
    data: {
      campaignId: leadbayCampaign.id,
      companyId: leadbayUser.company.id,
      creatorId: robin.id,
      status: import_client.CollabStatus.COMPLETED,
      fixedRate: 180,
      pitchMessage: "I build MCP servers every weekend and have an audience of 26k engineers and technical founders eager to see this in action.",
      submittedPostUrl: "https://www.linkedin.com/posts/robin-delaere_mcp-claude-leadbay-sales-automation-71982749182",
      postProofText: "Video demo got 32k views and 85 repo stars/signups.",
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1e3),
      clicksCount: 384,
      leadsCount: 68,
      conversation: {
        create: {
          messages: {
            create: [
              {
                senderId: leadbayUser.id,
                content: "Awesome demo Robin! Approved and payment sent via Stripe Connect."
              },
              {
                senderId: robin.userId,
                content: "Super smooth collaboration, thanks Thomas!"
              }
            ]
          }
        }
      },
      payment: {
        create: {
          amount: 180,
          currency: "EUR",
          status: import_client.PayoutStatus.PAID,
          stripePayoutId: "po_1NkZ9f2eZvKYlo2C78aXbY3e",
          paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1e3)
        }
      }
    }
  });
  await prisma.collaboration.create({
    data: {
      campaignId: lemlistCampaign.id,
      companyId: lemlistUser.company.id,
      creatorId: aya.id,
      status: import_client.CollabStatus.IN_PROGRESS,
      fixedRate: 220,
      pitchMessage: "Excited to showcase how founder-led content converts 3x higher than paid search ads.",
      conversation: {
        create: {
          messages: {
            create: [
              {
                senderId: lemlistUser.id,
                content: "Welcome aboard Aya! Brief is locked in, ping us here whenever your draft is ready."
              }
            ]
          }
        }
      }
    }
  });
  await prisma.notification.createMany({
    data: [
      {
        userId: lemlistUser.id,
        title: "Content Submitted for Approval",
        message: 'Eric Nowosielski submitted a live post link for "lemlist AI v5 Launch". Click to review and approve.',
        link: "/dashboard/company/collabs",
        isRead: false
      },
      {
        userId: eric.userId,
        title: "New Campaign Invitation",
        message: "lemlist invited you to collaborate on their upcoming AI Outbound campaign with a fixed fee of \u20AC250.",
        link: "/dashboard/creator/applications",
        isRead: true
      },
      {
        userId: robin.userId,
        title: "Payment Processed",
        message: "Your payout of \u20AC180 for the Leadbay campaign has been deposited to your account via Stripe Connect.",
        link: "/dashboard/creator/gains",
        isRead: false
      }
    ]
  });
  await prisma.favorite.create({
    data: {
      companyId: lemlistUser.company.id,
      creatorId: eric.id
    }
  });
  for (let i = 7; i >= 0; i--) {
    const d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() - i);
    await prisma.campaignAnalytics.create({
      data: {
        campaignId: lemlistCampaign.id,
        date: d,
        clicks: Math.floor(35 + Math.random() * 45),
        leads: Math.floor(6 + Math.random() * 12),
        pipelineValue: Math.floor(1200 + Math.random() * 2500)
      }
    });
  }
  console.log("Seed completed successfully!");
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
