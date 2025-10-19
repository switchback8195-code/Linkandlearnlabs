import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Cpu, Users, BookOpen, Calendar, Heart, Eye, MessageSquare, TrendingUp } from 'lucide-react';
import { learningPathsAPI, buildsAPI, eventsAPI, forumAPI } from '../api';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <img 
            src="https://images.pexels.com/photos/7199194/pexels-photo-7199194.jpeg" 
            alt="Tech workspace"
            className="hero-image"
          />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">Build. Learn. Connect.</h1>
          <p className="body-large" style={{ marginTop: '24px', maxWidth: '30ch' }}>
            Join our inclusive community dedicated to computer building, gaming rigs, and tech education
          </p>
          <div style={{ marginTop: '32px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Button className="btn-primary" onClick={() => navigate('/dashboard')}>
              Get Started
            </Button>
            <Button className="btn-secondary" onClick={() => document.getElementById('learning-paths').scrollIntoView({ behavior: 'smooth' })}>
              Explore Learning
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '96px 40px', background: 'var(--bg-card)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <Users size={48} color="var(--brand-primary)" />
              </div>
              <h3 className="heading-4" style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>2,500+</h3>
              <p className="body-small">Community Members</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <Cpu size={48} color="var(--brand-primary)" />
              </div>
              <h3 className="heading-4" style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>1,200+</h3>
              <p className="body-small">Builds Shared</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <BookOpen size={48} color="var(--brand-primary)" />
              </div>
              <h3 className="heading-4" style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>50+</h3>
              <p className="body-small">Learning Courses</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <Calendar size={48} color="var(--brand-primary)" />
              </div>
              <h3 className="heading-4" style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Weekly</h3>
              <p className="body-small">Live Events</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Builds Section */}
      <section style={{ padding: '96px 40px', background: 'var(--bg-page)' }}>
        <div className="container">
          <div style={{ marginBottom: '48px' }}>
            <h2 className="heading-2" style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>Featured Builds</h2>
            <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>Check out amazing PC builds from our community</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            {mockFeaturedBuilds.map((build) => (
              <Card key={build.id} className="overflow-hidden hover-lift" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)', cursor: 'pointer' }}>
                <div style={{ position: 'relative', height: '250px', overflow: 'hidden' }}>
                  <img 
                    src={build.image} 
                    alt={build.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '24px' }}>
                  <h3 className="heading-5" style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>{build.title}</h3>
                  <p className="caption" style={{ marginBottom: '12px' }}>by {build.builder}</p>
                  <p className="body-small" style={{ marginBottom: '16px' }}>{build.specs}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Heart size={16} color="var(--text-secondary)" />
                      <span className="body-small">{build.likes}</span>
                    </div>
                    <span className="caption" style={{ color: 'var(--text-muted)' }}>{build.date}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section id="learning-paths" style={{ padding: '96px 40px', background: 'var(--bg-card)' }}>
        <div className="container">
          <div style={{ marginBottom: '48px' }}>
            <h2 className="heading-2" style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>Learning Paths</h2>
            <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>Master computer building with our structured courses</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            {mockLearningPaths.map((path) => (
              <Card key={path.id} className="hover-lift" style={{ background: 'var(--bg-page)', border: '1px solid var(--border-medium)', padding: '32px', cursor: 'pointer' }}>
                <div style={{ marginBottom: '16px' }}>
                  <Badge style={{ background: path.difficulty === 'Beginner' ? 'var(--secondary-olive)' : path.difficulty === 'Intermediate' ? 'var(--secondary-yellow)' : 'var(--brand-primary)', color: 'var(--text-inverse)', padding: '4px 12px' }}>
                    {path.difficulty}
                  </Badge>
                </div>
                <h3 className="heading-5" style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>{path.title}</h3>
                <p className="body-small" style={{ marginBottom: '20px', minHeight: '60px' }}>{path.description}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="caption">Duration:</span>
                    <span className="body-small" style={{ color: 'var(--text-primary)' }}>{path.duration}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="caption">Modules:</span>
                    <span className="body-small" style={{ color: 'var(--text-primary)' }}>{path.modules}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="caption">Enrolled:</span>
                    <span className="body-small" style={{ color: 'var(--text-primary)' }}>{path.enrolled} students</span>
                  </div>
                </div>
                <Button className="btn-primary" style={{ width: '100%' }}>Start Learning</Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section style={{ padding: '96px 40px', background: 'var(--bg-page)' }}>
        <div className="container">
          <div style={{ marginBottom: '48px' }}>
            <h2 className="heading-2" style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>Upcoming Events</h2>
            <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>Join our community events and workshops</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
            {mockEvents.map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-card-content">
                  <div>
                    <h3 className="event-card-title">{event.title}</h3>
                    <p className="body-small" style={{ marginBottom: '24px' }}>{event.description}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={20} color="var(--brand-primary)" />
                        <span className="body-small">{event.date} at {event.time}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Users size={20} color="var(--brand-primary)" />
                        <span className="body-small">{event.attendees}/{event.maxAttendees} attendees</span>
                      </div>
                    </div>
                  </div>
                  <Button className="btn-primary" style={{ width: '100%' }}>Register Now</Button>
                </div>
                <div className="event-card-image">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Forum Preview Section */}
      <section style={{ padding: '96px 40px', background: 'var(--bg-card)' }}>
        <div className="container">
          <div style={{ marginBottom: '48px' }}>
            <h2 className="heading-2" style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>Community Forum</h2>
            <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>Join the conversation and get help from experts</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {mockForumTopics.map((topic) => (
              <Card key={topic.id} className="hover-lift" style={{ background: 'var(--bg-page)', border: '1px solid var(--border-medium)', padding: '24px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '20px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '300px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      {topic.isPinned && (
                        <TrendingUp size={18} color="var(--brand-primary)" />
                      )}
                      <h3 className="heading-6" style={{ color: 'var(--text-primary)' }}>{topic.title}</h3>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                      <span className="caption">{topic.author}</span>
                      <Badge style={{ background: 'var(--secondary-olive)', color: 'var(--text-primary)', padding: '2px 8px', fontSize: '0.7rem' }}>
                        {topic.category}
                      </Badge>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MessageSquare size={18} color="var(--text-secondary)" />
                      <span className="body-small">{topic.replies}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Eye size={18} color="var(--text-secondary)" />
                      <span className="body-small">{topic.views}</span>
                    </div>
                    <span className="caption">{topic.lastActivity}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <Button className="btn-secondary" onClick={() => navigate('/forum')}>View All Topics</Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '120px 40px', background: 'var(--bg-page)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="heading-1" style={{ color: 'var(--text-primary)', marginBottom: '24px', maxWidth: '20ch', margin: '0 auto 24px' }}>Ready to Start Your Journey?</h2>
          <p className="body-large" style={{ marginBottom: '40px', maxWidth: '50ch', margin: '0 auto 40px' }}>
            Join thousands of PC builders and tech enthusiasts in our growing community
          </p>
          <Button className="btn-primary" size="lg" onClick={() => navigate('/dashboard')}>Join LinkAndLearnLabs</Button>
        </div>
      </section>
    </div>
  );
};

export default Home;