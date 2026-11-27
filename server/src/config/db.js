import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');
const LOCAL_DB_PATH = path.join(DATA_DIR, 'local_db.json');

const schemaOptions = {
  toJSON: {
    virtuals: true,
    transform: (_doc, ret) => {
      ret.id = ret._id.toString();
      return ret;
    }
  },
  toObject: { virtuals: true }
};

// Mongoose Schemas (Only used if MongoDB is active)
const ProfileSchema = new mongoose.Schema({
  name: { type: String, default: 'Your Name' },
  title: { type: String, default: 'AI Developer' },
  bio: { type: String, default: 'I build intelligent web applications.' },
  image: { type: String, default: '' },
  resume: { type: String, default: '' },
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  location: { type: String, default: '' }
}, schemaOptions);

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, default: 'Frontend' },
  percentage: { type: Number, default: 80 }
}, schemaOptions);

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  techStack: [{ type: String }],
  githubUrl: { type: String, default: '' },
  demoUrl: { type: String, default: '' },
  imageUrls: [{ type: String }],
  reportUrls: [{ type: String }]
}, schemaOptions);

const AchievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, default: '' },
  date: { type: String, default: '' },
  description: { type: String, default: '' },
  imageUrls: [{ type: String }],
  githubUrl: { type: String, default: '' },
  reportUrls: [{ type: String }]
}, schemaOptions);

const ExperienceSchema = new mongoose.Schema({
  role: { type: String, required: true },
  company: { type: String, required: true },
  date: { type: String, default: '' },
  description: { type: String, default: '' },
  imageUrls: [{ type: String }],
  githubUrl: { type: String, default: '' },
  reportUrls: [{ type: String }]
}, schemaOptions);

const EducationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  date: { type: String, default: '' },
  description: { type: String, default: '' },
  imageUrls: [{ type: String }],
  githubUrl: { type: String, default: '' },
  reportUrls: [{ type: String }]
}, schemaOptions);

const CertificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: String, default: '' },
  description: { type: String, default: '' },
  imageUrls: [{ type: String }],
  githubUrl: { type: String, default: '' },
  reportUrls: [{ type: String }]
}, schemaOptions);

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, default: '' },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, schemaOptions);

let MongooseProfile, MongooseSkill, MongooseProject, MongooseAchievement, MongooseContact;
let MongooseExperience, MongooseEducation, MongooseCertification;
let useMongo = false;

// Connect to MongoDB if MONGODB_URI is provided
export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (uri) {
    try {
      console.log('Connecting to MongoDB...');
      await mongoose.connect(uri);
      console.log('MongoDB connected successfully.');
      
      MongooseProfile = mongoose.model('Profile', ProfileSchema);
      MongooseSkill = mongoose.model('Skill', SkillSchema);
      MongooseProject = mongoose.model('Project', ProjectSchema);
      MongooseAchievement = mongoose.model('Achievement', AchievementSchema);
      MongooseContact = mongoose.model('Contact', ContactSchema);
      MongooseExperience = mongoose.model('Experience', ExperienceSchema);
      MongooseEducation = mongoose.model('Education', EducationSchema);
      MongooseCertification = mongoose.model('Certification', CertificationSchema);
      
      useMongo = true;
    } catch (err) {
      console.error('MongoDB connection error. Falling back to Local JSON database:', err.message);
      initializeLocalDB();
    }
  } else {
    console.log('No MONGODB_URI found. Using Local JSON database.');
    initializeLocalDB();
  }
}

