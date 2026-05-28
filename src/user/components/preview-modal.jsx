import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@user/components/ui/dialog'
import { DetailsForm } from '@user/components/details-form'
import { GrandTotalDisplay } from '@user/components/grand-total-display'
import {
  AlbumSection,
  createAlbumSelection,
} from '@user/components/album-section'
import { createBooking } from '@user/services/api'
import { buildBookingPayload } from '@user/services/booking-payload'

export function PreviewModal({
  open,
  onOpenChange,
  events,
  services,
  addonServices,
}) {
  const [step, setStep] = useState('album')
  const [customerDetails, setCustomerDetails] = useState(null)
  const [albumSelection, setAlbumSelection] = useState(createAlbumSelection)
  const [isSavingEnquiry, setIsSavingEnquiry] = useState(false)

  const handleDetailsSubmit = async (details) => {
    const payload = buildBookingPayload({
      events,
      services,
      albumSelection,
      addonServices,
      customerDetails: details,
      isConfirmed: false,
    })

    if (payload.events.length === 0) {
      alert('Please select backend services before continuing.')
      return
    }

    setIsSavingEnquiry(true)
    try {
      await createBooking(payload)
      setCustomerDetails(details)
      setStep('total')
    } catch (error) {
      alert(error.message || 'Unable to save enquiry')
    } finally {
      setIsSavingEnquiry(false)
    }
  }

  const handleConfirm = () => {
    onOpenChange(false)
    setStep('album')
    setCustomerDetails(null)
    setAlbumSelection(createAlbumSelection())
  }

  const handleBack = () => {
    setStep('details')
  }

  const handleDetailsBack = () => {
    setStep('album')
    setCustomerDetails(null)
  }

  const handleCloseModal = (newOpen) => {
    if (!newOpen) {
      setStep('album')
      setCustomerDetails(null)
      setAlbumSelection(createAlbumSelection())
      setIsSavingEnquiry(false)
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleCloseModal}>
      <DialogContent className="package-builder-theme max-h-[85vh] w-[calc(100vw-2rem)] gap-6 overflow-y-auto p-5 sm:max-w-lg sm:p-7">
        <DialogHeader className="space-y-2 border-b border-border pb-5 pr-8">
          <DialogTitle className="text-xl">
            {step === 'album' && 'Album Add-ons'}
            {step === 'details' && 'Contact Information'}
            {step === 'total' && 'Order Summary'}
          </DialogTitle>
          <DialogDescription>
            {step === 'album' && 'Choose album, editing, and delivery options'}
            {step === 'details' && 'Please provide your contact details'}
            {step === 'total' && 'Review your final order and pricing'}
          </DialogDescription>
        </DialogHeader>

        {step === 'album' && (
          <AlbumSection
            albumSelection={albumSelection}
            addonServices={addonServices}
            onChange={setAlbumSelection}
            onBack={() => handleCloseModal(false)}
            onContinue={() => setStep('details')}
          />
        )}

        {step === 'details' && (
          <DetailsForm
            onSubmit={handleDetailsSubmit}
            onBack={handleDetailsBack}
            isSubmitting={isSavingEnquiry}
          />
        )}

        {step === 'total' && customerDetails && (
          <GrandTotalDisplay
            events={events}
            services={services}
            albumSelection={albumSelection}
            addonServices={addonServices}
            customerDetails={customerDetails}
            onConfirm={handleConfirm}
            onBack={handleBack}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
