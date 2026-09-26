import { prisma } from '@/lib/prisma';
import { Role, CampaignStatus, CollabStatus, PayoutStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function seedDatabase() {
  console.log('Seeding Naano database with full comprehensive suite...');

  // Clean existing records in reverse dependency order
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
  await prisma.caseStudyItem.deleteMany();
  await prisma.blogItem.deleteMany();
  await prisma.platformSetting.deleteMany();
  await prisma.adminAuditLog.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. ADMIN USER
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@naano.io',
      name: 'Super Admin',
      passwordHash,
      role: Role.ADMIN,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    },
  });

  // 2. COMPANIES & USERS
  const lemlistUser = await prisma.user.create({
    data: {
      email: 'brand@lemlist.com',
      name: 'Guillaume Moubeche',
      passwordHash,
      role: Role.COMPANY,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      company: {
        create: {
          name: 'lemlist',
          website: 'https://lemlist.com',
          logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
          tagline: 'The all-in-one outreach platform that gets you meetings',
          description: 'lemlist helps B2B sales teams find buyer leads, personalize multi-channel sequences with AI, and get replies with deliverability boosters.',
          industry: 'B2B SaaS & Sales Tech',
          country: 'FR',
          targetIndustries: 'B2B Outbound,Sales Tech,AI & SaaS,Growth Marketing',
          targetCountries: 'FR,US,GB,DE',
          targetRoles: 'Founders,Sales leaders,GTM teams',
          plan: 'Managed'
        }
      }
    },
    include: { company: true }
  });

  // Legacy alias for company@lemlist.com
  await prisma.user.create({
    data: {
      email: 'company@lemlist.com',
      name: 'lemlist Growth Team',
      passwordHash,
      role: Role.COMPANY,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    }
  });

  const leadbayUser = await prisma.user.create({
    data: {
      email: 'growth@leadbay.ai',
      name: 'Thomas Marcelle',
      passwordHash,
      role: Role.COMPANY,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      company: {
        create: {
          name: 'Leadbay',
          website: 'https://leadbay.ai',
          logoUrl: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=200&auto=format&fit=crop&q=80',
          tagline: 'AI lead qualification and CRM enrichment',
          description: 'Automate sales pipeline discovery and research accounts in seconds with our AI research agents.',
          industry: 'AI & Data Intelligence',
          country: 'FR',
          targetIndustries: 'AI & SaaS,GTM Strategy,Sales Engineering',
          targetCountries: 'FR,US,GB',
          targetRoles: 'RevOps,Founders,Sales leaders',
          plan: 'Self-Serve'
        }
      }
    },
    include: { company: true }
  });

  const attioUser = await prisma.user.create({
    data: {
      email: 'contact@attio.com',
      name: 'Nicolas Vorsteveld',
      passwordHash,
      role: Role.COMPANY,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      company: {
        create: {
          name: 'Attio',
          website: 'https://attio.com',
          logoUrl: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=200&auto=format&fit=crop&q=80',
          tagline: 'The AI-native CRM built for fast-growing companies',
          description: 'Attio is a real-time, customizable CRM built for modern tech teams who need powerful automation.',
          industry: 'CRM & Cloud',
          country: 'GB',
          targetIndustries: 'CRM,SaaS,Startup Growth',
          targetCountries: 'GB,US,FR,DE',
          targetRoles: 'Founders,GTM teams,Product leaders',
          plan: 'Managed'
        }
      }
    },
    include: { company: true }
  });

  // 3. CREATORS & USERS
  const creatorsData = [
    {
      email: 'creator@naano.io',
      name: 'Eric Nowosielski',
      headline: 'Helping 50,000+ Founders & SDRs scale B2B Outbound | 150M+ impressions',
      bio: 'Ex-VP Sales sharing actionable breakdowns of cold outreach, lead magnets, and LinkedIn organic playbooks for B2B tech companies.',
      niche: 'B2B Outbound & Cold Email',
      industry: 'Sales Tech',
      country: 'FR',
      followersCount: 48500,
      engagementRate: 4.8,
      pricePerPost: 250,
      badge: 'Top Creator',
      featured: true,
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80'
    },
    {
      email: 'eric@creator.io',
      name: 'Eric N. (Backup)',
      headline: 'B2B Cold Outreach & LinkedIn Growth',
      bio: 'Practitioner insights on cold emails and inbound demand generation.',
      niche: 'B2B Outbound',
      industry: 'Sales Tech',
      country: 'FR',
      followersCount: 35000,
      engagementRate: 4.6,
      pricePerPost: 220,
      badge: 'Verified B2B',
      featured: false,
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80'
    },
    {
      email: 'robin@creator.io',
      name: 'Robin Delaere',
      headline: 'AI Agents, LLM workflows & MCP architecture for modern GTM teams',
      bio: 'Writing daily about AI workflows, software development, and automation hacks for developers and technical founders.',
      niche: 'AI Agents & Automation',
      industry: 'AI & SaaS',
      country: 'FR',
      followersCount: 26200,
      engagementRate: 5.2,
      pricePerPost: 180,
      badge: 'Verified B2B',
      featured: true,
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80'
    },
    {
      email: 'aya@creator.io',
      name: 'Aya Tange',
      headline: 'Growth & GTM Strategist | Advisor to Seed to Series B SaaS',
      bio: 'Documenting what actually drives ARR growth in B2B SaaS. Founder-led marketing, creator collaboration, and pipeline velocity.',
      niche: 'GTM & SaaS Growth',
      industry: 'Growth Marketing',
      country: 'GB',
      followersCount: 39400,
      engagementRate: 4.5,
      pricePerPost: 220,
      badge: 'Top Creator',
      featured: true,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
    },
    {
      email: 'marina@creator.io',
      name: 'Marina Garmash',
      headline: 'Product Marketing & Positioning expert for enterprise software',
      bio: 'Helping SaaS products communicate their differentiation so customers actually buy. Deep dive teardowns of landing pages and product hooks.',
      niche: 'Product Marketing',
      industry: 'B2B Marketing',
      country: 'DE',
      followersCount: 16800,
      engagementRate: 6.1,
      pricePerPost: 140,
      badge: 'Rising Star',
      featured: false,
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80'
    },
    {
      email: 'david@creator.io',
      name: 'David Zmirov',
      headline: 'CEO Zmirov Communication | Managing €10M+ influence budgets annually',
      bio: 'Veteran influence strategist in B2B and enterprise tech. Keynote speaker on Creator-Led Growth and executive personal branding.',
      niche: 'Influence & Brand Strategy',
      industry: 'Enterprise Tech',
      country: 'FR',
      followersCount: 89000,
      engagementRate: 3.9,
      pricePerPost: 480,
      badge: 'Top Creator',
      featured: true,
      avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80'
    },
    {
      email: 'sarah@creator.io',
      name: 'Sarah Jenkins',
      headline: 'RevOps Leader & Salesforce MVP | Building predictable revenue engines',
      bio: 'Bridging marketing, sales, and customer success pipelines. Real case studies on data-driven revenue operations.',
      niche: 'RevOps & Sales Engineering',
      industry: 'Sales Tech',
      country: 'US',
      followersCount: 21500,
      engagementRate: 4.7,
      pricePerPost: 190,
      badge: 'Verified B2B',
      featured: false,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80'
    },
    {
      email: 'alexandre@creator.io',
      name: 'Alexandre Martin',
      headline: 'Bootstrapped 0 to $1M ARR | Sharing the unfiltered playbook',
      bio: 'Writing candid post-mortems and growth frameworks for solo founders and small engineering teams scaling B2B micro-SaaS.',
      niche: 'Founder-Led Growth',
      industry: 'Startup Growth',
      country: 'FR',
      followersCount: 32400,
      engagementRate: 4.3,
      pricePerPost: 210,
      badge: 'Top Creator',
      featured: false,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
    },
    {
      email: 'elena@creator.io',
      name: 'Elena Rostova',
      headline: 'B2B Copywriter & Lead Magnet Specialist | 40%+ DM conversion rates',
      bio: 'I teach tech companies how to turn LinkedIn comments into pipeline via organic lead magnets and high-intent automated follow-ups.',
      niche: 'B2B Copywriting & Lead Magnets',
      industry: 'Growth Marketing',
      country: 'NL',
      followersCount: 14200,
      engagementRate: 5.7,
      pricePerPost: 130,
      badge: 'Rising Star',
      featured: false,
      avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80'
    }
  ];

  const createdCreators = [];

  for (const c of creatorsData) {
    const creatorUser = await prisma.user.create({
      data: {
        email: c.email,
        name: c.name,
        passwordHash,
        role: Role.CREATOR,
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
            linkedinUrl: `https://linkedin.com/in/${c.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
          }
        }
      },
      include: { creator: true }
    });
    createdCreators.push(creatorUser.creator!);
  }

  // 4. CAMPAIGNS & BRIEFS
  const lemlistCampaign = await prisma.campaign.create({
    data: {
      companyId: lemlistUser.company!.id,
      title: 'lemlist AI v5 Launch: Personalization that Converts',
      objective: 'Brand Awareness & Lead Generation',
      description: 'Highlighting how B2B sales teams can run personalized LinkedIn & email outbound sequences in under 5 minutes without generic AI spam.',
      deliverables: '1 In-depth LinkedIn Post with concrete case study + Lead magnet tracked link in comments',
      targetAudience: 'Founders, SDR Managers, Sales Leaders, RevOps',
      budgetPerPost: 250,
      status: CampaignStatus.ACTIVE,
      startDate: new Date(),
      brief: {
        create: {
          angle: 'Contrast the old way of generic spam sequences with smart, intent-triggered AI research that sounds authentically human.',
          suggestedHooks: JSON.stringify([
            "99% of AI cold emails get deleted instantly. Here's what the 1% doing $50k/mo do differently:",
            "We audited 1,400 LinkedIn outreach messages last month. The highest-converting one broke every rule:",
            "Stop sending 'quick questions'. Here is how to book enterprise demo meetings without annoying your buyers:"
          ]),
          keyTalkingPoints: '1. Mention hyper-personalization based on recent buyer activity.\n2. Point out deliverability warm-up tools.\n3. Mention our free 14-day trial without credit card.',
          dosAndDonts: 'DO: Share personal experience or real screenshots.\nDON\'T: Sound like a corporate press release.\nDON\'T: Put the link in the main post body (keep it in the 1st comment).',
          trackingUrl: 'https://lemlist.com/?utm_source=naano&utm_medium=creator',
          callToAction: 'Comment "OUTBOUND" below and I will DM you our 2026 Cold Email Playbook.'
        }
      }
    }
  });

  const leadbayCampaign = await prisma.campaign.create({
    data: {
      companyId: leadbayUser.company!.id,
      title: 'Leadbay Claude MCP Integration: Instant Account Research',
      objective: 'Product Launch & Trials',
      description: 'Showcasing the new Leadbay MCP server that lets Cursor and Claude Code users research prospective B2B accounts directly in their CLI.',
      deliverables: '1 LinkedIn post showing a 30-second screen demo or carousel breakdown',
      targetAudience: 'Technical Founders, Engineers, Sales Engineers',
      budgetPerPost: 180,
      status: CampaignStatus.ACTIVE,
      startDate: new Date(),
      brief: {
        create: {
          angle: 'AI Agents are useless without real-time company intelligence. Here is how MCP bridges the gap for GTM teams.',
          suggestedHooks: JSON.stringify([
            "I connected Claude Code directly to our company lead database using MCP. The result blew my mind:",
            "Developers are replacing 4 sales tools with 1 Claude prompt. Here is how:"
          ]),
          keyTalkingPoints: '1. Open-source MCP standard compatibility.\n2. Instant enrichment of tech stack and hiring signals.\n3. 100 free credits upon sign up.',
          dosAndDonts: 'DO: Keep it practical and dev-friendly.\nDON\'T: Overcomplicate technical terms.',
          trackingUrl: 'https://leadbay.ai/?ref=naano-creator',
          callToAction: 'Get 100 free credits to test the MCP server here.'
        }
      }
    }
  });

  // 5. COLLABORATIONS
  const demoCreator = createdCreators[0]; // creator@naano.io
  const robin = createdCreators.find((c) => c.niche.includes('AI Agents'))!;
  const aya = createdCreators.find((c) => c.niche.includes('GTM'))!;

  await prisma.collaboration.create({
    data: {
      campaignId: lemlistCampaign.id,
      companyId: lemlistUser.company!.id,
      creatorId: demoCreator.id,
      status: CollabStatus.CONTENT_SUBMITTED,
      fixedRate: 250,
      pitchMessage: "Hey Guillaume! I've been using lemlist for 3 years. I have a 12-slide carousel ready breaking down our exact 42% reply rate sequence. Would love to feature you guys.",
      submittedPostUrl: 'https://www.linkedin.com/posts/eric-nowosielski_b2b-outbound-cold-email-lemlist-activity-719382910482',
      postProofText: 'Published at 08:30 AM CET. Reached 18,400 impressions in the first 4 hours with 124 comments asking for the playbook.',
      publishedAt: new Date(),
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
                senderId: demoCreator.userId,
                content: "Thanks Guillaume! Post is live now. Link and tracking proof submitted for your review."
              }
            ]
          }
        }
      },
      payment: {
        create: {
          amount: 250,
          currency: 'EUR',
          status: PayoutStatus.PENDING
        }
      }
    }
  });

  await prisma.collaboration.create({
    data: {
      campaignId: leadbayCampaign.id,
      companyId: leadbayUser.company!.id,
      creatorId: robin.id,
      status: CollabStatus.COMPLETED,
      fixedRate: 180,
      pitchMessage: 'I build MCP servers every weekend and have an audience of 26k engineers and technical founders eager to see this in action.',
      submittedPostUrl: 'https://www.linkedin.com/posts/robin-delaere_mcp-claude-leadbay-sales-automation-71982749182',
      postProofText: 'Video demo got 32k views and 85 repo stars/signups.',
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
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
          currency: 'EUR',
          status: PayoutStatus.PAID,
          stripePayoutId: 'po_1NkZ9f2eZvKYlo2C78aXbY3e',
          paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        }
      }
    }
  });

  await prisma.collaboration.create({
    data: {
      campaignId: lemlistCampaign.id,
      companyId: lemlistUser.company!.id,
      creatorId: aya.id,
      status: CollabStatus.IN_PROGRESS,
      fixedRate: 220,
      pitchMessage: 'Excited to showcase how founder-led content converts 3x higher than paid search ads.',
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

  // 6. NOTIFICATIONS & FAVORITES
  await prisma.notification.createMany({
    data: [
      {
        userId: lemlistUser.id,
        title: 'Content Submitted for Approval',
        message: 'Eric Nowosielski submitted a live post link for "lemlist AI v5 Launch". Click to review and approve.',
        link: '/dashboard/company/collabs',
        isRead: false
      },
      {
        userId: demoCreator.userId,
        title: 'New Campaign Invitation',
        message: 'lemlist invited you to collaborate on their upcoming AI Outbound campaign with a fixed fee of €250.',
        link: '/dashboard/creator/applications',
        isRead: true
      },
      {
        userId: robin.userId,
        title: 'Payment Processed',
        message: 'Your payout of €180 for the Leadbay campaign has been deposited to your account via Stripe Connect.',
        link: '/dashboard/creator/gains',
        isRead: false
      }
    ]
  });

  await prisma.favorite.create({
    data: {
      companyId: lemlistUser.company!.id,
      creatorId: demoCreator.id
    }
  });

  // 7. CAMPAIGN ANALYTICS (14 Days)
  for (let i = 14; i >= 0; i--) {
    const d = new Date();
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

  // 8. CASE STUDIES (CaseStudyItem)
  await prisma.caseStudyItem.createMany({
    data: [
      {
        slug: 'lemlist-outbound-engine',
        company: 'lemlist',
        logo: '/lp/logo-lemlist.png',
        tagline: 'Driving €140k in B2B SaaS Pipeline with 8 Micro-Influencers',
        industry: 'Sales Tech & Outbound',
        metric: '€140,000',
        metricLabel: 'Attributed Pipeline',
        quote: 'Naano allowed us to tap directly into authentic sales practitioner audiences with zero retainer fees or broker overhead.',
        author: 'Guillaume Moubeche',
        role: 'CEO & Co-Founder, lemlist',
        creatorsUsed: '8 Vetted Creators',
        pipelineAdded: '€140,000 ARR',
        impressions: '310,000 Views',
        clicks: '4,850 Clicks',
        readTime: '4 min read',
        date: 'Sep 2026',
        summary: 'How lemlist activated 8 niche B2B outbound influencers to drive 4,850 high-intent demo clicks with closed-loop UTM attribution.',
        challenge: 'Traditional paid search and LinkedIn sponsored updates had ballooned to €180+ CPL with low trial conversion rates.',
        strategy: 'Contracted 8 verified sales leaders to share genuine cold email audit carousels and outbound templates using Naano milestone escrow.',
        results: JSON.stringify([
          '€140,000 in tracked pipeline generated in 45 days',
          '310,000+ organic impressions across enterprise buyers',
          'CPL dropped by 64% compared to standard LinkedIn paid ads',
          '100% of posts delivered on schedule with verified UTM analytics'
        ]),
        keyTakeaways: JSON.stringify([
          'Practitioner-led proof outperforms brand-led ads by 4.2x',
          'Comments section lead magnet strategy drove 62% of all conversions',
          'Prepaid escrow built trust and eliminated contract renegotiations'
        ]),
        published: true
      },
      {
        slug: 'leadbay-claude-mcp',
        company: 'Leadbay',
        logo: '/lp/logo-leadbay.png',
        tagline: 'Scaling AI Agent & MCP Tool Adoption Among 25k Technical Founders',
        industry: 'AI & Developer Tools',
        metric: '+340%',
        metricLabel: 'CLI Downloads & Trials',
        quote: 'Working with engineering creators on Naano transformed our open-source MCP launch from obscure GitHub repo into a viral industry standard.',
        author: 'Thomas Marcelle',
        role: 'Head of Growth, Leadbay',
        creatorsUsed: '5 AI Engineers',
        pipelineAdded: '€85,000 ARR',
        impressions: '185,000 Views',
        clicks: '2,420 Clicks',
        readTime: '5 min read',
        date: 'Sep 2026',
        summary: 'Leadbay partnered with 5 technical AI builders to demonstrate real-time account research directly inside Claude Code and Cursor.',
        challenge: 'Developer tools are notoriously hard to promote through conventional corporate advertising.',
        strategy: 'Identified top AI agent creators on LinkedIn who built real-world CLI demos showcasing Leadbay APIs.',
        results: JSON.stringify([
          '340% increase in weekly CLI package installations',
          '12,000 developer account signups in 30 days',
          'Over 40 organic reposts from enterprise CTOs and founders'
        ]),
        keyTakeaways: JSON.stringify([
          'Developers only trust other developers showing working code',
          'Screen demos under 45 seconds achieved 82% retention',
          'UTM-tagged comment links avoided LinkedIn algorithm reach penalties'
        ]),
        published: true
      },
      {
        slug: 'attio-crm-migration',
        company: 'Attio',
        logo: '/lp/logo-attio.png',
        tagline: 'Capturing Enterprise RevOps Buyers Migrating Away from Legacy CRMs',
        industry: 'CRM & Cloud',
        metric: '48 Migrations',
        metricLabel: 'Enterprise Wins',
        quote: 'Naano gave us unprecedented transparency into creator performance and guaranteed escrow safety.',
        author: 'Nicolas Vorsteveld',
        role: 'VP Marketing, Attio',
        creatorsUsed: '6 RevOps Experts',
        pipelineAdded: '€210,000 ARR',
        impressions: '420,000 Views',
        clicks: '5,600 Clicks',
        readTime: '6 min read',
        date: 'Sep 2026',
        summary: 'Attio enlisted 6 senior RevOps consultants on LinkedIn to share migration playbooks from Salesforce and HubSpot.',
        challenge: 'High customer acquisition costs in the crowded CRM software space.',
        strategy: 'Positioned Attio as the modern developer-friendly alternative through teardowns published by respected revenue architects.',
        results: JSON.stringify([
          '48 qualified enterprise CRM migration deals initiated',
          '€210,000 ARR added to sales pipeline in 60 days',
          '5,600 qualified clicks to the interactive migration calculator'
        ]),
        keyTakeaways: JSON.stringify([
          'Consultant authority cuts sales cycles by nearly half',
          'Deep workflow breakdowns drive higher ASP than short promotional posts'
        ]),
        published: true
      }
    ]
  });

  // 9. BLOG ARTICLES (BlogItem)
  await prisma.blogItem.createMany({
    data: [
      {
        slug: 'b2b-creator-led-growth-guide-2026',
        title: 'The 2026 Guide to B2B Creator-Led Growth: From Vanity Likes to Qualified Pipeline',
        topic: 'Creator-led growth',
        readTime: '8 min read',
        date: 'Sep 2026',
        author: 'Naano Editorial',
        authorRole: 'GTM Strategy Research',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        gradient: 'from-indigo-600 to-violet-600',
        summary: 'How fast-growing SaaS scaleups are replacing saturated ad channels with niche practitioner networks on LinkedIn.',
        takeaways: JSON.stringify([
          'Why corporate brand pages are dead and individual practitioner voices dominate engagement algorithms.',
          'How to structure performance-driven creator briefs without destroying editorial authenticity.',
          'The 3-stage funnel: Awareness hooks, educational carousels, and high-intent DM lead magnets.'
        ]),
        contentJson: JSON.stringify([
          {
            heading: '1. The Death of the Corporate Social Account',
            paragraphs: [
              'Algorithm data from 2025 and 2026 reveals a brutal reality for corporate B2B marketing teams: organic reach for company pages on LinkedIn has plummeted below 0.8% of follower count. Meanwhile, personal profiles of recognized practitioners and builders routinely command organic engagement rates between 3.5% and 7.2%.',
              'Buyers no longer trust logo-branded whitepapers. They trust peer practitioners who share unfiltered screenshots, failure post-mortems, and actionable workflows.'
            ]
          },
          {
            heading: '2. Structuring Creator Briefs for Maximum Conversion',
            paragraphs: [
              'The most common mistake B2B companies make is treating creators like billboard ad slots. Handing an influencer a rigid PR script guarantees audience rejection.',
              'Instead, the highest-performing campaigns on Naano specify only three core parameters: the problem angle, the target persona challenge, and the CTA link destination. The creator retains 100% control over the opening hook and tone of voice.'
            ]
          },
          {
            heading: '3. Closed-Loop Attribution Architecture',
            paragraphs: [
              'By utilizing unique UTM tags per creator and delivering lead magnets in first comments or direct messages, brands can track visitors from first post impression through trial signup to closed-won CRM revenue.'
            ]
          }
        ]),
        published: true,
        featured: true
      },
      {
        slug: 'cpl-economics-creators-vs-paid-ads',
        title: 'The Unit Economics of B2B Creators vs. Google & LinkedIn Ads in 2026',
        topic: 'CPL economics',
        readTime: '6 min read',
        date: 'Sep 2026',
        author: 'Eric Nowosielski',
        authorRole: 'VP Outbound & Creator Advisor',
        authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
        gradient: 'from-blue-600 to-cyan-600',
        summary: 'A direct mathematical breakdown comparing cost-per-lead, demo show-up rate, and CAC payback periods.',
        takeaways: JSON.stringify([
          'LinkedIn Sponsored Content average CPC has climbed to €14.50 in major European and US tech hubs.',
          'Niche creator campaigns achieve effective CPCs under €3.20 with 3x higher demo attendance.',
          'Creator-sourced prospects churn 28% less than cold paid traffic due to pre-established trust.'
        ]),
        contentJson: JSON.stringify([
          {
            heading: 'The Rising Cost of Conventional B2B Paid Search and Display',
            paragraphs: [
              'Across Series A to Series C enterprise software firms, customer acquisition costs have surged by over 40% year-over-year. As competition for intent keywords heats up, ad networks extract the lion’s share of margin.',
              'In contrast, a micro-creator with 25,000 high-density followers in RevOps or cybersecurity can deliver an authoritative case study post for €250, reaching 15,000 targeted buyers at an effective CPM under €18.'
            ]
          }
        ]),
        published: true,
        featured: false
      },
      {
        slug: 'micro-creators-conversion-rates',
        title: 'Why 10k-Follower Technical Creators Outperform 200k-Follower Generic Influencers',
        topic: 'LinkedIn micro-creators',
        readTime: '5 min read',
        date: 'Sep 2026',
        author: 'Robin Delaere',
        authorRole: 'AI Workflow Architect',
        authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
        gradient: 'from-emerald-600 to-teal-600',
        summary: 'Audience density beats sheer follower counts every time when selling complex B2B software solutions.',
        takeaways: JSON.stringify([
          'Audience composition ratio: A 10k follower base containing 60% VP and Director level buyers beats 200k student and recruiter followers.',
          'High comment-to-view ratios create organic algorithm re-amplification on LinkedIn.',
          'Creators with focused technical niches command 5x higher trust from engineering leads.'
        ]),
        contentJson: JSON.stringify([
          {
            heading: 'Understanding B2B Audience Density',
            paragraphs: [
              'Consumer influencer marketing taught marketers to chase vanity reach. In B2B SaaS, reaching 500,000 random viewers is worthless if none of them hold purchasing budget.',
              'Micro-creators who write exclusively about Kubernetes, MCP integrations, or cold outbound speak the insider dialect of decision makers.'
            ]
          }
        ]),
        published: true,
        featured: false
      },
      {
        slug: 'escrow-milestone-architecture',
        title: 'Why Milestone Escrow is Mandatory for Performance-Driven Creator Partnerships',
        topic: 'Naano vs alternatives',
        readTime: '7 min read',
        date: 'Sep 2026',
        author: 'Naano Product Engineering',
        authorRole: 'FinTech & Escrow Infrastructure',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        gradient: 'from-violet-600 to-fuchsia-600',
        summary: 'How automated Stripe Connect escrow guarantees eliminate non-delivery risk for brands and late payment anxiety for creators.',
        takeaways: JSON.stringify([
          'Traditional influencer agencies charge 30-50% margins while providing zero delivery guarantees.',
          'Naano locks project funds safely in Stripe Connect milestone vaults before creators begin work.',
          'Automatic verification of published post URLs and live analytics releases funds without friction.'
        ]),
        contentJson: JSON.stringify([
          {
            heading: 'The Broken Legacy Influencer Agency Model',
            paragraphs: [
              'Until now, brands faced two bad options: risk paying expensive agency retainers with unpredictable outcomes, or risk paying freelance creators upfront with zero recourse if deliverables were delayed.',
              'Naano solves this two-sided trust dilemma with automated milestone vaults powered by Stripe Connect.'
            ]
          }
        ]),
        published: true,
        featured: false
      }
    ]
  });

  // 10. PLATFORM SETTINGS
  await prisma.platformSetting.createMany({
    data: [
      {
        key: 'commission_rate',
        value: '0',
        description: 'Platform commission fee percentage taken from creators (0% guaranteed)'
      },
      {
        key: 'min_payout',
        value: '50',
        description: 'Minimum balance required in EUR to initiate an instant bank transfer'
      },
      {
        key: 'escrow_auto_release_days',
        value: '7',
        description: 'Days before submitted content is automatically approved if brand is unresponsive'
      },
      {
        key: 'support_email',
        value: 'support@naano.io',
        description: 'Primary customer support and concierge email'
      },
      {
        key: 'stripe_mode',
        value: 'live',
        description: 'Stripe Connect processing environment mode'
      }
    ]
  });

  // 11. AUDIT LOGS
  await prisma.adminAuditLog.createMany({
    data: [
      {
        adminId: adminUser.id,
        adminName: 'Super Admin',
        action: 'SYSTEM_SEED',
        details: 'Full initial seed of 8 verified creators, 3 companies, active campaigns, blogs, case studies, and platform settings.'
      },
      {
        adminId: adminUser.id,
        adminName: 'Super Admin',
        action: 'UPDATE_SETTINGS',
        details: 'Verified 0% creator commission rate and activated Stripe Connect Escrow milestone vault.'
      }
    ]
  });

  console.log('✅ Naano database seeded successfully!');
  return {
    success: true,
    userCount: await prisma.user.count(),
    companyCount: await prisma.company.count(),
    creatorCount: await prisma.creator.count(),
    campaignCount: await prisma.campaign.count(),
    collabCount: await prisma.collaboration.count(),
  };
}
