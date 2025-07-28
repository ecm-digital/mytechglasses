# Payment Flow Testing Guide

This directory contains comprehensive end-to-end tests for the Stripe payment integration in My Tech Glasses e-commerce platform.

## Test Structure

### End-to-End Tests (`/tests/e2e/`)

#### 1. Payment Flow Tests (`payment-flow.test.ts`)
Tests the complete payment process from cart to success/failure:

- **Cart to Checkout Flow**
  - Cart item display and validation
  - Checkout navigation
  - Empty cart handling
  - Quick Stripe checkout from cart

- **Checkout Form Validation**
  - Required field validation
  - Email format validation
  - Phone number formatting and validation
  - Postal code validation by country
  - Terms acceptance requirement

- **Successful Payment Flow**
  - Checkout session creation
  - Stripe redirect handling
  - Success page display with order details

- **Failed Payment Flow**
  - API error handling
  - Stripe redirect errors
  - Failed payment page display
  - Payment cancellation handling

- **Loading States and User Feedback**
  - Loading indicators during operations
  - Button state management
  - Error recovery mechanisms

#### 2. Stripe Test Cards Tests (`stripe-test-cards.test.ts`)
Tests different payment scenarios using Stripe test card numbers:

- **Success Scenarios**
  - Successful payment with `4242424242424242`
  - Payment confirmation and order details

- **Failure Scenarios**
  - Card declined (`4000000000000002`)
  - Insufficient funds (`4000000000009995`)
  - Expired card (`4000000000000069`)
  - Incorrect CVC (`4000000000000127`)
  - Processing error (`4000000000000119`)
  - Authentication required (`4000002760003184`)

- **Error Mapping**
  - Stripe error code to user message mapping
  - Payment error object creation
  - User-friendly error suggestions

- **Payment Methods**
  - BLIK payment handling
  - Przelewy24 payment handling
  - Card payment processing

- **Network and API Errors**
  - Network timeout handling
  - API rate limiting
  - Stripe API errors

#### 3. Cart Persistence Tests (`cart-persistence.test.ts`)
Tests cart data persistence through the payment flow:

- **Storage Operations**
  - Cart data saving to localStorage
  - Cart data loading from localStorage
  - Corrupted data handling
  - Expired data cleanup

- **Checkout Flow Persistence**
  - Cart data maintenance during checkout
  - Data preservation after payment failure
  - Data preservation after cancellation
  - Retry functionality with preserved data

- **State Synchronization**
  - Multi-tab cart synchronization
  - Concurrent modification handling

- **Recovery Scenarios**
  - Browser crash recovery
  - Invalid item handling
  - Data migration from older versions

- **Performance and Memory**
  - Large cart handling
  - Storage cleanup
  - Memory management

## Running Tests

### Prerequisites

Install test dependencies:
```bash
npm install
```

### Test Commands

#### Run All Tests
```bash
npm test
```

#### Run Tests in Watch Mode
```bash
npm run test:watch
```

#### Run with Coverage Report
```bash
npm run test:coverage
```

#### Run Only E2E Tests
```bash
npm run test:e2e
```

#### Run Only Unit Tests
```bash
npm run test:unit
```

#### Run Specific Test Files
```bash
# Payment flow tests
npm run test:payment-flow

# Stripe test cards
npm run test:stripe-cards

# Cart persistence tests
npm run test:cart-persistence
```

### Environment Setup

Tests use mocked environment variables. For integration testing with real Stripe, set:

```bash
# .env.test.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key
STRIPE_SECRET_KEY=sk_test_your_test_key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=test_secret
```

## Test Data

### Mock Cart Items
```typescript
const mockCartItems = [
  {
    id: 1,
    productId: 'vision-pro',
    name: 'Vision Pro',
    price: 2499,
    quantity: 1,
    color: 'Black',
    emoji: '🥽'
  },
  {
    id: 2,
    productId: 'tech-view',
    name: 'Tech View',
    price: 1899,
    quantity: 2,
    color: 'Blue',
    emoji: '👓'
  }
]
```

