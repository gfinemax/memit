const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Basic env parser for .env.local
function loadEnv() {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) return;
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
        const [key, ...value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.join('=').trim();
        }
    });
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function createTestAccount() {
    const email = 'test@memit.ai';
    const password = 'password123!';

    console.log(`Attempting to create/update account: ${email}`);

    // 1. Try to create the user
    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
    });

    if (error) {
        if (error.message.includes('already registered')) {
            console.log('Account already exists. Updating password...');
            // 2. If exists, update password and confirm email
            const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
            if (listError) throw listError;

            const existingUser = listData.users.find(u => u.email === email);
            if (existingUser) {
                const { error: updateError } = await supabase.auth.admin.updateUserById(existingUser.id, {
                    password,
                    email_confirm: true
                });
                if (updateError) throw updateError;
                console.log('Password updated successfully.');
            }
        } else {
            console.error('Error creating user:', error.message);
            return;
        }
    } else {
        console.log('Account created successfully.');
    }

    console.log('-----------------------------------');
    console.log('ID: test@memit.ai');
    console.log('PW: password123!');
    console.log('-----------------------------------');
}

createTestAccount();
