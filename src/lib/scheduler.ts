import { blogGenerator } from './blogGenerator';

export interface ScheduledJob {
  id: string;
  name: string;
  cronExpression: string;
  timezone: string;
  enabled: boolean;
  lastRun?: Date;
  nextRun?: Date;
  handler: () => Promise<void>;
}

export class JobScheduler {
  private jobs: Map<string, ScheduledJob> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.setupBlogGenerationJob();
  }

  private setupBlogGenerationJob(): void {
    const blogJob: ScheduledJob = {
      id: 'daily-blog-generation',
      name: 'Daily Blog Post Generation',
      cronExpression: '0 9 * * *', // 9 AM daily
      timezone: 'Europe/Lisbon',
      enabled: true,
      handler: this.generateDailyBlogPost.bind(this)
    };

    this.addJob(blogJob);
  }

  private async generateDailyBlogPost(): Promise<void> {
    try {
      console.log(`[${new Date().toISOString()}] Starting daily blog post generation...`);
      
      const newPost = await blogGenerator.generateNewPost();
      
      if (newPost) {
        console.log(`[${new Date().toISOString()}] Successfully generated new blog post: "${newPost.title}"`);
        console.log(`Post slug: ${newPost.slug}`);
        console.log(`Category: ${newPost.category}`);
        console.log(`Tags: ${newPost.tags.join(', ')}`);
        
        // Update the blog pages with new content
        await this.updateBlogPages(newPost);
        
      } else {
        console.log(`[${new Date().toISOString()}] No new blog post generated - all topics may be used`);
      }
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error generating daily blog post:`, error);
    }
  }

  private async updateBlogPages(newPost: any): Promise<void> {
    // This would update the blog listing page and sitemap
    // For now, we'll just log the action
    console.log(`[${new Date().toISOString()}] Blog pages would be updated with new post: ${newPost.slug}`);
  }

  public addJob(job: ScheduledJob): void {
    this.jobs.set(job.id, job);
    if (job.enabled) {
      this.scheduleJob(job);
    }
  }

  public removeJob(jobId: string): void {
    const interval = this.intervals.get(jobId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(jobId);
    }
    this.jobs.delete(jobId);
  }

  public enableJob(jobId: string): void {
    const job = this.jobs.get(jobId);
    if (job) {
      job.enabled = true;
      this.scheduleJob(job);
    }
  }

  public disableJob(jobId: string): void {
    const job = this.jobs.get(jobId);
    if (job) {
      job.enabled = false;
      const interval = this.intervals.get(jobId);
      if (interval) {
        clearInterval(interval);
        this.intervals.delete(jobId);
      }
    }
  }

  private scheduleJob(job: ScheduledJob): void {
    // Clear existing interval if any
    const existingInterval = this.intervals.get(job.id);
    if (existingInterval) {
      clearInterval(existingInterval);
    }

    // Calculate next run time
    const nextRun = this.getNextRunTime(job);
    job.nextRun = nextRun;

    console.log(`[${new Date().toISOString()}] Scheduled job "${job.name}" to run at ${nextRun.toLocaleString('en-US', { timeZone: job.timezone })}`);

    // Set up the interval
    const interval = setInterval(async () => {
      const now = new Date();
      const lisbonTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Lisbon' }));
      
      // Check if it's time to run (9 AM Lisbon time)
      if (lisbonTime.getHours() === 9 && lisbonTime.getMinutes() === 0) {
        job.lastRun = new Date();
        job.nextRun = this.getNextRunTime(job);
        
        try {
          await job.handler();
        } catch (error) {
          console.error(`Error executing job ${job.name}:`, error);
        }
      }
    }, 60000); // Check every minute

    this.intervals.set(job.id, interval);
  }

  private getNextRunTime(job: ScheduledJob): Date {
    const now = new Date();
    const lisbonTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Lisbon' }));
    
    // Set to 9 AM Lisbon time
    const nextRun = new Date(lisbonTime);
    nextRun.setHours(9, 0, 0, 0);
    
    // If it's already past 9 AM today, schedule for tomorrow
    if (lisbonTime.getHours() >= 9) {
      nextRun.setDate(nextRun.getDate() + 1);
    }
    
    return nextRun;
  }

  public getJobStatus(jobId: string): ScheduledJob | undefined {
    return this.jobs.get(jobId);
  }

  public getAllJobs(): ScheduledJob[] {
    return Array.from(this.jobs.values());
  }

  public async runJobNow(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (job) {
      console.log(`[${new Date().toISOString()}] Manually executing job: ${job.name}`);
      job.lastRun = new Date();
      await job.handler();
    } else {
      throw new Error(`Job with ID ${jobId} not found`);
    }
  }

  public start(): void {
    console.log(`[${new Date().toISOString()}] Job scheduler started`);
    
    // Schedule all enabled jobs
    for (const job of this.jobs.values()) {
      if (job.enabled) {
        this.scheduleJob(job);
      }
    }
  }

  public stop(): void {
    console.log(`[${new Date().toISOString()}] Job scheduler stopped`);
    
    // Clear all intervals
    for (const interval of this.intervals.values()) {
      clearInterval(interval);
    }
    this.intervals.clear();
  }

  public getSchedulerStatus(): {
    isRunning: boolean;
    activeJobs: number;
    totalJobs: number;
    nextRuns: { jobName: string; nextRun: Date | undefined }[];
  } {
    return {
      isRunning: this.intervals.size > 0,
      activeJobs: this.intervals.size,
      totalJobs: this.jobs.size,
      nextRuns: Array.from(this.jobs.values()).map(job => ({
        jobName: job.name,
        nextRun: job.nextRun
      }))
    };
  }
}

// Export singleton instance
export const jobScheduler = new JobScheduler();