// Local JSON Database implementation
export const initialData = {
  profile: {
    name: "DHAMODHARAN R",
    title: "SOFTWARE DEVELOPER & AI/ML ENGINEER",
    bio: "Pre-final-year Computer Science and Engineering student at Achariya College of Engineering Technology with a strong academic record (CGPA: 9.05/10) and hands-on experience in software development, AI/ML applications, and IoT-based systems. Skilled in Java, Python, JavaScript, C, C++, and MySQL, with practical experience in developing web applications, database-driven solutions, and intelligent monitoring systems. Strong foundation in Data Structures and Algorithms, Database Management Systems, Object-Oriented Programming, and software development principles. Passionate about solving real-world problems through technology and seeking an entry-level Software Developer opportunity to apply technical skills and contribute to innovative application development.",
    image: "/uploads/file-1795176077357-301149090-WhatsApp_Image_2026-11-20_at_3.45.59_PM.jpeg",
    resume: "/uploads/file-1795176105621-809389694-DHAMODHARAN__R_RESUME.pdf",
    github: "https://github.com/DHAMODHARAN-R26",
    linkedin: "https://www.linkedin.com/in/dhamo-r",
    email: "dhamodharancse26@gmail.com",
    phone: "+91 8778119621",
    location: "Pondicherry, India"
  },
  skills: [
    { id: "sk-1", name: "Java", category: "Languages", percentage: 90 },
    { id: "sk-2", name: "Python", category: "Languages", percentage: 92 },
    { id: "sk-3", name: "JavaScript", category: "Languages", percentage: 90 },
    { id: "sk-4", name: "C", category: "Languages", percentage: 88 },
    { id: "sk-5", name: "C++", category: "Languages", percentage: 86 },
    { id: "sk-6", name: "HTML5", category: "Frontend", percentage: 95 },
    { id: "sk-7", name: "CSS3", category: "Frontend", percentage: 92 },
    { id: "sk-8", name: "Responsive Web Design", category: "Frontend", percentage: 90 },
    { id: "sk-9", name: "MySQL", category: "Databases", percentage: 90 },
    { id: "sk-10", name: "JDBC", category: "Databases", percentage: 85 },
    { id: "sk-11", name: "MongoDB", category: "Databases", percentage: 82 },
    { id: "sk-12", name: "Apache Hadoop", category: "Big Data", percentage: 80 },
    { id: "sk-13", name: "Pandas", category: "AI & Data Science", percentage: 86 },
    { id: "sk-14", name: "NumPy", category: "AI & Data Science", percentage: 88 },
    { id: "sk-15", name: "Matplotlib", category: "AI & Data Science", percentage: 85 },
    { id: "sk-16", name: "NLTK", category: "AI & Data Science", percentage: 82 },
    { id: "sk-17", name: "DSA", category: "Core CS", percentage: 90 },
    { id: "sk-18", name: "OOP", category: "Core CS", percentage: 92 },
    { id: "sk-19", name: "DBMS", category: "Core CS", percentage: 88 },
    { id: "sk-20", name: "Operating Systems", category: "Core CS", percentage: 85 },
    { id: "sk-21", name: "Computer Networks", category: "Core CS", percentage: 85 },
    { id: "sk-22", name: "Arduino", category: "IoT & Embedded", percentage: 90 },
    { id: "sk-23", name: "Raspberry Pi", category: "IoT & Embedded", percentage: 88 },
    { id: "sk-24", name: "STM32 & Sensors", category: "IoT & Embedded", percentage: 86 },
    { id: "sk-25", name: "GSM Modules", category: "IoT & Embedded", percentage: 84 },
    { id: "sk-26", name: "Git", category: "Tools", percentage: 92 },
    { id: "sk-27", name: "GitHub", category: "Tools", percentage: 92 },
    { id: "sk-28", name: "VS Code", category: "Tools", percentage: 95 },
    { id: "sk-29", name: "PyCharm", category: "Tools", percentage: 88 },
    { id: "sk-30", name: "Problem-Solving", category: "Soft Skills", percentage: 95 },
    { id: "sk-31", name: "Communication", category: "Soft Skills", percentage: 92 },
    { id: "sk-32", name: "Teamwork", category: "Soft Skills", percentage: 92 },
    { id: "sk-33", name: "Leadership", category: "Soft Skills", percentage: 88 },
    { id: "sk-34", name: "Adaptability", category: "Soft Skills", percentage: 92 },
    { id: "sk-35", name: "Critical Thinking", category: "Soft Skills", percentage: 90 }
  ],
  projects: [
    {
      id: "pr-1",
      title: "NIVORA – Smart Intelligent Mountain Road Safety System",
      description: "Developed an IoT-based road safety solution to detect approaching vehicles at blind curves and reduce accident risks. Implemented bidirectional alerts, GPS-based emergency SOS functionality, and fail-safe mechanisms for communication and power failures.",
      techStack: ["IoT", "Blind Curve Sensors", "Bidirectional Alerts", "GPS Emergency SOS", "Fail-Safe Systems"],
      githubUrl: "https://github.com/DHAMODHARAN-R26",
      demoUrl: "",
      imageUrls: ["/uploads/file-1781844627553-966569308.png"],
      reportUrls: []
    },
    {
      id: "pr-2",
      title: "ZERORA – Advanced Water Monitoring & Automatic Cleaning System",
      description: "Developed an intelligent water monitoring solution using pH, turbidity, and TDS sensors. Implemented real-time contamination detection, automatic cleaning mechanisms, and alert notifications for water-quality management.",
      techStack: ["IoT", "pH Sensor", "Turbidity Sensor", "TDS Sensor", "Automation", "Real-Time Alerts"],
      githubUrl: "https://github.com/DHAMODHARAN-R26",
      demoUrl: "",
      imageUrls: ["/uploads/file-1781844638364-183887740.png"],
      reportUrls: []
    },
    {
      id: "pr-3",
      title: "INOROUT – Real-Time Smart Faculty Availability & Notification System",
      description: "Developed a system to track faculty availability using real-time entry/exit sensor detection and a web platform for managing departmental communication. Implemented sensor-based monitoring to update status automatically and designed an accessible notification interface to inform students about faculty presence.",
      techStack: ["IoT", "Entry/Exit Sensors", "Real-Time Updates", "Notification System", "Web Platform"],
      githubUrl: "https://github.com/DHAMODHARAN-R26",
      demoUrl: "",
      imageUrls: ["/uploads/file-1782100119236-923544116.jpeg"],
      reportUrls: ["/uploads/file-1782100108233-632558747.pdf"]
    },
    {
      id: "pr-4",
      title: "DIGILOG – Digital Student Monitoring System",
      description: "Developed a digital platform to manage student academic records, attendance, assignments, and other activities. Implemented structured data management and automated record tracking to improve information accessibility and monitoring efficiency.",
      techStack: ["Data Logging", "Automated Monitoring", "Structured Storage", "Data Analysis", "Record Tracking"],
      githubUrl: "https://github.com/DHAMODHARAN-R26",
      demoUrl: "",
      imageUrls: [],
      reportUrls: []
    },
    {
      id: "pr-5",
      title: "CSENEXUS – Department Coordination Website",
      description: "Developed a web platform for managing departmental activities, announcements, and communication. Designed an accessible user interface to improve information sharing between students and faculty members.",
      techStack: ["Web Development", "Frontend", "UI Design", "Department Coordination", "Information Sharing"],
      githubUrl: "https://github.com/DHAMODHARAN-R26",
      demoUrl: "",
      imageUrls: [],
      reportUrls: []
    },
    {
      id: "pr-6",
      title: "Athlete Stress Management System Using AI/ML",
      description: "Developed an AI/ML-based application to analyze athlete stress levels and identify stress-related patterns. Applied machine learning techniques to support early identification of stress-related concerns and data-driven analysis.",
      techStack: ["AI / Machine Learning", "Python", "Data Analysis", "Pattern Recognition", "Health Informatics"],
      githubUrl: "https://github.com/DHAMODHARAN-R26",
      demoUrl: "",
      imageUrls: [],
      reportUrls: []
    },
    {
      id: "pr-7",
      title: "Smart Laboratory Management System",
      description: "Developed a digital laboratory management system to organize laboratory resources and records. Implemented structured resource management to improve accessibility and reduce manual administrative activities.",
      techStack: ["Database Management", "Resource Tracking", "Web Application", "Process Automation"],
      githubUrl: "https://github.com/DHAMODHARAN-R26",
      demoUrl: "",
      imageUrls: [],
      reportUrls: []
    },
    {
      id: "pr-8",
      title: "AQUANEST – Smart Water Management System",
      description: "Developed an automated pond cleaning and water-quality management system. Integrated sensors and automated mechanisms to monitor pond conditions and reduce manual cleaning efforts. Implemented a dashboard to display real-time water-quality monitoring results and sensor readings, enabling centralized visualization of pond conditions to support effective monitoring and management.",
      techStack: ["IoT", "Water Quality Sensors", "Automated Cleaning", "Real-Time Dashboard", "Telemetry"],
      githubUrl: "https://github.com/DHAMODHARAN-R26",
      demoUrl: "",
      imageUrls: [],
      reportUrls: []
    },
    {
      id: "pr-9",
      title: "CODE BREAKERZ – Technical Symposium Event Website",
      description: "Developed a dedicated website for a national-level technical symposium. Implemented event information, registration features, and responsive interfaces to improve participant communication and event management.",
      techStack: ["Web Development", "Event Registration", "Responsive UI", "Symposium Portal"],
      githubUrl: "https://github.com/DHAMODHARAN-R26",
      demoUrl: "",
      imageUrls: [],
      reportUrls: []
    }
  ],
  experience: [
    {
      id: "ex-1",
      role: "AI & ML Developer Intern",
      company: "Vulture Management Wings Pvt. Ltd. (LinesOftech)",
      date: "July 2026",
      description: "Contributed to the development and implementation of AI/ML-based software applications. Applied machine learning concepts, analytical thinking, and software engineering principles to practical development tasks. Collaborated with engineers and team members to design, develop, and improve application functionality.",
      imageUrls: [],
      githubUrl: "",
      reportUrls: []
    },
    {
      id: "ex-2",
      role: "Web Development Intern",
      company: "SkillBuilder Academy",
      date: "Dec 2025 – Jan 2026",
      description: "Developed web pages and user interface components using web development tools and technologies. Explored frontend–backend integration, application routing, and project architecture. Gained practical exposure to website development, application workflows, and deployment concepts.",
      imageUrls: ["/uploads/file-1781797984975-152057615.png"],
      githubUrl: "",
      reportUrls: ["/uploads/file-1782101063978-515803204.pdf"]
    }
  ],
  education: [
    {
      id: "ed-1",
      degree: "B.Tech, Computer Science and Engineering",
      institution: "Achariya College of Engineering and Technology, Puducherry",
      date: "2024 – 2028",
      description: "CGPA: 9.05 / 10 | Pre-final-year student specializing in Software Development, AI/ML applications, and IoT-based intelligent systems.",
      imageUrls: ["/uploads/files-1782117713412-444946696.jpeg"],
      githubUrl: "",
      reportUrls: ["/uploads/files-1782117622495-632531694.pdf"]
    },
    {
      id: "ed-2",
      degree: "Class XII (TNSCERT)",
      institution: "Rani Seethai Achi Higher Secondary School, Chidambaram",
      date: "2024",
      description: "Higher Secondary Examination (HSC) — Score: 91%",
      imageUrls: [],
      githubUrl: "",
      reportUrls: []
    },
    {
      id: "ed-3",
      degree: "Class X (TNSCERT)",
      institution: "Government Higher Secondary School, Chidambaram",
      date: "2022",
      description: "Secondary School Leaving Certificate (SSLC) — Score: 81%",
      imageUrls: [],
      githubUrl: "",
      reportUrls: []
    }
  ],
  certifications: [
    {
      id: "ce-1",
      title: "Full Stack Development",
      issuer: "CodeBuilders (Ongoing)",
      date: "Ongoing",
      description: "Comprehensive program focused on building fully integrated web applications, client-server architectures, and deployment workflows.",
      imageUrls: ["/uploads/file-1781798006281-637074272.png"],
      githubUrl: "",
      reportUrls: []
    },
    {
      id: "ce-2",
      title: "AI & Machine Learning Workshop",
      issuer: "Indian Institute of Science (IISc)",
      date: "2026",
      description: "Hands-on workshop covering AI models, machine learning fundamentals, and predictive analytics.",
      imageUrls: [],
      githubUrl: "",
      reportUrls: []
    },
    {
      id: "ce-3",
      title: "Python Acceleration Program",
      issuer: "Ministry of Micro, Small and Medium Enterprises (MSME)",
      date: "2025",
      description: "Intensive program focused on Python development, optimization, and practical application.",
      imageUrls: [],
      githubUrl: "",
      reportUrls: ["/uploads/files-1782117634124-8584961.pdf", "/uploads/files-1782119774788-105883579-NLH3.pdf"]
    },
    {
      id: "ce-4",
      title: "Programming with Data Structures and Algorithms",
      issuer: "NPTEL",
      date: "2025",
      description: "Coursework covering algorithmic complexity, data structures, and problem-solving techniques.",
      imageUrls: [],
      githubUrl: "",
      reportUrls: ["/uploads/files-1782118466492-316622051-NLH3__1_.pdf"]
    }
  ],
  achievements: [
    {
      id: "ac-1",
      title: "Shortlisted for Smart India Hackathon (SIH)",
      issuer: "Smart India Hackathon",
      date: "2025",
      description: "Shortlisted among top teams for designing innovative engineering solutions to solve real-world problems.",
      imageUrls: [],
      githubUrl: "https://github.com/DHAMODHARAN-R26",
      reportUrls: []
    },
    {
      id: "ac-2",
      title: "Finalist – YI Hackathon 6.0",
      issuer: "Young Indians (YI)",
      date: "2025",
      description: "Finalist – YI Hackathon 6.0, awarded a mentorship opportunity for best performance.",
      imageUrls: [],
      githubUrl: "",
      reportUrls: []
    },
    {
      id: "ac-3",
      title: "Received Funding Through MSME 5.0 Hackathon",
      issuer: "Ministry of Micro, Small and Medium Enterprises (MSME)",
      date: "2025",
      description: "Received funding through MSME 5.0 Hackathon for innovative technical product development.",
      imageUrls: [],
      githubUrl: "",
      reportUrls: []
    },
    {
      id: "ac-4",
      title: "1st Prize – Paper Presentation",
      issuer: "Pondicherry Technological University (PTU)",
      date: "2026",
      description: "Awarded 1st Prize in Paper Presentation at Pondicherry Technological University.",
      imageUrls: [],
      githubUrl: "",
      reportUrls: ["/uploads/files-1782119994746-239230280-NLH_2026__1_.pdf"]
    },
    {
      id: "ac-5",
      title: "2nd Prize – Paper Presentation",
      issuer: "Pondicherry Technological University (PTU)",
      date: "2026",
      description: "Awarded 2nd Prize in Paper Presentation at Pondicherry Technological University.",
      imageUrls: [],
      githubUrl: "",
      reportUrls: []
    },
    {
      id: "ac-6",
      title: "2nd Prize – Paper Presentation",
      issuer: "Pondicherry Technological University (PTU)",
      date: "2025",
      description: "Awarded 2nd Prize in Paper Presentation at Pondicherry Technological University.",
      imageUrls: [],
      githubUrl: "",
      reportUrls: []
    },
    {
      id: "ac-7",
      title: "2nd Prize – Paper Presentation (Azollax Project)",
      issuer: "Pondicherry Technological University (PTU)",
      date: "2025",
      description: "Awarded 2nd Prize in Paper Presentation for the Azollax Project at Pondicherry Technological University.",
      imageUrls: [],
      githubUrl: "",
      reportUrls: []
    },
    {
      id: "ac-8",
      title: "1st Prize – National Science Day Expo",
      issuer: "Achariya College of Engineering Technology",
      date: "2026",
      description: "Won 1st Prize at the National Science Day Expo (2026) at Achariya College of Engineering Technology.",
      imageUrls: [],
      githubUrl: "",
      reportUrls: []
    },
    {
      id: "ac-9",
      title: "3rd Prize – National Science Day Expo",
      issuer: "Achariya College of Engineering Technology",
      date: "2026",
      description: "Awarded 3rd Prize at the National Science Day Expo (2026) at Achariya College of Engineering Technology.",
      imageUrls: [],
      githubUrl: "",
      reportUrls: []
    },
    {
      id: "ac-10",
      title: "2nd Prize – Poster Presentation",
      issuer: "Achariya College of Engineering Technology",
      date: "2026",
      description: "Awarded 2nd Prize in Poster Presentation at Achariya College of Engineering Technology.",
      imageUrls: [],
      githubUrl: "",
      reportUrls: []
    },
    {
      id: "ac-11",
      title: "1st Prize – Reverse Engineering",
      issuer: "Achariya College of Engineering Technology",
      date: "2026",
      description: "Won 1st Prize in Reverse Engineering at Achariya College of Engineering Technology.",
      imageUrls: [],
      githubUrl: "",
      reportUrls: []
    },
    {
      id: "ac-12",
      title: "2nd Prize – Code Debugging",
      issuer: "Achariya College of Engineering Technology",
      date: "2026",
      description: "Awarded 2nd Prize in Code Debugging at Achariya College of Engineering Technology.",
      imageUrls: [],
      githubUrl: "",
      reportUrls: []
    }
  ],
  contacts: []
};

