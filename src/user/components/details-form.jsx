import { useState } from 'react'
import { Button } from '@user/components/ui/button'
import { Input } from '@user/components/ui/input'
import { Separator } from '@user/components/ui/separator'
import { User, Mail, Phone } from 'lucide-react'

export function DetailsForm({ onSubmit, onBack, isSubmitting = false }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!phone.trim()) {
      newErrors.phone = 'Phone is required'
    } else if (!/^[-0-9\s+()]+$/.test(phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit({ name, email, phone })
    }
  }

  return (
    <div className="pb-1 pt-1">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div className="space-y-3 rounded-lg border border-border/70 bg-muted/20 p-4">
          <label className="text-sm font-medium flex items-center gap-2 text-foreground">
            <User className="size-4 text-primary" />
            Full Name
          </label>
          <Input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (errors.name) setErrors({ ...errors, name: '' })
            }}
            className="h-11 bg-background px-4"
          />
          {errors.name && <p className="pt-1 text-xs text-red-600">{errors.name}</p>}
        </div>

        {/* Email Field */}
        <div className="space-y-3 rounded-lg border border-border/70 bg-muted/20 p-4">
          <label className="text-sm font-medium flex items-center gap-2 text-foreground">
            <Mail className="size-4 text-primary" />
            Email Address
          </label>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) setErrors({ ...errors, email: '' })
            }}
            className="h-11 bg-background px-4"
          />
          {errors.email && <p className="pt-1 text-xs text-red-600">{errors.email}</p>}
        </div>

        {/* Phone Field */}
        <div className="space-y-3 rounded-lg border border-border/70 bg-muted/20 p-4">
          <label className="text-sm font-medium flex items-center gap-2 text-foreground">
            <Phone className="size-4 text-primary" />
            Phone Number
          </label>
          <Input
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value)
              if (errors.phone) setErrors({ ...errors, phone: '' })
            }}
            className="h-11 bg-background px-4"
          />
          {errors.phone && <p className="pt-1 text-xs text-red-600">{errors.phone}</p>}
        </div>

        <Separator className="my-7" />

        {/* Buttons */}
        <div className="flex flex-col-reverse justify-end gap-3 pt-2 sm:flex-row">
          <Button type="button" variant="outline" onClick={onBack} className="w-full sm:w-auto">
            Back
          </Button>
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? 'Saving...' : 'Continue to Summary'}
          </Button>
        </div>
      </form>
    </div>
  )
}
