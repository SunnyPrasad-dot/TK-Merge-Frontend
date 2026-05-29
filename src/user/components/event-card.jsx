import { format } from 'date-fns'
import { CalendarIcon, Clock, MapPin, X } from 'lucide-react'
import { Button } from '@user/components/ui/button'
import { Card, CardContent } from '@user/components/ui/card'
import { Input } from '@user/components/ui/input'
import { Calendar } from '@user/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@user/components/ui/popover'
import { cn } from '@shared/utils/cn'
import { EVENT_SUGGESTIONS } from '@user/services/package-data'

export function EventCard({ event, onUpdate, onRemove, showRemove }) {
  return (
    <Card className="relative w-full transition-all duration-200 hover:shadow-md">
      {showRemove && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 text-muted-foreground hover:text-destructive"
          onClick={onRemove}
        >
          <X className="size-4" />
        </Button>
      )}
      <CardContent className="px-5 py-5 sm:px-6 sm:py-6">
        <div className="grid gap-6">
          {/* Event Name */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Event Name</label>
            <div className="relative">
              <Input
                placeholder="e.g., Wedding, Reception..."
                value={event.name}
                onChange={(e) => onUpdate({ ...event, name: e.target.value })}
                list={`event-suggestions-${event.id}`}
                className="bg-background"
              />
              <datalist id={`event-suggestions-${event.id}`}>
                {EVENT_SUGGESTIONS.map((suggestion) => (
                  <option key={suggestion} value={suggestion} />
                ))}
              </datalist>
            </div>
            <div className="flex flex-wrap gap-2.5 pt-1">
              {EVENT_SUGGESTIONS.slice(0, 4).map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => onUpdate({ ...event, name: suggestion })}
                  className={cn(
                    'max-w-full break-words px-3 py-1 text-xs rounded-full border transition-all duration-200',
                    event.name === suggestion
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-secondary text-secondary-foreground hover:bg-accent hover:border-primary/50'
                  )}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Venue, city, or address"
                value={event.location || ''}
                onChange={(e) => onUpdate({ ...event, location: e.target.value })}
                className="bg-background pl-10"
              />
            </div>
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
            {/* Date Picker */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full min-w-0 justify-start text-left font-normal',
                      !event.date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 size-4 shrink-0" />
                    <span className="min-w-0 truncate">
                      {event.date ? format(event.date, 'PPP') : 'Pick a date'}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar selected={event.date} onSelect={(date) => onUpdate({ ...event, date })} />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Picker */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Time (Optional)</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="time"
                  value={event.time}
                  onChange={(e) => onUpdate({ ...event, time: e.target.value })}
                  className="pl-10 bg-background"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
