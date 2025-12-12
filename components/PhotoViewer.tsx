import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Image } from '@/types/Image'
import { FC, useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Maximize, Minimize, X } from 'lucide-react'

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

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      await document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const closeDialog = () => {
    setIsActive(false)
    if (isFullscreen) {
      toggleFullscreen()
    }
  }

  return (
    <Dialog open={isActive} onOpenChange={setIsActive}>
      <DialogContent
        className={'w-full !max-w-none border-none bg-transparent shadow-none'}
        overlayClassname={isFullscreen ? 'bg-black' : undefined}
        showCloseButton={false}
      >
        <div
          className={
            'absolute -top-12 right-4 z-50 flex gap-3 sm:-top-16 sm:right-8 sm:gap-5'
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
        <Carousel
          className="mx-auto w-full"
          opts={{
            startIndex: images.findIndex(
              (image) => image.id === currentImageId,
            ),
            loop: true,
          }}
        >
          <CarouselContent>
            {images.map((image) => (
              <CarouselItem className={''} key={image.id + 'carousel'}>
                <div className="flex h-[70vh] w-full items-center justify-center px-2 sm:h-[80vh] sm:px-0">
                  <img
                    src={image.url}
                    className="max-h-[70vh] w-full object-contain sm:max-h-[80vh]"
                    alt={image.title}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            className={'my-carousel-btn h-full w-16 text-white sm:w-[300px]'}
            variant={'link'}
          />
          <CarouselNext
            className={'my-carousel-btn h-full w-16 text-white sm:w-[300px]'}
            variant={'link'}
          />
        </Carousel>
      </DialogContent>
    </Dialog>
  )
}

export default PhotoViewer
