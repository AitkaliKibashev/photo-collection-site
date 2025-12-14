'use client'

import Masonry from 'react-masonry-css'
import { motion } from 'framer-motion'
import { FC, useEffect, useState, useCallback, useRef } from 'react'
import { Image } from '@/types/Image'
import PhotoViewer from '@/components/PhotoViewer'
import Search from '@/components/ui/Search'
import { fetchImages } from '@/lib/fetchImages'
import Filters from '@/components/Filters'
import { Tag } from '@/types/Tag'
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore'
import { Spinner } from '@/components/ui/spinner'
import { ImageIcon } from 'lucide-react'

interface GalleryItemProps {
  onClick: (value: number) => void
  image: Image
  index: number
}

const GalleryItem: FC<GalleryItemProps> = ({ onClick, image, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onClick={() => onClick(image.id)}
      className="group relative cursor-pointer overflow-hidden rounded-lg shadow"
    >
      {/* Placeholder/Skeleton */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 flex animate-pulse items-center justify-center bg-gray-200">
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <ImageIcon className="h-8 w-8" />
            <span className="text-xs">Loading...</span>
          </div>
        </div>
      )}

      {/* Error state */}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <ImageIcon className="h-8 w-8" />
            <span className="text-xs">Failed to load</span>
          </div>
        </div>
      )}

      {/* Actual image */}
      <img
        src={image.url}
        style={{ width: '100%' }}
        alt={image.title}
        onLoad={() => setImageLoaded(true)}
        onError={() => {
          setImageError(true)
          setImageLoaded(false)
        }}
        className={`transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Hover overlay with title */}
      <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="flex h-full items-center justify-center p-4">
          <p className="text-center text-lg font-semibold text-white drop-shadow-lg">
            {image.title}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

const GalleryGrid = () => {
  const [currentImageId, setCurrentImageId] = useState(0)
  const [isViewerActive, setIsViewerActive] = useState(false)
  const [images, setImages] = useState<Image[]>([])
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const observerTarget = useRef<HTMLDivElement>(null)

  const loadingRef = useRef(false)
  const selectedTagsRef = useRef(selectedTags)
  const lastDocRef = useRef(lastDoc)
  const hasMountedRef = useRef(false)

  // Обновляем refs при изменении значений
  useEffect(() => {
    selectedTagsRef.current = selectedTags
  }, [selectedTags])

  useEffect(() => {
    lastDocRef.current = lastDoc
  }, [lastDoc])

  const loadImages = useCallback(
    async (reset: boolean = false) => {
      if (loadingRef.current) return

      loadingRef.current = true
      setLoading(true)

      try {
        const currentTags = selectedTagsRef.current
        const currentLastDoc = reset ? null : lastDocRef.current

        const result = await fetchImages({
          selectedTags: currentTags,
          pageSize: 12,
          lastDoc: currentLastDoc,
        })

        if (reset) {
          setImages(result.images)
        } else {
          setImages((prev) => [...prev, ...result.images])
        }

        setLastDoc(result.lastDoc)
        setHasMore(result.hasMore)
      } catch (error) {
        console.error('Error loading images:', error)
        setHasMore(false)
      } finally {
        setLoading(false)
        setInitialLoading(false)
        loadingRef.current = false
      }
    },
    [], // Убираем зависимости, используем refs
  )

  // Загрузка при изменении фильтров
  useEffect(() => {
    if (!hasMountedRef.current) return // Пропускаем первый рендер

    setInitialLoading(true)
    setImages([])
    setLastDoc(null)
    setHasMore(true)
    loadImages(true)
  }, [selectedTags, loadImages])

  // Начальная загрузка (только один раз)
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      loadImages(true)
    }
  }, [loadImages])

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadImages(false)
        }
      },
      { threshold: 0.1 },
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [hasMore, loading, loadImages])

  // Фильтрация изображений по поисковому запросу
  const filteredImages = images.filter((image) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase().trim()
    return image.title.toLowerCase().includes(query)
  })

  const items = filteredImages?.map((image, i) => (
    <GalleryItem
      onClick={(value) => {
        setCurrentImageId(value)
        setIsViewerActive(true)
      }}
      image={image}
      index={i}
      key={image.id}
    />
  ))

  return (
    <div className={'w-full'}>
      <PhotoViewer
        images={filteredImages}
        currentImageId={currentImageId}
        isActive={isViewerActive}
        setIsActive={setIsViewerActive}
      />
      <div className="flex min-w-full flex-col gap-3 pt-2 sm:gap-4 sm:pt-4">
        <Search value={searchQuery} onChange={setSearchQuery} />
        <Filters values={selectedTags} setValues={setSelectedTags} />
        {initialLoading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : (
          <>
            <Masonry
              breakpointCols={{ default: 4, 1100: 3, 700: 2, 500: 1 }}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {items}
            </Masonry>
            {hasMore && (
              <div ref={observerTarget} className="flex justify-center py-8">
                {loading && <Spinner />}
              </div>
            )}
            {!hasMore && images.length > 0 && !searchQuery && !loading && (
              <div className="py-8 text-center text-gray-500">
                No more images to load
              </div>
            )}
            {!initialLoading && filteredImages.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                {searchQuery
                  ? `No images found for "${searchQuery}"`
                  : 'No images found'}
              </div>
            )}
            {searchQuery && filteredImages.length > 0 && (
              <div className="py-4 text-center text-sm text-gray-500">
                Found {filteredImages.length} image
                {filteredImages.length !== 1 ? 's' : ''}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default GalleryGrid
