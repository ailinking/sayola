import { jobScheduler } from './scheduler';

let isInitialized = false;

export function initializeScheduler() {
  if (isInitialized) {
    return;
  }

  console.log(`[${new Date().toISOString()}] Initializing blog post scheduler...`);
  
  // Start the scheduler
  jobScheduler.start();
  
  // Log scheduler status
  const status = jobScheduler.getSchedulerStatus();
  console.log(`[${new Date().toISOString()}] Scheduler initialized:`, {
    isRunning: status.isRunning,
    activeJobs: status.activeJobs,
    totalJobs: status.totalJobs
  });

  // Log next scheduled runs
  status.nextRuns.forEach(({ jobName, nextRun }) => {
    if (nextRun) {
      console.log(`[${new Date().toISOString()}] ${jobName} scheduled for: ${nextRun.toLocaleString('en-US', { timeZone: 'Europe/Lisbon' })} (Lisbon time)`);
    }
  });

  isInitialized = true;
}

// Auto-initialize when this module is imported
if (typeof window === 'undefined') {
  // Only run on server side
  initializeScheduler();
}

export { jobScheduler };