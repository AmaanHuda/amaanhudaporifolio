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
    sub: "My main passion is learning, solving problems and getting a little better with every project. I work across React, Node.js and Python: from hosted client websites to Orbital AI, the satellite collision-assessment system that took our team into the top 7 at the Inter-College Departmental SIH 2026.",
    photo: "assets/profile.jpg",   // drop a portrait here; it shows as an ID chip in the hologram
    meta: [["Degree", "B.Tech · AI & DS"], ["Batch", "2025 — 2029"], ["Status", "Open to internships"]],
    // hologram next to the intro: a pin on the globe + one tag per orbit
    holo: {
      origin: { label: "Origin · India", lat: 20.6, lon: 78.9 },
      satellites: ["Inter-college dept. SIH · top 7", "SGPA 9.18", "Coding since 2021"]
    }
  },

  // school: written by hand on the card. score: the circled "stamp".
  education: [
    {
      years: "2025 — 2029",
      school: "Thakur College of Engineering & Technology",
      score: "SGPA 9.18",
      title: "B.Tech — Artificial Intelligence & Data Science",
      place: "Undergraduate · Batch of 2029",
      notes: "Technical WC at S4DS and TSDW · Inter-College Departmental SIH 2026 top-7 team"
    },
    {
      years: "2023 — 2025",
      school: "",                                // add your junior college's name here
      score: "69.50%",
      title: "Higher Secondary Certificate",
      place: "Class XII · HSC",
      notes: "Completed HSC with 69.50%."
    },
    {
      years: "2023",
      school: "",                                // add your school's name here
      score: "85.40%",
      title: "Secondary School Certificate",
      place: "Class X · SSC",
      notes: "Completed SSC with 85.40%."
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
        "Selected as a Technical Working Committee member for both S4DS and TSDW."
      ]
    },
    {
      role: "Top 7 Team",
      org: "Inter-College Departmental SIH 2026",
      type: "Hackathon",
      date: "2026",
      points: [
        "Our project Orbital AI, a collision-assessment system for mega-constellation satellites, placed the team in the top 7 of the Inter-College Departmental SIH.",
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
      desc: "A collision-assessment system for mega-constellation satellites. This was our Inter-College Departmental SIH project, and it took the team into the top 7.",
      tags: ["React", "Three.js", "FastAPI", "TypeScript"],
      points: ["3D orbital visualisation in the browser", "Collision-risk assessment between satellites", "Inter-College Departmental SIH 2026 — top 7 teams"],
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
      links: [{ label: "Live", url: "https://amaanhudaa.netlify.app/" }, { label: "GitHub", url: "https://github.com/AmaanHuda/amaanhudaporifolio" }]
    }
  ],

  // LinkedIn posts carousel: short summaries that link to the original posts.
  // Add a new one at the top: { date, title, org, text, tags, url }
  linkedin: {
    posts: [
      {
        date: "2026-11-14", title: "Bit n Build — 24-hour hackathon", org: "GDG · Fr. Conceicao Rodrigues College of Engineering",
        text: "Took part in a 24-hour online hackathon with Team Protons. Out of 200+ teams we didn't make the top 15, but we used the blockchain problem statement to learn the fundamentals from scratch.",
        tags: ["Hackathon", "Blockchain", "Team Protons"],
        url: "https://www.linkedin.com/posts/amaan-huda-980967202_glad-to-share-that-recently-i-participated-activity-7527283753069539329-UnU6"
      },
      {
        date: "2026-09-06", title: "AETHRAVERSE — Vibe Coding Hackathon", org: "AI Aethra Club · TCET",
        text: "A 4-hour duo hackathon with Rehan Khan on AI-assisted development: build, experiment and ship within the time box. We missed by a few points and came away better prepared.",
        tags: ["Vibe coding", "AI", "TCET"],
        url: "https://www.linkedin.com/posts/amaan-huda-980967202_hackathon-vibecoding-ai-activity-7502411465203552256-yE1X"
      },
      {
        date: "2026-08-22", title: "Mission Control by Team Aeronoix", org: "Reposted · Rehan Khan",
        text: "Our AI-driven collision risk assessment and orchestration system for crowded low Earth orbit: multi-level risk priorities, human-in-the-loop decisions and a real-time mission dashboard.",
        tags: ["Space tech", "Machine learning", "Orbital AI"], repost: true,
        url: "https://www.linkedin.com/posts/rehan-khan-b10b49428_aeronoix-spacetech-artificialintelligence-activity-7497002113701416960-Ww4S"
      },
      {
        date: "2026-08-21", title: "Nyay Setu — to the Grand Finale", org: "CODEMOBILE 2026 · National level",
        text: "A 24-hour build to make legal jargon understandable for everyone. Team Protons qualified for the Grand Finale and defended the solution in front of the judges.",
        tags: ["Legal tech", "AI", "Grand Finale"],
        url: "https://www.linkedin.com/posts/amaan-huda-980967202_nyaysetu-codemobile2026-hackathon-activity-7496562102342664192-77gS"
      },
      {
        date: "2026-06-26", title: "BriefAI — AI Brochure Generator", org: "Build in public",
        text: "Scrapes a company's website, understands the business with an LLM and writes brochures tailored to clients or investors. Learned FastAPI, frontend-backend integration and prompt engineering along the way.",
        tags: ["LLM", "FastAPI", "Python"],
        url: "https://www.linkedin.com/posts/amaan-huda-980967202_aiengineering-llm-python-activity-7476281105424224277-KQ7s"
      }
    ]
  },

  skills: {
    text: "AI & Data Science student building full-stack web apps, APIs and interactive 3D frontends.",
    groups: [
      { name: "Frontend", items: ["React.js", "HTML5", "CSS3", "JavaScript", "Three.js", "GSAP"] },
      { name: "Backend", items: ["Node.js", "Python", "FastAPI", "REST APIs"] },
      { name: "Data & AI", items: ["Web Scraping", "LLMs", "Data Science", "Prompt design"] },
      { name: "Tools", items: ["Git", "GitHub", "Netlify", "Hostinger"] }
    ]
  }
};
