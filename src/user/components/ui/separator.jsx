import { cn } from '@shared/utils/cn'

const Separator = ({ className, orientation = 'horizontal', decorative = true, ...props }) => (
  <div
    role={decorative ? 'none' : 'separator'}
    aria-orientation={orientation}
    className={cn(
      'shrink-0 bg-border',
      orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
      className
    )}
    {...props}
  />
)

export { Separator }
