import { NextRequest, NextResponse } from 'next/server';
import { jobScheduler } from '@/lib/scheduler';

export async function GET() {
  try {
    const status = jobScheduler.getSchedulerStatus();
    const jobs = jobScheduler.getAllJobs();
    
    return NextResponse.json({
      success: true,
      scheduler: status,
      jobs: jobs.map(job => ({
        id: job.id,
        name: job.name,
        enabled: job.enabled,
        timezone: job.timezone,
        lastRun: job.lastRun,
        nextRun: job.nextRun,
        cronExpression: job.cronExpression
      }))
    });
  } catch (error) {
    console.error('Error fetching scheduler status:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch scheduler status',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, jobId } = await request.json();

    switch (action) {
      case 'start':
        jobScheduler.start();
        return NextResponse.json({
          success: true,
          message: 'Scheduler started successfully'
        });

      case 'stop':
        jobScheduler.stop();
        return NextResponse.json({
          success: true,
          message: 'Scheduler stopped successfully'
        });

      case 'enable':
        if (!jobId) {
          return NextResponse.json({
            success: false,
            message: 'Job ID is required for enable action'
          }, { status: 400 });
        }
        jobScheduler.enableJob(jobId);
        return NextResponse.json({
          success: true,
          message: `Job ${jobId} enabled successfully`
        });

      case 'disable':
        if (!jobId) {
          return NextResponse.json({
            success: false,
            message: 'Job ID is required for disable action'
          }, { status: 400 });
        }
        jobScheduler.disableJob(jobId);
        return NextResponse.json({
          success: true,
          message: `Job ${jobId} disabled successfully`
        });

      case 'run':
        if (!jobId) {
          return NextResponse.json({
            success: false,
            message: 'Job ID is required for run action'
          }, { status: 400 });
        }
        await jobScheduler.runJobNow(jobId);
        return NextResponse.json({
          success: true,
          message: `Job ${jobId} executed successfully`
        });

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action. Supported actions: start, stop, enable, disable, run'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Error managing scheduler:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to manage scheduler',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}