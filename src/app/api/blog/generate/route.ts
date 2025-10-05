import { NextRequest, NextResponse } from 'next/server';
import { blogGenerator } from '@/lib/blogGenerator';
import { jobScheduler } from '@/lib/scheduler';

export async function POST(request: NextRequest) {
  try {
    const { manual = false } = await request.json();

    if (manual) {
      // Manual generation
      const newPost = await blogGenerator.generateNewPost();
      
      if (newPost) {
        return NextResponse.json({
          success: true,
          message: 'Blog post generated successfully',
          post: {
            id: newPost.id,
            title: newPost.title,
            slug: newPost.slug,
            category: newPost.category,
            tags: newPost.tags,
            publishedAt: newPost.publishedAt
          }
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'No unused topics available for generation'
        }, { status: 400 });
      }
    } else {
      // Trigger scheduled job
      await jobScheduler.runJobNow('daily-blog-generation');
      
      return NextResponse.json({
        success: true,
        message: 'Scheduled blog generation triggered successfully'
      });
    }
  } catch (error) {
    console.error('Error generating blog post:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to generate blog post',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const posts = await blogGenerator.getAllPosts();
    
    return NextResponse.json({
      success: true,
      posts: posts.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        category: post.category,
        tags: post.tags,
        publishedAt: post.publishedAt,
        readTime: post.readTime,
        featured: post.featured
      }))
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch blog posts',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}