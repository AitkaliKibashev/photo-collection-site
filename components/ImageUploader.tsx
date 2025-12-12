import { useState, useRef } from 'react'
import { uploadImage } from '@/lib/uploadImage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Tag } from '@/types/Tag'

export default function ImageUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      // Создаем превью
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setLoading(true)

    const data = await uploadImage(file, title, selectedTags)

    setLoading(false)
    // Сброс формы после загрузки
    setFile(null)
    setPreview(null)
    setTitle('')
    setSelectedTags([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const toggleTag = (tag: Tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
  }

  return (
    <div className="flex flex-col gap-3 rounded border p-3 sm:p-4">
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      {preview && (
        <div className="relative w-full overflow-hidden rounded-lg border">
          <img
            src={preview}
            alt="Preview"
            className="w-full object-contain"
            style={{ maxHeight: '400px' }}
          />
        </div>
      )}

      <Input
        type="text"
        placeholder="Title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="rounded border p-2 text-sm sm:text-base"
      />

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Tags:</label>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {Object.values(Tag).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`rounded-full px-2.5 py-0.5 text-xs transition-colors sm:px-3 sm:py-1 sm:text-sm ${
                selectedTags.includes(tag)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={handleUpload}
        className="w-full rounded bg-blue-600 px-4 py-2 text-white sm:w-auto"
        disabled={loading || !file}
      >
        {loading ? <Spinner /> : 'Upload'}
      </Button>
    </div>
  )
}
