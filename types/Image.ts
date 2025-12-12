import { Tag } from './Tag'

export interface Image {
  url: string
  id: number
  title: string
  tags: Tag[]
}