function initializeLocalDB() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(initialData, null, 2));
    console.log('Local JSON database seeded and created.');
  } else {
    console.log('Loaded local JSON database.');
  }
}

function readLocalDB() {
  try {
    const content = fs.readFileSync(LOCAL_DB_PATH, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading JSON DB. Reinitializing...', err);
    initializeLocalDB();
    return initialData;
  }
}

function writeLocalDB(data) {
  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2));
}

function sanitizeMongoPayload(data, includeMedia = false) {
  const payload = { ...data };
  delete payload._id;
  delete payload.id;
  delete payload.__v;
  if (includeMedia) {
    const imageUrls = Array.isArray(payload.imageUrls) ? [...payload.imageUrls] : [];
    if (payload.imageUrl && !imageUrls.includes(payload.imageUrl)) {
      imageUrls.unshift(payload.imageUrl);
    }
    const reportUrls = Array.isArray(payload.reportUrls) ? [...payload.reportUrls] : [];
    if (payload.reportUrl && !reportUrls.includes(payload.reportUrl)) {
      reportUrls.unshift(payload.reportUrl);
    }
    payload.imageUrls = imageUrls.filter(Boolean);
    payload.reportUrls = reportUrls.filter(Boolean);
    delete payload.imageUrl;
    delete payload.reportUrl;
  }
  return payload;
}

