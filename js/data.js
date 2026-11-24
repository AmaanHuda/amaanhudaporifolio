/* ==========================================================================
   PORTFOLIO CONTENT — edit everything about you here.
   The page is built from this file, so no HTML edits are needed.
   ========================================================================== */
window.PORTFOLIO = {
  name: { first: "Ama", second: "an" },          // rendered as "AMAAN." in the hero and footer
  fullName: "Amaan Imran Huda",
  role: "AI & Data Science Developer",
  year: "2026",

  contact: {
    email: "amaanhuda7@gmail.com",
    phone: "",                                   // e.g. "+91 96195 14072" — left blank so it isn't published by default
    github: "https://github.com/AmaanHuda",
    linkedin: "https://www.linkedin.com/in/amaan-huda-980967202/",
    website: "https://amaanhudaa.netlify.app/",
    availability: "Open to internships, freelance builds and hackathon teams that need careful engineering."
  },

  // Put the PDF in /assets with this name to update it (see README → "Updating your resume")
  resume: { file: "assets/Amaan-Huda-Resume.pdf", downloadName: "Amaan-Huda-Resume.pdf" },

  // Used by the live GitHub panel (public data only, no token needed)
  github: { user: "AmaanHuda" },

  hero: {
    tagline: 'B.Tech student in <em>AI &amp; Data Science</em>,<br>building things that are innovative and helpful.',
    phrase: "Learning, solving problems, improving every build."
  },

  about: {
    lead: 'I\'m Amaan Huda, a B.Tech student in <em>Artificial Intelligence &amp; Data Science</em> (batch of 2029) who has been exploring technology since 2021 and decided to become a developer who builds <em>innovative, helpful</em> things.',
    sub: "My main passion is learning, solving problems and getting a little better with every project. I work across React, Node.js and Python: from hosted client websites to Orbital AI, the satellite collision-assessment system that took our team into the top 7 at Smart India Hackathon 2026.",
    photo: "assets/profile.jpg",   // drop a portrait here; a monogram shows until you do
    meta: [["Degree", "B.Tech · AI & DS"], ["Batch", "2025 — 2029"], ["Status", "Open to internships"]]
  },

  education: [
    {
      years: "2025 — 2029",
      title: "B.Tech — Artificial Intelligence & Data Science",
      place: "Undergraduate · Batch of 2029",
      notes: "SGPA 9.18 · Technical WC at S4DS and TSDW · Smart India Hackathon 2026 top-7 team"
    },
    {
      years: "2025",
      title: "Engineering Entrance — CET",
      place: "State Common Entrance Test",
      notes: "Scored in the 91.3 percentile."
    },
    {
      years: "HSC",
      title: "Higher Secondary Certificate",
      place: "Class XII",
      notes: "Scored 69.50%."
    },
    {
      years: "SSC",
      title: "Secondary School Certificate",
      place: "Class X",
      notes: "Scored 85.40%."
    }
  ],

  experience: [
    {
      role: "Full-time Intern",
      org: "Excelencia International",
      type: "Internship",
      date: "May — Aug 2025",
      points: [
        "Managed and verified the authenticity of student documents.",
        "Created and maintained profiles in the company database.",
        "Communicated with universities and agents on applications."
      ]
    },
    {
      role: "Web Developer",
      org: "Impact Group Tuitions",
      type: "Freelance",
      date: "May — Jun 2024",
      points: [
        "Built the tuition's website with React.",
        "Deployed and hosted it on Netlify and Hostinger — it's live at impactgrouptutions.in."
      ]
    },
    {
      role: "Technical WC",
      org: "S4DS & TSDW",
      type: "Leadership",
      date: "2026",
      points: [
        "Selected as Technical Working Committee member for both S4DS and TSDW.",
        "Contribute to the clubs' technical work, including the S4DS website."
      ]
    },
    {
      role: "Top 7 Team",
      org: "Smart India Hackathon 2026",
      type: "Hackathon",
      date: "2026",
      points: [
        "Our project Orbital AI, a collision-assessment system for mega-constellation satellites, put the team in the top 7.",
        "Built with React and Three.js on the front end and FastAPI on the back end."
      ]
    },
    {
      role: "Top 20 Team",
      org: "Codeamble — National Hackathon",
      type: "Hackathon",
      date: "Jul — Aug 2026",
      points: [
        "Reached the top 20 teams selected for the national-level Codeamble hackathon."
      ]
    }
  ],

  projects: [
    {
      id: "orbital-ai", name: "Orbital AI", date: "2026", cover: "assets/covers/orbital-ai.svg",
      desc: "A collision-assessment system for mega-constellation satellites. This was our Smart India Hackathon project and it took the team into the top 7 nationally.",
      tags: ["React", "Three.js", "FastAPI", "TypeScript"],
      points: ["3D orbital visualisation in the browser", "Collision-risk assessment between satellites", "SIH 2026 — top 7 teams"],
      links: [{ label: "Live", url: "https://orbital-aii.netlify.app/" }, { label: "GitHub", url: "https://github.com/AmaanHuda/orbital-ai" }]
    },
    {
      id: "impact-group", name: "Impact Group Tuitions", date: "2024", cover: "assets/covers/impact-group.svg",
      desc: "A website that puts the tuition's information online so it can be marketed properly. Built with React and fully live and hosted.",
      tags: ["React", "Netlify", "Hostinger"],
      points: ["Real client project", "Deployed on Netlify and Hostinger", "Live on its own domain"],
      links: [{ label: "Live", url: "https://impactgrouptutions.in/" }]
    },
    {
      id: "portfolio", name: "Portfolio Website", date: "2026", cover: "assets/covers/portfolio.svg",
      desc: "A digital space about myself and a passion project, made with plain HTML, CSS and JavaScript. You're looking at its retro-futurist edition.",
      tags: ["HTML", "CSS", "JavaScript", "GSAP"],
      points: ["No framework, no build step", "Scroll-driven animation throughout", "Live GitHub telemetry"],
      links: [{ label: "Live", url: "https://amaanhudaa.netlify.app/" }, { label: "GitHub", url: "https://github.com/AmaanHuda" }]
    },
    {
      id: "nyaysetu", name: "NyaySetu", date: "2026", cover: "assets/covers/nyaysetu.svg",
      desc: "A legal AI assistant for Indian law. It started as a Gradio prototype and grew into a FastAPI app with a custom frontend, a tool-calling architecture and structured relational memory in place of plain RAG.",
      tags: ["Gemini", "FastAPI", "Async SQLAlchemy", "JSONB", "Tool calling"],
      points: ["PDF upload with in-app document preview", "Trust-score analysis for answers", "Legal knowledge base across Indian law categories"],
      links: []
    },
    {
      id: "legal-decoder", name: "Legal Doc Decoder", date: "2026", cover: "assets/covers/legal-decoder.svg",
      desc: "Upload a PDF, DOCX or TXT legal document and get it back in plain English: summary, key terms, timeline, responsibilities, risks and questions to ask a lawyer.",
      tags: ["FastAPI", "Gemini", "Structured JSON", "Python"],
      points: ["LEGAL / NON_LEGAL / UNCERTAIN gate before analysis", "Prompts kept separate from application code", "No document contents ever logged"],
      links: []
    },
    {
      id: "s4ds", name: "S4DS Website", date: "2026", cover: "assets/covers/s4ds.svg",
      desc: "The Society for Data Science club site: a 3D hero with orbiting event portals, plus members, gallery, join and contact sections.",
      tags: ["React", "React Three Fiber", "GSAP", "Tailwind"],
      points: ["3D neural-network hero", "Magnetic CTA and tilting member cards", "Auto-playing gallery"],
      links: []
    }
  ],

  skills: {
    text: "AI & Data Science student building full-stack web apps, APIs and interactive 3D frontends.",
    groups: [
      { name: "Frontend", items: ["React.js", "HTML5", "CSS3", "JavaScript", "Three.js", "GSAP"] },
      { name: "Backend", items: ["Node.js", "Python", "FastAPI", "REST APIs"] },
      { name: "Data & AI", items: ["Web Scraping", "Gemini API", "Data Science", "Prompt design"] },
      { name: "Tools", items: ["Git", "GitHub", "Netlify", "Hostinger"] }
    ]
  }
};
