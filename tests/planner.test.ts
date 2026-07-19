export function testPlanner() {
  const roadmap = {
    timeline: [{ week: 'Week 1', milestone: 'Compile Rust Core' }],
    tasks: [{ title: 'Write tests', assignee: 'Alice' }],
  };

  if (roadmap.timeline.length < 1) {
    throw new Error('Planner Test Fail: Timeline milestones missing.');
  }

  return true;
}
