export const SERVICES = [
  {
    id: 'traditional-photo',
    name: 'Traditional Photographer',
    description: 'Classic posed photography',
    pricePerDay: 15000,
    icon: 'Camera',
  },
  {
    id: 'traditional-video',
    name: 'Traditional Videographer',
    description: 'Standard event coverage',
    pricePerDay: 20000,
    icon: 'Video',
  },
  {
    id: 'semi-candid-photo',
    name: 'Semi-Candid Photographer',
    description: 'Natural moments with direction',
    pricePerDay: 25000,
    icon: 'Focus',
  },
  {
    id: 'semi-candid-video',
    name: 'Semi-Candid Videographer',
    description: 'Blend of candid and directed',
    pricePerDay: 30000,
    icon: 'Film',
  },
  {
    id: 'candid-photo',
    name: 'Candid Photographer',
    description: 'Authentic unposed moments',
    pricePerDay: 35000,
    icon: 'Sparkles',
  },
  {
    id: 'cinematographer',
    name: 'Cinematographer',
    description: 'Cinematic storytelling',
    pricePerDay: 50000,
    icon: 'Clapperboard',
  },
  {
    id: 'drone',
    name: 'Drone Coverage',
    description: 'Aerial photography & video',
    pricePerDay: 15000,
    icon: 'Plane',
  },
]

export const EVENT_SUGGESTIONS = [
  'Haldi',
  'Mehndi',
  'Sangeet',
  'Wedding',
  'Reception',
  'Pre-Wedding Shoot',
  'Engagement',
  'Cocktail Party',
]

const roleIconMap = {
  traditional_photographer: 'Camera',
  traditional_videographer: 'Video',
  candid_photographer: 'Sparkles',
  cinematographer: 'Clapperboard',
  drone: 'Plane',
}

export function normalizeService(service) {
  return {
    id: service._id || service.id,
    backendId: service._id || service.id,
    name: service.name,
    description:
      service.priceType === 'per_day'
        ? 'Per day service'
        : service.priceType === 'per_unit'
          ? 'Quantity based service'
          : 'Fixed price service',
    pricePerDay: service.price || service.pricePerDay || 0,
    price: service.price || service.pricePerDay || 0,
    priceType: service.priceType,
    type: service.type,
    role: service.role,
    icon: roleIconMap[service.role] || service.icon || 'Camera',
  }
}

export function formatPrice(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function calculateEventTotal(event, services) {
  return event.selectedServices.reduce((total, serviceId) => {
    const service = services.find((s) => s.id === serviceId)
    return total + (service?.pricePerDay || 0)
  }, 0)
}

export function calculateGrandTotal(events, services) {
  return events.reduce((total, event) => {
    return total + calculateEventTotal(event, services)
  }, 0)
}
