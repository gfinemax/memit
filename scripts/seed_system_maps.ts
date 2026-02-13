import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Helper to load .env.local manually for standalone execution
function loadEnv() {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const parts = line.split('=');
            if (parts.length === 2) {
                process.env[parts[0].trim()] = parts[1].trim();
            }
        });
    }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedSystemMaps() {
    console.log('Starting seed process...');

    const digits2Path = path.resolve(process.cwd(), 'digits_2_full.json');
    const digits3Path = path.resolve(process.cwd(), 'digits_3_full.json');

    const digits2Data = JSON.parse(fs.readFileSync(digits2Path, 'utf8'));
    const digits3Data = JSON.parse(fs.readFileSync(digits3Path, 'utf8'));

    const systemRows = [];

    // Prepare 2D items
    for (const item of digits2Data.digits_2) {
        systemRows.push({
            user_id: null,
            type: '2D',
            code: item.code,
            keywords: item.keywords,
            version: '1.0'
        });
    }

    // Prepare 3D items
    for (const item of digits3Data.digits_3) {
        systemRows.push({
            user_id: null,
            type: '3D',
            code: item.code,
            keywords: item.keywords,
            version: '1.0'
        });
    }

    console.log(`Prepared ${systemRows.length} rows. Upserting to Supabase...`);

    // Upsert in batches of 500 to avoid request limits
    const batchSize = 500;
    for (let i = 0; i < systemRows.length; i += batchSize) {
        const batch = systemRows.slice(i, i + batchSize);
        const { error } = await supabase
            .from('system_code_maps')
            .upsert(batch, {
                onConflict: 'user_id,type,code',
                ignoreDuplicates: false // We want to update keywords if they changed
            });

        if (error) {
            console.error(`Error upserting batch ${i / batchSize}:`, error.message);
        } else {
            console.log(`Successfully upserted batch ${i / batchSize + 1}`);
        }
    }

    console.log('Seeding complete!');
}

seedSystemMaps();
