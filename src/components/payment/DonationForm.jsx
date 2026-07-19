// Donation Form Component with Multiple Payment Methods
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { paymentSchema } from '@/lib/validators'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import toast from 'react-hot-toast'
import { loadStripe } from '@stripe/stripe-js'

// Payment method options
const PAYMENT_METHODS = [
  { value: 'CREDIT_CARD', label: 'Credit / Debit Card', icon: '💳' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer', icon: '🏦' },
  { value: 'MOBILE_MONEY', label: 'Mobile Money', icon: '📱' },
]

// Donation purposes
const DONATION_PURPOSES = [
  { value: '', label: 'Select purpose' },
  { value: 'TITHE', label: 'Tithe' },
  { value: 'OFFERING', label: 'Offering' },
  { value: 'BUILDING_FUND', label: 'Building Fund' },
  { value: 'MISSIONS', label: 'Missions' },
  { value: 'BENEVOLENCE', label: 'Benevolence' },
  { value: 'OTHER', label: 'Other' },
]

export default function DonationForm({ onSuccess, onError }) {
  const [loading, setLoading] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState('CREDIT_CARD')
  const [paymentResponse, setPaymentResponse] = useState(null)
  
  const stripe = useStripe()
  const elements = useElements()
  
  // Initialize form with react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: 100,
      currency: 'NGN',
      method: 'CREDIT_CARD',
      purpose: '',
    },
  })

  const amount = watch('amount')
  const currency = watch('currency')

  /**
   * Handle form submission
   * - Creates payment through API
   * - Handles redirects for Paystack
   * - Processes card payments with Stripe
   */
  const onSubmit = async (data) => {
    setLoading(true)
    
    try {
      // Send payment data to API
      const response = await fetch('/api/payments/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Payment creation failed')
      }

      setPaymentResponse(result.data)

      // Handle different payment providers
      if (result.data.provider === 'STRIPE') {
        // For Stripe, confirm card payment
        await handleStripePayment(result.data)
      } else if (result.data.provider === 'PAYSTACK') {
        // For Paystack, redirect to authorization URL
        window.location.href = result.data.authorizationUrl
      } else if (result.data.provider === 'MANUAL') {
        // For manual methods, show success message
        toast.success('Payment recorded. Please complete your payment manually.')
        if (onSuccess) onSuccess(result.data)
        reset()
      }

    } catch (error) {
      console.error('Payment error:', error)
      toast.error(error.message || 'Payment failed. Please try again.')
      if (onError) onError(error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handle Stripe card payment
   */
  const handleStripePayment = async (paymentData) => {
    if (!stripe || !elements) {
      toast.error('Payment system is not ready. Please try again.')
      return
    }

    const cardElement = elements.getElement(CardElement)

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      paymentData.clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: watch('payerName'),
            email: watch('payerEmail'),
            phone: watch('payerPhone'),
          },
        },
      }
    )

    if (error) {
      toast.error(error.message)
      if (onError) onError(error)
    } else if (paymentIntent.status === 'succeeded') {
      toast.success('Payment successful! Thank you for your donation.')
      if (onSuccess) onSuccess(paymentData)
      reset()
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Make a Donation
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Payment Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount *
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">
                {currency === 'NGN' ? '₦' : '$'}
              </span>
            </div>
            <input
              type="number"
              step="0.01"
              min="1"
              {...register('amount', { valueAsNumber: true })}
              className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
          )}
        </div>

        {/* Currency Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Currency
          </label>
          <select
            {...register('currency')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="NGN">NGN - Nigerian Naira</option>
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
          </select>
        </div>

        {/* Payer Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <input
              type="text"
              {...register('payerName')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="John Doe"
            />
            {errors.payerName && (
              <p className="mt-1 text-sm text-red-600">{errors.payerName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email *
            </label>
            <input
              type="email"
              {...register('payerEmail')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="john@example.com"
            />
            {errors.payerEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.payerEmail.message}</p>
            )}
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            {...register('payerPhone')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="+234 800 000 0000"
          />
          {errors.payerPhone && (
            <p className="mt-1 text-sm text-red-600">{errors.payerPhone.message}</p>
          )}
        </div>

        {/* Donation Purpose */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Purpose
          </label>
          <select
            {...register('purpose')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {DONATION_PURPOSES.map((purpose) => (
              <option key={purpose.value} value={purpose.value}>
                {purpose.label}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method *
          </label>
          <div className="grid grid-cols-3 gap-3">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.value}
                type="button"
                onClick={() => setSelectedMethod(method.value)}
                className={`
                  py-2 px-4 rounded-md border-2 text-center transition-all
                  ${selectedMethod === method.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                  }
                `}
              >
                <div className="text-2xl">{method.icon}</div>
                <div className="text-xs mt-1">{method.label}</div>
              </button>
            ))}
          </div>
          <input type="hidden" {...register('method')} value={selectedMethod} />
        </div>

        {/* Conditional Payment Details Based on Method */}
        {selectedMethod === 'CREDIT_CARD' && (
          <div className="p-4 border rounded-md bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Details
            </label>
            <div className="p-3 bg-white rounded border">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Your card details are secure and encrypted.
            </p>
          </div>
        )}

        {selectedMethod === 'BANK_TRANSFER' && (
          <div className="p-4 border rounded-md bg-gray-50">
            <label className="block text-sm font-medium text-gray-700">
              Bank Name
            </label>
            <input
              type="text"
              {...register('bankName')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="GTBank, First Bank, etc."
            />
            
            <label className="block text-sm font-medium text-gray-700 mt-3">
              Account Number
            </label>
            <input
              type="text"
              {...register('accountNumber')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="0123456789"
            />
            
            <p className="mt-2 text-xs text-gray-500">
              You will be redirected to complete the transfer.
            </p>
          </div>
        )}

        {selectedMethod === 'MOBILE_MONEY' && (
          <div className="p-4 border rounded-md bg-gray-50">
            <label className="block text-sm font-medium text-gray-700">
              Mobile Money Provider
            </label>
            <select
              {...register('bankName')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select provider</option>
              <option value="MTN_MOMO">MTN Mobile Money</option>
              <option value="AIRTEL_MONEY">Airtel Money</option>
              <option value="GLO_MONEY">Glo Money</option>
              <option value="9MOBILE_MONEY">9mobile Money</option>
            </select>
            
            <label className="block text-sm font-medium text-gray-700 mt-3">
              Phone Number
            </label>
            <input
              type="text"
              {...register('accountNumber')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="08012345678"
            />
            
            <p className="mt-2 text-xs text-gray-500">
              You will be redirected to complete the payment.
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !stripe}
          className={`
            w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            ${loading || !stripe
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }
          `}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Make Donation'
          )}
        </button>

        {/* Security Badges */}
        <div className="flex justify-center space-x-4 text-xs text-gray-500">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 1a9 9 0 00-9 9c0 4.97 4.03 9 9 9s9-4.03 9-9-4.03-9-9-9zm0 16a7 7 0 100-14 7 7 0 000 14zm1-11a1 1 0 10-2 0v4a1 1 0 102 0V6zm0 7a1 1 0 10-2 0 1 1 0 002 0z" clipRule="evenodd" />
            </svg>
            Secure SSL Encryption
          </span>
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 1a9 9 0 00-9 9c0 4.97 4.03 9 9 9s9-4.03 9-9-4.03-9-9-9zm0 16a7 7 0 100-14 7 7 0 000 14zm1-11a1 1 0 10-2 0v4a1 1 0 102 0V6zm0 7a1 1 0 10-2 0 1 1 0 002 0z" clipRule="evenodd" />
            </svg>
            PCI Compliant
          </span>
        </div>
      </form>
    </div>
  )
}