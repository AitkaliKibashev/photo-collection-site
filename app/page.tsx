import GalleryGrid from '@/components/GalleryGrid'
import Container from '@/components/Container'
import Sidebar from '@/components/Sidebar'

const Page = () => {
  return (
    <div className={'min-h-screen w-full bg-gray-100'}>
      <Sidebar />
      <Container>
        <div className={'flex gap-4 pt-3 md:ml-[300px] md:pt-0'}>
          <GalleryGrid />
        </div>
      </Container>
    </div>
  )
}

export default Page
