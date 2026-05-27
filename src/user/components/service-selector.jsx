import {
  Camera,
  Video,
  Focus,
  Film,
  Sparkles,
  Clapperboard,
  Plane,
  Check,
} from 'lucide-react'
import { cn } from '@shared/utils/cn'

const iconMap = {
  Camera: Camera,
  Video: Video,
  Focus: Focus,
  Film: Film,
  Sparkles: Sparkles,
  Clapperboard: Clapperboard,
  Plane: Plane,
}

export function ServiceSelector({ services, selectedServices, onToggle }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-4">
      {services.map((service) => {
        const Icon = iconMap[service.icon] || Camera
        const isSelected = selectedServices.includes(service.id)

        return (
          <button
            key={service.id}
            type="button"
            onClick={() => onToggle(service.id)}
            className={cn(
              'relative flex min-h-[5.75rem] w-full items-start gap-3 rounded-lg border-2 p-4 text-left transition-all duration-200 group sm:min-h-[6.25rem] sm:p-5',
              isSelected
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-border hover:border-primary/50 hover:bg-accent/50'
            )}
          >
            {/* Selection Indicator */}
            <div
              className={cn(
                'absolute right-4 top-4 size-5 rounded-full flex items-center justify-center transition-all duration-200',
                isSelected
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted border border-border group-hover:border-primary/50'
              )}
            >
              {isSelected && <Check className="size-3" />}
            </div>

            {/* Icon */}
            <div
              className={cn(
                'size-9 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200',
                isSelected
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
              )}
            >
              <Icon className="size-4" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pr-7">
              <h4 className="break-words font-medium text-foreground text-sm leading-tight">
                {service.name}
              </h4>
              <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">
                {service.description}
              </p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
