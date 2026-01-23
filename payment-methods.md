# Payment Methods System

## Overview

Allow users to add and manage payment methods for receiving payouts from bounties and campaigns.

## Commands

### /add-paypal [paypal_email] [first_name] [last_name]
Add PayPal as a payment method.

**Parameters:**
- paypal_email: Email associated with PayPal account
- first_name: Legal first name
- last_name: Legal last name

**Behavior:**
- Validate email format
- Store payment method linked to Discord user
- One PayPal per user (update if exists)

### /add-usdc [wallet_address]
Add USDC (ERC-20) wallet address.

**Parameters:**
- wallet_address: Ethereum wallet address for USDC

**Behavior:**
- Validate wallet address format (0x...)
- Store as USDC payment method

### /add-sol-usdc [wallet_address]
Add USDC on Solana wallet address.

**Parameters:**
- wallet_address: Solana wallet address for USDC

**Behavior:**
- Validate Solana address format
- Store as SOL-USDC payment method

### /remove-payment-details [platform]
Remove a specific payment method.

**Parameters:**
- platform: Payment type to remove (paypal, usdc, sol-usdc)

**Behavior:**
- Delete the specified payment method
- Confirm removal to user

### /payment-details
Display all saved payment methods.

**Output:**
- List of all payment methods user has added
- Shows type and relevant details (masked where appropriate)
- e.g., PayPal: j***@email.com, USDC: 0x1234...abcd

## Data Model

PaymentMethod:
- id
- discord_user_id
- type (paypal, usdc, sol-usdc)
- paypal_email (nullable)
- paypal_first_name (nullable)
- paypal_last_name (nullable)
- wallet_address (nullable)
- created_at
- updated_at

## Security Considerations

- Mask sensitive data in display (partial email, truncated wallet)
- Only user can view/modify their own payment methods
- Consider encryption at rest for payment data

## Acceptance Criteria

- All three payment types can be added
- Validation prevents malformed data
- User can have multiple payment methods
- /payment-details shows all methods with appropriate masking
- /remove-payment-details removes only specified type
- Cannot add duplicate payment types (updates existing)