### Stripe Test Cards
```typescript
const STRIPE_TEST_CARDS = {
  success: '4242424242424242',
  declined: '4000000000000002',
  insufficientFunds: '4000000000009995',
  expiredCard: '4000000000000069',
  incorrectCvc: '4000000000000127',
  processingError: '4000000000000119',
  authenticationRequired: '4000002760003184'
}
```

## Mocking Strategy

### External Dependencies
- **Stripe**: Mocked with `@stripe/stripe-js`
- **Next.js Router**: Mocked navigation hooks
- **Fetch API**: Global fetch mock for API calls
- **localStorage**: Mocked storage operations
- **useCart Hook**: Mocked cart state management

### Mock Implementations
```typescript
// Stripe mock
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(() => Promise.resolve({
    redirectToCheckout: jest.fn(() => Promise.resolve({ error: null }))
  }))
}))

// Cart hook mock
jest.mock('@/hooks/useCart')
const mockUseCart = useCart as jest.MockedFunction<typeof useCart>
```

## Test Scenarios Coverage

### ✅ Covered Scenarios
- Complete payment flow (cart → checkout → payment → success)
- Form validation (all fields, real-time validation)
- All Stripe test card scenarios
- Payment failure handling
- Cart data persistence
- Error recovery
- Loading states
- Network errors
- API errors
- Multi-tab synchronization
- Browser crash recovery

### 🔄 Partial Coverage
- Webhook handling (requires server-side testing)
- Real Stripe integration (uses mocks)
- Performance under load
- Mobile-specific interactions

### ❌ Not Covered
- Visual regression testing
- Cross-browser compatibility
- Accessibility testing (requires specialized tools)
- Real payment processing (test mode only)

## Debugging Tests

### Common Issues

#### 1. Test Timeouts
```bash
# Increase timeout for slow operations
jest.setTimeout(10000)
```

#### 2. Async Operations
```typescript
// Use waitFor for async state changes
await waitFor(() => {
  expect(screen.getByText('Expected text')).toBeInTheDocument()
})
```

#### 3. Mock Issues
```typescript
// Clear mocks between tests
beforeEach(() => {
  jest.clearAllMocks()
})
```

### Debug Mode
```bash
# Run tests with debug output
DEBUG=true npm test

# Run single test with verbose output
npm test -- --verbose payment-flow.test.ts
```

## Continuous Integration

### GitHub Actions Example
```yaml
name: Payment Flow Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:e2e
        env:
          NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${{ secrets.STRIPE_TEST_PK }}
          STRIPE_SECRET_KEY: ${{ secrets.STRIPE_TEST_SK }}
```

## Best Practices

### Test Writing
1. **Descriptive Test Names**: Use clear, descriptive test names
2. **Arrange-Act-Assert**: Follow AAA pattern
3. **Single Responsibility**: One assertion per test when possible
4. **Mock External Dependencies**: Mock all external services
5. **Clean Up**: Reset mocks and state between tests

### Test Maintenance
1. **Keep Tests Updated**: Update tests when features change
2. **Regular Review**: Review test coverage regularly
3. **Performance**: Keep tests fast and focused
4. **Documentation**: Document complex test scenarios

## Contributing

When adding new payment features:

1. **Add Unit Tests**: Test individual functions
2. **Add Integration Tests**: Test component interactions
3. **Add E2E Tests**: Test complete user flows
4. **Update Documentation**: Update this README
5. **Test Coverage**: Maintain >80% coverage

## Troubleshooting

### Common Test Failures

#### Mock Not Working
```typescript
// Ensure mock is called before component import
jest.mock('@/hooks/useCart')
import Component from '@/components/Component'
```

#### Async State Issues
```typescript
// Use act() for state updates
import { act } from '@testing-library/react'
await act(async () => {
  // async operation
})
```

#### Environment Variables
```typescript
// Set environment variables in test setup
process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_mock'
```

For more help, check the [Jest documentation](https://jestjs.io/docs/getting-started) and [Testing Library guides](https://testing-library.com/docs/).