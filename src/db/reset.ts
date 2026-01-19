
import 'dotenv/config';
import postgres from 'postgres';

async function reset() {
    const connectionString = process.env.DATABASE_URL!;
    const sql = postgres(connectionString);

    try {
        console.log('🗑️  Dropping drizzle schema (migration history)...');
        await sql`DROP SCHEMA IF EXISTS drizzle CASCADE`;

        console.log('🗑️  Dropping public schema...');
        await sql`DROP SCHEMA IF EXISTS public CASCADE`;

        console.log('✨ Recreating public schema...');
        await sql`CREATE SCHEMA public`;
        await sql`GRANT ALL ON SCHEMA public TO postgres`;
        await sql`GRANT ALL ON SCHEMA public TO public`;

        console.log('✅ Database reset successfully');
    } catch (err) {
        console.error('❌ Reset failed:', err);
        process.exit(1);
    } finally {
        await sql.end();
    }
}

reset();
