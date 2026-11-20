import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');
const LOCAL_DB_PATH = path.join(DATA_DIR, 'local_db.json');

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
});

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, default: 'Frontend' },
  percentage: { type: Number, default: 80 }
});

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  techStack: [{ type: String }],
  githubUrl: { type: String, default: '' },
  demoUrl: { type: String, default: '' },
  imageUrls: [{ type: String }],
  reportUrls: [{ type: String }]
});

const AchievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, default: '' },
  date: { type: String, default: '' },
  description: { type: String, default: '' },
  imageUrls: [{ type: String }],
  githubUrl: { type: String, default: '' },
  reportUrls: [{ type: String }]
});

const ExperienceSchema = new mongoose.Schema({
  role: { type: String, required: true },
  company: { type: String, required: true },
  date: { type: String, default: '' },
  description: { type: String, default: '' },
  imageUrls: [{ type: String }],
  githubUrl: { type: String, default: '' },
  reportUrls: [{ type: String }]
});

const EducationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  date: { type: String, default: '' },
  description: { type: String, default: '' },
  imageUrls: [{ type: String }],
  githubUrl: { type: String, default: '' },
  reportUrls: [{ type: String }]
});

const CertificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: String, default: '' },
  description: { type: String, default: '' },
  imageUrls: [{ type: String }],
  githubUrl: { type: String, default: '' },
  reportUrls: [{ type: String }]
});

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, default: '' },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

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
const initialData = {
  profile: {
    name: "DHAMODHARAN R",
    title: "SOFTWARE DEVELOPER",
    bio: "I am a motivated Computer Science student currently learning Full Stack Development, with practical experience in IoT-based projects like smart monitoring systems. I enjoy building innovative solutions that combine software and hardware to solve real-world challenges. I am eager to apply my skills and continuously learn new technologies.",
    image: "",
    resume: "",
    github: "https://github.com/DHAMODHARAN-R26",
    linkedin: "https://linkedin.com/in/dhamo-r",
    email: "dhamodharanr08@gmail.com",
    phone: "+91 8778119621",
    location: "Acet,Villianur"
  },
  skills: [
    { id: "sk-1", name: "C", category: "Programming & DSA", percentage: 90 },
    { id: "sk-2", name: "C++", category: "Programming & DSA", percentage: 85 },
    { id: "sk-3", name: "Python", category: "Programming & DSA", percentage: 90 },
    { id: "sk-4", name: "Java", category: "Programming & DSA", percentage: 85 },
    { id: "sk-5", name: "DSA", category: "Programming & DSA", percentage: 88 },
    { id: "sk-6", name: "NUMPY", category: "Programming & DSA", percentage: 80 },
    { id: "sk-7", name: "HTML", category: "Web & Databases", percentage: 95 },
    { id: "sk-8", name: "CSS", category: "Web & Databases", percentage: 90 },
    { id: "sk-9", name: "JAVASCRIPT", category: "Web & Databases", percentage: 92 },
    { id: "sk-10", name: "MYSQL", category: "Web & Databases", percentage: 88 },
    { id: "sk-11", name: "JDBC", category: "Web & Databases", percentage: 80 },
    { id: "sk-12", name: "Communication Skills", category: "Soft Skills", percentage: 90 },
    { id: "sk-13", name: "Problem-Solving", category: "Soft Skills", percentage: 92 },
    { id: "sk-14", name: "Teamwork", category: "Soft Skills", percentage: 90 },
    { id: "sk-15", name: "Time Management", category: "Soft Skills", percentage: 85 },
    { id: "sk-16", name: "Adaptability", category: "Soft Skills", percentage: 90 },
    { id: "sk-17", name: "Leadership", category: "Soft Skills", percentage: 85 },
    { id: "sk-18", name: "Critical Thinking", category: "Soft Skills", percentage: 88 },
    { id: "sk-19", name: "Creativity", category: "Soft Skills", percentage: 90 }
  ],
  projects: [
    {
      id: "pr-1",
      title: "Nivora – Smart Intelligent Mountain Road Safety System",
      description: "Developed an IoT-based system to detect vehicles at blind curves and reduce accident risks. Implemented real-time bidirectional alerts for approaching vehicles, integrated emergency SOS feature with GPS for accident situations, and designed fail-safe mechanisms for communication and power failures.",
      techStack: ["IoT", "Sensors", "GPS", "Bidirectional Alerts", "Fail-safe Systems"],
      githubUrl: "https://github.com/DHAMODHARAN-R26",
      demoUrl: "",
      imageUrl: ""
    },
    {
      id: "pr-2",
      title: "Zerora – Advanced Water Monitoring & Automatic Cleaning System",
      description: "Built a smart system to monitor water quality using pH, turbidity, and TDS sensors. Implemented real-time detection of contaminants and unsafe conditions, designed automatic cleaning mechanism to flush and refill contaminated water, and integrated alert system for notifying users about water quality issues.",
      techStack: ["IoT", "pH Sensor", "Turbidity", "TDS Sensor", "Automation"],
      githubUrl: "https://github.com/DHAMODHARAN-R26",
      demoUrl: "",
      imageUrl: ""
    },
    {
      id: "pr-3",
      title: "InOrOut – Real-Time Smart Faculty Availability & Notification System",
      description: "Developed a system to track faculty availability using real-time entry/exit sensor detection. Implemented sensor-based monitoring to update status automatically, designed notification system to inform students about faculty presence, and improved communication efficiency within the institution.",
      techStack: ["IoT", "Entry/Exit Sensors", "Automatic Updates", "Notifications"],
      githubUrl: "https://github.com/DHAMODHARAN-R26",
      demoUrl: "",
      imageUrl: ""
    },
    {
      id: "pr-4",
      title: "Digilog – Digital Student Monitoring System",
      description: "Developed a digital system to monitor and manage student activity records. Replaced manual tracking with automated data logging, designed structured data storage for easy retrieval and analysis, and improved accuracy and efficiency in monitoring processes.",
      techStack: ["Data Logging", "Automated Monitoring", "Structured Storage", "Data Analysis"],
      githubUrl: "https://github.com/DHAMODHARAN-R26",
      demoUrl: "",
      imageUrl: ""
    },
    {
      id: "pr-5",
      title: "CSENEXUS – Department Coordination Website",
      description: "Developed a web platform for managing departmental activities and communication. Designed user-friendly interface for announcements and updates, structured content for easy access by students and faculty, and improved coordination and information sharing within the department.",
      techStack: ["Web Development", "Frontend", "UI Design", "Coordination Tools"],
      githubUrl: "https://github.com/DHAMODHARAN-R26",
      demoUrl: "",
      imageUrl: ""
    }
  ],
  achievements: [
    {
      id: "ac-education-1",
      title: "B.Tech In Computer Science & Engineering",
      issuer: "Achariya College Of Engineering Technology",
      date: "2024-Present",
      description: "Currently pursuing. CGPA: 9.23"
    },
    {
      id: "ac-intern-1",
      title: "Web Development Intern",
      issuer: "SkillBuilder Academy",
      date: "Dec 2025-Jan 2026",
      description: "Developed foundational skills in website development using Antigravity with exposure to frontend–backend integration. Contributed to building web pages and learned routing, application structure, and deployment concepts."
    },
    {
      id: "ac-cert-1",
      title: "Full Stack Development Certification",
      issuer: "CodeBuilders (Ongoing)",
      date: "Ongoing",
      description: "Ongoing comprehensive program focused on building fully integrated web applications."
    },
    {
      id: "ac-cert-2",
      title: "AI & Machine Learning Workshop",
      issuer: "Indian Institute of Science (IISc)",
      date: "2026",
      description: "Participated in hands-on workshops covering advanced AI models and machine learning fundamentals."
    },
    {
      id: "ac-cert-3",
      title: "Python Acceleration Program",
      issuer: "Ministry of Micro, Small and Medium Enterprises (MSME)",
      date: "2025",
      description: "Intense learning program focused on speed, optimization, and practical application of Python."
    },
    {
      id: "ac-cert-4",
      title: "Programming with Data Structures and Algorithms",
      issuer: "NPTEL",
      date: "2025",
      description: "Successfully completed coursework focusing on algorithmic design, complexity analysis, and basic data structures."
    },
    {
      id: "ac-hack-1",
      title: "Shortlisted for Smart India Hackathon (SIH)",
      issuer: "Smart India Hackathon",
      date: "2025",
      description: "Selected among top teams for implementing national-level solutions under technical tracks."
    },
    {
      id: "ac-prize-1",
      title: "1st Prize, Paper Presentation",
      issuer: "Pondicherry Technological University (PTU)",
      date: "2026",
      description: "Awarded first place for presenting technical research and concepts."
    },
    {
      id: "ac-prize-2",
      "title": "2nd Prize, Paper Presentation",
      issuer: "Pondicherry Technological University (PTU)",
      date: "2026",
      description: "Awarded second place for paper presentation."
    },
    {
      id: "ac-prize-3",
      title: "1st Prize, National Science Day Expo",
      issuer: "Achariya College of Engineering and Technology",
      date: "2026",
      description: "Won first prize in the national-level science exhibition."
    },
    {
      id: "ac-prize-4",
      title: "2nd Prize, Paper Presentation (Azollax Project)",
      issuer: "Pondicherry Technological University (PTU)",
      date: "2025",
      description: "Presented research and technical development on the Azollax project."
    },
    {
      id: "ac-prize-5",
      title: "2nd Prize, Paper Presentation",
      issuer: "Pondicherry Technological University (PTU)",
      date: "2025",
      description: "Awarded second place for paper presentation."
    },
    {
      id: "ac-prize-6",
      title: "3rd Prize, National Science Day Expo",
      issuer: "Achariya College of Engineering and Technology",
      date: "2026",
      description: "Awarded third place in the national science expo."
    },
    {
      id: "ac-prize-7",
      title: "2nd Prize, Poster Presentation",
      issuer: "Achariya College of Engineering and Technology",
      date: "2026",
      description: "Awarded second place in technical poster representation."
    },
    {
      id: "ac-prize-8",
      title: "2nd Prize, Reverse Engineering",
      issuer: "Achariya College of Engineering and Technology",
      date: "2026",
      description: "Showed deep troubleshooting and deduction skills to win 2nd place in reverse engineering."
    },
    {
      id: "ac-prize-9",
      title: "2nd Prize, Code Debugging",
      issuer: "Achariya College of Engineering and Technology",
      date: "2026",
      description: "Awarded second place for speed and accuracy in debugging complex software issues."
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
        let p = await MongooseProfile.findOne();
        if (!p) {
          p = new MongooseProfile(updateData);
        } else {
          Object.assign(p, updateData);
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
        return await MongooseSkill.create(data);
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
        return await MongooseSkill.findByIdAndUpdate(id, data, { new: true });
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
        return await MongooseProject.create(data);
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
        return await MongooseProject.findByIdAndUpdate(id, data, { new: true });
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
        return await MongooseAchievement.create(data);
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
        return await MongooseAchievement.findByIdAndUpdate(id, data, { new: true });
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
        return await MongooseExperience.create(data);
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
        return await MongooseExperience.findByIdAndUpdate(id, data, { new: true });
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
        return await MongooseEducation.create(data);
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
        return await MongooseEducation.findByIdAndUpdate(id, data, { new: true });
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
        return await MongooseCertification.create(data);
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
        return await MongooseCertification.findByIdAndUpdate(id, data, { new: true });
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
