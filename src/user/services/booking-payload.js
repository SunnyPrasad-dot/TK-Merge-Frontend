import { getAlbumLineItems } from '@user/components/album-section'

const objectIdPattern = /^[0-9a-fA-F]{24}$/

function formatBookingDate(date) {
  if (!date) return ''

  const value = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(value.getTime())) return ''

  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function buildBookingPayload({
  events,
  services,
  albumSelection,
  addonServices,
  customerDetails,
  isConfirmed,
}) {
  const validServiceIds = new Set(services.map((service) => service.backendId || service.id))
  const backendEvents = events
    .map((event, index) => {
      const selectedServices = event.selectedServices
        .filter((serviceId) => validServiceIds.has(serviceId) && objectIdPattern.test(serviceId))
        .map((serviceId) => ({
          serviceId,
          quantity: 1,
        }))

      return {
        day: index + 1,
        date: formatBookingDate(event.date),
        location: event.name || `Event ${index + 1}`,
        services: selectedServices,
      }
    })
    .filter((event) => event.services.length > 0)

  const backendAddons = getAlbumLineItems(
    albumSelection,
    addonServices?.length ? addonServices : undefined
  )
    .filter((item) => objectIdPattern.test(item.serviceId))
    .map((item) => ({
      serviceId: item.serviceId,
      quantity: item.quantity || 1,
    }))

  const eventNotes = events
    .filter((event) => event.name || event.time)
    .map((event, index) => `Day ${index + 1}: ${event.name || 'Event'}${event.time ? ` at ${event.time}` : ''}`)
    .join(', ')

  return {
    customer: {
      name: customerDetails.name,
      email: customerDetails.email,
      phone: customerDetails.phone,
      note: eventNotes,
    },
    events: backendEvents,
    addons: backendAddons,
    isConfirmed,
  }
}
