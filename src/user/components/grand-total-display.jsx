import { useState } from 'react'
import { Button } from '@user/components/ui/button'
import { Separator } from '@user/components/ui/separator'
import { formatPrice, calculateGrandTotal } from '@user/services/package-data'
import { calculateAlbumTotal, getAlbumLineItems } from '@user/components/album-section'
import { createBooking } from '@user/services/api'
import { buildBookingPayload } from '@user/services/booking-payload'
import { Check, Mail, Phone, User } from 'lucide-react'

export function GrandTotalDisplay({
  events,
  services,
  albumSelection,
  addonServices,
  customerDetails,
  onConfirm,
  onBack,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const packageTotal = calculateGrandTotal(events, services)
  const albumTotal = calculateAlbumTotal(albumSelection, addonServices?.length ? addonServices : undefined)
  const grandTotal = packageTotal + albumTotal
  const albumLineItems = getAlbumLineItems(albumSelection, addonServices?.length ? addonServices : undefined)
  const eventsWithServices = events.filter((e) => e.selectedServices.length > 0)

  const handleConfirm = async () => {
    const payload = buildBookingPayload({
      events,
      services,
      albumSelection,
      addonServices,
      customerDetails,
      isConfirmed: true,
    })

    if (payload.events.length === 0) {
      alert('Please select backend services before confirming the booking.')
      return
    }

    setIsSubmitting(true)
    try {
      const data = await createBooking(payload)
      alert(`${data.message || 'Booking created'}${data.booking?.bookingId ? `: ${data.booking.bookingId}` : ''}`)
      onConfirm()
    } catch (error) {
      alert(error.message || 'Unable to create booking')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 pb-1 pt-1">
      {/* Customer Details Summary */}
      <div className="space-y-4 rounded-lg border border-border/70 bg-accent/40 p-4 sm:p-5">
        <div className="flex min-w-0 flex-wrap items-center gap-2.5 text-sm">
          <User className="size-4 text-primary" />
          <span className="text-muted-foreground">Name:</span>
          <span className="min-w-0 break-words font-medium text-foreground">{customerDetails.name}</span>
        </div>
        <div className="flex min-w-0 flex-wrap items-center gap-2.5 text-sm">
          <Mail className="size-4 text-primary" />
          <span className="text-muted-foreground">Email:</span>
          <span className="min-w-0 break-all font-medium text-foreground">{customerDetails.email}</span>
        </div>
        <div className="flex min-w-0 flex-wrap items-center gap-2.5 text-sm">
          <Phone className="size-4 text-primary" />
          <span className="text-muted-foreground">Phone:</span>
          <span className="min-w-0 break-words font-medium text-foreground">{customerDetails.phone}</span>
        </div>
      </div>

      <Separator />

      {/* Events Summary */}
      <div className="space-y-4 rounded-lg border border-border/70 bg-muted/20 p-4 sm:p-5">
        <h4 className="font-semibold text-foreground">Package Summary</h4>
        {eventsWithServices.map((event, index) => (
          <div key={event.id} className="space-y-3">
            {index > 0 && <Separator className="my-4" />}
            <div className="space-y-1 text-sm">
              <p className="font-medium text-foreground">{event.name}</p>
              <p className="text-xs text-muted-foreground">
                {event.date?.toLocaleDateString()} {event.time && `at ${event.time}`}
              </p>
            </div>
            <div className="space-y-2 pl-4">
              {event.selectedServices.map((serviceId) => {
                const service = services.find((s) => s.id === serviceId)
                return (
                  <div
                    key={serviceId}
                    className="flex items-center gap-2.5 text-sm text-muted-foreground"
                  >
                    <Check className="size-3 text-green-600" />
                    {service?.name}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <Separator />

      {/* Album Summary */}
      <div className="space-y-4 rounded-lg border border-border/70 bg-muted/20 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <h4 className="font-semibold text-foreground">Album Add-ons</h4>
          <span className="text-sm font-semibold text-primary">{formatPrice(albumTotal)}</span>
        </div>
        {albumLineItems.length > 0 ? (
          <div className="space-y-2">
            {albumLineItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 text-sm text-muted-foreground"
              >
                <span className="min-w-0 break-words">{item.name}</span>
                <span className="shrink-0">{formatPrice(item.price)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No album add-ons selected</p>
        )}
      </div>

      <Separator />

      {/* Grand Total */}
      <div className="space-y-4 rounded-lg border border-primary/15 bg-primary/5 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>Services Total</span>
          <span>{formatPrice(packageTotal)}</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>Album Total</span>
          <span>{formatPrice(albumTotal)}</span>
        </div>
        <div className="flex flex-col gap-2 border-t border-primary/15 pt-4 text-lg sm:flex-row sm:items-center sm:justify-between">
          <span className="font-semibold text-foreground">Grand Total</span>
          <span className="text-2xl font-bold text-primary">
            {formatPrice(grandTotal)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          This is the total cost for your complete wedding photography package
        </p>
      </div>

      <Separator className="my-7" />

      {/* Action Buttons */}
      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
        <Button variant="outline" onClick={onBack} className="w-full sm:flex-1">
          Back
        </Button>
        <Button onClick={handleConfirm} disabled={isSubmitting} className="w-full sm:flex-1">
          {isSubmitting ? 'Submitting...' : 'Confirm & Proceed'}
        </Button>
      </div>
    </div>
  )
}
