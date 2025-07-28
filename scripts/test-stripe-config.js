#!/usr/bin/env node

/**
 * Script to test Stripe configuration
 * Usage: node scripts/test-stripe-config.js
 */

const path = require('path')
const fs = require('fs')

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

async function testStripeConfig() {
  console.log('🧪 Testing Stripe Configuration...\n')

  // Check environment variables
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  const secretKey = process.env.STRIPE_SECRET_KEY

  console.log('📋 Environment Variables:')
  console.log(`   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${publishableKey ? '✅ Set' : '❌ Missing'}`)
  console.log(`   STRIPE_SECRET_KEY: ${secretKey ? '✅ Set' : '❌ Missing'}`)

  if (!publishableKey || !secretKey) {
    console.log('\n❌ Missing required environment variables')
    console.log('Please check your .env.local file')
    process.exit(1)
  }

  // Validate key formats
  console.log('\n🔍 Key Validation:')
  
  const publishableValid = publishableKey.startsWith('pk_')
  const secretValid = secretKey.startsWith('sk_')
  
  console.log(`   Publishable key format: ${publishableValid ? '✅ Valid' : '❌ Invalid'}`)
  console.log(`   Secret key format: ${secretValid ? '✅ Valid' : '❌ Invalid'}`)

  if (!publishableValid || !secretValid) {
    console.log('\n❌ Invalid key formats')
    console.log('Publishable keys should start with "pk_"')
    console.log('Secret keys should start with "sk_"')
    process.exit(1)
  }

  // Check environment consistency
  const publishableIsTest = publishableKey.includes('test')
  const secretIsTest = secretKey.includes('test')
  
  console.log('\n🌍 Environment Consistency:')
  console.log(`   Publishable key mode: ${publishableIsTest ? 'TEST' : 'LIVE'}`)
  console.log(`   Secret key mode: ${secretIsTest ? 'TEST' : 'LIVE'}`)
  
  if (publishableIsTest !== secretIsTest) {
    console.log('   Status: ❌ Mismatch - both keys must be test or live')
    process.exit(1)
  } else {
    console.log(`   Status: ✅ Consistent (${publishableIsTest ? 'TEST' : 'LIVE'} mode)`)
  }

  // Test Stripe connection
  console.log('\n🔌 Testing Stripe Connection...')
  
  try {
    const Stripe = require('stripe')
    const stripe = new Stripe(secretKey, {
      apiVersion: '2024-06-20',
    })

    // Simple API call to test connection
    await stripe.customers.list({ limit: 1 })
    console.log('   Connection: ✅ Successful')
    
  } catch (error) {
    console.log('   Connection: ❌ Failed')
    console.log(`   Error: ${error.message}`)
    
    if (error.type === 'StripeAuthenticationError') {
      console.log('   Hint: Check if your secret key is correct')
    }
    
    process.exit(1)
  }

  // Check .env.local file
  console.log('\n📁 File Check:')
  const envPath = path.join(__dirname, '..', '.env.local')
  const envExists = fs.existsSync(envPath)
  
  console.log(`   .env.local exists: ${envExists ? '✅ Yes' : '❌ No'}`)
  
  if (!envExists) {
    console.log('   Hint: Copy .env.local.example to .env.local')
  }

  console.log('\n✅ All tests passed! Stripe configuration is valid.')
  console.log('\n🚀 You can now run the application with: npm run dev')
}

// Run the test
testStripeConfig().catch((error) => {
  console.error('\n💥 Test failed:', error.message)
  process.exit(1)
})