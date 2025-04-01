// deploy.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.production
dotenv.config({ path: '.env.production' });

// Function to execute shell commands and log output
function runCommand(command) {
    console.log(`Executing: ${command}`);
    try {
        const output = execSync(command, { stdio: 'inherit' });
        return output;
    } catch (error) {
        console.error(`Error executing command: ${command}`);
        console.error(error);
        process.exit(1);
    }
}

// Main deployment function
function deploy() {
    // Determine which .env file to use
    const nodeEnv = process.env.NODE_ENV || 'production';

    // Load environment variables from the appropriate .env file
    if (nodeEnv === 'development') {
        console.log('Loading development environment variables (.env.development)');
        dotenv.config({ path: '.env.development' });
    } else {
        console.log('Loading production environment variables (.env.production)');
        dotenv.config({ path: '.env.production', override: true });
    }

    // Ensure all required environment variables are present
    const requiredEnvVars = [
        'GCLOUD_SERVICE_KEY',
        'GCLOUD_PROJECT_ID',
        'NEXT_AUTH_SECRET',
        'AUTH_GITHUB_ID',
        'AUTH_GITHUB_SECRET',
        'AUTH_GOOGLE_ID',
        'AUTH_GOOGLE_SECRET',
        'BITBUCKET_COMMIT'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
        console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
        process.exit(1);
    }

    // Set environment variables
    process.env.CONTAINER_NAME = process.env.CONTAINER_NAME || 'thirteenk-frontend';
    process.env.SERVICE_NAME = process.env.SERVICE_NAME || 'thirteenk-frontend-service';
    process.env.NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.thirteenk.co.za/api/v1';
    process.env.DOCKER_BUILDKIT = '0';

    console.log('Starting deployment process...');

    // Authenticate with Google Cloud
    console.log('Authenticating with Google Cloud...');
    fs.writeFileSync('gcloud-service-key.json', process.env.GCLOUD_SERVICE_KEY);
    runCommand('gcloud auth activate-service-account --key-file gcloud-service-key.json');
    runCommand(`gcloud config set project ${process.env.GCLOUD_PROJECT_ID}`);

    // Create a temporary .env file for the build
    console.log('Creating .env.build file...');
    const envContent = [
        `NEXT_PUBLIC_API_URL=${process.env.NEXT_PUBLIC_API_URL}`,
        `NEXT_AUTH_SECRET=${process.env.NEXT_AUTH_SECRET}`,
        `NEXT_AUTH_URL=https://hub.tredicik.com`,
        `NODE_ENV=production`,
        `AUTH_GITHUB_ID=${process.env.AUTH_GITHUB_ID}`,
        `AUTH_GITHUB_SECRET=${process.env.AUTH_GITHUB_SECRET}`,
        `AUTH_GOOGLE_ID=${process.env.AUTH_GOOGLE_ID}`,
        `AUTH_GOOGLE_SECRET=${process.env.AUTH_GOOGLE_SECRET}`
    ].join('\n');

    fs.writeFileSync('.env.build', envContent);

    // Build Docker image
    console.log('Building Docker image...');
    runCommand(`docker build -t gcr.io/${process.env.GCLOUD_PROJECT_ID}/${process.env.CONTAINER_NAME}:${process.env.BITBUCKET_COMMIT} .`);
    runCommand(`docker tag gcr.io/${process.env.GCLOUD_PROJECT_ID}/${process.env.CONTAINER_NAME}:${process.env.BITBUCKET_COMMIT} gcr.io/${process.env.GCLOUD_PROJECT_ID}/${process.env.CONTAINER_NAME}:latest`);

    // Configure Docker to use gcloud as a credential helper
    console.log('Configuring Docker credentials...');
    runCommand('gcloud auth configure-docker');

    // Push Docker image to Google Container Registry
    console.log('Pushing Docker image to Google Container Registry...');
    runCommand(`docker push gcr.io/${process.env.GCLOUD_PROJECT_ID}/${process.env.CONTAINER_NAME}:${process.env.BITBUCKET_COMMIT}`);
    runCommand(`docker push gcr.io/${process.env.GCLOUD_PROJECT_ID}/${process.env.CONTAINER_NAME}:latest`);

    // Push Docker image to Google Container Registry
    console.log('Deploy to Google Cloud Run...');
    runCommand(`gcloud run deploy ${process.env.SERVICE_NAME} --image gcr.io/${process.env.GCLOUD_PROJECT_ID}/${process.env.CONTAINER_NAME}:latest --platform managed --region ${process.env.GCLOUD_REGION} --allow-unauthenticated
                         `);


    console.log('# Set environment variables for NextJS');
    runCommand(`gcloud run services update ${process.env.SERVICE_NAME} --region ${process.env.GCLOUD_REGION} --set-env-vars="NEXT_PUBLIC_API_URL=${process.env.NEXT_PUBLIC_API_URL},NEXT_AUTH_SECRET=${process.env.NEXT_AUTH_SECRET},NEXT_AUTH_URL=https://thirteenk.co.za,NODE_ENV=production"
                         `);

    // Clean up
    console.log('Cleaning up...');
    fs.unlinkSync('gcloud-service-key.json');
    fs.unlinkSync('.env.build');

    console.log('Deployment completed successfully!');
}

// Execute the deployment
deploy();