import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ExternalLink, Play, Star } from 'lucide-react';
import axios from 'axios';
import analytics from '../utils/analytics';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Resources = () => {
  const [tools, setTools] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [toolsRes, videosRes] = await Promise.all([
        axios.get(`${API}/affiliate-tools`),
        axios.get(`${API}/videos`)
      ]);
      setTools(toolsRes.data);
      setVideos(videosRes.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-page)' }}>
        <p className="body-large">Loading resources...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px', background: 'var(--bg-page)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '48px', textAlign: 'center' }}>
          <h1 className="heading-1" style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>Resources & Tools</h1>
          <p className="body-large" style={{ color: 'var(--text-secondary)' }}>Trusted tools and video tutorials for your PC building journey</p>
        </div>

        {/* Recommended Tools Section */}
        <section style={{ marginBottom: '96px' }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 className="heading-2" style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Recommended Tools</h2>
            <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>Tools I trust and use - Amazon affiliate links</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {tools.map((tool) => (
              <Card key={tool.id} className="hover-lift" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)', overflow: 'hidden' }}>
                <div style={{ position: 'relative', height: '200px', overflow: 'hidden', background: 'var(--bg-page)' }}>
                  <img 
                    src={tool.image} 
                    alt={tool.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {tool.featured && (
                    <Badge style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--brand-primary)', color: 'var(--text-inverse)' }}>
                      Featured
                    </Badge>
                  )}
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <h3 className="heading-6" style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>{tool.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          fill={i < Math.floor(tool.rating) ? 'var(--brand-primary)' : 'none'}
                          color="var(--brand-primary)"
                        />
                      ))}
                      <span className="body-small" style={{ marginLeft: '8px' }}>({tool.rating})</span>
                    </div>
                  </div>
                  <p className="body-small" style={{ marginBottom: '16px', minHeight: '60px' }}>{tool.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span className="heading-5" style={{ color: 'var(--text-primary)' }}>${tool.price}</span>
                    <Badge style={{ background: 'var(--secondary-olive)', color: 'var(--text-primary)' }}>
                      {tool.category}
                    </Badge>
                  </div>
                  <a href={tool.affiliateLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <Button 
                      className="btn-primary" 
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                      onClick={() => analytics.trackAffiliateClick(tool.name, tool.id, tool.price)}
                    >
                      View on Amazon
                      <ExternalLink size={16} />
                    </Button>
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Video Tutorials Section */}
        <section>
          <div style={{ marginBottom: '32px' }}>
            <h2 className="heading-2" style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Video Tutorials</h2>
            <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>Learn from our video content on Facebook, Instagram, and TikTok</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
            {videos.map((video) => (
              <Card key={video.id} className="hover-lift" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)', overflow: 'hidden', cursor: 'pointer' }}>
                <div 
                  style={{ 
                    position: 'relative', 
                    paddingBottom: '56.25%', 
                    background: 'var(--bg-page)',
                    overflow: 'hidden'
                  }}
                >
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    style={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover' 
                    }}
                  />
                  <div style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0, 0, 0, 0.3)'
                  }}>
                    <div style={{ 
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: 'var(--brand-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Play size={28} color="var(--text-inverse)" fill="var(--text-inverse)" />
                    </div>
                  </div>
                  <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px' }}>
                    {video.platforms.map((platform) => (
                      <Badge key={platform} style={{ background: 'var(--brand-primary)', color: 'var(--text-inverse)' }}>
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 className="heading-6" style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>{video.title}</h3>
                  <p className="body-small" style={{ marginBottom: '12px' }}>{video.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span className="caption">{video.duration}</span>
                    <span className="caption">{video.views} views</span>
                  </div>
                  <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <Button 
                      className="btn-secondary" 
                      style={{ width: '100%' }}
                      onClick={() => analytics.trackVideoClick(video.title, video.id, video.platforms.join(', '))}
                    >
                      Watch Now
                    </Button>
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Resources;