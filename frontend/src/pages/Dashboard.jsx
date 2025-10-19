import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { BookOpen, Cpu, Calendar, MessageSquare, TrendingUp, Award } from 'lucide-react';
import { learningPathsAPI, buildsAPI, eventsAPI, forumAPI } from '../api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading, login } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [learningPaths, setLearningPaths] = useState([]);
  const [builds, setBuilds] = useState([]);
  const [events, setEvents] = useState([]);
  const [forumTopics, setForumTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        login();
      } else {
        fetchData();
      }
    }
  }, [authLoading, isAuthenticated]);

  const fetchData = async () => {
    try {
      const [pathsRes, buildsRes, eventsRes, forumRes] = await Promise.all([
        learningPathsAPI.getAll(),
        buildsAPI.getAll(10, 0),
        eventsAPI.getAll(),
        forumAPI.getTopics(null, 3, 0)
      ]);

      setLearningPaths(pathsRes.data);
      setBuilds(buildsRes.data);
      setEvents(eventsRes.data);
      setForumTopics(forumRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading || !user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-page)' }}>
        <p className="body-large">Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px', background: 'var(--bg-page)' }}>
      <div className="container">
        {/* Welcome Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 className="heading-2" style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Welcome back, {user.name}!</h1>
          <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>Here's what's happening in your learning journey</p>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <Card style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <BookOpen size={24} color="var(--brand-primary)" />
              <h3 className="heading-5" style={{ color: 'var(--text-primary)' }}>{user.coursesCompleted}</h3>
            </div>
            <p className="body-small">Courses Completed</p>
          </Card>
          <Card style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Cpu size={24} color="var(--brand-primary)" />
              <h3 className="heading-5" style={{ color: 'var(--text-primary)' }}>{user.buildsShared}</h3>
            </div>
            <p className="body-small">Builds Shared</p>
          </Card>
          <Card style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Award size={24} color="var(--brand-primary)" />
              <h3 className="heading-5" style={{ color: 'var(--text-primary)' }}>{user.communityRank}</h3>
            </div>
            <p className="body-small">Community Rank</p>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList style={{ background: 'var(--bg-card)', marginBottom: '32px' }}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="learning">My Learning</TabsTrigger>
            <TabsTrigger value="builds">My Builds</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div style={{ display: 'grid', gap: '32px' }}>
              {/* Continue Learning */}
              <div>
                <h3 className="heading-4" style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>Continue Learning</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                  {learningPaths.slice(0, 2).map((path) => (
                    <Card key={path.id} className="hover-lift" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)', padding: '24px', cursor: 'pointer' }}>
                      <Badge style={{ background: 'var(--secondary-olive)', color: 'var(--text-primary)', marginBottom: '12px' }}>{path.difficulty}</Badge>
                      <h4 className="heading-6" style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>{path.title}</h4>
                      <p className="body-small" style={{ marginBottom: '16px' }}>{path.description}</p>
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span className="caption">Progress</span>
                          <span className="caption">45%</span>
                        </div>
                        <div style={{ height: '8px', background: 'var(--bg-page)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: '45%', height: '100%', background: 'var(--brand-primary)' }}></div>
                        </div>
                      </div>
                      <Button className="btn-primary" style={{ width: '100%' }}>Continue</Button>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Recent Forum Activity */}
              <div>
                <h3 className="heading-4" style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>Recent Forum Activity</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {mockForumTopics.slice(0, 3).map((topic) => (
                    <Card key={topic.id} className="hover-lift" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)', padding: '20px', cursor: 'pointer' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                          <h4 className="heading-6" style={{ color: 'var(--text-primary)', marginBottom: '6px' }}>{topic.title}</h4>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span className="caption">{topic.author}</span>
                            <Badge style={{ background: 'var(--secondary-olive)', color: 'var(--text-primary)', fontSize: '0.7rem' }}>{topic.category}</Badge>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <MessageSquare size={16} color="var(--text-secondary)" />
                            <span className="body-small">{topic.replies}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="learning">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {mockLearningPaths.map((path) => (
                <Card key={path.id} className="hover-lift" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)', padding: '24px', cursor: 'pointer' }}>
                  <Badge style={{ background: 'var(--secondary-olive)', color: 'var(--text-primary)', marginBottom: '12px' }}>{path.difficulty}</Badge>
                  <h4 className="heading-6" style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>{path.title}</h4>
                  <p className="body-small" style={{ marginBottom: '16px' }}>{path.description}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span className="caption">Duration:</span>
                      <span className="body-small" style={{ color: 'var(--text-primary)' }}>{path.duration}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span className="caption">Modules:</span>
                      <span className="body-small" style={{ color: 'var(--text-primary)' }}>{path.modules}</span>
                    </div>
                  </div>
                  <Button className="btn-primary" style={{ width: '100%' }}>Start Course</Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="builds">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {mockFeaturedBuilds.map((build) => (
                <Card key={build.id} className="overflow-hidden hover-lift" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)', cursor: 'pointer' }}>
                  <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                    <img 
                      src={build.image} 
                      alt={build.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '20px' }}>
                    <h4 className="heading-6" style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>{build.title}</h4>
                    <p className="body-small" style={{ marginBottom: '12px' }}>{build.specs}</p>
                    <Button className="btn-secondary" style={{ width: '100%' }}>View Details</Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events">
            <div style={{ display: 'grid', gap: '20px' }}>
              {mockEvents.map((event) => (
                <Card key={event.id} className="hover-lift" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)', padding: '24px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                    <img 
                      src={event.image} 
                      alt={event.title}
                      style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <div style={{ flex: 1, minWidth: '250px' }}>
                      <h4 className="heading-5" style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>{event.title}</h4>
                      <p className="body-small" style={{ marginBottom: '16px' }}>{event.description}</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Calendar size={18} color="var(--brand-primary)" />
                          <span className="body-small">{event.date} at {event.time}</span>
                        </div>
                      </div>
                      <Button className="btn-primary">Register Now</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;