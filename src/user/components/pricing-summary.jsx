import { format } from 'date-fns'
import { CalendarDays, FileText } from 'lucide-react'
import { Button } from '@user/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@user/components/ui/card'
import { Separator } from '@user/components/ui/separator'

export function PricingSummary({
  events,
  services,
  onGeneratePDF,
  onPreview,
}) {
  const hasSelections = events.some((e) => e.selectedServices.length > 0)

  return (
    <Card className="w-full border-2 border-primary/20 bg-card shadow-lg">
      <CardHeader className="px-5 pb-5 pt-5 sm:px-6">
        <CardTitle className="flex min-w-0 items-center gap-2 text-base sm:text-lg">
          <FileText className="size-5 text-primary" />
          <span className="min-w-0 truncate">Package Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 px-5 pb-5 sm:px-6 sm:pb-6">
        {/* Per Event Breakdown */}
        {events.map((event) => {
          const selectedServiceNames = event.selectedServices
            .map((id) => services.find((s) => s.id === id)?.name)
            .filter(Boolean)

          if (selectedServiceNames.length === 0) return null

          return (
            <div key={event.id} className="space-y-3 rounded-lg border border-border/70 bg-muted/30 p-4">
              <div className="flex min-w-0 items-center gap-2 text-sm font-medium text-foreground">
                <CalendarDays className="size-4 shrink-0 text-primary" />
                <span className="min-w-0 truncate">{event.name || 'Unnamed Event'}</span>
                {event.date && (
                  <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                    {format(event.date, 'MMM d')}
                  </span>
                )}
              </div>
              <div className="space-y-1.5 pl-6">
                {selectedServiceNames.map((name) => (
                  <p key={name} className="break-words text-xs text-muted-foreground">
                    {name}
                  </p>
                ))}
              </div>
            </div>
          )
        })}

        {hasSelections && (
          <>
            <Separator className="my-5" />

            {/* Action Buttons */}
            <div className="space-y-3 pt-1">
              <Button className="w-full" onClick={onPreview}>
                Preview Package
              </Button>
              <Button variant="outline" className="w-full" onClick={onGeneratePDF}>
                <FileText className="size-4 mr-2" />
                PDF
              </Button>
            </div>
          </>
        )}

        {!hasSelections && (
          <div className="text-center py-6 text-muted-foreground">
            <p className="text-sm">Select services for your events</p>
            <p className="text-xs mt-1">Your package summary will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
