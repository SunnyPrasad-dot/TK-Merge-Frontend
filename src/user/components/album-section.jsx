import { BookOpen, Check, HardDrive, Image, Play, Video } from 'lucide-react'
import { Button } from '@user/components/ui/button'
import { Input } from '@user/components/ui/input'
import { Separator } from '@user/components/ui/separator'
import { formatPrice } from '@user/services/package-data'

export const ALBUM_ADDONS = [
  {
    id: 'premiumAlbum',
    name: 'Premium Album',
    price: 15000,
    icon: BookOpen,
  },
  {
    id: 'videoEditing',
    name: 'Video Editing',
    price: 15000,
    icon: Video,
  },
  {
    id: 'magazine',
    name: 'Magazine',
    price: 3000,
    icon: BookOpen,
  },
  {
    id: 'hardDrive',
    name: '500GB Hard Drive',
    price: 2700,
    icon: HardDrive,
  },
  {
    id: 'sameDayHighlight',
    name: 'Same Day Highlight',
    price: 15000,
    icon: Play,
  },
  {
    id: 'sameDayPhotoScanner',
    name: 'Same Day Photo Through Scanner',
    price: 10000,
    icon: Image,
  },
]

export const EDITED_PHOTO_PRICE = 30

export function createAlbumSelection() {
  return {
    premiumAlbum: false,
    videoEditing: false,
    magazine: false,
    hardDrive: false,
    sameDayHighlight: false,
    sameDayPhotoScanner: false,
    editedPhotos: 0,
  }
}

export function getAlbumLineItems(albumSelection) {
  const selectedAddons = ALBUM_ADDONS.filter((addon) => albumSelection[addon.id]).map(
    (addon) => ({
      id: addon.id,
      name: addon.name,
      price: addon.price,
    })
  )

  const editedPhotos = Number(albumSelection.editedPhotos) || 0
  if (editedPhotos > 0) {
    selectedAddons.push({
      id: 'editedPhotos',
      name: `Edited Photos (${editedPhotos} x ${formatPrice(EDITED_PHOTO_PRICE)})`,
      price: editedPhotos * EDITED_PHOTO_PRICE,
    })
  }

  return selectedAddons
}

export function calculateAlbumTotal(albumSelection) {
  return getAlbumLineItems(albumSelection).reduce((total, item) => total + item.price, 0)
}

export function AlbumSection({ albumSelection, onChange, onBack, onContinue }) {
  const albumTotal = calculateAlbumTotal(albumSelection)

  const handleToggle = (id) => {
    onChange({
      ...albumSelection,
      [id]: !albumSelection[id],
    })
  }

  const handleEditedPhotosChange = (event) => {
    const value = Math.max(0, Number(event.target.value) || 0)
    onChange({
      ...albumSelection,
      editedPhotos: value,
    })
  }

  return (
    <div className="space-y-6 py-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Album & Delivery Add-ons</h3>
        <p className="text-sm text-muted-foreground">
          Select album, editing, storage, and same-day delivery options for this package.
        </p>
      </div>

      <div className="grid gap-3">
        {ALBUM_ADDONS.map((addon) => {
          const Icon = addon.icon
          const selected = albumSelection[addon.id]

          return (
            <button
              key={addon.id}
              type="button"
              onClick={() => handleToggle(addon.id)}
              className={`flex min-w-0 items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                selected
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-border bg-card hover:bg-accent/40'
              }`}
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                <Icon className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block break-words text-sm font-medium">{addon.name}</span>
                <span className="block text-xs text-muted-foreground">{formatPrice(addon.price)}</span>
              </span>
              <span
                className={`grid size-5 shrink-0 place-items-center rounded-full border ${
                  selected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/40'
                }`}
              >
                {selected && <Check className="size-3" />}
              </span>
            </button>
          )
        })}
      </div>

      <div className="space-y-2 rounded-lg border bg-card p-3">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Image className="size-4 text-primary" />
          Edited Photos
        </label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            type="number"
            min="0"
            value={albumSelection.editedPhotos}
            onChange={handleEditedPhotosChange}
            className="bg-background sm:max-w-36"
          />
          <p className="text-sm text-muted-foreground">
            {formatPrice(EDITED_PHOTO_PRICE)} per photo
          </p>
        </div>
      </div>

      <Separator />

      <div className="rounded-lg bg-primary/5 p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-foreground">Album Total</span>
          <span className="text-xl font-bold text-primary">{formatPrice(albumTotal)}</span>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 justify-end sm:flex-row">
        <Button type="button" variant="outline" onClick={onBack} className="w-full sm:w-auto">
          Back
        </Button>
        <Button type="button" onClick={onContinue} className="w-full sm:w-auto">
          Continue to Details
        </Button>
      </div>
    </div>
  )
}
