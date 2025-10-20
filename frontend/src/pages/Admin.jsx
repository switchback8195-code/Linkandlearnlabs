import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('tools');
  
  // State for affiliate tools
  const [tools, setTools] = useState([]);
  const [editingTool, setEditingTool] = useState(null);
  const [showToolForm, setShowToolForm] = useState(false);
  
  // State for videos
  const [videos, setVideos] = useState([]);
  const [editingVideo, setEditingVideo] = useState(null);
  const [showVideoForm, setShowVideoForm] = useState(false);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate('/');
      } else {
        fetchData();
      }
    }
  }, [authLoading, isAuthenticated, navigate]);

  const fetchData = async () => {
    try {
      const [toolsRes, videosRes] = await Promise.all([
        axios.get(`${API}/affiliate-tools`, { withCredentials: true }),
        axios.get(`${API}/videos`, { withCredentials: true })
      ]);
      setTools(toolsRes.data);
      setVideos(videosRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({ title: 'Error', description: 'Failed to load data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Tool Management Functions
  const handleSaveTool = async (toolData) => {
    try {
      if (editingTool) {
        await axios.put(`${API}/affiliate-tools/${editingTool.id}`, toolData, { withCredentials: true });
        toast({ title: 'Success', description: 'Tool updated successfully' });
      } else {
        await axios.post(`${API}/affiliate-tools`, toolData, { withCredentials: true });
        toast({ title: 'Success', description: 'Tool created successfully' });
      }
      setShowToolForm(false);
      setEditingTool(null);
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save tool', variant: 'destructive' });
    }
  };

  const handleDeleteTool = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tool?')) return;
    try {
      await axios.delete(`${API}/affiliate-tools/${id}`, { withCredentials: true });
      toast({ title: 'Success', description: 'Tool deleted successfully' });
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete tool', variant: 'destructive' });
    }
  };

  // Video Management Functions
  const handleSaveVideo = async (videoData) => {
    try {
      if (editingVideo) {
        await axios.put(`${API}/videos/${editingVideo.id}`, videoData, { withCredentials: true });
        toast({ title: 'Success', description: 'Video updated successfully' });
      } else {
        await axios.post(`${API}/videos`, videoData, { withCredentials: true });
        toast({ title: 'Success', description: 'Video created successfully' });
      }
      setShowVideoForm(false);
      setEditingVideo(null);
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save video', variant: 'destructive' });
    }
  };

  const handleDeleteVideo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    try {
      await axios.delete(`${API}/videos/${id}`, { withCredentials: true });
      toast({ title: 'Success', description: 'Video deleted successfully' });
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete video', variant: 'destructive' });
    }
  };

  if (authLoading || loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-page)' }}>
        <p className="body-large">Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px', background: 'var(--bg-page)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 className="heading-2" style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Admin Panel</h1>
          <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>Manage your affiliate tools, videos, and content</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList style={{ marginBottom: '32px' }}>
            <TabsTrigger value="tools">Affiliate Tools</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          {/* Affiliate Tools Tab */}
          <TabsContent value="tools">
            <div style={{ marginBottom: '24px' }}>
              <Button 
                className="btn-primary" 
                onClick={() => { setShowToolForm(true); setEditingTool(null); }}
                style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
              >
                <Plus size={20} />
                Add New Tool
              </Button>
            </div>

            {showToolForm && (
              <ToolForm 
                tool={editingTool} 
                onSave={handleSaveTool} 
                onCancel={() => { setShowToolForm(false); setEditingTool(null); }}
              />
            )}

            <div style={{ display: 'grid', gap: '16px' }}>
              {tools.map((tool) => (
                <Card key={tool.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '20px' }}>
                    <div style={{ flex: 1 }}>
                      <h3 className="heading-6" style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>{tool.name}</h3>
                      <p className="body-small" style={{ marginBottom: '8px' }}>{tool.description}</p>
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <span className="caption">Price: ${tool.price}</span>
                        <span className="caption">Rating: {tool.rating}</span>
                        <span className="caption">Category: {tool.category}</span>
                        {tool.featured && <span className="caption" style={{ color: 'var(--brand-primary)' }}>Featured</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button 
                        className="btn-secondary" 
                        onClick={() => { setEditingTool(tool); setShowToolForm(true); }}
                        style={{ padding: '8px' }}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        className="btn-secondary" 
                        onClick={() => handleDeleteTool(tool.id)}
                        style={{ padding: '8px', borderColor: 'var(--destructive)', color: 'var(--destructive)' }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos">
            <div style={{ marginBottom: '24px' }}>
              <Button 
                className="btn-primary" 
                onClick={() => { setShowVideoForm(true); setEditingVideo(null); }}
                style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
              >
                <Plus size={20} />
                Add New Video
              </Button>
            </div>

            {showVideoForm && (
              <VideoForm 
                video={editingVideo} 
                onSave={handleSaveVideo} 
                onCancel={() => { setShowVideoForm(false); setEditingVideo(null); }}
              />
            )}

            <div style={{ display: 'grid', gap: '16px' }}>
              {videos.map((video) => (
                <Card key={video.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '20px' }}>
                    <div style={{ flex: 1 }}>
                      <h3 className="heading-6" style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>{video.title}</h3>
                      <p className="body-small" style={{ marginBottom: '8px' }}>{video.description}</p>
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <span className="caption">Duration: {video.duration}</span>
                        <span className="caption">Views: {video.views}</span>
                        <span className="caption">Platforms: {video.platforms.join(', ')}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button 
                        className="btn-secondary" 
                        onClick={() => { setEditingVideo(video); setShowVideoForm(true); }}
                        style={{ padding: '8px' }}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        className="btn-secondary" 
                        onClick={() => handleDeleteVideo(video.id)}
                        style={{ padding: '8px', borderColor: 'var(--destructive)', color: 'var(--destructive)' }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <Card style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)', padding: '24px' }}>
                <h3 className="heading-5" style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>{tools.length}</h3>
                <p className="body-small">Affiliate Tools</p>
              </Card>
              <Card style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)', padding: '24px' }}>
                <h3 className="heading-5" style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>{videos.length}</h3>
                <p className="body-small">Video Tutorials</p>
              </Card>
              <Card style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)', padding: '24px' }}>
                <h3 className="heading-5" style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>{tools.filter(t => t.featured).length}</h3>
                <p className="body-small">Featured Tools</p>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Tool Form Component
const ToolForm = ({ tool, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: tool?.name || '',
    description: tool?.description || '',
    category: tool?.category || '',
    price: tool?.price || '',
    rating: tool?.rating || '',
    image: tool?.image || '',
    affiliateLink: tool?.affiliateLink || '',
    featured: tool?.featured || false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: parseFloat(formData.price),
      rating: parseFloat(formData.rating)
    });
  };

  return (
    <Card style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)', padding: '24px', marginBottom: '24px' }}>
      <h3 className="heading-5" style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>
        {tool ? 'Edit Tool' : 'Add New Tool'}
      </h3>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: '16px' }}>
          <div>
            <Label>Tool Name</Label>
            <Input 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <Label>Category</Label>
              <Input 
                value={formData.category} 
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                placeholder="Tools, Safety, etc."
                required
              />
            </div>
            <div>
              <Label>Price ($)</Label>
              <Input 
                type="number" 
                step="0.01"
                value={formData.price} 
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <Label>Rating (0-5)</Label>
              <Input 
                type="number" 
                step="0.1"
                min="0"
                max="5"
                value={formData.rating} 
                onChange={(e) => setFormData({...formData, rating: e.target.value})}
                required
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '28px' }}>
              <input 
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                id="featured"
              />
              <Label htmlFor="featured">Featured Product</Label>
            </div>
          </div>
          <div>
            <Label>Image URL</Label>
            <Input 
              value={formData.image} 
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              placeholder="https://..."
              required
            />
          </div>
          <div>
            <Label>Amazon Affiliate Link</Label>
            <Input 
              value={formData.affiliateLink} 
              onChange={(e) => setFormData({...formData, affiliateLink: e.target.value})}
              placeholder="https://amazon.com/..."
              required
            />
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <Button type="submit" className="btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Save size={16} />
              Save Tool
            </Button>
            <Button type="button" className="btn-secondary" onClick={onCancel} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <X size={16} />
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};

// Video Form Component
const VideoForm = ({ video, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: video?.title || '',
    description: video?.description || '',
    thumbnail: video?.thumbnail || '',
    videoUrl: video?.videoUrl || '',
    duration: video?.duration || '',
    views: video?.views || '',
    platforms: video?.platforms || []
  });

  const [platformInput, setPlatformInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const addPlatform = () => {
    if (platformInput && !formData.platforms.includes(platformInput)) {
      setFormData({...formData, platforms: [...formData.platforms, platformInput]});
      setPlatformInput('');
    }
  };

  const removePlatform = (platform) => {
    setFormData({...formData, platforms: formData.platforms.filter(p => p !== platform)});
  };

  return (
    <Card style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)', padding: '24px', marginBottom: '24px' }}>
      <h3 className="heading-5" style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>
        {video ? 'Edit Video' : 'Add New Video'}
      </h3>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: '16px' }}>
          <div>
            <Label>Video Title</Label>
            <Input 
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>
          <div>
            <Label>Thumbnail URL</Label>
            <Input 
              value={formData.thumbnail} 
              onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
              placeholder="https://..."
              required
            />
          </div>
          <div>
            <Label>Video URL (Facebook, YouTube, TikTok, etc.)</Label>
            <Input 
              value={formData.videoUrl} 
              onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
              placeholder="https://..."
              required
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <Label>Duration (e.g., 12:30)</Label>
              <Input 
                value={formData.duration} 
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                placeholder="12:30"
                required
              />
            </div>
            <div>
              <Label>Views (e.g., 125K)</Label>
              <Input 
                value={formData.views} 
                onChange={(e) => setFormData({...formData, views: e.target.value})}
                placeholder="125K"
                required
              />
            </div>
          </div>
          <div>
            <Label>Platforms (Facebook, Instagram, TikTok, YouTube)</Label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <Input 
                value={platformInput} 
                onChange={(e) => setPlatformInput(e.target.value)}
                placeholder="Enter platform name"
              />
              <Button type="button" onClick={addPlatform} className="btn-secondary">
                <Plus size={16} />
              </Button>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {formData.platforms.map((platform) => (
                <span 
                  key={platform} 
                  style={{ 
                    background: 'var(--brand-primary)', 
                    color: 'var(--text-inverse)', 
                    padding: '4px 12px', 
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.9rem'
                  }}
                >
                  {platform}
                  <X size={14} style={{ cursor: 'pointer' }} onClick={() => removePlatform(platform)} />
                </span>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <Button type="submit" className="btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Save size={16} />
              Save Video
            </Button>
            <Button type="button" className="btn-secondary" onClick={onCancel} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <X size={16} />
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default Admin;