import { config } from 'dotenv';

config({ path: ['.env.local', '.env'], quiet: true });

const { closeConnection } = await import('./config');
const { runBootstrap } = await import('./run');

try {
  console.log('Bootstrapping the ConectaPelu2 role walkthrough...');
  const result = await runBootstrap();

  console.log(`Role accounts created: ${result.accountsCreated}`);
  console.log(`Role accounts reused: ${result.accountsReused}`);
  console.log(`Organization created: ${result.organizationCreated ? 'yes' : 'no'}`);
  console.log(`Organization membership created: ${result.membershipCreated ? 'yes' : 'no'}`);
  console.log(`Pets created: ${result.petsCreated}`);
  console.log(`Set each account password through ${result.recoveryPath}.`);
} catch (error) {
  console.error('Bootstrap failed:', error instanceof Error ? error.message : 'Unknown error');
  process.exitCode = 1;
} finally {
  await closeConnection();
}
