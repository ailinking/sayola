'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Play, Pause, RefreshCw, FileText, Tag, Eye } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: string;
  featured: boolean;
}

interface SchedulerJob {
  id: string;
  name: string;
  enabled: boolean;
  timezone: string;
  lastRun?: string;
  nextRun?: string;
  cronExpression: string;
}

interface SchedulerStatus {
  isRunning: boolean;
  activeJobs: number;
  totalJobs: number;
}

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [jobs, setJobs] = useState<SchedulerJob[]>([]);
  const [schedulerStatus, setSchedulerStatus] = useState<SchedulerStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch blog posts
      const postsResponse = await fetch('/api/blog/generate');
      const postsData = await postsResponse.json();
      if (postsData.success) {
        setPosts(postsData.posts);
      }

      // Fetch scheduler status
      const schedulerResponse = await fetch('/api/scheduler');
      const schedulerData = await schedulerResponse.json();
      if (schedulerData.success) {
        setJobs(schedulerData.jobs);
        setSchedulerStatus(schedulerData.scheduler);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePost = async (manual = true) => {
    try {
      setGenerating(true);
      const response = await fetch('/api/blog/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ manual })
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchData(); // Refresh data
        alert(`Blog post generated successfully: ${data.post?.title || 'New post'}`);
      } else {
        alert(`Failed to generate post: ${data.message}`);
      }
    } catch (error) {
      console.error('Error generating post:', error);
      alert('Error generating post');
    } finally {
      setGenerating(false);
    }
  };

  const manageScheduler = async (action: string, jobId?: string) => {
    try {
      const response = await fetch('/api/scheduler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, jobId })
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchData(); // Refresh data
        alert(data.message);
      } else {
        alert(`Failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Error managing scheduler:', error);
      alert('Error managing scheduler');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">Loading blog management dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog Management Dashboard</h1>
          <p className="text-gray-600">Monitor and control automated blog post generation</p>
        </div>

        {/* Scheduler Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Scheduler Status
          </h2>
          
          {schedulerStatus && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    schedulerStatus.isRunning 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {schedulerStatus.isRunning ? 'Running' : 'Stopped'}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Active Jobs</span>
                  <span className="text-lg font-bold text-gray-900">{schedulerStatus.activeJobs}</span>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Total Jobs</span>
                  <span className="text-lg font-bold text-gray-900">{schedulerStatus.totalJobs}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => manageScheduler('start')}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Scheduler
            </button>
            <button
              onClick={() => manageScheduler('stop')}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Pause className="w-4 h-4 mr-2" />
              Stop Scheduler
            </button>
            <button
              onClick={fetchData}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Jobs */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Scheduled Jobs
          </h2>
          
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{job.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    job.enabled 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {job.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                  <div>
                    <span className="font-medium">Schedule:</span> {job.cronExpression}
                  </div>
                  <div>
                    <span className="font-medium">Timezone:</span> {job.timezone}
                  </div>
                  <div>
                    <span className="font-medium">Last Run:</span> {
                      job.lastRun 
                        ? new Date(job.lastRun).toLocaleString('en-US', { timeZone: job.timezone })
                        : 'Never'
                    }
                  </div>
                  <div>
                    <span className="font-medium">Next Run:</span> {
                      job.nextRun 
                        ? new Date(job.nextRun).toLocaleString('en-US', { timeZone: job.timezone })
                        : 'Not scheduled'
                    }
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => manageScheduler('run', job.id)}
                    className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Run Now
                  </button>
                  <button
                    onClick={() => manageScheduler(job.enabled ? 'disable' : 'enable', job.id)}
                    className={`inline-flex items-center px-3 py-1 text-sm rounded transition-colors ${
                      job.enabled
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {job.enabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Manual Generation */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Manual Generation
          </h2>
          
          <p className="text-gray-600 mb-4">
            Generate a new blog post immediately without waiting for the scheduled time.
          </p>
          
          <button
            onClick={() => generatePost(true)}
            disabled={generating}
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <FileText className="w-4 h-4 mr-2" />
            )}
            {generating ? 'Generating...' : 'Generate New Post'}
          </button>
        </div>

        {/* Recent Posts */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Recent Blog Posts ({posts.length})
          </h2>
          
          <div className="space-y-4">
            {posts.slice(0, 10).map((post) => (
              <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900 flex-1">{post.title}</h3>
                  {post.featured && (
                    <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{post.excerpt}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center">
                    <Tag className="w-3 h-3 mr-1" />
                    {post.category}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {post.readTime}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <Eye className="w-3 h-3 mr-1" />
                    <a 
                      href={`/blog/${post.slug}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Post
                    </a>
                  </span>
                </div>
                
                <div className="mt-2">
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{post.tags.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}