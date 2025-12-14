import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Image } from '@/types/Image'
import { FC, useState, useEffect, useCallback } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Maximize, Minimize, X } from 'lucide-react'
import type { UseEmblaCarouselType } from 'embla-carousel-react'

interface PhotoViewerProps {
  images: Image[]
  currentImageId: number
  isActive: boolean
  setIsActive: (value: boolean) => void
}

const PhotoViewer: FC<PhotoViewerProps> = ({
  currentImageId,
  images,
  setIsActive,
  isActive,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [carouselApi, setCarouselApi] = useState<
    UseEmblaCarouselType[1] | null
  >(null)

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      await document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  const closeDialog = useCallback(() => {
    setIsActive(false)
    if (isFullscreen) {
      toggleFullscreen()
    }
  }, [isFullscreen, setIsActive, toggleFullscreen])

  // Hot keys handler
  useEffect(() => {
    if (!isActive) return

    const handleKeyDown = (event: KeyboardEvent) => {
      // ESC - закрыть
      if (event.key === 'Escape') {
        event.preventDefault()
        closeDialog()
        return
      }

      // F - fullscreen
      if (event.key === 'f' || event.key === 'F') {
        event.preventDefault()
        toggleFullscreen()
        return
      }

      // ArrowLeft - предыдущее изображение
      if (event.key === 'ArrowLeft' && carouselApi) {
        event.preventDefault()
        carouselApi.scrollPrev()
        return
      }

      // ArrowRight - следующее изображение
      if (event.key === 'ArrowRight' && carouselApi) {
        event.preventDefault()
        carouselApi.scrollNext()
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isActive, carouselApi, closeDialog, toggleFullscreen])

  return (
    <Dialog open={isActive} onOpenChange={setIsActive}>
      <DialogContent
        className={
          'h-full w-full max-w-full border-none bg-transparent px-0 shadow-none sm:max-w-full sm:px-4'
        }
        overlayClassname={isFullscreen ? 'bg-black' : undefined}
        showCloseButton={false}
      >
        <div
          className={
            'absolute top-4 right-4 z-50 flex gap-3 sm:top-6 sm:right-8 sm:gap-5'
          }
        >
          <button
            onClick={() => toggleFullscreen()}
            className={`cursor-pointer p-1 sm:p-0`}
            aria-label="Toggle fullscreen"
          >
            {isFullscreen ? (
              <Minimize className="h-6 w-6 text-white sm:h-8 sm:w-8" />
            ) : (
              <Maximize className="h-6 w-6 text-white sm:h-8 sm:w-8" />
            )}
          </button>
          <button
            onClick={closeDialog}
            className={`cursor-pointer p-1 sm:p-0`}
            aria-label="Close"
          >
            <X className="h-6 w-6 text-white sm:h-8 sm:w-8" />
          </button>
        </div>
        <div className="flex h-full w-full items-center justify-center overflow-hidden px-2 sm:px-4">
          <Carousel
            className="flex h-full w-full max-w-full items-center"
            setApi={setCarouselApi}
            opts={{
              startIndex: images.findIndex(
                (image) => image.id === currentImageId,
              ),
              loop: true,
            }}
          >
            <CarouselContent className="h-full">
              {images.map((image) => (
                <CarouselItem key={image.id + 'carousel'}>
                  <div className="flex h-full min-h-0 w-full items-center justify-center overflow-hidden">
                    <img
                      src={image.url}
                      className="h-auto max-h-[80vh] w-auto max-w-full object-contain"
                      alt={image.title}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious
              className={
                'my-carousel-btn h-full w-[100px] text-white sm:w-[300px]'
              }
              variant={'link'}
            />
            <CarouselNext
              className={
                'my-carousel-btn h-full w-[100px] text-white sm:w-[300px]'
              }
              variant={'link'}
            />
          </Carousel>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PhotoViewer
