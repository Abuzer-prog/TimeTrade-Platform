import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User.js';
import { Session } from './models/Session.js';
import { Booking } from './models/Booking.js';
import { logger } from './utils/logger.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/timetrade';
    logger.info(`Connecting to database for seeding at: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    logger.info('Cleaning existing collections...');
    await User.deleteMany({});
    await Session.deleteMany({});
    await Booking.deleteMany({});

    logger.info('Creating student accounts...');
    const users = await User.create([
      {
        name: 'Alex Chen',
        email: 'alex.chen@university.edu',
        password: 'password123',
        department: 'Computer Science',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        bio: 'BCA 5th Semester. Passionate about Full-Stack web architecture, MERN stack, and algorithms.',
      },
      {
        name: 'Sarah Jenkins',
        email: 'sarah.jenkins@university.edu',
        password: 'password123',
        department: 'Data Science',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        bio: 'Stats nerd, Pythonista, and SQL enthusiast. Happy to exchange help on data structures.',
      },
      {
        name: 'Marcus Taylor',
        email: 'marcus.taylor@university.edu',
        password: 'password123',
        department: 'Software Engineering',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        bio: 'Backend developer, Docker fan, and presentation coach for capstone defense.',
      },
      {
        name: 'Priya Patel',
        email: 'priya.patel@university.edu',
        password: 'password123',
        department: 'Information Technology',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        bio: 'Frontend enthusiast specializing in React, Tailwind, and responsive web design.',
      },
      {
        name: 'David Kim',
        email: 'david.kim@university.edu',
        password: 'password123',
        department: 'Mathematics & Computing',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        bio: 'Discrete Math tutor and competitive programmer. Let us trade time on coding tasks.',
      },
    ]);

    logger.info('Creating session offerings...');
    const [alex, sarah, marcus, priya, david] = users;

    const sessions = await Session.create([
      {
        creator: alex._id,
        title: 'React 18 Hooks & State Architecture Walkthrough',
        category: 'Coding',
        description:
          'Hands-on session troubleshooting useEffect dependencies, custom hooks, and state management pitfalls for midterms and capstones.',
        skillOffered: 'React, JavaScript, State Management',
        durationMinutes: 45,
        timeSlot: 'Tomorrow at 4:00 PM EST',
        status: 'Open',
      },
      {
        creator: sarah._id,
        title: 'BCA Semester 5 Web Technologies Handwritten Notes Review',
        category: 'Notes',
        description:
          'Comprehensive breakdown of semester 5 front-end and back-end exam topics with high-yield revision summaries and past year questions.',
        skillOffered: 'Exam Notes, Front-end Theory, Revision',
        durationMinutes: 30,
        timeSlot: 'Thursday at 6:30 PM EST',
        status: 'Open',
      },
      {
        creator: marcus._id,
        title: 'Mock Final Year Capstone Project Defense & Slide Polish',
        category: 'Presentation Practice',
        description:
          'Run through your 10-minute presentation slides. Receive constructive feedback on pacing, technical delivery, and Q&A readiness.',
        skillOffered: 'Public Speaking, Slide Review, Project Defense',
        durationMinutes: 60,
        timeSlot: 'Friday at 2:00 PM EST',
        status: 'Open',
      },
      {
        creator: david._id,
        title: 'Discrete Math Graph Theory & Complexity Analysis',
        category: 'Academic Support',
        description:
          'Working through Euler paths, Hamilton cycles, tree traversals, and Big-O proof techniques for the upcoming midterm.',
        skillOffered: 'Discrete Mathematics, Proofs, Big-O',
        durationMinutes: 45,
        timeSlot: 'Saturday at 11:00 AM EST',
        status: 'Open',
      },
      {
        creator: priya._id,
        title: 'Tailwind CSS Layout Mastery: Flexbox, Grid & Responsive UI',
        category: 'Coding',
        description:
          'Learn how to rapidly translate Figma concepts to pixel-perfect responsive Tailwind components without bloated CSS.',
        skillOffered: 'Tailwind CSS, Responsive Design, Flexbox',
        durationMinutes: 45,
        timeSlot: 'Sunday at 3:00 PM EST',
        status: 'Booked',
      },
      {
        creator: alex._id,
        title: 'Git Merge Conflicts, Rebasing & GitHub Workflow Clinic',
        category: 'Other',
        description:
          'Stuck in a merge conflict nightmare? Let us pair-program to untangle git rebases, resolve detached heads, and set up branch protections.',
        skillOffered: 'Git, GitHub, Version Control, CLI',
        durationMinutes: 30,
        timeSlot: 'Next Monday at 5:00 PM EST',
        status: 'Open',
      },
    ]);

    logger.info('Creating initial slot requests / bookings...');
    const [, sessionSarah, , , sessionPriya] = sessions;

    await Booking.create([
      {
        session: sessionSarah._id,
        requester: alex._id,
        creator: sarah._id,
        message: 'Hey Sarah! Would love to trade notes review for some React assistance.',
        status: 'Pending',
      },
      {
        session: sessionPriya._id,
        requester: marcus._id,
        creator: priya._id,
        message: 'Hey Priya, looking forward to pairing on the Tailwind dashboard layout.',
        status: 'Accepted',
      },
    ]);

    logger.info('Database seeded successfully with demo students and sessions!');
    logger.info('Demo Credentials:');
    users.forEach((u) => {
      logger.info(` - Email: ${u.email} | Password: password123`);
    });

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    logger.error(`Error during seed: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
