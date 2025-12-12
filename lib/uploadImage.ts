import { db, storage } from './firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { addDoc, collection } from 'firebase/firestore'
import { Tag } from '@/types/Tag'

export const uploadImage = async (file: File, title: string, tags: Tag[] = []) => {
  const id = Date.now()

  const storageRef = ref(storage, `images/${id}-${file.name}`)

  const snap = await uploadBytes(storageRef, file)

  const url = await getDownloadURL(snap.ref)

  await addDoc(collection(db, 'images'), {
    id,
    title,
    url,
    tags,
  })

  return { id, title, url, tags }
}
