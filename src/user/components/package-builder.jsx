import { useEffect, useState, useCallback } from 'react'
import { ArrowLeft, Plus, Camera, Sparkles } from 'lucide-react'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { EventCard } from './event-card'
import { ServiceSelector } from './service-selector'
import { PricingSummary } from './pricing-summary'
import { PreviewModal } from './preview-modal'
import { SERVICES, normalizeService } from '@user/services/package-data'
import { getServices } from '@user/services/api'

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

function createNewEvent() {
  return {
    id: generateId(),
    name: '',
    location: '',
    date: undefined,
    time: '',
    selectedServices: [],
  }
}

export function PackageBuilder({ onBack }) {
  const [events, setEvents] = useState([createNewEvent()])
  const [activeEventId, setActiveEventId] = useState(events[0].id)
  const [discountPercent, setDiscountPercent] = useState(0)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [backendServices, setBackendServices] = useState([])

  const activeEvent = events.find((e) => e.id === activeEventId) || events[0]
  const shootServices = backendServices.filter((service) => service.type === 'shoot')
  const addonServices = backendServices.filter((service) => service.type === 'addon')
  const services = shootServices.length > 0 ? shootServices : SERVICES

  useEffect(() => {
    let isMounted = true

    getServices()
      .then((data) => {
        if (!isMounted) return
        setBackendServices((data.services || []).map(normalizeService))
      })
      .catch((error) => {
        console.error('Unable to load backend services:', error)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const handleAddEvent = useCallback(() => {
    const newEvent = createNewEvent()
    setEvents((prev) => [...prev, newEvent])
    setActiveEventId(newEvent.id)
  }, [])

  const handleRemoveEvent = useCallback(
    (id) => {
      setEvents((prev) => {
        const filtered = prev.filter((e) => e.id !== id)
        if (filtered.length === 0) {
          const newEvent = createNewEvent()
          return [newEvent]
        }
        return filtered
      })
      setActiveEventId((prevActive) => {
        if (prevActive === id) {
          const remaining = events.filter((e) => e.id !== id)
          return remaining.length > 0 ? remaining[0].id : ''
        }
        return prevActive
      })
    },
    [events]
  )

  const handleUpdateEvent = useCallback((updatedEvent) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
    )
  }, [])

  const handleToggleService = useCallback(
    (serviceId) => {
      setEvents((prev) =>
        prev.map((e) => {
          if (e.id !== activeEventId) return e
          const isSelected = e.selectedServices.includes(serviceId)
          return {
            ...e,
            selectedServices: isSelected
              ? e.selectedServices.filter((id) => id !== serviceId)
              : [...e.selectedServices, serviceId],
          }
        })
      )
    },
    [activeEventId]
  )

  const handleGeneratePDF = useCallback(() => {
    alert('PDF generation would be implemented with a library like jsPDF or react-pdf')
  }, [])

  return (
    <div className="package-builder-theme min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="package-builder-container py-3 sm:py-4">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onBack}
              className="shrink-0"
            >
              <ArrowLeft className="size-4 mr-2" />
              Back
            </Button>
            <div className="size-9 sm:size-10 shrink-0 rounded-full bg-primary flex items-center justify-center">
              {/* <Camera className="size-5 text-primary-foreground" /> */}
            </div>
            {/* <div className="min-w-0">
              <h1 className="truncate text-lg sm:text-xl font-semibold text-foreground">Wedding Package Builder</h1>
              <p className="truncate text-xs sm:text-sm text-muted-foreground">Create your perfect photography package</p>
            </div> */}
          </div>
        </div>
      </header>

      <main className="package-builder-container py-5 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-6 lg:gap-8">
          {/* Left Column - Main Content */}
          <div className="min-w-0 space-y-6 sm:space-y-8">
            {/* Section 1: Event Selection */}
            <section>
              <div className="mb-4 sm:mb-6">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
                    <span className="size-7 shrink-0 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      1
                    </span>
                    Event Details
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add your wedding events and select dates
                  </p>
                </div>
              </div>

              {/* Event Tabs */}
              <div className="-mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-2 sm:flex-wrap sm:overflow-visible">
                {events.map((event, index) => (
                  <button
                    key={event.id}
                    onClick={() => setActiveEventId(event.id)}
                    className={`shrink-0 max-w-[70vw] truncate px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      activeEventId === event.id
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-secondary text-secondary-foreground hover:bg-accent'
                    }`}
                  >
                    {event.name || `Event ${index + 1}`}
                    {event.selectedServices.length > 0 && (
                      <span className="ml-2 size-5 inline-flex items-center justify-center rounded-full bg-primary-foreground/20 text-xs">
                        {event.selectedServices.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Active Event Card */}
              <EventCard
                event={activeEvent}
                onUpdate={handleUpdateEvent}
                onRemove={() => handleRemoveEvent(activeEvent.id)}
                showRemove={events.length > 1}
              />
            </section>

            <Separator />

            {/* Section 2: Service Selection */}
            <section className="rounded-xl border bg-card p-4 shadow-sm sm:p-5 lg:p-6">
              <div className="mb-5 sm:mb-6">
                <h2 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
                  <span className="size-7 shrink-0 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  Select Services
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose services for{' '}
                  <span className="font-medium text-foreground">
                    {activeEvent.name || 'this event'}
                  </span>
                </p>
              </div>

              <ServiceSelector
                services={services}
                selectedServices={activeEvent.selectedServices}
                onToggle={handleToggleService}
              />
            </section>

            {/* Add Event Button - After Services */}
            <div className="pt-4">
              <Button
                size="lg"
                onClick={handleAddEvent}
                className="w-full sm:w-auto"
              >
                <Plus className="size-5 mr-2" />
                Add Event
              </Button>
            </div>
          </div>

          {/* Right Column - Sticky Pricing Summary */}
          <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <PricingSummary
              events={events}
              services={services}
              onGeneratePDF={handleGeneratePDF}
              onPreview={() => setPreviewOpen(true)}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-8 sm:mt-12">
        <div className="package-builder-container py-5 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <span> Wedding Photography Services</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Preview Modal */}
      <PreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        events={events}
        services={services}
        addonServices={addonServices}
        discountPercent={discountPercent}
      />
    </div>
  )
}
