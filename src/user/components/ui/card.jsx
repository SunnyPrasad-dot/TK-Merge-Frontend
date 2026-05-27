import { cn } from '@shared/utils/cn'

const Card = ({ className, ...props }) => (
  <div
    data-slot="card"
    className={cn('bg-card text-card-foreground flex flex-col gap-4 sm:gap-6 rounded-xl border py-4 sm:py-6 shadow-sm', className)}
    {...props}
  />
)

const CardHeader = ({ className, ...props }) => (
  <div className={cn('grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-4 sm:px-6 [.border-b]:pb-6', className)} {...props} />
)

const CardTitle = ({ className, ...props }) => (
  <h2 className={cn('leading-none font-semibold', className)} {...props} />
)

const CardDescription = ({ className, ...props }) => (
  <p className={cn('text-sm text-muted-foreground', className)} {...props} />
)

const CardContent = ({ className, ...props }) => (
  <div className={cn('px-4 sm:px-6', className)} {...props} />
)

const CardFooter = ({ className, ...props }) => (
  <div className={cn('flex items-center px-4 sm:px-6 [.border-t]:pt-6', className)} {...props} />
)

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
