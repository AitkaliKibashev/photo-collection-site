import { db } from '@/lib/firebase'
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore'
import { Image } from '@/types/Image'
import { Tag } from '@/types/Tag'

export interface FetchImagesParams {
  selectedTags?: Tag[]
  pageSize?: number
  lastDoc?: QueryDocumentSnapshot<DocumentData> | null
}

export interface FetchImagesResult {
  images: Image[]
  lastDoc: QueryDocumentSnapshot<DocumentData> | null
  hasMore: boolean
}

export const fetchImages = async ({
  selectedTags = [],
  pageSize = 12,
  lastDoc = null,
}: FetchImagesParams = {}): Promise<FetchImagesResult> => {
  let q

  // Если есть выбранные теги, используем фильтрацию
  if (selectedTags.length > 0) {
    // Firestore требует составной индекс для where + orderBy на разных полях
    // Для упрощения используем только where, сортировку делаем на клиенте
    q = query(
      collection(db, 'images'),
      where('tags', 'array-contains-any', selectedTags),
      limit(pageSize + 1)
    )
  } else {
    // Без фильтров используем orderBy для правильной пагинации
    q = query(
      collection(db, 'images'),
      orderBy('id', 'desc'),
      limit(pageSize + 1)
    )
  }

  // Если есть lastDoc, начинаем с него (для пагинации)
  if (lastDoc) {
    q = query(q, startAfter(lastDoc))
  }

  const snap = await getDocs(q)
  const docs = snap.docs
  const hasMore = docs.length > pageSize

  // Преобразуем документы в изображения
  let images = docs
    .slice(0, pageSize)
    .map((doc) => {
      const data = doc.data()
      // Обработка обратной совместимости - если tags отсутствует, используем пустой массив
      return {
        ...data,
        tags: data.tags || [],
      } as Image
    })

  // Если использовали фильтрацию без orderBy, сортируем на клиенте
  if (selectedTags.length > 0) {
    images = images.sort((a, b) => b.id - a.id)
  }

  return {
    images,
    lastDoc: hasMore ? docs[pageSize - 1] : null,
    hasMore,
  }
}
