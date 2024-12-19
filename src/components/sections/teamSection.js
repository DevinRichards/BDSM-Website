import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const teamMembers = [
  {
    name: "Team Member 1",
    role: "CEO & Founder",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin cursus justo eget augue interdum, in dignissim nulla efficitur.",
    imageUrl: "/api/placeholder/400/400",
    social: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "mailto:example@email.com"
    }
  },
  {
    name: "Team Member 2",
    role: "CTO",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin cursus justo eget augue interdum, in dignissim nulla efficitur.",
    imageUrl: "/api/placeholder/400/400",
    social: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "mailto:example@email.com"
    }
  },
  {
    name: "Team Member 3",
    role: "Lead Developer",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin cursus justo eget augue interdum, in dignissim nulla efficitur.",
    imageUrl: "/api/placeholder/400/400",
    social: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "mailto:example@email.com"
    }
  }
];

const TeamSection = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Our Team</h2>
        <p className="text-xl text-gray-600 text-center mb-12">Meet the founders behind BDSM Software</p>
        
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex-1">
              <div className="aspect-w-1 aspect-h-1">
                <img 
                  src={member.imageUrl} 
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 mb-6">{member.bio}</p>
                
                <div className="flex justify-center space-x-4">
                  <a 
                    href={member.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Github className="w-6 h-6" />
                  </a>
                  <a 
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Linkedin className="w-6 h-6" />
                  </a>
                  <a 
                    href={member.social.email}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Mail className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;