// Database-agnostic Repository Wrapper
export const db = {
  profile: {
    get: async () => {
      if (useMongo) {
        let p = await MongooseProfile.findOne();
        if (!p) {
          p = await MongooseProfile.create(initialData.profile);
        }
        return p;
      } else {
        const dbData = readLocalDB();
        return dbData.profile;
      }
    },
    update: async (updateData) => {
      if (useMongo) {
        const cleanData = sanitizeMongoPayload(updateData, false);
        let p = await MongooseProfile.findOne();
        if (!p) {
          p = new MongooseProfile(cleanData);
        } else {
          Object.assign(p, cleanData);
        }
        return await p.save();
      } else {
        const dbData = readLocalDB();
        dbData.profile = { ...dbData.profile, ...updateData };
        writeLocalDB(dbData);
        return dbData.profile;
      }
    }
  },
  
  skills: {
    getAll: async () => {
      if (useMongo) {
        return await MongooseSkill.find();
      } else {
        return readLocalDB().skills || [];
      }
    },
    create: async (data) => {
      if (useMongo) {
        return await MongooseSkill.create(sanitizeMongoPayload(data, false));
      } else {
        const dbData = readLocalDB();
        const newSkill = { id: 'sk-' + Date.now(), ...data };
        dbData.skills = dbData.skills || [];
        dbData.skills.push(newSkill);
        writeLocalDB(dbData);
        return newSkill;
      }
    },
    update: async (id, data) => {
      if (useMongo) {
        return await MongooseSkill.findByIdAndUpdate(id, sanitizeMongoPayload(data, false), { new: true });
      } else {
        const dbData = readLocalDB();
        const index = dbData.skills.findIndex(s => s.id === id);
        if (index !== -1) {
          dbData.skills[index] = { ...dbData.skills[index], ...data };
          writeLocalDB(dbData);
          return dbData.skills[index];
        }
        return null;
      }
    },
    delete: async (id) => {
      if (useMongo) {
        return await MongooseSkill.findByIdAndDelete(id);
      } else {
        const dbData = readLocalDB();
        const originalLength = dbData.skills.length;
        dbData.skills = dbData.skills.filter(s => s.id !== id);
        writeLocalDB(dbData);
        return dbData.skills.length < originalLength;
      }
    }
  },

  projects: {
    getAll: async () => {
      if (useMongo) {
        return await MongooseProject.find();
      } else {
        return readLocalDB().projects || [];
      }
    },
    create: async (data) => {
      if (useMongo) {
        return await MongooseProject.create(sanitizeMongoPayload(data, true));
      } else {
        const dbData = readLocalDB();
        const newProj = { id: 'pr-' + Date.now(), ...data };
        dbData.projects = dbData.projects || [];
        dbData.projects.push(newProj);
        writeLocalDB(dbData);
        return newProj;
      }
    },
    update: async (id, data) => {
      if (useMongo) {
        return await MongooseProject.findByIdAndUpdate(id, sanitizeMongoPayload(data, true), { new: true });
      } else {
        const dbData = readLocalDB();
        const index = dbData.projects.findIndex(p => p.id === id);
        if (index !== -1) {
          dbData.projects[index] = { ...dbData.projects[index], ...data };
          writeLocalDB(dbData);
          return dbData.projects[index];
        }
        return null;
      }
    },
    delete: async (id) => {
      if (useMongo) {
        return await MongooseProject.findByIdAndDelete(id);
      } else {
        const dbData = readLocalDB();
        const originalLength = dbData.projects.length;
        dbData.projects = dbData.projects.filter(p => p.id !== id);
        writeLocalDB(dbData);
        return dbData.projects.length < originalLength;
      }
    }
  },

  achievements: {
    getAll: async () => {
      if (useMongo) {
        return await MongooseAchievement.find();
      } else {
        return readLocalDB().achievements || [];
      }
    },
    create: async (data) => {
      if (useMongo) {
        return await MongooseAchievement.create(sanitizeMongoPayload(data, true));
      } else {
        const dbData = readLocalDB();
        const newAch = { id: 'ac-' + Date.now(), ...data };
        dbData.achievements = dbData.achievements || [];
        dbData.achievements.push(newAch);
        writeLocalDB(dbData);
        return newAch;
      }
    },
    update: async (id, data) => {
      if (useMongo) {
        return await MongooseAchievement.findByIdAndUpdate(id, sanitizeMongoPayload(data, true), { new: true });
      } else {
        const dbData = readLocalDB();
        const index = dbData.achievements.findIndex(a => a.id === id);
        if (index !== -1) {
          dbData.achievements[index] = { ...dbData.achievements[index], ...data };
          writeLocalDB(dbData);
          return dbData.achievements[index];
        }
        return null;
      }
    },
    delete: async (id) => {
      if (useMongo) {
        return await MongooseAchievement.findByIdAndDelete(id);
      } else {
        const dbData = readLocalDB();
        const originalLength = dbData.achievements.length;
        dbData.achievements = dbData.achievements.filter(a => a.id !== id);
        writeLocalDB(dbData);
        return dbData.achievements.length < originalLength;
      }
    }
  },

  experience: {
    getAll: async () => {
      if (useMongo) {
        return await MongooseExperience.find();
      } else {
        return readLocalDB().experience || [];
      }
    },
    create: async (data) => {
      if (useMongo) {
        return await MongooseExperience.create(sanitizeMongoPayload(data, true));
      } else {
        const dbData = readLocalDB();
        const newExp = { id: 'ex-' + Date.now(), ...data };
        dbData.experience = dbData.experience || [];
        dbData.experience.push(newExp);
        writeLocalDB(dbData);
        return newExp;
      }
    },
    update: async (id, data) => {
      if (useMongo) {
        return await MongooseExperience.findByIdAndUpdate(id, sanitizeMongoPayload(data, true), { new: true });
      } else {
        const dbData = readLocalDB();
        const index = dbData.experience.findIndex(e => e.id === id);
        if (index !== -1) {
          dbData.experience[index] = { ...dbData.experience[index], ...data };
          writeLocalDB(dbData);
          return dbData.experience[index];
        }
        return null;
      }
    },
    delete: async (id) => {
      if (useMongo) {
        return await MongooseExperience.findByIdAndDelete(id);
      } else {
        const dbData = readLocalDB();
        const originalLength = dbData.experience.length;
        dbData.experience = dbData.experience.filter(e => e.id !== id);
        writeLocalDB(dbData);
        return dbData.experience.length < originalLength;
      }
    }
  },

  education: {
    getAll: async () => {
      if (useMongo) {
        return await MongooseEducation.find();
      } else {
        return readLocalDB().education || [];
      }
    },
    create: async (data) => {
      if (useMongo) {
        return await MongooseEducation.create(sanitizeMongoPayload(data, true));
      } else {
        const dbData = readLocalDB();
        const newEdu = { id: 'ed-' + Date.now(), ...data };
        dbData.education = dbData.education || [];
        dbData.education.push(newEdu);
        writeLocalDB(dbData);
        return newEdu;
      }
    },
    update: async (id, data) => {
      if (useMongo) {
        return await MongooseEducation.findByIdAndUpdate(id, sanitizeMongoPayload(data, true), { new: true });
      } else {
        const dbData = readLocalDB();
        const index = dbData.education.findIndex(e => e.id === id);
        if (index !== -1) {
          dbData.education[index] = { ...dbData.education[index], ...data };
          writeLocalDB(dbData);
          return dbData.education[index];
        }
        return null;
      }
    },
    delete: async (id) => {
      if (useMongo) {
        return await MongooseEducation.findByIdAndDelete(id);
      } else {
        const dbData = readLocalDB();
        const originalLength = dbData.education.length;
        dbData.education = dbData.education.filter(e => e.id !== id);
        writeLocalDB(dbData);
        return dbData.education.length < originalLength;
      }
    }
  },

  certifications: {
    getAll: async () => {
      if (useMongo) {
        return await MongooseCertification.find();
      } else {
        return readLocalDB().certifications || [];
      }
    },
    create: async (data) => {
      if (useMongo) {
        return await MongooseCertification.create(sanitizeMongoPayload(data, true));
      } else {
        const dbData = readLocalDB();
        const newCert = { id: 'ce-' + Date.now(), ...data };
        dbData.certifications = dbData.certifications || [];
        dbData.certifications.push(newCert);
        writeLocalDB(dbData);
        return newCert;
      }
    },
    update: async (id, data) => {
      if (useMongo) {
        return await MongooseCertification.findByIdAndUpdate(id, sanitizeMongoPayload(data, true), { new: true });
      } else {
        const dbData = readLocalDB();
        const index = dbData.certifications.findIndex(c => c.id === id);
        if (index !== -1) {
          dbData.certifications[index] = { ...dbData.certifications[index], ...data };
          writeLocalDB(dbData);
          return dbData.certifications[index];
        }
        return null;
      }
    },
    delete: async (id) => {
      if (useMongo) {
        return await MongooseCertification.findByIdAndDelete(id);
      } else {
        const dbData = readLocalDB();
        const originalLength = dbData.certifications.length;
        dbData.certifications = dbData.certifications.filter(c => c.id !== id);
        writeLocalDB(dbData);
        return dbData.certifications.length < originalLength;
      }
    }
  },

  contacts: {
    getAll: async () => {
      if (useMongo) {
        return await MongooseContact.find().sort({ createdAt: -1 });
      } else {
        const cList = readLocalDB().contacts || [];
        return [...cList].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    },
    create: async (data) => {
      if (useMongo) {
        return await MongooseContact.create(data);
      } else {
        const dbData = readLocalDB();
        const newContact = { id: 'co-' + Date.now(), createdAt: new Date().toISOString(), ...data };
        dbData.contacts = dbData.contacts || [];
        dbData.contacts.push(newContact);
        writeLocalDB(dbData);
        return newContact;
      }
    },
    delete: async (id) => {
      if (useMongo) {
        return await MongooseContact.findByIdAndDelete(id);
      } else {
        const dbData = readLocalDB();
        const originalLength = dbData.contacts.length;
        dbData.contacts = dbData.contacts.filter(c => c.id !== id);
        writeLocalDB(dbData);
        return dbData.contacts.length < originalLength;
      }
    }
  }
};
