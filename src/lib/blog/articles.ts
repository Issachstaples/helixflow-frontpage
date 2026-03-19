/**
 * articles.ts
 * ─────────────────────────────────────────────────────────────
 * Local article data source for the HelixFlow blog.
 *
 * CMS migration path:
 *   Replace `ARTICLES` with a fetch() call in a server component and
 *   keep the `Article` type as the shared contract. The blog layout and
 *   index page are rendering-only — no changes needed there.
 *
 * Content conventions:
 *   - `body` is an array of content blocks for structured rendering.
 *   - Each block has a `type`: heading | paragraph | list | callout | quote
 *   - This keeps the data portable (CMS or MDX later) without introducing
 *     a parser dependency today.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export type BlockType = "heading" | "paragraph" | "list" | "callout" | "quote";

export interface ContentBlock {
    type: BlockType;
    /** Plain text or heading content */
    text?: string;
    /** List items — used when type === "list" */
    items?: string[];
    /** Optional label for callout blocks */
    label?: string;
}

export interface Article {
    slug: string;
    title: string;
    excerpt: string;
    tag: string;
    readTime: string;
    accent: string;
    publishedAt: string;
    /** SEO description — falls back to excerpt if omitted */
    metaDescription?: string;
    body: ContentBlock[];
}

// ── Article data ──────────────────────────────────────────────────────────────

export const ARTICLES: Article[] = [
    // ── 1 ────────────────────────────────────────────────────────────────────────
    {
        slug: "ai-crm-for-agencies",
        title: "What AI-Assisted CRM Actually Means for Agencies",
        excerpt:
            "Most CRMs were built for sales teams, not service delivery. We break down what it means to have an AI layer that works across your full client lifecycle — from first enquiry to retained relationship.",
        tag: "AI & CRM",
        readTime: "6 min read",
        accent: "#2DBBEE",
        publishedAt: "2026-02-12",
        metaDescription:
            "Most CRMs were built for sales teams, not service delivery. Learn what AI-assisted CRM really means for agencies — from lead capture to retained relationships.",
        body: [
            {
                type: "paragraph",
                text: "The term 'AI-assisted CRM' gets used a lot. Most of the time, it means a chatbot bolted onto a legacy database, or a GPT wrapper that auto-fills a text field. That's not what we mean — and it's probably not what your agency actually needs.",
            },
            {
                type: "heading",
                text: "Why most CRMs weren't built for agencies",
            },
            {
                type: "paragraph",
                text: "The dominant CRM platforms — Salesforce, HubSpot, Pipedrive — were designed around the sales funnel. The metric they optimise for is deals closed. That makes sense if you run a SaaS sales team or a high-volume outbound operation. It makes much less sense if you run a creative agency, consultancy, or service business where client relationships span months, the work itself is the product, and repeat business matters more than new logo count.",
            },
            {
                type: "paragraph",
                text: "For agencies, the interesting problems start after the deal closes: onboarding, delivery handoffs, project communication, upsells, renewals, referrals. Legacy CRMs treat that entire phase as a black box.",
            },
            {
                type: "heading",
                text: "What an AI layer actually does",
            },
            {
                type: "paragraph",
                text: "A useful AI layer in a CRM isn't about generating text for its own sake. It's about removing the friction that slows down the work. Specifically, it should:",
            },
            {
                type: "list",
                items: [
                    "Draft proposals from scoped intake data — so you're editing rather than starting from blank",
                    "Summarise contact and project history before a call — so you're prepared without digging through threads",
                    "Flag relationships that have gone quiet — so at-risk clients don't fall through silently",
                    "Suggest follow-up timing based on engagement patterns — not on someone's memory",
                    "Help write client-facing updates and check-ins — consistently, without the cognitive load",
                ],
            },
            {
                type: "paragraph",
                text: "None of these tasks require a brilliant AI. They require a well-connected one. The AI needs to see your pipeline, your email history, your project status, your delivery notes — and act on that context. That's the integration challenge, not the model challenge.",
            },
            {
                type: "callout",
                label: "The key distinction",
                text: "Passive CRMs store data. AI-assisted CRMs act on it. The difference is whether the system surfaces the right thing at the right time — or waits for you to go find it.",
            },
            {
                type: "heading",
                text: "The full client lifecycle, not just the top of the funnel",
            },
            {
                type: "paragraph",
                text: "For agencies, AI assistance is most valuable when it spans the full engagement — not just lead capture. That means the AI layer needs to be present at:",
            },
            {
                type: "list",
                items: [
                    "Lead qualification — scoring and staging inbound enquiries",
                    "Proposal creation — drafting scope-aligned proposals from intake data",
                    "Onboarding — triggering and personalising welcome sequences",
                    "Delivery — summarising project updates and flagging blockers",
                    "Retention — identifying re-engagement windows and drafting outreach",
                ],
            },
            {
                type: "paragraph",
                text: "When the AI layer spans all of these phases, you get compound value. The context that exists in a lead note informs the proposal. The proposal informs the onboarding sequence. The onboarding sequence informs the delivery handoff. Nothing is siloed, and the AI has enough context to actually be useful.",
            },
            {
                type: "heading",
                text: "What to look for when evaluating AI-assisted CRMs",
            },
            {
                type: "paragraph",
                text: "If you're evaluating platforms, the questions worth asking are less about model quality (they're all using GPT-4-class APIs) and more about integration depth:",
            },
            {
                type: "list",
                items: [
                    "Does the AI see your full client history, or just the last message?",
                    "Can it act across multiple phases — not just generate text in one place?",
                    "Does it flag things proactively, or wait for you to ask?",
                    "Is it trained on service delivery context, or generic sales patterns?",
                    "How does it handle the handoff from sales to delivery?",
                ],
            },
            {
                type: "paragraph",
                text: "The best AI-assisted CRM for an agency is one that disappears into the workflow — reducing the effort of doing the right thing, rather than adding a new tool to manage.",
            },
            {
                type: "quote",
                text: "The goal isn't to automate your relationships. It's to remove the administrative overhead so you have more capacity for the judgment and care that clients actually value.",
            },
        ],
    },

    // ── 2 ────────────────────────────────────────────────────────────────────────
    {
        slug: "lead-to-delivery-workflow",
        title: "Designing a Lead-to-Delivery Workflow That Doesn't Break Under Load",
        excerpt:
            "When you're busy, the gaps in your process become expensive. Here's how structured lead-to-delivery workflows eliminate the coordination tax that grows with every new client.",
        tag: "Workflow Design",
        readTime: "5 min read",
        accent: "#818cf8",
        publishedAt: "2026-02-19",
        metaDescription:
            "When agencies get busy, process gaps become expensive. Learn how to design a lead-to-delivery workflow that holds up under load without adding headcount.",
        body: [
            {
                type: "paragraph",
                text: "Most agency workflows were designed when things were quiet. They work fine when you have three clients and plenty of time to manage each one manually. The problem is that the same process, applied to twelve clients with a team of five, creates a coordination overhead that compounds every week.",
            },
            {
                type: "heading",
                text: "The coordination tax",
            },
            {
                type: "paragraph",
                text: "The coordination tax is the hidden cost of a workflow that relies on people remembering things, chasing updates, and manually moving information between tools. It shows up as: missed follow-ups, onboarding delays, proposals that take a week instead of a day, delivery handoffs that require a 30-minute briefing because context isn't written down anywhere.",
            },
            {
                type: "paragraph",
                text: "It's not visible on a spreadsheet, but it's real — and it grows with every new client you add. At a certain point, it starts limiting capacity more than headcount does.",
            },
            {
                type: "heading",
                text: "The four stages that break first",
            },
            {
                type: "paragraph",
                text: "Based on how most service businesses scale, the same four stages tend to break first:",
            },
            {
                type: "list",
                items: [
                    "Lead qualification — enquiries pile up in inboxes and get lost or deprioritised",
                    "Proposal creation — each proposal is built from scratch, taking 3–5 hours",
                    "Onboarding handoff — the transition from sales to delivery loses context",
                    "Follow-up and retention — clients go quiet, and nobody notices until it's too late",
                ],
            },
            {
                type: "callout",
                label: "The pattern",
                text: "Each of these breakpoints has the same root cause: the process relies on a person holding context in their head rather than the system holding it on their behalf.",
            },
            {
                type: "heading",
                text: "What a structured workflow looks like",
            },
            {
                type: "paragraph",
                text: "A structured lead-to-delivery workflow doesn't mean rigid or bureaucratic. It means that at every stage, the next action is defined, the context needed to take it is available, and the handoff is automatic rather than manual.",
            },
            {
                type: "list",
                items: [
                    "Lead captured → automatically staged and scored by source and fit",
                    "Proposal triggered → AI-drafted from intake data, sent with one click",
                    "Contract signed → onboarding sequence fires automatically, no manual steps",
                    "Delivery underway → project status and client comms in one place",
                    "Project complete → retention sequence starts, follow-up is scheduled",
                ],
            },
            {
                type: "paragraph",
                text: "The goal is that the workflow handles the coordination, so people can focus on the judgment: the creative brief, the strategy call, the delivery decisions that actually require expertise.",
            },
            {
                type: "heading",
                text: "How to audit your current workflow",
            },
            {
                type: "paragraph",
                text: "Before redesigning anything, it's worth mapping where the coordination tax is highest. A simple audit:",
            },
            {
                type: "list",
                items: [
                    "Where do things get stuck when the person responsible is unavailable?",
                    "Which tasks require someone to manually trigger them rather than fire automatically?",
                    "Where does context get lost in a handoff between tools or people?",
                    "Which recurring tasks take longer than they should because starting from scratch is the default?",
                ],
            },
            {
                type: "paragraph",
                text: "The answers tell you where structured automation will have the highest return. Usually, it's proposals, onboarding, and post-delivery follow-up — the same three stages for almost every agency.",
            },
            {
                type: "quote",
                text: "A workflow that holds under load isn't necessarily automated end-to-end. It's one where the right information is in the right place when someone needs to make a decision.",
            },
        ],
    },

    // ── 3 ────────────────────────────────────────────────────────────────────────
    {
        slug: "crm-vs-spreadsheets-service-business",
        title: "CRM vs Spreadsheets: The Real Cost of Staying in Sheets",
        excerpt:
            "Spreadsheets are flexible — until they aren't. We calculated the actual time and revenue cost of managing client relationships in a spreadsheet versus a purpose-built system.",
        tag: "Operations",
        readTime: "7 min read",
        accent: "#34d399",
        publishedAt: "2026-02-26",
        metaDescription:
            "Spreadsheets feel free until you calculate the real cost. See how much time and revenue agencies lose managing client relationships in sheets vs a purpose-built CRM.",
        body: [
            {
                type: "paragraph",
                text: "Spreadsheets are free, flexible, and familiar. There's a reason every service business starts with them — they work well enough at the beginning, and the switching cost to something else always feels larger than the problem they're solving. Until the problem gets expensive.",
            },
            {
                type: "heading",
                text: "The hidden cost calculation",
            },
            {
                type: "paragraph",
                text: "The cost of staying in spreadsheets isn't usually the spreadsheet. It's the time spent maintaining it, the mistakes made when it's out of date, the opportunities missed when it can't trigger anything, and the overhead of building every new client touchpoint from scratch.",
            },
            {
                type: "paragraph",
                text: "A conservative estimate for a 5-person agency with 15 active clients:",
            },
            {
                type: "list",
                items: [
                    "30 minutes per week keeping the pipeline sheet current — 26 hours/year",
                    "3 hours per proposal, built from scratch 2–3 times per month — 72–108 hours/year",
                    "1 hour per client for manual onboarding coordination — 15 hours per cohort",
                    "Follow-up missed on 20% of completed projects — estimated 2–4 upsell opportunities lost per year",
                ],
            },
            {
                type: "callout",
                label: "The number",
                text: "At a blended billing rate of £80–120/hour, that's £8,000–£16,000 in time cost annually — before accounting for missed revenue from dropped follow-ups.",
            },
            {
                type: "heading",
                text: "What spreadsheets can't do",
            },
            {
                type: "paragraph",
                text: "Beyond the time cost, there are structural things spreadsheets simply cannot do, regardless of how well they're maintained:",
            },
            {
                type: "list",
                items: [
                    "Trigger an automated sequence when a deal moves to a new stage",
                    "Surface a client that's gone quiet after 30 days of no contact",
                    "Generate a proposal draft from a previously-completed intake form",
                    "Send a check-in email 6 weeks after project delivery without someone scheduling it",
                    "Give the whole team the same view of a client relationship simultaneously",
                ],
            },
            {
                type: "paragraph",
                text: "None of these require a complex platform. They require a system that can hold data and act on it — which spreadsheets structurally cannot do.",
            },
            {
                type: "heading",
                text: "When spreadsheets are still the right answer",
            },
            {
                type: "paragraph",
                text: "To be fair: for some businesses, spreadsheets are the right tool. If you have fewer than 3 active clients, no recurring engagements, and no plans to grow, the overhead of a CRM platform isn't worth it. The switching cost is real.",
            },
            {
                type: "paragraph",
                text: "But if you're actively growing, have more than 5 active relationships to track, and are rebuilding the same documents repeatedly — the spreadsheet is no longer saving you effort. It's just redistributing the cost in a way that's harder to see.",
            },
            {
                type: "heading",
                text: "The real switching cost",
            },
            {
                type: "paragraph",
                text: "The fear with moving to a CRM is always the migration and the learning curve. In practice, for a service business, migration is importing a client list and a pipeline. It takes an afternoon, not a project. The learning curve for a tool designed for your workflow is a few days, not months.",
            },
            {
                type: "quote",
                text: "The question isn't whether a CRM is better than a spreadsheet. The question is whether the time you're losing to manual coordination is worth more than the effort of switching.",
            },
        ],
    },

    // ── 4 ────────────────────────────────────────────────────────────────────────
    {
        slug: "proposal-automation-agencies",
        title: "How Proposal Automation Cuts Proposal-to-Signature Time by 80%",
        excerpt:
            "The average agency spends 3–5 hours building a proposal from scratch. Automation doesn't replace the thinking — it removes the rebuilding. Here's what that looks like in practice.",
        tag: "Proposals",
        readTime: "4 min read",
        accent: "#f59e0b",
        publishedAt: "2026-03-04",
        metaDescription:
            "The average agency spends 3–5 hours on each proposal. Learn how proposal automation removes the rebuilding work and cuts time-to-signature without sacrificing quality.",
        body: [
            {
                type: "paragraph",
                text: "Proposal creation is one of the most time-consuming non-delivery tasks in an agency. The irony is that most proposals share the same structure, include the same service descriptions, and get built from the same mental model — yet almost every one gets built from scratch.",
            },
            {
                type: "heading",
                text: "Why proposals take so long",
            },
            {
                type: "paragraph",
                text: "The time doesn't go into the thinking. It goes into the rebuilding. Copying the scope from last month's proposal. Reformatting the pricing table. Finding the right case study. Writing an intro that reflects what you discussed on the call. These are mechanical tasks dressed up as creative ones.",
            },
            {
                type: "list",
                items: [
                    "Finding and copying the relevant service description: 20–30 minutes",
                    "Building or reformatting the pricing table: 30–45 minutes",
                    "Writing a contextualised intro paragraph: 20–40 minutes",
                    "Adding the right case studies and social proof: 30 minutes",
                    "Formatting, reviewing, and exporting: 30–60 minutes",
                ],
            },
            {
                type: "paragraph",
                text: "Total: 2.5–3.5 hours for a competent proposal. More for complex scopes. And that's before revisions.",
            },
            {
                type: "heading",
                text: "What automation removes",
            },
            {
                type: "paragraph",
                text: "Proposal automation doesn't replace the strategy behind a proposal — it removes the mechanical assembly. With the right system, the workflow looks like this:",
            },
            {
                type: "list",
                items: [
                    "Client submits an intake form or call notes are logged",
                    "AI drafts a proposal using intake data, your service templates, and previous similar proposals",
                    "You review, refine the intro and scope specifics (15–20 minutes)",
                    "Proposal is sent for e-signature directly from the platform",
                    "Signature triggers the onboarding sequence automatically",
                ],
            },
            {
                type: "callout",
                label: "The outcome",
                text: "End-to-end time from signed-off scope to proposal in the client's inbox: under 30 minutes. That's an 80–90% reduction in proposal creation time.",
            },
            {
                type: "heading",
                text: "The quality question",
            },
            {
                type: "paragraph",
                text: "The concern with automation is always quality. Will an AI-drafted proposal feel generic? The honest answer: it depends on what the AI has access to. If it's working from a brief intake form and no context, yes — it'll feel generic. If it has access to the full client intake, your service templates, pricing history, and relevant case studies, the draft will be specific enough that your edits become refinements rather than rewrites.",
            },
            {
                type: "paragraph",
                text: "The goal isn't to remove the human judgment from proposals. It's to give that judgment something concrete to react to, rather than a blank page.",
            },
            {
                type: "heading",
                text: "What to look for in a proposal automation tool",
            },
            {
                type: "list",
                items: [
                    "Access to intake and CRM data — not just a template filler",
                    "E-signature built in — no separate tool handoff",
                    "Connected to onboarding — so signature triggers next steps automatically",
                    "Version control — so you can see what changed between drafts",
                    "Consistent output quality — same proposal structure every time, not random",
                ],
            },
            {
                type: "quote",
                text: "The best proposals still require a person who understands the client. Automation just means that person spends their time on the thinking, not the formatting.",
            },
        ],
    },

    // ── 5 ────────────────────────────────────────────────────────────────────────
    {
        slug: "ai-summaries-followups",
        title: "AI Summaries and Follow-Ups: What Gets Automated and What Shouldn't",
        excerpt:
            "The right line between automation and human judgment in client communication. Which follow-ups should fire automatically, and where a real message matters more than a fast one.",
        tag: "AI & Automation",
        readTime: "5 min read",
        accent: "#2DBBEE",
        publishedAt: "2026-03-10",
        metaDescription:
            "Not all client communication should be automated. Learn which follow-ups and summaries to automate, and where human judgment matters more than speed.",
        body: [
            {
                type: "paragraph",
                text: "Automation in client communication is a balance. Too little, and you're manually scheduling follow-ups that should be systematic. Too much, and clients can tell — and the relationship cost is higher than the time savings are worth.",
            },
            {
                type: "heading",
                text: "What should be automated",
            },
            {
                type: "paragraph",
                text: "The cleanest candidates for automation are communications that are expected, predictable, and low-stakes enough that a templated message is actually appropriate:",
            },
            {
                type: "list",
                items: [
                    "Post-signature onboarding welcome — expected, time-sensitive, consistent across clients",
                    "Intake form requests — mechanical, same every time, no personalisation needed",
                    "Weekly status update prompts to internal team — internal, systematic",
                    "Post-delivery check-in at 2 weeks — expected, same structure each time",
                    "6-week renewal nudge — systematic, not personal",
                    "Overdue invoice reminders — administrative, not relational",
                ],
            },
            {
                type: "paragraph",
                text: "These are all cases where the message is essentially the same every time, the timing is predictable, and the recipient doesn't need it to feel personal — they just need to receive it.",
            },
            {
                type: "heading",
                text: "What shouldn't be automated",
            },
            {
                type: "paragraph",
                text: "The communications that shouldn't be fully automated are the ones where the relationship is the message:",
            },
            {
                type: "list",
                items: [
                    "Recovery messages after a difficult delivery — these require genuine acknowledgement",
                    "Upsell conversations — needs to reflect knowledge of the specific client situation",
                    "Referral requests — trust-dependent, impersonal automation destroys the ask",
                    "Post-project reviews with high-value clients — deserves a real conversation",
                    "Messages after a client has gone quiet — the reason matters, automation assumes",
                ],
            },
            {
                type: "callout",
                label: "The rule of thumb",
                text: "If the right response depends on understanding this specific client's situation right now — automate the prompt, not the message. Let the AI surface the moment; let a human own the communication.",
            },
            {
                type: "heading",
                text: "AI summaries: what they're for",
            },
            {
                type: "paragraph",
                text: "AI-generated summaries of client history are underrated. Before a call, a one-paragraph summary of the last 90 days of interactions, project status, and open items means you're not spending the first 5 minutes of a call getting up to speed. At scale — 10, 15, 20 active clients — that compounds significantly.",
            },
            {
                type: "paragraph",
                text: "The key is that the summary draws from real data: email threads, project notes, CRM activity, not just the last message. That requires a system where all of that context is in one place, which is the underlying infrastructure problem that most agencies solve last.",
            },
            {
                type: "heading",
                text: "The balance in practice",
            },
            {
                type: "paragraph",
                text: "In practice, the most effective automation strategy is layered: systematic messages fire automatically, but the system also flags moments that need a human. A client that's gone quiet gets a flag, not an auto-send. An upsell opportunity gets surfaced, not pitched. A difficult delivery gets a prompt to check in, not a templated apology.",
            },
            {
                type: "quote",
                text: "Automation at its best doesn't replace client relationships. It ensures you have the time and context to maintain them well.",
            },
        ],
    },

    // ── 6 ────────────────────────────────────────────────────────────────────────
    {
        slug: "crm-buying-guide-service-business",
        title: "What to Look For in a CRM if You Run a Service Business",
        excerpt:
            "Product and e-commerce CRMs weren't built for the complexity of service delivery. Here are the eight capabilities that separate a useful CRM from one that becomes shelfware.",
        tag: "Buying Guide",
        readTime: "8 min read",
        accent: "#818cf8",
        publishedAt: "2026-03-17",
        metaDescription:
            "Most CRMs are built for product sales, not service delivery. Here are the eight capabilities that actually matter when choosing a CRM for an agency or service business.",
        body: [
            {
                type: "paragraph",
                text: "The CRM market is built around product and e-commerce businesses. The dominant platforms — HubSpot, Salesforce, Pipedrive — optimise for volume, velocity, and deal value. That's a reasonable focus if you're selling software licences or running a B2B outbound team. It's the wrong focus for an agency, consultancy, or service business where the complexity is in the delivery, not just the close.",
            },
            {
                type: "heading",
                text: "The eight capabilities that matter",
            },
            {
                type: "paragraph",
                text: "When evaluating CRM platforms for a service business, these are the eight capabilities that separate useful from shelfware:",
            },
            {
                type: "heading",
                text: "1. Full lifecycle coverage, not just pipeline",
            },
            {
                type: "paragraph",
                text: "A sales pipeline is table stakes. What matters for a service business is whether the CRM extends into the delivery phase — project status, delivery milestones, client communication history after the contract is signed. If the CRM ends at 'deal closed', you'll need a second tool for everything that follows.",
            },
            {
                type: "heading",
                text: "2. Proposal and contract management built in",
            },
            {
                type: "paragraph",
                text: "Proposals and contracts should live in the same system as the client record. Exporting to DocuSign or Proposify and then manually syncing back to the CRM is a process gap that costs time and introduces errors. The best platforms handle proposal creation, e-signature, and CRM update in one flow.",
            },
            {
                type: "heading",
                text: "3. Onboarding automation connected to the deal close",
            },
            {
                type: "paragraph",
                text: "When a contract is signed, the onboarding process should start automatically. This means the CRM needs to trigger sequences — welcome emails, intake forms, access provisioning, kickoff scheduling — without manual intervention. If someone has to 'remember to kick off onboarding', you have a process gap.",
            },
            {
                type: "heading",
                text: "4. Relationship health monitoring",
            },
            {
                type: "paragraph",
                text: "A CRM should tell you which client relationships are at risk before the client tells you. That means tracking contact frequency, project milestone progress, NPS or satisfaction signals, and surfacing anything that looks like a warning sign. Most standard CRMs don't do this — they track activity, but don't interpret it.",
            },
            {
                type: "heading",
                text: "5. AI assist that's connected to real data",
            },
            {
                type: "paragraph",
                text: "AI features are only as good as the data they can access. An AI that can draft a follow-up email knowing the last 90 days of client interaction is useful. An AI that generates generic text in a sidebar is not. When evaluating AI features, the question is: what context does it have access to?",
            },
            {
                type: "heading",
                text: "6. Minimal tool sprawl",
            },
            {
                type: "paragraph",
                text: "Every additional tool in the stack is a context switch, an integration to maintain, and a surface area for things to fall through. The ideal CRM for a service business handles: contact management, pipeline, proposals, onboarding, project tracking, and client communication — in one place. The integration complexity of a four-tool stack is rarely worth the marginal feature benefit.",
            },
            {
                type: "heading",
                text: "7. Built for service logic, not sales logic",
            },
            {
                type: "paragraph",
                text: "Sales CRMs are built around stages in a funnel: lead, prospect, qualified, proposal, closed. Service business relationships don't end at 'closed' — they grow or they don't. The CRM should model client health, project delivery, and retention as first-class concepts, not afterthoughts.",
            },
            {
                type: "heading",
                text: "8. Scales with a small team",
            },
            {
                type: "paragraph",
                text: "Enterprise CRMs are designed for dedicated admins, multi-team rollouts, and compliance requirements you don't have yet. For a 3–15 person service business, the overhead of configuring and maintaining an enterprise platform is disproportionate. The right tool has enough flexibility to fit your workflow without requiring a consultant to implement it.",
            },
            {
                type: "callout",
                label: "The evaluation shortcut",
                text: "Ask vendors: 'Show me the flow from a signed contract to the client receiving their first onboarding email.' If the answer involves manual steps, a separate tool, or a Zapier connection — you've found the gap.",
            },
            {
                type: "heading",
                text: "Red flags when evaluating",
            },
            {
                type: "list",
                items: [
                    "The pipeline view is the main screen — delivery is an afterthought",
                    "Proposals require a separate tool and manual sync back to the CRM",
                    "Onboarding requires someone to 'start' it after the deal closes",
                    "AI features are generative text with no access to your CRM data",
                    "The pricing model penalises you for having more contacts or sending more emails",
                    "Implementation is measured in weeks, not hours",
                ],
            },
            {
                type: "quote",
                text: "The best CRM for a service business is the one your team actually uses — not the one with the most features. Complexity is a cost, not a benefit.",
            },
        ],
    },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Look up an article by slug. Returns undefined if not found. */
export function getArticleBySlug(slug: string): Article | undefined {
    return ARTICLES.find((a) => a.slug === slug);
}

/** All slugs — used for generateStaticParams */
export function getAllSlugs(): string[] {
    return ARTICLES.map((a) => a.slug);
}

/** Format a publishedAt ISO date string for display */
export function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}
